# Gugu Kingdom: Arctic War — Android build route

This package is a fresh HTML5 mobile game shell wrapped with Capacitor.
It does not depend on Godot. The GitHub Actions workflow creates the Android
project, installs Android SDK packages on a cloud runner, builds a debug APK,
and uploads it as a downloadable workflow artifact.

## Game features in this starter
- Animated original Gugu Kingdom loading screen.
- Isometric arctic island map drawn on canvas.
- Tap building to select and upgrade.
- Build a Guard Post, train 5 Ice Guards, attack and earn resources.
- Hero penguin squad, resource economy, local save.
- Mobile touch drag and zoom.

## Build
Push this folder to a GitHub repository on branch `main`, then open Actions
and run `Build Gugu Kingdom Android APK`. The workflow uploads
`app-debug.apk` as `GuguKingdom-Android-APK`.

## Notes
- This is an installable debug APK, not a Play Store-signed release.
- A successful build must be verified from the GitHub Actions run.
- The HTML5 version is a new implementation of the core game loop; it is
  not a binary conversion of the Godot project.
