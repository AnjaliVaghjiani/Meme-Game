# Meme Game 🎭

**A full-stack, browser-based caption-matching game built with React, Node.js, Express, and SQLite.**

Pick the caption that fits the meme, beat the clock, and see how well you did. Play a quick round as a guest, or log in to play multi-round sessions and revisit your game history.

> **Project context:** Built as a university web-application project at Politecnico di Torino. This is a learning/portfolio project, not a production-hosted service.

## A quick look

| Home | Gameplay | Game dashboard |
| --- | --- | --- |
| ![Home screen](Screenshots/HomePage.png) | ![Caption matching](Screenshots/GamePage.png) | ![Game dashboard](Screenshots/GameDashboard.png) |

| Login | Profile | History |
| --- | --- | --- |
| ![Login screen](Screenshots/LoginPage.png) | ![Profile screen](Screenshots/ProfilePage.png) | ![Game history](Screenshots/HistoryPage.png) |

![Detailed round history](Screenshots/HistoryRounds.png)

## What you can do

- **Play as a guest:** Try the caption-matching game without logging in.
- **Play timed rounds:** Choose from several captions before a **30-second** timer runs out.
- **Earn points:** The game checks whether the selected caption matches the meme and awards points for correct answers.
- **Log in:** Access a user profile and multi-round game experience.
- **Review history:** Browse previous sessions, scores, and individual round results.
- **Track progress:** See your cumulative score on your profile.

## Tech stack

| Layer | Technology |
| --- | --- |
| Frontend | React 18, React Router, Vite, React Bootstrap, JavaScript, CSS |
| Backend | Node.js, Express, REST endpoints |
| Data storage | SQLite (`sqlite3`) |
| Authentication | Passport Local, Express Session; password hashing with Node's `crypto.scrypt` |

## How the application works

```text
Browser (React + Vite)
    │
    │ HTTP requests to http://localhost:3001/api
    ▼
Node.js / Express API
    │
    ├── Login & session handling
    ├── Random meme and caption retrieval
    ├── Caption validation and scoring
    └── Game and round history
    │
    ▼
SQLite database
```

The backend stores memes and their caption associations alongside accounts, games, and round results. The frontend has separate screens for the home page, guest gameplay, login, profile, game, and history.

## Repository structure

```text
Meme-Game/
├── client/
│   ├── src/
│   │   ├── Components/      # Pages and game interfaces
│   │   ├── API.js           # Backend requests
│   │   └── App.jsx          # Client routes
│   ├── public/              # Images and frontend assets
│   └── package.json
├── server/
│   ├── Dao/                 # Database access and authentication logic
│   ├── Database/            # SQLite setup and bundled project database
│   ├── index.mjs            # Express API
│   └── package.json
└── Screenshots/              # Screens from the application
```

## Run locally

**Prerequisites:** Node.js and npm. Native `sqlite3` dependencies may require build tooling depending on your operating system and Node.js version.

Open **two terminals** from the project root.

**1. Start the backend**

```bash
cd server
npm install
node index.mjs
```

Backend: `http://localhost:3001`

> The SQLite connection uses the relative path `Database/database.db`, so run the backend **from the `server/` directory**, as shown. The current repository includes a populated development database. Review its contents before publishing or distributing it.

**2. Start the frontend**

```bash
cd client
npm install
npm run dev
```

Open the local URL printed by Vite (normally `http://localhost:5173`). The frontend currently calls `http://localhost:3001/api`.

**Note:** These instructions reflect the repository configuration. They have not been verified with a clean-install end-to-end test.

## What I worked on

This project gave me experience building both sides of an interactive web application: the React interface and state management, client–server API integration, backend routes, relational data storage, authentication flows, and game-history persistence. It was a chance to go beyond a static website and work through a complete user journey.

## Current limitations and improvements

This is an academic project. Before treating it as a publicly deployable service, I would prioritize:

1. **Fixing and testing the authentication/session flow.** In the current backend, Passport deserialization references an undefined `db` variable; protected-route behavior also needs a review.
2. **Removing the development SQLite database from the public repository** if its user records are not explicitly approved for publication. Replace it with a schema and synthetic seed data.
3. **Moving the session secret to an environment variable** rather than using the hard-coded development string.
4. **Adding automated API and game-logic tests**, including guest flow, login, scoring, and game history.
5. **Configuring frontend API URLs via environment variables** to support deployments beyond localhost.

## Project status

**Academic portfolio project.** The repository documents the implementation and UI as developed; it is not presented as a hardened production application.
