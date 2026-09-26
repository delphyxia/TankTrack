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
