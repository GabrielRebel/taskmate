# TaskMate - Master Task Checklist

_Last updated: 2025-07-15_

## Immediate (Next Session)
- [ ] Polish UI/UX for chat and tasks
- [ ] Add error handling and user feedback for failed AI calls
- [ ] Explore multi-IDE workflows (Kiro, Cursor, etc.)

## Short Term (Next Week)
- [ ] Add more robust task extraction (multiple tasks, edge cases)
- [ ] Improve session summary automation
- [ ] Continue feature development per roadmap

## Technical Roadmap & Feature Expansion
- [ ] Create centralized `taskService` for state-machine operations
- [ ] Build out `/tasks` route with drag-and-drop board
- [ ] Build out `/calendar` route with react-big-calendar
- [ ] Build out `/missions` route with gamification features (streaks, badges)
- [ ] Implement notification system (WebSocket, fallback to email/SMS)
- [ ] Add ADHD-friendly UX patterns (focus mode, micro-confetti, urgency gradients, streak safeguard)

## Implementation Plan (Model Spec)
- [ ] Set up calendar UI and task CRUD logic
- [ ] Build habit tracker with streak logic and gamified feedback
- [ ] Implement chat thread saving, folder creation, and organization
- [ ] Manual and automated tests for each component
- [ ] Update documentation and change log after each milestone

## Next Features (Planned)
- [ ] Calendar integration: Extract and display tasks/goals on a calendar
- [ ] Habit tracker: Gamified streaks for daily habits
- [ ] Chat thread management: Save, organize, and folder chat threads

## Advanced Features (Future)
- [ ] Mission system (MISSION-04)
- [ ] PWA features and mobile optimization
- [ ] Advanced analytics and performance optimization
- [ ] Calendar sync capabilities
- [ ] Team collaboration features

## Validation & Documentation
- [ ] Install `express-validator` and re-enable validation middleware
- [ ] Complete original minor improvements (PowerShell script, file consolidation)
- [ ] Test all new features in production environment
- [ ] Use folder move checklist for future migrations
- [ ] Maintain clear, up-to-date documentation
- [ ] Improve session summary automation

## Questions for Future Consideration
- [ ] How will we handle user onboarding for the PWA installation?
- [ ] What metrics should we track for the mission system (Phase 2)?
- [ ] How will we scale the notification system for multiple users?

## Ideas for Future Versions
- [ ] Mission system integration → **Priority**: High (Phase 2)
- [ ] Calendar sync capabilities → **Priority**: Medium (Phase 3)
- [ ] Team collaboration features → **Priority**: Low (Future)

---

> This checklist is compiled from session summaries, change logs, model spec, and project status docs. Update this file as you complete tasks or add new ones! 