# TaskMate Monorepo

Your AI co-pilot for mission-driven productivity that transforms conversational intent into actionable accountability systems.

TaskMate is built using the [Vibe Coding Model Spec (VCMS)](../Vibe_Coding_Model_Spec_v1.0.md) framework. It detects tasks and deadlines in natural conversation and provides intelligent nudges to reduce task drop-off by 70%.

---

## Folder Structure

```
backend/    # Node.js/Express backend API
web/        # React web app
mobile/     # Native mobile apps (iOS, Android, shared logic)
shared/     # Code shared across platforms
docs/       # Documentation (specs, checklists, retrospectives, etc.)
```

- Each folder contains a README with more details.
- We use Yarn Workspaces for package management and code sharing.

---

## Getting Started

- See each folder’s README for setup instructions.
- To install all dependencies: `yarn install` (from the repo root)

### Quick Start

1. Install dependencies: `npm install` (both frontend and backend, or use `yarn install` at the root)
2. Set up environment variables: Copy `.env.example` to `.env`
3. Start the backend: `npm run server`
4. Start the frontend: `npm start`
5. Open in browser: `http://localhost:3000`

---

## Core Features

- **Chat Interface (CHAT-01):** GPT-4 level conversation
- **Task Extraction (TASK-02):** Detect tasks/deadlines in natural conversation
- **Notification Engine (NOTIFY-03):** Time/context-triggered reminders
- **Mission System (MISSION-04):** Break goals into daily checkpoints

---

## Development Philosophy

This project follows the VCMS framework:
- **Spec-driven development:** All features are defined in `docs/Model-Spec.md` (or `spec.md`)
- **Atomic components:** Each feature is isolated and focused
- **Validation:** Use `../enforcement/validate-spec.py` to validate changes
- **Anti-overreach:** Strict protocols prevent scope creep

---

## Phase 1 MVP Scope

✅ **In Scope**:
- Chat interface with OpenAI integration
- Task extraction from conversation
- Desktop notifications
- Basic mission system
- Local SQLite storage

❌ **Out of Scope** (Phase 1):
- Calendar integrations
- Team collaboration
- Mobile app
- Cloud sync

---

## ⚠️ Post-Move Note

If you move this project to a new folder or machine, you MUST manually recreate the `.env` file in `src/backend` with your API keys and environment variables. See `docs/FOLDER-MOVE-CHECKLIST.md` for a full checklist and troubleshooting steps.

---

## Links

- [VCMS Documentation](../VCMS/README.md)
- [VCMS Model System Spec](../VCMS/Vibe_Coding_Model_System_Spec_v2.1.md)
- [VCMS Templates](../VCMS/templates/)
- [Validation Tools](../enforcement/)
- [Configuration](../tools/)

---

[Add any additional project-wide notes or instructions below.] 

## Recent Progress

### 2025-07-15
- Restored full frontend UI and navigation
- Fixed TypeScript and CSS issues
- Integrated DeepSeek AI chat and task extraction
- Added persistent chat history (localStorage)
- See session summary for details 