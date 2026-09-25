# TankTrack learning roadmap

TankTrack is designed to grow in small, shippable stages. Each stage produces a visible improvement and teaches one worthwhile full-stack concept.

## Phase 1 — a working product (now)

**Stack:** HTML, CSS, browser JavaScript, Node.js standard library, Git/GitHub

You can add tanks, log tests, manage care tasks, and back up the data. The app currently saves to the browser, which makes it simple to learn the user interface first.

## Phase 2 — a typed Node API

**Add:** TypeScript, Node.js, Express or Fastify, Zod, ESLint, Prettier, Vitest

Move the browser data operations into API routes:

- `GET /api/tanks`
- `POST /api/tanks`
- `POST /api/tanks/:tankId/water-tests`
- `GET /api/tasks?due=today`
- `PATCH /api/tasks/:id`

TypeScript prevents a large category of bugs by checking that the front end and back end agree on the shape of tank, task, and water-test data. Zod validates incoming data at the API boundary. Tests protect the most important behavior.

## Phase 3 — persistent SQL data

**Add:** PostgreSQL, Prisma or Drizzle ORM, Docker Compose, database migrations

Use `database/schema.sql` as the starting database design. Put PostgreSQL in Docker locally so onboarding the project is one command. An ORM gives TypeScript-aware queries; migrations make database changes reproducible for a reviewer or future teammate.

## Phase 4 — deploy it on AWS

**Add:** AWS, Docker, GitHub Actions, infrastructure as code

Suggested production setup:

| Concern | Service | Why it belongs here |
| --- | --- | --- |
| Web/API container | AWS App Runner or ECS Fargate | Runs the Node app without managing a server |
| Database | Amazon RDS for PostgreSQL | Managed backups, upgrades, and network controls |
| Secrets | AWS Secrets Manager | Keeps database URLs out of source control |
| Images | Amazon ECR | Private storage for Docker images |
| Delivery | GitHub Actions | Test and deploy automatically after a merge |
| Infrastructure | AWS CDK or Terraform | Documents cloud resources as reviewed code |

Start with App Runner for the least operational overhead. Move to ECS Fargate only when you want to demonstrate more networking and container configuration.

## Phase 5 — portfolio polish

**Add:** authentication (Clerk/Auth0 or AWS Cognito), charts, accessibility review, monitoring

Good features to build next are target water ranges per tank, overdue task reminders, nitrate/pH trend charts, and multiple users. Include screenshots, a short architecture diagram, API documentation, and a clear deployment link in the README.

## What makes this a strong résumé project

Do not list every tool in isolation. Describe the outcome and the choices you made. For example:

> Built and deployed TankTrack, a full-stack aquarium-care tracker using TypeScript, Node.js, PostgreSQL, Docker, and AWS; designed REST APIs and relational data models for water chemistry and recurring maintenance.

Only use that wording after those pieces are actually implemented. The project will be more convincing if each increment is committed separately with a clear message.
