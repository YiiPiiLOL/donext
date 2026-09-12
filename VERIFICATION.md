# DoNext V2.11.4 Verification

## Scope
V2.11.4 is based on the V2.11.3 single-weight release, retaining the V2.11.2 stability behavior.

- Manual weight override is available through one editable weight field on each exercise; no separate actual-weight field is shown.
- Workout records retain `recommendedWeight` and `actualWeight` (with legacy `weight` retained for compatibility).
- Next recommendations use the latest actual weight, not only the previous recommendation.
- Existing local-first, draft persistence, event-driven sync, and pending queue behavior remain unchanged.
- Service-worker cache bumped to `donext-v2.11.4`.

## Static checks
- JavaScript syntax checked with `node --check`.
- App version shown as V2.11.4.
- Service-worker cache is `donext-v2.11.4`.
- No V2.11.2 polling timer was reintroduced.

## Manual acceptance tests
1. Open Dagens pass and verify each exercise shows one editable `Vikt` field prefilled with the recommended weight.
2. Change the prefilled weight manually (for example 40 kg → 45 kg), enter reps, and save the workout. History must retain the actual 45 kg result while the UI remains a single weight field.
3. Start the same exercise again and verify the next recommendation is calculated from the actual previous weight.
4. Enter more reps at the actual weight and verify the recommendation advances according to the existing rep-range progression.
5. Leave an edited weight and reps in an incomplete workout for at least 60 seconds; values must remain.
6. Reload an incomplete workout; edited weight and reps must restore from the draft.
7. Save offline, reconnect, and verify the session still syncs.


## V2.11.4 acceptance tests
1. Open Historik and tap a saved workout.
2. Confirm the detail view shows each recorded exercise.
3. Confirm actual weight and reps per set are shown.
4. Confirm comments/session note appear when present.
5. Return to Historik and confirm the list remains intact.
6. Confirm V2.11.4 is shown in Inställningar.


## V2.11.7 preflight
- API-token inputs removed from user UI.
- Session Authorization used by frontend.
- User state is namespaced by authenticated user ID.
- Email registration/login uses PBKDF2 hashing.
- Coach profile persists per account.
- Test reset clears only the authenticated test account.
- Google/Apple endpoints intentionally remain disabled until provider credentials and verification are configured.
- Capacitor Android project configuration included; APK requires Android SDK/Gradle on build machine.
