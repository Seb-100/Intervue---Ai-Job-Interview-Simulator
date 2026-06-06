/**
 * Firestore schema & typed hooks for Intervue.ai
 *
 * Collections (all nested under /users/{uid}/):
 *   interviews        – completed/in-progress interview sessions
 *   jobApplications   – job tracker entries
 *   cvs               – saved CV drafts
 *   coverLetters      – saved cover letters
 */

import {
  collection, doc,
  addDoc, setDoc, updateDoc, deleteDoc,
  getDocs, getDoc, query, orderBy, onSnapshot,
  serverTimestamp, Timestamp, where,
} from 'firebase/firestore';
import { db } from './firebase';

// ─── Shared helper ────────────────────────────────────────────────────────────
function userCol(uid: string, col: string) {
  return collection(db, 'users', uid, col);
}
function userDoc(uid: string, col: string, id: string) {
  return doc(db, 'users', uid, col, id);
}

// ═══════════════════════════════════════════════════════════════════════════════
// INTERVIEWS
// ═══════════════════════════════════════════════════════════════════════════════
export type InterviewType  = 'technical' | 'behavioral' | 'mixed' | 'case-study';
export type ExperienceLevel = 'junior' | 'mid' | 'senior' | 'lead';
export type InterviewStatus = 'ready' | 'in-progress' | 'completed';

export interface InterviewDoc {
  id:            string;
  title:         string;
  field:         string;
  type:          InterviewType;
  level:         ExperienceLevel;
  questionCount: number;
  score:         number | null;
  duration:      number | null;   // seconds
  status:        InterviewStatus;
  contextId:     string | null;
  notes:         string | null;
  createdAt:     Timestamp;
  completedAt:   Timestamp | null;
}

export async function addInterview(uid: string, data: Omit<InterviewDoc, 'id' | 'createdAt' | 'completedAt'>) {
  const ref = await addDoc(userCol(uid, 'interviews'), {
    ...data,
    createdAt:   serverTimestamp(),
    completedAt: serverTimestamp(),   // mark as completed immediately on save
  });
  return ref.id;
}

export async function updateInterview(uid: string, id: string, data: Partial<InterviewDoc>) {
  await updateDoc(userDoc(uid, 'interviews', id), data as any);
}

export async function getInterviews(uid: string): Promise<InterviewDoc[]> {
  const snap = await getDocs(query(userCol(uid, 'interviews'), orderBy('createdAt', 'desc')));
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as InterviewDoc));
}

export function subscribeInterviews(uid: string, cb: (interviews: InterviewDoc[]) => void) {
  const q = query(userCol(uid, 'interviews'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, snap => cb(snap.docs.map(d => ({ id: d.id, ...d.data() } as InterviewDoc))));
}

// ═══════════════════════════════════════════════════════════════════════════════
// JOB APPLICATIONS
// ═══════════════════════════════════════════════════════════════════════════════
export type AppStatus = 'wishlist' | 'applied' | 'screening' | 'interview' | 'offer' | 'rejected';
export type Priority  = 'high' | 'medium' | 'low';

export interface JobApplicationDoc {
  id:          string;
  company:     string;
  role:        string;
  location:    string;
  salary:      string;
  status:      AppStatus;
  appliedDate: string;
  deadline:    string;
  notes:       string;
  jobUrl:      string;
  priority:    Priority;
  createdAt:   Timestamp;
  updatedAt:   Timestamp;
}

export async function addJobApplication(uid: string, data: Omit<JobApplicationDoc, 'id' | 'createdAt' | 'updatedAt'>) {
  const ref = await addDoc(userCol(uid, 'jobApplications'), {
    ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateJobApplication(uid: string, id: string, data: Partial<JobApplicationDoc>) {
  await updateDoc(userDoc(uid, 'jobApplications', id), {
    ...data as any, updatedAt: serverTimestamp(),
  });
}

export async function deleteJobApplication(uid: string, id: string) {
  await deleteDoc(userDoc(uid, 'jobApplications', id));
}

export function subscribeJobApplications(uid: string, cb: (apps: JobApplicationDoc[]) => void) {
  const q = query(userCol(uid, 'jobApplications'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, snap => cb(snap.docs.map(d => ({ id: d.id, ...d.data() } as JobApplicationDoc))));
}

// ═══════════════════════════════════════════════════════════════════════════════
// CVs
// ═══════════════════════════════════════════════════════════════════════════════
export interface ExperienceEntry { title: string; company: string; location: string; startDate: string; endDate: string; current: boolean; description: string }
export interface EducationEntry  { degree: string; school: string; field: string; year: string; gpa: string }
export interface ProjectEntry    { name: string; description: string; tech: string; url: string }

export interface CVDoc {
  id:          string;
  name:        string;
  templateId:  string;
  personalInfo: { fullName: string; email: string; phone: string; location: string; website: string; linkedin: string; summary: string };
  experience:   ExperienceEntry[];
  education:    EducationEntry[];
  skills:       string[];
  projects:     ProjectEntry[];
  certifications: string[];
  createdAt:   Timestamp;
  updatedAt:   Timestamp;
}

export async function saveCV(uid: string, data: Omit<CVDoc, 'id' | 'createdAt' | 'updatedAt'>, existingId?: string) {
  if (existingId) {
    await updateDoc(userDoc(uid, 'cvs', existingId), { ...data as any, updatedAt: serverTimestamp() });
    return existingId;
  }
  const ref = await addDoc(userCol(uid, 'cvs'), { ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
  return ref.id;
}

export async function getCVs(uid: string): Promise<CVDoc[]> {
  const snap = await getDocs(query(userCol(uid, 'cvs'), orderBy('updatedAt', 'desc')));
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as CVDoc));
}

export async function deleteCV(uid: string, id: string) {
  await deleteDoc(userDoc(uid, 'cvs', id));
}

// ═══════════════════════════════════════════════════════════════════════════════
// COVER LETTERS
// ═══════════════════════════════════════════════════════════════════════════════
export interface CoverLetterDoc {
  id:             string;
  jobTitle:       string;
  company:        string;
  recipientName:  string;
  jobDescription: string;
  content:        string;
  createdAt:      Timestamp;
  updatedAt:      Timestamp;
}

export async function saveCoverLetter(uid: string, data: Omit<CoverLetterDoc, 'id' | 'createdAt' | 'updatedAt'>, existingId?: string) {
  if (existingId) {
    await updateDoc(userDoc(uid, 'coverLetters', existingId), { ...data as any, updatedAt: serverTimestamp() });
    return existingId;
  }
  const ref = await addDoc(userCol(uid, 'coverLetters'), { ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
  return ref.id;
}

export async function getCoverLetters(uid: string): Promise<CoverLetterDoc[]> {
  const snap = await getDocs(query(userCol(uid, 'coverLetters'), orderBy('updatedAt', 'desc')));
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as CoverLetterDoc));
}

export async function deleteCoverLetter(uid: string, id: string) {
  await deleteDoc(userDoc(uid, 'coverLetters', id));
}
