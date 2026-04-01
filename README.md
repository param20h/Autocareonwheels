# Car Service Booking Website

A complete, full-stack car service booking application built with React 18, Node.js, Express, MySQL, and Prisma.

## Application Architecture

- **Client**: React 18, Vite, Tailwind CSS, ShadCN UI, Zustand, FullCalendar.io, Recharts.
- **Server**: Node.js, Express, Prisma ORM, MySQL, JWT.

## Deployment on Hostinger

Please follow the guides in `docs/` or refer to the `project_overview_and_deployment.md` created alongside this project for deploying efficiently to a Hostinger Unlimited Plan with cPanel Node.js features and static hosting.

## Development

```bash
# Install dependencies in the root
npm install

# Start development 
npm run dev
```

## Environment Setup

1. Copy `.env.example` to `.env`.
2. Fill all required values before running the server.

Required for auth and server startup:
- `DATABASE_URL`
- `JWT_SECRET`

Required for admin bootstrap script:
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`

Optional admin bootstrap fields:
- `ADMIN_NAME`
- `ADMIN_PHONE`

Optional integrations:
- SMTP email: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`
- Cloudinary upload: `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- Push notifications: `FCM_SERVER_KEY`

## Admin Bootstrap

Run this once after database setup to ensure an admin account exists:

```bash
npm run admin:create --workspace=server
```
