This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

//working functionalities

Feature	                                                Status
Firebase auth (email + Google)	                        ✅ Working
Sign-in / Sign-up pages	                                ✅ Working
Auth guard on dashboard                             	✅ Working
Sidebar with user profile	                            ✅ Working
Job Tracker (Firestore CRUD)	                        ✅ Working
CV Reviewer (keyword analysis)	                        ✅ Working
CV Builder (Firestore save/load)	                    ✅ Working
Cover Letter Generator (Firestore)	                    ✅ Working
Whiteboard diagrams (40+ concepts)	                    ✅ Working
Trash2 in CVBuilder	                                    ✅ Fine (local SVG component)
HistoryPanel	                                        ✅ Now reads from Firestore
StatsOverview	                                        ✅ Now reads from Firestore
Interview sessions save to Firestore	                ✅ Fixed (was the critical missing piece)
Interview setup modal	                                ✅ New — configure field, type, level, Q count
STAR results panel	                                    ✅ New
PDF export	                                            ✅ New (browser print → A4)
