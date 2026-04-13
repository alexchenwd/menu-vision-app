# Menu Vision Webapp

## Working Name

`Menu Vision`

Tagline: "Point your camera at a menu and instantly understand what to order."

## 1. Product Summary

This product helps diners understand restaurant menus they cannot easily read. A user opens a mobile-friendly webapp, takes a photo of a menu or uploads one from their phone, and receives:

- translated menu text in their selected language
- plain-language dish explanations
- ingredient hints when possible
- a representative food image for each dish, using real web photos when confidence is high and AI-generated illustrations as fallback

The first launch target is Chinese-speaking users translating English-language menus into Simplified Chinese. The product should be architected so more source languages and target languages can be added with minimal work.

## 2. Problem Statement

People often face menus with:

- unfamiliar dish names
- ingredients they do not recognize
- no food photos
- inconsistent translations provided by the restaurant
- dense menu layouts that make manual lookup slow

Today, users often switch between camera apps, Google Translate, Google search, maps/reviews, and image search. That workflow is slow, fragmented, and especially painful at the table when ordering quickly.

## 3. Product Goals

### Primary Goal

Help a user go from "I do not understand this menu" to "I know what this dish is and what it probably looks like" in under 30 seconds for a typical menu photo.

### Secondary Goals

- reduce the number of external searches needed
- improve confidence before ordering
- support tourists and multilingual diners on mobile browsers without app install friction
- create a strong enough first experience that users bookmark or install the webapp as a PWA

### Non-Goals for V1

- full nutrition accuracy
- guaranteed allergen safety decisions
- restaurant ordering/payment integration
- OCR for handwritten chalkboards with near-human reliability
- offline-first translation/image generation

## 4. Target Users

### Primary Persona

Traveler or immigrant diner, mobile-first, sitting in a restaurant, needs fast translation plus food context.

### Secondary Persona

Food explorer who can read some menu text but wants richer explanation and representative visuals.

### Accessibility Persona

User with dyslexia, low vision, or reading difficulty who benefits from larger translated text, high contrast, and optional text-to-speech.

## 5. Core Jobs To Be Done

- When I see a menu I do not understand, help me understand dish names quickly.
- When the menu has no images, show me what the dish likely looks like.
- When a dish name is ambiguous, explain the ingredients and cooking style.
- When a menu is dense, detect items and group them cleanly.
- When OCR is messy, let me correct a few words and rerun the interpretation.

## 6. Product Principles

- mobile-first before desktop-first
- camera capture should be one tap from landing
- confidence should be visible; do not pretend uncertainty is certainty
- real photos are preferable to generated images when provenance is strong
- generated images must be labeled as illustrative
- privacy defaults should be conservative
- the product should still be useful even if image lookup fails

## 7. Market and Research Takeaways

### What already exists

- Browsers can access device cameras with `getUserMedia()`, but only in secure contexts such as HTTPS.
- Mobile browsers also support file upload capture flows, but the `capture` attribute has uneven browser support, so the product needs both live camera and upload fallback.
- Google Translate and Google Lens already translate text from images, so translation alone is not enough differentiation.
- Google Maps already connects some popular dish names to user-contributed photos, which validates demand for "menu item -> what it looks like."
- Google Custom Search can programmatically return image search results, but it has usage limits and requires careful handling of source attribution and licensing.
- AI image generation is now easy to integrate, which makes an "illustrative fallback" feasible for low-photo-availability dishes.

### Product gap to win

The differentiated experience is not just OCR or translation. The differentiated experience is:

`menu understanding = translated text + dish explanation + likely ingredients + visual representation + confidence`

That integrated flow is the product.

## 8. Proposed V1 Feature Set

### 8.1 Input

- open camera from mobile browser
- upload photo from gallery
- support single image first
- optional retake before processing
- client-side crop and rotate before submit
- image compression before upload

### 8.2 OCR and Menu Parsing

- detect text from menu image
- optimize OCR and parsing for English-language menus in V1
- segment text into probable menu items
- classify blocks into likely dish name, description, price, and section header
- preserve original text and approximate on-page position alongside translation
- extract price when present
- let user tap a line if automatic grouping is wrong
- support layout-preserving overlay rendering for common printed menu formats

### 8.3 Translation and Dish Understanding

- translate each menu item into Simplified Chinese in V1
- generate a short human-friendly explanation
- infer likely ingredients and preparation style
- flag ambiguity with labels like `可能`, `不确定`, `地区菜名`
- optionally expose pinyin/romanization later for Chinese source menus

### 8.4 Dish Image Experience

For each parsed dish:

