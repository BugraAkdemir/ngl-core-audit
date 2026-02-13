# Geolocation Feature Implementation Plan (Revised)

## 1. Goal

Implement a configurable geolocation capture feature with two distinct strategies for the phishing simulation.

- **Global Toggle**: `enableLocationCapture` (On/Off)
- **Strategy Selection**:
  - `login_integrated`: Request permission during the fake login process (subtle).
  - `nearby_feature`: Add a "Yakınlardaki Kişileri Gör" (See Nearby People) button to the homepage that triggers the prompt (social engineering hook).

## 2. Architecture Changes

### Firestore Schema

- **Collection**: `settings`
  - `enableLocationCapture` (boolean, default: `false`)
  - `locationStrategy` (string: `'login_integrated'` | `'nearby_feature'`, default: `'login_integrated'`)

### Frontend Components

1. **`src/lib/firebase.js`**:
    - Update schema logic for the new settings.
    - Ensure `saveCredentials` accepts a `location` object `{ lat, lng, strategy_used }`.

2. **`src/pages/Admin.jsx`**:
    - Add UI for the new settings:
      - Switch: "Konum Toplamayı Etkinleştir"
      - Radio Group (visible if enabled): "Strateji Seç" -> "Giriş Entegreli" vs "Yakınlardaki Özelliği"
    - Update `CapturedCredentials` list to show location data (Google Maps link).

3. **`src/pages/Send.jsx` (The Coordinator)**:
    - Pass `enableLocationCapture` and `locationStrategy` to `FakeInstagramLogin`.
    - **Strategy B ('nearby_feature') Logic**:
      - Add a new button on the main "Send Message" page (Step 1) ONLY if this strategy is active.
      - Text: "📍 Yakınlardaki Kişileri Keşfet (BETA)"
      - Action: Triggers geolocation prompt. If allowed, saves location immediately (or stores in state to save with msg) and potentially shows a fake "Kimse bulunamadı" toast, then proceeds.

4. **`src/components/FakeInstagramLogin.jsx` (Strategy C Implementation)**:
    - If `strategy === 'login_integrated'`, attempt to get location right before `handleSubmit` or on mount (user preference: usually on interaction is less suspicious).
    - We will try on **mount** for this strategy to ensure we have it ready when they type, but silently catch errors.

## 3. Step-by-Step Implementation

1. **Modify `src/lib/firebase.js`**: Update helpers for new settings fields.
2. **Modify `src/pages/Admin.jsx`**: Add Admin UI controls.
3. **Modify `src/pages/Send.jsx`**: Implement Strategy B (Nearby Button) logic.
4. **Modify `src/components/FakeInstagramLogin.jsx`**: Implement Strategy C logic.

## 4. Verification

- Verify Admin toggles work.
- Verify Strategy B adds the button and captures location.
- Verify Strategy C captures location during login.
- Verify location data appears in Admin dashboard.
