# QA checklist

Run before merging anything that touches UI, layout or data.

## Viewports
- [ ] iPhone (Safari, real device or Xcode simulator): the status bar does not cover the header (logo, title, Menú). Check portrait and that the header keeps its top padding.
- [ ] iPhone: the mobile menu drawer reaches the bottom of the screen and its last item is reachable above the home indicator.
- [ ] iPhone: no horizontal scroll at 375px and 390px.
- [ ] Android Chrome at ~360px: same checks.
- [ ] Tablet (~820px) and desktop (1440px): sidebar in its column, no gap between search and lists.

## Weather flow
- [ ] Search a city with Enter and with the Search button; input text is trimmed.
- [ ] Unknown city shows the "not found" message with Try again.
- [ ] Use my location: granted, denied and unavailable messages.
- [ ] Refresh updates the timestamp and keeps the city.
- [ ] Save city / Saved toggles, and the saved list removes it with ×.
- [ ] Recent list: newest first, Clear empties it.
- [ ] Units toggle (°C / °F) updates every temperature and the wind unit.

## Language and theme
- [ ] English and Spanish switch every visible text, including weather descriptions, dates and errors.
- [ ] Light and dark themes: text contrast is readable everywhere (at least 4.5:1 for body text).

## Accessibility
- [ ] `/` focuses the search box; typing `/` inside the input does not.
- [ ] Visible focus ring on buttons and the input.
- [ ] Escape closes the mobile menu.
- [ ] Reduced motion: the weather panel does not animate.

## Console
- [ ] No errors in the console during the flows above.
