# v2.1.0

Public open-source release of the extension with commercial gating removed and the core workflow cleaned up for local use.

## Highlights

- Removed login, subscription, quota, payment, and uninstall prompt behavior
- Refreshed the popup, dashboard, and in-page Maps controls with a cleaner utility-focused UI
- Added lead deduplication to reduce repeated exports
- Added dashboard filters for faster review before export
- Added local session history for recent scrape runs
- Cleaned the repository for public open-source distribution

## What Changed

### Product and workflow

- Export now works without account requirements
- Uninstall no longer opens a feedback form
- Popup and dashboard no longer contain commercial upgrade flows

### Data quality

- Leads are deduplicated by `placeID`, website host, phone, normalized name/address, and coordinates
- Duplicate rows merge useful enrichment fields instead of simply keeping the first match

### Dashboard

- Added session switching for recent local scrape sessions
- Added filters for:
  - free-text search
  - has email
  - has website
  - minimum rating
  - minimum review count

### Open-source cleanup

- Removed commercial/product prompts from the active extension flow
- Added derivative-work notice and repository provenance documentation
- Updated project metadata for the public open-source release

## Notes

- This remains a browser-side scraper and depends on Google Maps page structure, so future Google UI changes may require parser updates.
- Email and social discovery remain best-effort and depend on publicly accessible business websites.

## Upgrade Notes

- Existing users should reload the unpacked extension after updating.
- If you have old saved data in extension storage, new exports will continue using the latest session format automatically.