- try to find broad web image results first
- if search confidence is low, generate an AI illustration
- clearly label image type:
  - `真实网络图片`
  - `AI示意图`
- show source link for real images
- let user refresh image or see alternatives

### 8.5 Output UI

- default result mode: card per menu item
- optional layout-preserving overlay mode on top of the original menu image
- original name
- translated name
- short explanation
- possible ingredients
- price if found
- representative image positioned near the detected dish block when overlay mode is used
- confidence badge

### 8.6 Session Features

- recent scans in local device history
- shareable result link if user opts in
- save favorite dishes

### 8.7 Safety and Trust

- allergen disclaimer
- "illustrative only" label on AI images
- privacy notice before upload
- easy delete of uploaded image/result

## 9. Recommended UX Flow

### Flow A: Fast Scan

1. User lands on homepage.
2. User taps `Scan Menu`.
3. Browser asks for camera permission.
4. User captures one photo.
5. User optionally crops/rotates.
6. App processes image and shows progress states:
   - extracting text
   - identifying dishes
   - translating to Chinese
   - finding/generating food images
7. User sees parsed menu cards or a layout-preserving overlay view on the original menu image.
8. User taps a dish card for larger image and richer explanation.

### Flow B: Upload Existing Photo

1. User taps `Upload Photo`.
2. User selects image from gallery.
3. Same pipeline as Flow A.

### Flow C: Fix OCR Errors

1. User sees bad parse.
2. User taps `Edit text`.
3. User corrects a dish name or line break.
4. App reruns translation and image lookup only for edited items.

## 10. UX and Design Direction

### Product Feel

- practical, calm, trustworthy
- restaurant-table friendly
- large tap targets
- fast loading on weak mobile networks

### Visual Direction

- warm editorial food aesthetic, not generic AI-tool aesthetic
- cream or parchment base with dark ink typography
- one accent color inspired by lacquer red or jade green
- card-based dish results with generous whitespace
- subtle motion for scan progress and card reveal

### Home Screen Modules

- hero with camera-first CTA
- upload alternative
- trust strip: `Translate`, `Explain`, `Show Me The Dish`
- sample before/after demo

### Result Screen Layout

- sticky language selector
- top summary bar:
  - source language
  - items found
  - scan confidence
- card list below
- bottom sheet for detailed dish view

### Mobile-First Design Requirements

- one-thumb usage
- no hidden critical controls
- camera controls reachable near bottom edge
- support portrait first; landscape is secondary

## 11. Functional Requirements

### Must Have for MVP

- browser camera capture on supported devices
- image upload fallback
- OCR extraction with bounding boxes
- English-menu optimization in parsing and dish interpretation
- automatic dish-name detection for common printed menu layouts
- Simplified Chinese translation
- per-item explanation
- per-item image result
- layout-preserving overlay mode tied to detected dish positions
- real-photo-first logic with AI fallback
- confidence labeling
- edit-and-rerun for text
- responsive mobile UI
- basic analytics

### Should Have Soon After MVP

- additional target languages
- user accounts
- saved scan history across devices
- text-to-speech for translated dish names
- allergen-focused warnings
- restaurant/menu page grouping

### Nice To Have

- multi-page menu support
- dish comparison
- "recommended for me" filters by spice/meat/vegetarian preference
- menu category detection like appetizers/noodles/dessert
- community corrections

## 12. Non-Functional Requirements

- HTTPS required in production for live camera access
- target first meaningful UI under 2 seconds on a modern phone over 4G for cached assets
- target completed result under 15 seconds median for one menu image
- graceful degradation when camera permission is denied
- uploaded originals should be auto-deleted on a short retention policy unless user saves explicitly
- application should support at least 10k monthly scans without architectural rewrite
- all major flows must work on recent iPhone Safari and Android Chrome
- layout-preserving overlay mode should render accurately for common single-page printed menu layouts, with graceful fallback to card view when layout confidence is low

## 13. Key Product Decisions

### Decision 1: Real Image vs AI Image

Recommendation:

- default to real web images when there is strong semantic match
- use AI generation only when:
  - no usable real image exists
  - the dish name is generic but regionally variable
  - the search results are clearly mismatched

Why:

- real images build trust
- AI images fill coverage gaps
- mixing both gives better completeness without sacrificing too much credibility

Important constraint:

AI images should be explicitly labeled as representative illustrations, not guaranteed exact servings from that restaurant.

### Decision 2: OCR Engine

Recommendation:

- use cloud OCR rather than browser-only OCR for V1

Why:

- menus often contain dense layouts, multiple fonts, and mixed languages
- dense-text OCR with bounding boxes is much more reliable from mature cloud OCR services

