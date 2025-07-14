# Error Retrospectives - TaskMate

This document contains deep dives on major or unique incidents that led to significant improvements in the TaskMate project. For a full history, see the [Change Log](./Change-Log.md).

---

## 1. Frontend Setup & Configuration Error (July 13, 2025)

### Summary
- **Error**: "Module not found: Error: Can't resolve './App' in '.../src'" when running `npm start`.
- **Root Cause**: Missing `tsconfig.json` file in the frontend project.
- **Secondary Issues**: TypeScript version mismatch, AJV dependency conflicts.

### Resolution & Learnings
- Created `tsconfig.json` with proper configuration.
- Verified all dependencies and fixed version mismatches.
- Added file structure validation and configuration file checks to setup scripts.
- **Key Learnings**: Always check for required config files first; document all troubleshooting steps; configuration files are critical for TypeScript projects.

### Prevention
- Add `tsconfig.json` to project templates.
- Include file structure validation in setup scripts.
- Document PowerShell syntax issues and create compatible command examples.

---

## 2. Migration, Environment, and Integration Issues (July 13, 2025)

### Summary
- **Issue**: Moving TaskMate to a standalone directory caused environment variable and path issues.
- **.env File Handling**: `.env` file was missing after the move (not tracked by git), causing backend failures until manually recreated.
- **Editor Ignore Files**: `.cursorignore` and similar files can prevent important files from being copied or noticed during moves.
- **Frontend-Backend Integration**: API calls from the frontend were misrouted due to port and URL mismatches after migration.

### Resolution & Learnings
- Manually recreated the `.env` file and updated documentation to highlight this requirement after moves.
- Checked for `.cursorignore` and other editor-specific ignore files after migration.
- Updated frontend API URLs and/or proxy settings to match the backend.
- Added folder move checklist, onboarding notes, and session summaries to documentation.
- **Key Learnings**: Always check for untracked or editor-ignored files after moving projects; post-move validation is essential; documentation should mention manual steps for environment setup.

### Prevention
- Add `.env` handling and post-move validation to onboarding and setup guides.
- Include a folder move checklist in project documentation.
- Emphasize the need to test all integrations after structural changes.
- Encourage session summary documentation for all major troubleshooting events.
- Remind developers to review `.cursorignore` and similar files when moving or copying projects.

---

For more details on daily development, see [session-summaries/](./session-summaries/). For all changes and decisions, see [Change-Log.md](./Change-Log.md). 