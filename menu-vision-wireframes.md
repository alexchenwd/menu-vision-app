# Menu Vision Wireframes

## Product Direction

V1 is optimized for English-language menus and Chinese-speaking users. The app should feel fast, trustworthy, and usable at a restaurant table with one hand.

## Design System Direction

### Tone

- warm, editorial, food-forward
- practical over playful
- confidence-building, not overly technical

### Color Tokens

- background: warm cream
- surface: off-white card
- text: dark ink
- accent: lacquer red
- success: deep green
- warning: amber
- low-confidence: muted slate

### Typography

- display: elegant serif for headings
- UI/body: clean sans-serif for readability
- translated dish names should be slightly larger than source names

### Component Rules

- large primary CTA
- minimum 44px tap targets
- rounded cards with strong image presence
- sticky bottom actions on mobile
- confidence chips always visible on dish cards

## Screen 1: Landing

### Goal

Get the user into scan/upload in under 3 seconds.

### Layout

```text
+------------------------------------------------+
| Menu Vision                                    |
| Understand the menu before you order           |
|                                                |
| [ Scan Menu ]                                  |
| [ Upload Photo ]                               |
|                                                |
| Translate -> Explain -> Show the Dish          |
|                                                |
|  Example card carousel                         |
|  [Original] [Chinese] [Dish photo]             |
|                                                |
| Privacy note: Photos auto-delete by default    |
+------------------------------------------------+
```

### Notes

- `Scan Menu` is primary
- `Upload Photo` is secondary but still prominent
- example content reduces first-use uncertainty

## Screen 2: Camera Capture

### Goal

Make capture easy even in low-light restaurant conditions.

### Layout

```text
+------------------------------------------------+
| < Back                    Camera permission ?  |
|                                                |
|  Live camera preview                           |
|  [ alignment frame ]                           |
|                                                |
| Tip: Fill the frame with one menu section      |
|                                                |
| [ Flash ]         [ Capture ]       [ Upload ] |
+------------------------------------------------+
```

### Notes

- offer upload fallback on the same screen
- include a tip to capture one menu section, not the whole restaurant wall
- if permission is denied, switch to upload-first mode

## Screen 3: Crop and Confirm

### Goal

Let the user improve OCR quality before processing.

### Layout

```text
+------------------------------------------------+
| < Retake                     Confirm Scan       |
|                                                |
|   Captured image with crop box                 |
|                                                |
| [ Rotate ]  [ Auto-enhance ]  [ Reset ]        |
|                                                |
| Output language: [ Simplified Chinese v ]      |
|                                                |
| [ Start Analysis ]                             |
+------------------------------------------------+
```

### Notes

- auto-enhance can adjust contrast/sharpening client-side
- output language selector is visible even in V1 so later expansion fits naturally

## Screen 4: Processing State

### Goal

Keep the user calm during multi-step processing.

### Layout

```text
+------------------------------------------------+
| Analyzing your menu                            |
|                                                |
| [animated progress graphic]                    |
|                                                |
| 1. Reading text                                |
| 2. Identifying dishes                          |
| 3. Translating to Chinese                      |
| 4. Finding dish photos                         |
|                                                |
| This usually takes 8-15 seconds                |
+------------------------------------------------+
```

### Notes

- step-by-step progress feels faster than a spinner
- if one stage fails, explain the fallback path

## Screen 5: Results List

### Goal

Show readable dish cards quickly with confidence and images.

### Layout

```text
+------------------------------------------------+
| Menu Results                    [ zh-CN v ]    |
| Source: English   12 items   Confidence: Good  |
|------------------------------------------------|
| [Photo]  Fish and Chips                        |
|         炸鱼薯条                                |
|         英式炸鱼配薯条，通常搭配塔塔酱。        |
|         Ingredients: cod, potato, batter       |
|         Price: $18                              |
|         [ Real Web Image ] [ High ]            |
|------------------------------------------------|
| [Photo]  Chicken Fried Steak                   |
|         炸鸡排风味牛排                           |
|         美国南方菜，用裹粉牛排油炸后配肉汁。    |
|         [ AI Illustration ] [ Medium ]         |
+------------------------------------------------+
```

