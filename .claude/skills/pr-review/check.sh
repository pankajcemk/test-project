#!/usr/bin/env bash
# ==============================================================================
# UI PR Review Automated Pre-Check Script
# Checks git diff / staged changes for common UI security, performance, and
# quality issues before or during code review.
# ==============================================================================

set -euo pipefail

# ANSI color codes
RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

TARGET_REF="${1:-HEAD}"
BASE_REF="${2:-main}"

echo -e "${BLUE}=== Starting UI PR Automated Checks ===${NC}"

# Determine diff source
if git rev-parse --verify "$BASE_REF" >/dev/null 2>&1; then
    DIFF_CMD="git diff ${BASE_REF}...${TARGET_REF}"
    DIFF_FILES=$(git diff --name-only "${BASE_REF}...${TARGET_REF}" 2>/dev/null || true)
else
    # Fallback to staged or working tree diff against HEAD
    DIFF_CMD="git diff HEAD"
    DIFF_FILES=$(git diff --name-only HEAD 2>/dev/null || true)
fi

# Filter UI / frontend files
UI_FILES=$(echo "$DIFF_FILES" | grep -E '\.(jsx?|tsx?|vue|svelte|html|css|scss)$' || true)

if [ -z "$UI_FILES" ]; then
    echo -e "${YELLOW}No modified UI/frontend files found in diff.${NC}"
    exit 0
fi

echo -e "Auditing modified UI files:"
echo "$UI_FILES" | sed 's/^/  - /'
echo ""

WARNINGS=0
ERRORS=0

report_issue() {
    local severity="$1"
    local message="$2"
    local matches="$3"

    if [ -n "$matches" ]; then
        if [ "$severity" = "CRITICAL" ] || [ "$severity" = "ERROR" ]; then
            echo -e "${RED}[${severity}] ${message}${NC}"
            ERRORS=$((ERRORS + 1))
        else
            echo -e "${YELLOW}[${severity}] ${message}${NC}"
            WARNINGS=$((WARNINGS + 1))
        fi
        echo "$matches" | sed 's/^/    /'
        echo ""
    fi
}

# ------------------------------------------------------------------------------
# 1. Security Checks
# ------------------------------------------------------------------------------
echo -e "${BLUE}--- 1. Security Audit ---${NC}"

# Check for dangerouslySetInnerHTML / innerHTML / v-html
DANGEROUS_HTML=$($DIFF_CMD -G"dangerouslySetInnerHTML|innerHTML|v-html" -- $UI_FILES | grep -E '^\+[[:space:]].*(dangerouslySetInnerHTML|innerHTML|v-html)' || true)
report_issue "CRITICAL" "Unescaped/Dangerous HTML rendering detected (XSS risk):" "$DANGEROUS_HTML"

# Check for target="_blank" without rel="noopener" or rel="noreferrer"
TABNABBING=$($DIFF_CMD -G"target=[\"']_blank[\"']" -- $UI_FILES | grep -E '^\+[[:space:]].*target=["'\''\']_blank' | grep -vE 'rel=.*(noopener|noreferrer)' || true)
report_issue "WARN" "target=\"_blank\" link missing rel=\"noopener noreferrer\" (Tabnabbing risk):" "$TABNABBING"

# Check for potential javascript: URLs
JS_URLS=$($DIFF_CMD -G"href=[\"']javascript:" -- $UI_FILES | grep -E '^\+[[:space:]].*href=["'\''\']javascript:' || true)
report_issue "CRITICAL" "Unsafe javascript: protocol in href detected:" "$JS_URLS"

# Check for exposed API Keys or Secrets
POTENTIAL_SECRETS=$($DIFF_CMD -E -- $UI_FILES | grep -E '^\+[[:space:]].*(api_key|apiKey|secret|private_key|token)[[:space:]]*[:=][[:space:]]*["'\''][A-Za-z0-9_\-]{16,}["'\'']' | grep -v 'process.env' || true)
report_issue "CRITICAL" "Potential hardcoded secret or token detected in client code:" "$POTENTIAL_SECRETS"

# ------------------------------------------------------------------------------
# 2. Performance & Lifecycle Checks
# ------------------------------------------------------------------------------
echo -e "${BLUE}--- 2. Performance & Cleanup Audit ---${NC}"

# Check for setInterval / addEventListener without clear/remove in the same file diff
INTERVAL_CALLS=$($DIFF_CMD -G"setInterval|addEventListener" -- $UI_FILES | grep -E '^\+[[:space:]].*(setInterval|addEventListener)\(' || true)
if [ -n "$INTERVAL_CALLS" ]; then
    echo -e "${YELLOW}[WARN] Found timers or event listeners added. Verify matching cleanup logic on unmount:${NC}"
    echo "$INTERVAL_CALLS" | sed 's/^/    /'
    echo ""
    WARNINGS=$((WARNINGS + 1))
fi

# ------------------------------------------------------------------------------
# 3. Accessibility & Code Polish Checks
# ------------------------------------------------------------------------------
echo -e "${BLUE}--- 3. Accessibility (a11y) & Polish Audit ---${NC}"

# Check for clickable divs or spans (onClick on non-button elements)
CLICKABLE_DIVS=$($DIFF_CMD -G"onClick" -- $UI_FILES | grep -E '^\+[[:space:]]*<(div|span)[^>]*onClick' || true)
report_issue "WARN" "Clickable <div>/<span> found. Prefer semantic <button> or ensure role='button' with key handling:" "$CLICKABLE_DIVS"

# Check for left-over console.log or debugger statements
DEBUG_CALLS=$($DIFF_CMD -G"console\.log|debugger" -- $UI_FILES | grep -E '^\+[[:space:]].*(console\.log|debugger)' || true)
report_issue "WARN" "Debug statement (console.log / debugger) left in code:" "$DEBUG_CALLS"

# ------------------------------------------------------------------------------
# Summary
# ------------------------------------------------------------------------------
echo -e "${BLUE}=== Check Complete ===${NC}"
if [ "$ERRORS" -gt 0 ]; then
    echo -e "${RED}Found $ERRORS critical issue(s) and $WARNINGS warning(s). Review required.${NC}"
    exit 1
elif [ "$WARNINGS" -gt 0 ]; then
    echo -e "${YELLOW}Found $WARNINGS warning(s). 0 critical issues.${NC}"
    exit 0
else
    echo -e "${GREEN}All automated UI checks passed cleanly!${NC}"
    exit 0
fi
