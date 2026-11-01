# Locket Personal — Reviewed snapshot

**Status: source reviewed and Node.js tests passed; NOT tested inside Shadowrocket/Locket.**

This is a **personal maintenance rewrite** inspired by scripts published by **@leekang** and pasted by the user. It is **not** an identical copy of the original `Locket_Unlocked.js`: the original 150+ captions were restructured into a simpler local pack with over 150 entries, and some original gradients, image assets and features were not carried over. Keep attribution; do not assume redistributing third-party code is licensed. Prefer a **private GitHub repo** for personal archival use.

## Files

- `scripts/RemoteConfig.js`: custom caption catalog; merges upstream sections by individual caption IDs, date calculation in Vietnam timezone; safe pass-through on invalid body.
- `scripts/HeaderClean.js`: removes conditional caching headers safely without recreating an empty ETag.
- `scripts/Gold.js`: preserves demonstration of local RevenueCat entitlement response modification; **does not create a genuine subscription** and may fail under server validation.
- `config/Locket_Personal_GitHub.template.conf`: template for **public** raw GitHub hosting. Replace `GITHUB_USER` and `REPO_NAME` before using. Do not use this template unchanged.
- `config/Locket_Personal_Local.template.sgmodule`: local-path **unverified** reference; Shadowrocket may require explicit local script import and path mapping.
- `tests/test.js`: local tests with Node v22.
- `reference-original/`: exact backups of the two smaller scripts that the user pasted.

### Issues fixed

1. Malformed, empty, or failed remote responses no longer turn into fabricated empty config responses.
2. Header delete is case-insensitive; no more empty `X-RevenueCat-ETag` re-addition.
3. Caption merge is per `overlay_id`, not per section title; it keeps new server captions inside pre-existing categories.
4. Vietnamese clock uses UTC date accessors after UTC+7 shift.
5. Lunar New Year dates are bounded to a documented table 2026–2030; unknown future dates **omit** countdown instead of guessing Feb 10.
6. Avoids modifying storage buckets, CDN hosts, Sentry, or global cache lifetime, which can break media and security/privacy behavior.
7. Script arguments are handled with a defensive query parser; invalid URI encodings are skipped.
8. No live remote script auto-updating: snapshot remains stable as long as your own copy remains accessible.

### Limits / risks

- Setting `max_duration:60` and `microphone_enabled` does **not** prove 60-second video with audio actually works; the app/server can reject it.
- Several original cosmetic effects and external frame assets are intentionally not reproduced by this compact rewrite. This pack focuses on the **funny captions** and retains Gold/HD flags at configuration level.
- Changing an intercepted subscription response only affects client-side interpretation; server-side permissions remain separate.
- Do not run this alongside another RevenueCat/Remote Config rewrite module targeting the same endpoints: script order can conflict.
- Intercepting HTTPS requires trusting a local CA. Never upload `ca-p12`, `ca-passphrase`, cookies, API keys, personal log files, or signing credentials.
- Private GitHub repositories cannot serve anonymous raw URLs to Shadowrocket directly. For a private repo, use the backup only and import scripts locally when supported by your version.
- Header rewrites cannot guarantee a `200 OK` from a remote service.

## Test

```bash
node tests/test.js
```

## Put it on GitHub from iPhone

1. Open this ZIP from the Files app and extract it.
2. Open GitHub in Safari, create a **private** repository such as `locket-personal-backup`.
3. In the repository select **Add file → Upload files** and select the extracted files (if Safari doesn't allow folders, upload files individually in the correct directories or use GitHub Desktop later).
4. Keep the repository private unless you have the rights to publish third-party source.
5. **Uploading to GitHub is not done by this archive.** You must authorize the write to your own account; no password or tokens should be provided to this chat.

## Provenance

- Original code/preset concept: **@leekang** (user-provided source), `Locket_Unlocked.js`, `Locket_Gold.js`, `deleteHeader.js`.
- The provided JS is a fresh maintenance adaptation, not the author's original and not a promise of future Locket compatibility.
