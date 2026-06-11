---
name: check-voice
description: Check Tommy's Tunes site copy against the project language rules before publishing or committing. Flags em dashes, banned words (premier, unforgettable, unparalleled, "elevate your event", "next level"), stale "over 30 years" phrasing, "two showrooms", and "book a consultation". Use after editing any HTML or js/data content.
---

# /check-voice

Guards the language rules in `CLAUDE.md` so nothing off-brand ships.

## Steps
1. Run the bundled script. With no args it scans every `*.html` and `js/data/*.js` (skipping `reference/`):
   ```
   bash .claude/skills/check-voice/lint.sh
   ```
   To check only what you changed, pass paths:
   ```
   bash .claude/skills/check-voice/lint.sh services.html js/data/team-data.js
   ```
2. Read the output. Report each real hit as `file:line` with the rule it breaks.
   - The em-dash section can include decorative comment banners (inside `<!-- -->` or `/* */`). Those are not visible copy, so ignore them. Flag em dashes in actual text, attributes, and data strings.
3. Then eyeball what grep can't catch:
   - Sentence case everywhere except the `TOMMY'S TUNES` wordmark. Watch for Title Case headings.
   - False-enthusiasm words used in spirit even if not on the list: "exciting," "groundbreaking," "game-changing."
4. Summarize: "clean," or a short list of fixes with locations. Do not auto-fix unless asked.

## The rules (from CLAUDE.md)
- No em dashes (—) in visible copy. En dashes (–) in ranges like "Mon–Thu" are correct.
- Banned words: premier, unforgettable, unparalleled, "elevate your event", "next level".
- Never "over 30 years" or a fixed year count that ages; always "40+ years".
- Selden = showroom, Melville = office. Never "two showrooms".
- The CTA is "Check your date", never "Book a consultation".
- Sentence case everywhere (wordmark excepted).
