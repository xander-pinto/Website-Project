#!/usr/bin/env bash
# check-voice — scan Tommy's Tunes copy for language-rule violations (see CLAUDE.md).
# Usage: bash .claude/skills/check-voice/lint.sh [file ...]
#   No args = scan all *.html and js/data/*.js (excluding reference/ and .git/).
# Written for macOS bash 3.2 — no mapfile / bash-4 features.
set -u

ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
cd "$ROOT" || exit 2

if [ "$#" -gt 0 ]; then
  FILES="$*"
else
  FILES="$(find . -type f \( -name '*.html' -o -path './js/data/*.js' \) \
            -not -path './reference/*' -not -path './.git/*' -not -path './node_modules/*')"
fi

[ -z "$FILES" ] && { echo "No files to scan."; exit 0; }

found=0

# Em-dash scan that understands comments. Skips <!-- -->, /* */, and //-style
# lines (across line breaks too), so only em dashes in real, visible copy show.
emdash_scan() {
  for f in $FILES; do
    awk '
      { line=$0 }
      (index(line,"<!--")>0 && index(line,"-->")>0) { next }
      (h==0 && index(line,"<!--")>0) { h=1; next }
      (h==1) { if (index(line,"-->")>0) h=0; next }
      (index(line,"/*")>0 && index(line,"*/")>0) { next }
      (b==0 && index(line,"/*")>0) { b=1; next }
      (b==1) { if (index(line,"*/")>0) b=0; next }
      (line ~ /^[[:space:]]*\/\//) { next }
      (line ~ /^[[:space:]]*\*/) { next }
      (index(line,"\xe2\x80\x94")>0) { printf "%s:%d:%s\n", FILENAME, NR, line }
    ' "$f"
  done
}

# For the word/phrase rules, drop the most common single-line comment markers.
strip_comments() {
  grep -vE '<!--|-->|^[^:]*:[0-9]+:[[:space:]]*(//|/\*|\*)'
}

report_grep() {
  label="$1"; rx="$2"; mode="${3:-}"
  if [ "$mode" = "ci" ]; then
    hits="$(grep -nHEi "$rx" $FILES 2>/dev/null | strip_comments)"
  else
    hits="$(grep -nHE "$rx" $FILES 2>/dev/null | strip_comments)"
  fi
  echo "== $label =="
  if [ -n "$hits" ]; then printf '%s\n' "$hits"; found=1; else echo "  none"; fi
  echo
}

# Em dashes (comment-aware).
echo "== Em dashes (—) =="
em="$(emdash_scan)"
if [ -n "$em" ]; then printf '%s\n' "$em"; found=1; else echo "  none"; fi
echo

report_grep "Banned words" "\\bpremier\\b|unforgettable|unparalleled|elevate your event|next level" ci
report_grep "Stale year count (use \"40+ years\")" "over 30 years|over [0-9]+ years|[0-9]+ years of (experience|service)" ci
report_grep "Showroom wording (\"two showrooms\")" "two showrooms" ci
report_grep "CTA wording (use \"Check your date\")" "book (a|your|a free) consultation" ci

if [ "$found" -eq 1 ]; then
  echo "Voice check: review the hits above."
  exit 1
fi
echo "Voice check: clean."
exit 0