### Decision 3: Layout Preservation

Recommendation:

- support a layout-preserving overlay mode for common printed menu layouts, with fallback to card view when parsing confidence is low

Why:

- users often want to understand the menu in its original visual structure
- images are more useful when attached near the detected dish location instead of separated into a flat list
- different menu layouts make full automation probabilistic, so the UI needs a graceful fallback

### Decision 4: Translation Layer

Recommendation:

- split "literal translation" from "dish explanation"

Why:

- menu names are often idiomatic, regional, or metaphorical
- users need interpretation, not just direct translation

## 14. Proposed System Architecture

### Frontend

- Next.js webapp
- TypeScript
- Tailwind CSS or CSS variables plus a small design system
- PWA support for installability

### Backend

- Next.js server routes or lightweight API service
- job orchestration for OCR -> parse -> translate/explain -> image lookup/generation
- signed upload flow for images

### Storage

- object storage for uploaded menu images
- short-lived result cache
- optional database for saved scans and analytics events

### AI / API Pipeline

1. user captures or uploads image
2. client compresses image
3. backend issues signed upload URL
4. image stored in object storage
5. OCR service extracts text blocks, bounding boxes, and layout anchors
6. parsing layer groups lines into candidate dishes and classifies likely name, description, price, and section blocks
7. result model preserves item positions for optional overlay rendering
8. LLM or translation layer returns:
   - normalized dish name
   - Chinese translation
   - explanation
   - possible ingredients
   - confidence
9. image service attempts web image retrieval
10. if retrieval confidence too low, generate AI illustration
11. results returned as structured JSON with both list and overlay metadata

## 15. Recommended Tech Stack

### My Recommendation for V1

- frontend: Next.js + TypeScript
- hosting: Vercel or Cloudflare
- storage: Cloudflare R2 or equivalent object storage with presigned uploads
- OCR: Google Cloud Vision `DOCUMENT_TEXT_DETECTION`
- translation + explanation + structuring: LLM with structured JSON output
- image retrieval: Google Custom Search JSON API
- image generation fallback: OpenAI image generation API
- analytics: PostHog or simple event pipeline

### Why this stack

- fast web iteration
- low mobile friction
- straightforward camera and upload support
- reliable OCR for dense menu text
- structured AI output keeps frontend rendering predictable
- photo coverage plus AI fallback solves the core image problem

## 16. API and Data Model Sketch

### Input

`POST /api/scan`

Request:

```json
{
  "imageUrl": "https://storage.example.com/uploads/abc.jpg",
  "targetLanguage": "zh-CN",
  "mode": "auto"
}
```

### Output

```json
{
  "scanId": "scan_123",
  "sourceLanguage": "en",
  "confidence": 0.87,
  "items": [
    {
      "id": "item_1",
      "originalText": "Chicken Fried Steak",
      "normalizedName": "chicken fried steak",
      "translatedName": "炸鸡排风味牛排",
      "explanation": "美国南方菜，通常是裹粉牛排油炸后搭配肉汁。",
      "possibleIngredients": ["beef steak", "flour coating", "gravy"],
      "priceText": "$21",
      "layout": {
        "x": 0.12,
        "y": 0.34,
        "w": 0.42,
        "h": 0.08
      },
      "image": {
        "type": "web",
        "url": "https://...",
        "sourcePageUrl": "https://..."
      },
      "confidence": 0.91,
      "ambiguityNotes": ["Name is misleading: the dish is beef, not chicken."]
    }
  ]
}
```

## 17. Confidence Model

Each dish card should show a confidence state:

- High: OCR clean, translation confident, image source strongly matched
- Medium: some ambiguity in menu term or image match
- Low: OCR uncertain, regional dish name ambiguous, or image is illustrative fallback

Confidence should be computed from:

- OCR confidence
- parser confidence
- translation/explanation confidence
- image match confidence

## 18. Ranking Logic for Real Images

Use real web images only when enough signals agree:

- dish name match
- cuisine or restaurant context match
- image alt/title/snippet match
- source domain quality score
- optional restaurant name match if available

Preferred real-image source types:

- restaurant official site
- major review/map platforms
- reputable food publishers

Avoid or down-rank:

- unrelated stock images
- low-resolution duplicates
- irrelevant recipe images when dish style differs materially

## 19. AI Image Prompting Strategy

When generating fallback images:

- use normalized dish name
- include cuisine style and likely ingredients
- specify realistic food photography
- avoid plate details that imply exact restaurant identity

Example internal prompt:

