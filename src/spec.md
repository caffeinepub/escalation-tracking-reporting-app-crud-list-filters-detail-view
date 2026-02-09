# Specification

## Summary
**Goal:** Fix sign-in and post-login failures by showing actionable authentication/initialization errors and correcting backend authorization so newly signed-in users can load their profile.

**Planned changes:**
- Update the Login page to display a visible error message when Internet Identity login fails (using `loginError.message` or a safe fallback) and include a “Try again” action that re-attempts login.
- Update the authenticated app layout to handle failures in bootstrap calls (e.g., `getCallerUserProfile`) by showing a readable error view and offering a “Log out” action to recover.
- Adjust backend authorization to allow authenticated Internet Identity principals to call `getCallerUserProfile` and other user-level escalation CRUD methods without requiring admin token initialization, while continuing to reject anonymous callers.

**User-visible outcome:** When sign-in or initial profile loading fails, users see a clear English error message with a recovery action (retry or logout) instead of a blank/error screen; after signing in, authenticated users can successfully load their profile and use protected app features.
