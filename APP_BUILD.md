# DoNext V2.11.8 — Android build

This release contains the Capacitor wrapper configuration for a real Android app.

## Build on a machine with Android Studio + Android SDK

1. Install Node.js and Android Studio.
2. In this folder run `npm install`.
3. Run `npx cap add android` once if the `android/` folder is not present.
4. Run `npm run build:android`.
5. The debug APK will be at `android/app/build/outputs/apk/debug/app-debug.apk`.

For distribution, create a signed release build and upload the APK/AAB to a GitHub Release or Google Play Internal Testing.

The current environment used to prepare this package does not have the Android SDK/Gradle toolchain installed, so an APK was not fabricated or falsely marked as built.