`Create a realistic food photo style image of a Japanese oyakodon rice bowl with chicken, egg, onion, and glossy savory sauce, photographed from a natural restaurant-table angle.`

## 20. Privacy, Legal, and Trust Considerations

- user-uploaded menu photos may contain incidental personal data; minimize retention
- real web images require source attribution and careful respect for platform terms
- AI-generated dish images must be labeled as illustrative
- do not make medical/allergen guarantees
- avoid implying that an image is the restaurant's actual serving unless provenance is strong
- publish a clear privacy policy and deletion policy before launch

## 21. Analytics and Success Metrics

### North Star

Percentage of scans that lead to at least one dish detail open within the same session.

### Core Metrics

- scan start to successful result rate
- median time to first useful result
- percentage of items with image coverage
- percentage of image results using real photos vs AI fallback
- user correction rate after OCR
- return user rate
- share/save rate

## 22. Error Handling

### Likely Failure Cases

- camera permission denied
- blurry image
- low light
- menu text too dense or decorative
- OCR merges columns incorrectly
- dish name too regional or poetic
- no high-confidence real image

### UX Response

- offer retake tips
- let user crop a smaller section
- provide editable text
- label low confidence instead of hiding uncertainty
- fall back to text-only results if image generation/search fails

## 23. MVP Roadmap

### Phase 0: Spec and Clickable Design

- finalize product scope
- produce mobile wireframes and UI kit
- define structured response schema

### Phase 1: Functional MVP

- upload/camera
- OCR
- Chinese translation
- explanation cards
- real image lookup
- AI fallback image

### Phase 2: Quality Upgrade

- confidence scoring
- better parsing
- edit-and-rerun
- saved history
- PWA install support

### Phase 3: Growth

- more target languages
- accounts
- favorites
- multi-page menus
- restaurant context memory

## 24. Delivery Recommendation

If we build this now, the smartest path is:

1. build the mobile-first MVP around one strong target flow: `take photo -> see translated dish cards in Chinese`
2. treat image retrieval as hybrid: real photo first, AI fallback second
3. keep uploads ephemeral by default
4. expose confidence and editing so users can recover from OCR ambiguity
5. avoid user accounts until the core scan experience is clearly valuable

## 25. Open Questions I Recommend We Decide Next

- Real-image sourcing for V1: use broad web image results, with source attribution shown when available.
- Source-language focus for V1: English menus only; add multi-language OCR later after the core flow works well.
- Should the first release be fully anonymous, or should we support saved history with login from day one?
- Do you want the product to optimize for speed over completeness, or completeness over speed?

## 26. My Product-Manager Recommendation

I would launch V1 as:

`A mobile webapp for travelers that scans a menu photo, translates each dish into Chinese, explains what it is in plain language, and shows either a matched real-world photo or an AI illustrative photo.`

This is narrow enough to ship, broad enough to feel magical, and differentiated enough from plain camera translation tools.

## 27. My Tech-Lead Recommendation

For the first working build, I would optimize for:

- highest OCR reliability
- predictable structured output
- fast mobile UX
- explicit confidence/trust labeling

I would not attempt:

- user accounts
- payment features
- perfect ingredient extraction
- multi-image menu stitching

until the single-photo flow performs well.

## 28. Suggested Next Build Scope

If we move into implementation next, I recommend these first deliverables:

- product wireframes for landing, camera, processing, and result views
- technical architecture diagram
- API contracts
- starter Next.js codebase with mobile camera/upload flow
- mock OCR and translation pipeline
- one polished end-to-end prototype

## 29. Research Sources

- [MDN: `MediaDevices.getUserMedia()`](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia.)
- [MDN: HTML `capture` attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/capture)
- [Google Cloud Vision OCR](https://docs.cloud.google.com/vision/docs/ocr)
- [Google Cloud Translation: Detect language](https://cloud.google.com/translate/docs/basic/detecting-language)
- [Google Cloud Translation: Translate text](https://docs.cloud.google.com/translate/docs/translate-text)
- [Google Custom Search JSON API overview](https://developers.google.com/custom-search/v1/overview)
- [Google Translate image translation help](https://support.google.com/translate/answer/6142483?hl=en-AU)
- [Google Maps popular dishes feature](https://blog.google/products-and-platforms/products/maps/popular-dishes-feature-maps/)
- [Cloudflare R2 direct uploads with presigned URLs](https://developers.cloudflare.com/r2/objects/upload-objects/)
- [OpenAI image generation guide](https://developers.openai.com/api/docs/guides/image-generation)
- [OpenAI structured outputs guide](https://platform.openai.com/docs/guides/structured-outputs?lang=javascript)