### Notes

- top bar summarizes source language and scan quality
- every card should expose image provenance and confidence
- cards should load incrementally if images lag behind text

## Screen 6: Overlay Mode

### Goal

Preserve the original menu layout and place translated labels and dish images near the detected dish blocks.

### Layout

```text
+------------------------------------------------+
| Menu Overlay                    [ zh-CN v ]    |
| [ Overlay ] [ List ]            Confidence: OK |
|------------------------------------------------|
|  Original menu image                           |
|                                                |
|  [Fish and Chips] ---> [thumb]                 |
|  炸鱼薯条 / 英式炸鱼配薯条                      |
|                                                |
|  [Chicken Fried Steak] -> [thumb]              |
|  炸鸡排风味牛排 / 美国南方炸牛排                |
|                                                |
|  [Clam Chowder] ------> [thumb]                |
|  蛤蜊浓汤 / 奶油浓汤类                          |
|                                                |
| Tap any overlay chip for full details          |
+------------------------------------------------+
```

### Notes

- overlay chips should anchor to OCR bounding boxes, not arbitrary screen positions
- each chip should avoid covering nearby text when possible
- if layout confidence is low, the app should default back to list mode automatically

## Screen 7: Dish Detail Bottom Sheet

### Goal

Provide a richer explanation without leaving the results list.

### Layout

```text
+------------------------------------------------+
| Dish Detail                                    |
|                                                |
| [ large image ]                                |
|                                                |
| Chicken Fried Steak                            |
| 炸鸡排风味牛排                                   |
|                                                |
| What it is                                     |
| Southern US comfort food...                    |
|                                                |
| Likely ingredients                             |
| beef, flour coating, gravy, pepper             |
|                                                |
| Notes                                          |
| Name can be confusing: it is beef, not chicken |
|                                                |
| Source: AI illustration / Web result           |
| [ See alternatives ] [ Open source ]           |
+------------------------------------------------+
```

### Notes

- ambiguity note is especially important for confusing dish names
- `See alternatives` helps when users distrust the first image

## Screen 8: OCR Correction

### Goal

Recover from bad OCR without restarting the whole flow.

### Layout

```text
+------------------------------------------------+
| Fix Menu Text                                  |
|                                                |
| Original scan snippet                          |
|                                                |
| [ editable text rows ]                         |
| Fish and Chips          $18                    |
| Chicken Fried Steak     $21                    |
| Clam Chowder            $9                     |
|                                                |
| [ Re-run Selected Item ]                       |
| [ Re-run All ]                                 |
+------------------------------------------------+
```

### Notes

- partial rerun is better for speed and cost
- edited rows should preserve a small audit marker like `edited`

## Screen 9: Empty/Error State

### Goal

Help the user recover fast.

### Layout

```text
+------------------------------------------------+
| We couldn't read this menu clearly             |
|                                                |
| Try one of these                               |
| - move closer to one section                   |
| - increase brightness                          |
| - crop out decorative borders                  |
|                                                |
| [ Retake Photo ]                               |
| [ Upload Another Image ]                       |
| [ Enter Dish Name Manually ]                   |
+------------------------------------------------+
```

## Motion Guidance

- camera-to-crop transition should feel immediate
- processing steps can animate with staggered checkmarks
- result cards should reveal progressively from top to bottom
- avoid heavy parallax or novelty motion

## Accessibility Requirements

- WCAG AA contrast minimum
- dynamic text size support
- screen-reader labels for camera, upload, result cards, and confidence chips
- visible source labels for AI-generated imagery
- no critical information conveyed by color alone

## MVP Component Inventory

- app header
- primary and secondary button
- permission prompt state
- camera preview shell
- cropper
- progress stepper
- result summary bar
- overlay canvas with positioned chips
- dish result card
- confidence chip
- image provenance badge
- detail bottom sheet
- editable OCR row
- empty/error state card

## Recommended Next Design Deliverables

- high-fidelity mobile mockups for the 8 screens above
- design tokens in CSS variables
- clickable prototype for landing -> scan -> results -> detail flow
