# Google Maps Scraper

Free Chrome extension for extracting business leads from Google Maps and exporting them to CSV or XLSX.

This repository is the fully unlocked public version of the project. There is no login, subscription, quota, uninstall prompt, or payment flow in the extension.

## Features

- Scrape Google Maps search result listings directly in the browser
- Auto-scroll through result feeds and collect leads in bulk
- Extract business details such as name, phone, website, address, category, rating, review count, place ID, CID, latitude, and longitude
- Attempt email and social profile discovery from linked business websites
- Export collected leads to `CSV` or `XLSX`
- Store scraped leads locally in extension storage

## Screenshots

![Google Maps scraper UI](./screenshot/ui.png)
![Google Maps scraper popup](./screenshot/popup.png)
![Sample exported data](./screenshot/demo_data.png)

## Installation

1. Download or clone this repository.
2. Open `chrome://extensions/` in Chrome or another Chromium-based browser.
3. Enable `Developer mode`.
4. Click `Load unpacked`.
5. Select this repository folder.

## Usage

1. Open Google Maps.
2. Search for a business category and location, for example `dentists in Chicago`.
3. Click the extension icon and use `Search Google Maps` if you want to open a search quickly.
4. On the Google Maps page, use the injected panel:
   - `Start Auto Extract` to scroll and collect listings
   - `Export Leads` to open the dashboard
   - `Clear` to reset the current session
5. In the dashboard, download the results as `CSV` or `XLSX`.

## Extracted Fields

The exact fields depend on what Google Maps and the linked business website expose, but the extension can collect:

- `name`
- `phone`
- `website`
- `email`
- `address`
- `category`
- `reviewCount`
- `averageRating`
- `placeID`
- `cID`
- `latitude`
- `longitude`
- weekly opening hours
- social links such as `instagram`, `facebook`, `twitter`, `linkedin`, `youtube`, and `yelp`

## Project Structure

- [manifest.json](./manifest.json): extension manifest
- [contentScript.js](./contentScript.js): Google Maps page UI and lead extraction logic
- [contentScript2.js](./contentScript2.js): injects the XHR hook into the page
- [injected.js](./injected.js): listens for Google Maps XHR responses
- [js/mybg.js](./js/mybg.js): background worker logic for fetch and email/social extraction
- [js/popup.js](./js/popup.js): popup behavior
- [js/dashboard.js](./js/dashboard.js): export dashboard

## Notes

- This extension depends on Google Maps page structure and internal responses. Google UI changes can break parts of the scraper.
- Email and social discovery are best-effort only and depend on publicly accessible business websites.
- Use the extension responsibly and in line with applicable laws, platform rules, and your own compliance requirements.

## Development

There is no build step in this repository. The extension is plain HTML, CSS, and JavaScript with vendored browser libraries.

To test changes:

1. Reload the unpacked extension in `chrome://extensions/`.
2. Refresh the Google Maps tab.
3. Re-run a scrape and export flow.

## Release

Current public release: `v2.1.0`

## Open Source Status

This repository is published as open-source software for public use under the Apache 2.0 license included in this repo.

## Provenance

This codebase is a modified derivative of the Apache-2.0 licensed project originally published at:

- `https://github.com/LeadGenerationTools/google-maps-extractor`

This repository removes the original commercial gating and related prompts, and adds local-only workflow improvements, UI refinements, session history, filtering, and deduplication changes.

## License

This project is distributed under the terms of the [LICENSE](./LICENSE) file in this repository. See [NOTICE](./NOTICE) for derivative-work attribution and modification notice.
