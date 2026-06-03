# Wedding Invitation and RSVP Portal

- [Wedding Invitation and RSVP Portal](#wedding-invitation-and-rsvp-portal)
  - [Inspiration](#inspiration)
  - [The End Product](#the-end-product)
  - [Features](#features)
  - [Setup and Deployment](#setup-and-deployment)
  - [Customization](#customization)
    - [1. Central Page \& Asset Configurations (`/public/config/main.yaml`)](#1-central-page--asset-configurations-publicconfigmainyaml)
    - [2. Language-Specific Config File Customization (`/public/config/{lang}.yaml`)](#2-language-specific-config-file-customization-publicconfiglangyaml)
    - [3. How to Add or Remove a Language from the Site](#3-how-to-add-or-remove-a-language-from-the-site)
      - [How to Add a New Language (e.g., Spanish - `es`):](#how-to-add-a-new-language-eg-spanish---es)
      - [How to Remove a Language (e.g., Amharic - `am`):](#how-to-remove-a-language-eg-amharic---am)
    - [4. Re-theming Colors and Fonts (`/public/config/main.yaml`)](#4-re-theming-colors-and-fonts-publicconfigmainyaml)
  - [Integrations](#integrations)
    - [1. RSVP Google Spreadsheet Sync](#1-rsvp-google-spreadsheet-sync)
      - [Setup Steps:](#setup-steps)
    - [2. Congratulatory Wishes Guestbook (Formspree)](#2-congratulatory-wishes-guestbook-formspree)
      - [Setup Steps:](#setup-steps-1)
    - [3. Live Snapshot Telegram Group](#3-live-snapshot-telegram-group)
  - [Development](#development)
    - [Project Architecture](#project-architecture)
    - [Getting Started](#getting-started)
    - [Testing Suite](#testing-suite)
      - [Run Unit \& Functional Tests](#run-unit--functional-tests)
      - [Test Coverage Overview](#test-coverage-overview)

## Inspiration

This project was inspired by [YeneSerg](https://www.yeneserg.com), one of the first digital wedding invitation platforms in Ethiopia.

The idea started when a friend of mine was preparing for his wedding and searching for a wedding invitation card printing provider. During that search, we came across YeneSerg and were impressed by what they had built. But, being a tech enthusiast, I took it as a personal challenge. Instead of purchasing their hosted service, I decided to prototype a similar concept with the help of AI and create something tailored for my friend's wedding.

![YeneSerg](readme/readme01.png)

What began as a fun experiment quickly evolved into a customizable portal for anyone looking for similar thing to use.

## The End Product

After a few iterations and improvements, the project reached a stage where it felt polished and wedding ready. I then decided to refactor it into a Modern, mobile-friendly, and highly configurable single-page wedding invitation and RSVP portal that anyone can host and use free of charge without any development experience.

![WIRP](readme/readme02.png)

## Features

This wedding invitation and RSVP portal comes packed with the following features:

- **Multi-Language Support**: Built with Amharic and English support out of the box, while remaining flexible enough to support any combination or number of languages.

<img src="readme/lang01.png" width="49%" /> <img src="readme/lang02.png" width="49%" />

- **Custom Themes**: Easily change the entire look and feel of the portal by adjusting a few color settings in the configuration file.

<img src="readme/theme01.png" width="49%" /> <img src="readme/theme02.png" width="49%" />

- **Guest Book**: Allow guests to send their wishes and messages directly through the portal.

<img src="readme/guestbook01.png" width="49%" /> <img src="readme/guestbook02.png" width="49%" />

- **RSVP Registration**: Guests can confirm attendance and receive a generated digital pass.

<img src="readme/rsvp01.png" width="49%" /> <img src="readme/rsvp02.png" width="49%" />

- **Wedding Countdown**: Include a live countdown timer leading up to the big day.

<img src="readme/countdown01.png" width="49%" /> <img src="readme/countdown02.png" width="49%" />

- **Video Preview**: Feature memorable pre-wedding moments through video previews.

<img src="readme/videopreview01.png" width="49%" /> <img src="readme/videopreview02.png" width="49%" />

- **Photo Gallery**: Showcase your favorite pre-wedding photos and special moments.

<img src="readme/gallery01.png" width="49%" /> <img src="readme/gallery02.png" width="49%" />

- **Wedding Timeline**: Share the full wedding schedule so guests know what to expect.

<img src="readme/timeline01.png" width="49%" /> <img src="readme/timeline02.png" width="49%" />

- **Location & Maps**: Embed venue location maps with quick links to open directions in Google Maps or Apple Maps.

<img src="readme/location01.png" width="49%" /> <img src="readme/location02.png" width="49%" />

- **Story Section**: Share the story of the bride and groom in a beautiful and personal way.

<img src="readme/story01.png" width="49%" /> <img src="readme/story02.png" width="49%" />

- **Telegram Group Integration**: Redirect guests to a configured Telegram group to share memories and stay connected.

<img src="readme/telegram01.png" width="49%" /> <img src="readme/telegram02.png" width="49%" />

- **Calendar Integration**: Highlight the wedding date and allow guests to download an ICS calendar file.

<img src="readme/calendar01.png" width="49%" /> <img src="readme/calendar02.png" width="49%" />

- **Wedding Audio Experience**: Play a configured wedding song automatically when guests open the invitation.


> Every feature listed above is designed to be highly customizable and configurable from a single configuration file: `public/config/main.yaml` This makes it easy to personalize the experience without needing to modify the codebase.

## Setup and Deployment

1. Fork this repository.
2. Enable GitHub Pages on the forked repository, using **GitHub Actions** as the build and deployment source.
3. Ensure GitHub Actions is enabled for the repository.
4. Update the configuration files under the `public/config` directory:
   - Rename and customize the example YAML files to:
     - `main.yaml`
     - `am.yaml`
     - `en.yaml`
5. Configure your custom domain in GitHub Pages, and add the generated GitHub Pages domain as a CNAME record in your DNS provider.
   - If you are using the default GitHub Pages domain, update the `.github/workflows` configuration by setting `VITE_BASE_PATH` from `/` to:
     ```
     /${{ github.event.repository.name }}/
     ```
## Customization 

Nearly all variables can be changed inside modular configuration files under `/public/config/` without modifying any component source code. This keeps configurations clean and less bloated, specifically for multi-lingual and non-multi-lingual invitations alike.

### 1. Central Page & Asset Configurations (`/public/config/main.yaml`)
Open `/public/config/main.yaml` to specify core configurations, page ordering/toggles, media links, visual branding, and integrations:

- **Section Layout, Visibility & Visual Ordering:**
  To toggle any webpage section or modify the ordering on the page, simply arrange the items in the `sections` dictionary. The order of keys inside the `sections:` block directly dictates their vertical sequence on the live website:
  ```yaml
  # Rearrange these key positions to adjust their layout ordering on the webpage!
  sections:
    audioPlayer: true     # Ambient audio controller tag
    story: true           # Story introduction narrative card
    countdown: true       # Real-time ticking relative counter
    videoPreview: true    # Wedding highlight film frame
    saveTheDate: true     # Interactive calendar card with (.ics) downloader
    location: true        # Directions layout section
    timeline: true        # Day timeline of programs
    gallery: true         # Captured moments polaroid gallery
    memoryShare: true     # Telegram snap drop link, guestbook, and blessings
    guestbook: true       # Leaves wishes database log
    rsvpForm: true        # Digital boarding pass registration form
  ```

- **Core Timestamps, Branding Initials & Media URLs:**
  Update colors, Google Fonts, and core assets cleanly:
  ```yaml
  monagramInitials: "A&K"
  countdownTarget: "2026-09-20T16:00:00Z" # Set wedding date
  addressQuery: "Feleke Teka Wedding Hall | ፈለቀ ተካ የሠርግ አዳራሽ"
  backgroundMusicUrl: "https://romantic-music-mp3-address.mp3"
  youtubeVideoId: "x0U55UcW2Aw"           # Highlights video ID
  ```

### 2. Language-Specific Config File Customization (`/public/config/{lang}.yaml`)

Each language listed in the multilingual directory has its own `.yaml` translation file (e.g., `en.yaml` for English, `am.yaml` for Amharic). Inside these files, edit:
* Localized name marks: `groomName` & `brideName`.
* Detailed descriptions: `weddingDate`, `weddingTime`, `venueLocation` and `venueDescription`.
* Filterable polaroid titles, description details, and parent blessing notes.
* Context translation keys under the `translations` dictionary (e.g. Navigation tags list, buttons texts, form placeholder prompts).


### 3. How to Add or Remove a Language from the Site

The framework enables flexible localized expansion. Here is how to configure them without touching main codebase logic:

#### How to Add a New Language (e.g., Spanish - `es`):

1. **Declare the language** inside `/public/config/main.yaml` under `multilingual.languages` section:
   ```yaml
   multilingual:
     enabled: true
     defaultLanguage: "en"
     languages:
       - code: "en"
         label: "EN"
       - code: "am"
         label: "አማ"
       - code: "es"       # <-- Code represents the yaml file's name (es.yaml)
         label: "ESP"      # <-- Display tag in navigation header language buttons
   ```
2. **Create the translation file**: Duplicate an existing language file (such as `en.yaml`) in `/public/config/` and name the copy **`es.yaml`** (matches the `code` specified in `main.yaml`).
3. **Customize strings**: Translate all titles, descriptions, calendar labels, and RSVP form inputs inside your newly created `es.yaml` file. The platform dynamically loads, parses, and wires up your translations at runtime.

#### How to Remove a Language (e.g., Amharic - `am`):

1. Open `/public/config/main.yaml`.
2. Locate the `multilingual.languages` section and remove or comment out the block for Amharic (`am`).
3. (Optional) Delete the unused `/public/config/am.yaml` file from your repository.
4. *If you only want a single-language website, set `multilingual.enabled: false` and set `multilingual.defaultLanguage` to your preferred primary language (e.g. `en`).*


### 4. Re-theming Colors and Fonts (`/public/config/main.yaml`)

The theme is dynamically controlled from the `theme:` playbook block inside `/public/config/main.yaml`. You can customize colors and typography instantly without changing CSS styles:

```yaml
theme:
  primaryColor: "#3B2242"       # Deep plum for headings, buttons, and strong contrast
  accentColor: "#D97C8C"        # Dusty rose for highlights and accents
  goldColor: "#E6B566"          # Warm champagne gold for counters and decorative elements
  creamColor: "#FFF8F4"         # Soft blush-white page background
  creamDarkColor: "#F2E7E2"     # Card and panel background
  sageColor: "#8C7A86"          # Muted mauve-gray for subtle accents and shadows
  sageLightColor: "#F6EEEB"     # Borders and soft section backgrounds
  primaryFont: "Cormorant Garamond"   # Elegant romantic heading font
  secondaryFont: "Poppins"            # Clean navigation and labels
  bodyFont: "Lora"                    # Warm and readable body text
```

The portal dynamically requests and parses Google Fonts at runtime, and feeds these variables seamlessly into the layouts. Let the configuration handle the design playbook for you!


## Integrations

The portal support integration and linking with different product to extend the functionality of the invitation. This include
- Integration with Google sheets for RSVP registration
- Integration with Formspree to receive messages and wishes from guests
- Link with telegram to open a specific group

### 1. RSVP Google Spreadsheet Sync
The portal supports real-time synchronization of guest records to a Google Sheet using **Google Apps Script**.

#### Setup Steps:
1. Open [Google Sheets](https://sheets.google.com) and create a **blank spreadsheet**.
2. Label columns in Row 1 precisely as:
   - **Col A:** `fullName`
   - **Col B:** `attending`
   - **Col C:** `guestsCount`
   - **Col D:** `dietaryNotes`
   - **Col E:** `songRequest`
   - **Col F:** `invitationCode`
   - **Col G:** `timestamp`
3. Click on **Extensions > Apps Script** in the top menu.
4. Replace all code in the library editor with the following robust Google Script code (make sure to copy **every single line**, including the very last closing `}`):
   ```javascript
   function doPost(e) {
     try {
       var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
       
       // Handle cases where the endpoint is called with empty data (e.g. manual testing)
       if (!e || !e.postData || !e.postData.contents) {
         return ContentService.createTextOutput(JSON.stringify({ "status": "error", "message": "No post data found. This script should be triggered by the RSVP form submission, not clicked manually from 'Run'." }))
                              .setMimeType(ContentService.MimeType.JSON);
       }
       
       var data = JSON.parse(e.postData.contents);
       
       sheet.appendRow([
         data.fullName || "Anonymous",
         data.attending || "",
         data.guestsCount !== undefined ? data.guestsCount : 0,
         data.dietaryNotes || "",
         data.songRequest || "",
         data.invitationCode || "",
         data.timestamp || new Date().toISOString()
       ]);
       
       return ContentService.createTextOutput(JSON.stringify({ "status": "success" }))
                            .setMimeType(ContentService.MimeType.JSON);
     } catch (error) {
       return ContentService.createTextOutput(JSON.stringify({ "status": "error", "message": error.toString() }))
                            .setMimeType(ContentService.MimeType.JSON);
     }
   }
   ```
   > ⚠️ **IMPORTANT SYNTAX ERROR NOTE:** If you see an error like `Syntax error: SyntaxError: Unexpected end of input line: 16` in the Apps Script tab, it means the code was copied incompletely and the very last closing brace `}` at the bottom of the script was missed! Be absolutely sure that the final `}` is copied when replacing the code.
   >
   > Also, if you click the **"Run"** button in Google Apps Script directly, it is normal to see a `No post data found` message in the execution logs. This is because clicking "Run" inside Google's editor runs the script with an empty request, whereas the real web app will submit real data correctly. Always perform real tests by submitting the RSVP form on the live site.
5. Click **Deploy > New Deployment** (top-right).
6. Select **Web App** as the deployment type. Set the configurations:
   - **Execute as:** `Me` (your active email)
   - **Who has access:** `Anyone` (required to let your website's interface submit guest RSVPS)
7. Click **Deploy**. Authorize required permissions in the authentication dialogue.
8. **Copy the resulting Web App URL** (ends with `/exec`).
9. Open `/public/config/main.yaml` on your site, locate the `googleSheetsRsvpUrl` key, and replace the placeholder string with your live Apps Script link:
   ```yaml
   googleSheetsRsvpUrl: "https://script.google.com/macros/s/PASTE_YOUR_COPIED_ID_HERE/exec"
   ```

Now, every time guests submit RSVP records, they will see an instant digital invitation ticket, and the record will be pushed in real-time to your Google Sheet!

### 2. Congratulatory Wishes Guestbook (Formspree)
Under the "Leave a Wish" guestbook panel, submissions are handled via Formspree, a simple HTML form submission handler.

#### Setup Steps:
1. Sign up for a free account on [Formspree](https://formspree.io).
2. Create a new form project (e.g., named "Wedding Wishes Guestbook"). Select target notification email.
3. Formspree will provide a custom ID (usually an 8-character string, e.g., `mjkbvzyq`).
4. Paste this ID into `formspreeId` inside `/public/config/main.yaml`:
   ```yaml
   formspreeId: "your-eight-char-formspree-id"
   ```
Whenever guests sign the guestbook, their warm wishes are immediately processed, and a notification email is dispatched to you!


### 3. Live Snapshot Telegram Group
To allow guests to seamlessly share photostream snippets during your wedding program:
1. Open **Telegram** and create a new **Public Channel** or **Group**.
2. Copy your group’s share link (e.g., `https://t.me/your_channels_address`).
3. Open `/public/config/main.yaml` and replace the `telegramUrl` key under core configuration with your copied link:
   ```yaml
   telegramUrl: "https://t.me/YOUR_TELEGRAM_GROUP_LINK"
   ```

## Development

### Project Architecture

The codebase is organized into modular files. The primary files you need to interact with are:

```text
├── .env.example              # Documents template environment variables
├── index.html                # Entry HTML file 
├── metadata.json             # Manifest meta information (permissions & app name)
├── package.json              # Main project metadata & dependencies declaration
├── tsconfig.json             # TypeScript configuration options
├── vite.config.ts            # Vite compile and plugin bundle configs
├── public/
│   └── config/
│       ├── main.yaml         # CORE STATIC CONFIGURATION: Colors, layouts, toggles, asset links
│       ├── en.yaml           # English specific configurations, titles, and localized texts
│       └── am.yaml           # Amharic specific configurations, titles, and localized Amharic texts
└── src/
    ├── App.tsx               # Main application layout, sticking bar, and footer
    ├── config.ts             # Default configuration fallback (compiled-in fallback settings)
    ├── index.css             # Tailwind v4 configuration, theme colors, design styles
    ├── LanguageContext.tsx   # Config loading engine & multi-lingual context controller
    ├── main.tsx              # Mount point of the React app
    ├── types.ts              # Custom TypeScript types and structure interfaces
    └── components/           # Sub-components directories
        ├── AudioPlayer.tsx   # Soft instrumental background music loop controller
        ├── Countdown.tsx     # Timed ticking counter calculating days/hours/mins to wedding
        ├── Gallery.tsx       # Filterable polaroid-style grid with cinematic lightbox carousel
        ├── Guestbook.tsx     # Leave congratulations wishes and view beautiful parental blessings
        ├── Hero.tsx          # Large background fading image slideshow with monogram
        ├── Intro.tsx         # Our Story preview & modal of "How we Met & Got Engaged"
        ├── LocationMap.tsx   # Venue details, Google Map embed frame, and Navigation links
        ├── MemoryShare.tsx   # Telegram image upload group call-to-action panel
        ├── Monogram.tsx      # Custom vectorized circular gold wedding initials seal Logo
        ├── RsvpForm.tsx      # Smart RSVP form with party size controls & dynamic ticket generator
        ├── SaveTheDate.tsx   # Interactive Calendar with real offline-ready (.ics) invite downloader
        ├── Timeline.tsx      # Day schedule of program events with timeline controls
        └── VideoPreview.tsx  # Highlights video preview modal context container
```


### Getting Started

To run and build this application locally, ensure you have **Node.js (v18 or higher)** and **npm** installed on your workstation.

1. Install Dependencies
Run the following terminal command at the root folder:
```bash
npm install
```

2. Launch Local Dev Server
Start the development server with Hot Module Replacement on the default port:
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:3000` to preview changes in real-time.

3. Verify Code Integrity (Linter)
Validate syntax, compilation paths, and type-safety of your scripts before committing:
```bash
npm run lint
```

4. Build for Production
Bundle the static assets into a minified, lightweight folder in `/dist`:
```bash
npm run build
```

### Testing Suite

To ensure new features, custom localization assets, or component rearrangements do not break critical application logic, the repository includes a complete testing suite using **Vitest**, **React Testing Library**, and **JSDOM**.

#### Run Unit & Functional Tests
Execute the tests locally in headless run mode:
```bash
npm run test
```

#### Test Coverage Overview

The suite covers critical functional requirements of the wedding portal:
1. **Dynamic Image Optimization (`src/test/imageUtils.test.ts`)**: Confirms Unsplash URLs generate fluid responsive `srcSet` sizes and crop width filters safely while leaving custom self-hosted assets untouched.
2. **Dynamic YAML Translation Engine (`src/test/LanguageContext.test.tsx`)**: Validates that config and translation properties load, fall back gracefully to original defaults if network files fail, and dynamically swap headings / form inputs when lang parameters change.
3. **Responsive Wedding Countdown (`src/test/Countdown.test.tsx`)**: Verifies calculations for days, hours, and minutes remaining to the wedding target, as well as automatic switching to cohesive elapsed messages once the wedding date starts.
4. **Vector Initials Monogram (`src/test/Monogram.test.tsx`)**: Validates rendering structure, color accents, and dynamic initialization based on branding fields in custom static configurations.
5. **Smart RSVP Form (`src/test/RsvpForm.test.tsx`)**: Validates entire local and remote submission pipelines, state machine toggles for plus-ones or dietary restrictions, rendering localized ticket receipts, and local storage saves under simulated offline modes.
6. **Program Schedule Timeline (`src/test/Timeline.test.tsx`)**: Verifies that scheduled events render based on configuration arrays, collapse seamlessly when media list is empty, and cyclic transition controls navigate program carousels smoothly.
7. **Aesthetic Polaroid Gallery (`src/test/Gallery.test.tsx`)**: Tests category tab filters, horizontal snapping track index tracking, and keyboard inputs (Escape or Arrow keys) inside full-screen lightbox photo expansions.
8. **Congratulatory Guestbook (`src/test/Guestbook.test.tsx`)**: Confirms Formspree API submit handlers, error state banners (e.g. detailed closed form messages), and correct rendering of parental blessing notes.

The test setups in `src/test/setup.ts` intercept DOM environments smoothly, mocking animations (`IntersectionObserver`), layout scrolling behaviors (`HTMLElement.prototype.scrollTo`), audio media buffers (`HTMLMediaElement.prototype.play`), and layout queries (`matchMedia`) so your code is verified purely from command interfaces.