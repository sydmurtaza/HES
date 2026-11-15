# Manual QA & Device Verification Checklist: Reel Theatre

This document provides comprehensive manual test protocols for device-specific scenarios that cannot be simulated entirely in headless automation, including hardware audio mute switches, OS call interruptions, in-app webview quirks, display safe areas (notches/dynamic islands), and low power modes.

---

## 1. Real iPhone (Safari on iOS 16+)

### Test M01: Hardware Ringer / Silent Switch & Initial Mute State
- **Precondition**: Set iPhone physical silent switch to "Silent" (red showing).
- **Steps**:
  1. Open `http://<LAN_IP>:8080/campus-life.html` in Mobile Safari.
  2. Scroll down to Section 5 ("Experience Hadi Education in Motion").
  3. Tap the first reel card ("Sports Week 2025").
- **Expected Result**:
  - The Fullscreen Reel Viewer modal opens smoothly without layout shifts.
  - The reel begins playing visually within 1 second.
  - Video starts muted by default with the simple speaker muted icon visible.
  - No system audio plays.

### Test M02: Audio Unmute & Session Persistence
- **Steps**:
  1. With the reel playing, tap the speaker mute icon on the top right or floating right rail.
  2. Observe audio playback.
  3. Swipe up to advance to the next reel ("Prize Distribution Ceremony").
- **Expected Result**:
  - Audio unmutes cleanly and speaker icon transitions to the unmuted state without video pausing or stuttering.
  - When swiping to the next reel, audio remains unmuted without needing another tap.
  - The previous video stops playing completely; only the active video produces sound.

### Test M03: Safe Area Insets (Notch / Dynamic Island & Home Indicator)
- **Steps**:
  1. Rotate iPhone between Portrait and Landscape orientations while the Reel Viewer is open.
  2. Inspect the close button (`✕`), story progress bars, and bottom metadata / seek controls.
- **Expected Result**:
  - Top story bars and close/mute buttons clear the notch/Dynamic Island completely via `env(safe-area-inset-top)`.
  - Bottom metadata, seek bar, and swipe hint sit comfortably above the Home Indicator bar via `env(safe-area-inset-bottom)`.
  - No touch controls are clipped or unreachable.

### Test M04: Incoming Phone Call / Audio Interruption
- **Steps**:
  1. Play a reel with sound on.
  2. Trigger an incoming cellular call or alarm (or activate Siri).
  3. Dismiss the call/Siri and return to Safari.
- **Expected Result**:
  - Playback immediately pauses upon interruption.
  - When returning to Safari, the reel remains paused and does not auto-resume unexpectedly.
  - Tapping the centered play icon resumes smooth playback.

### Test M05: iOS Low Power Mode
- **Steps**:
  1. Enable Low Power Mode in iOS Settings -> Battery.
  2. Refresh the Campus Life page and open a reel.
- **Expected Result**:
  - Video loads on user tap with metadata.
  - Native scroll-snap remains responsive.

---

## 2. Real Android Phone (Chrome on Android 12+)

### Test M06: Instagram-Style Snap Scrolling & Gesture Navigation
- **Steps**:
  1. Open `http://<LAN_IP>:8080/campus-life.html` in Chrome on Android.
  2. Tap any reel in the 2-column mobile grid.
  3. Perform quick vertical swipes up and down.
  4. At the very top (first reel), swipe down; at the very bottom (last reel), swipe up.
- **Expected Result**:
  - Each flick snaps precisely to exactly one reel (no momentum multi-slide skipping).
  - Swiping down at the first reel does NOT trigger Android Chrome's pull-to-refresh (`overscroll-behavior-y: contain`).
  - Swiping up at the last reel does NOT scroll the underlying page content.
  - Only the visible active slide has playing video; non-active slides are paused and unloaded.

### Test M07: Android System Back Button & Gesture
- **Steps**:
  1. Open the Reel Viewer modal.
  2. Swipe from the left/right screen edge (or press the Android navigation bar Back button).
- **Expected Result**:
  - The Reel Viewer closes immediately.
  - Focus returns to the reel card that launched it.
  - The user remains on `campus-life.html` without leaving the page.
  - Forward gesture does not re-open the modal unexpectedly.

---

## 3. In-App Browsers (WhatsApp, Instagram, Facebook Webview)

### Test M08: WhatsApp In-App Webview
- **Steps**:
  1. Send `http://<LAN_IP>:8080/campus-life.html#reel-sports-week-2025` as a link in a WhatsApp chat.
  2. Tap the link inside WhatsApp to open in the integrated webview.
  3. Tap play and test the share button.
- **Expected Result**:
  - Deep-link `#reel-sports-week-2025` automatically selects the correct reel on load without forced autoplay.
  - Tap-to-play works inside the sandboxed webview.
  - Tapping "Share" triggers Web Share if supported or falls back to copying the link with a toast confirmation.

### Test M09: Instagram Direct In-App Browser
- **Steps**:
  1. Open the Campus Life URL from an Instagram DM.
  2. Tap the Fullscreen button on the action rail.
- **Expected Result**:
  - If the Fullscreen API is restricted by the webview container, native video fullscreen is invoked gracefully with no unhandled JS errors.
