#!/usr/bin/env bash
# Smoke-tests a deployed EnochLabs environment.
#
# Usage:
#   ./scripts/smoke-test.sh --frontend-url https://enochlabs.dev \
#                            --backend-url https://api.enochlabs.dev \
#                            [--submit-test-inquiry]
#
# Exits non-zero on any failure — safe to use as a CI gate after a deploy.
# See docs/SPRINT-PLAN.md, Sprint 1: "Smoke test: submit the live contact
# form, confirm the row lands in production Postgres."

set -euo pipefail

FRONTEND_URL=""
BACKEND_URL=""
SUBMIT_TEST_INQUIRY=false

while [[ $# -gt 0 ]]; do
  case "$1" in
    --frontend-url)
      FRONTEND_URL="$2"
      shift 2
      ;;
    --backend-url)
      BACKEND_URL="$2"
      shift 2
      ;;
    --submit-test-inquiry)
      SUBMIT_TEST_INQUIRY=true
      shift
      ;;
    *)
      echo "Unknown argument: $1" >&2
      exit 1
      ;;
  esac
done

pass() { echo "  ✓ $1"; }
fail() { echo "  ✗ $1" >&2; exit 1; }

if [[ -n "$FRONTEND_URL" ]]; then
  echo "Checking frontend at ${FRONTEND_URL} ..."
  status=$(curl -s -o /dev/null -w "%{http_code}" "$FRONTEND_URL")
  [[ "$status" == "200" ]] && pass "GET / → 200" || fail "GET / → ${status} (expected 200)"
fi

if [[ -n "$BACKEND_URL" ]]; then
  echo "Checking backend at ${BACKEND_URL} ..."

  health_status=$(curl -s -o /dev/null -w "%{http_code}" "${BACKEND_URL}/api/v1/health")
  [[ "$health_status" == "200" ]] \
    && pass "GET /api/v1/health → 200" \
    || fail "GET /api/v1/health → ${health_status} (expected 200)"

  root_status=$(curl -s -o /dev/null -w "%{http_code}" "${BACKEND_URL}/")
  [[ "$root_status" == "200" ]] && pass "GET / → 200" || fail "GET / → ${root_status} (expected 200)"

  if [[ "$SUBMIT_TEST_INQUIRY" == "true" ]]; then
    echo "Submitting a test inquiry ..."
    response=$(curl -s -o /tmp/smoke_inquiry_response.json -w "%{http_code}" \
      -X POST "${BACKEND_URL}/api/v1/inquiries" \
      -H "Content-Type: application/json" \
      -d '{"name":"Smoke Test","contact":"smoke-test@enochlabs.dev","problem":"Automated smoke test — safe to ignore or delete."}')

    if [[ "$response" == "201" ]]; then
      pass "POST /api/v1/inquiries → 201 (test row created — see docs/SPRINT-PLAN.md Sprint 3 admin view to delete it)"
    else
      fail "POST /api/v1/inquiries → ${response} (expected 201). Response: $(cat /tmp/smoke_inquiry_response.json)"
    fi
  fi
fi

echo "All smoke tests passed."
