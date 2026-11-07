# Will — Group Savings & Chama Management Platform

**A smarter way to save together.** Will helps people in Kenya create, join and manage chamas online with transparent contribution tracking, group management and financial reporting, with M-Pesa payments planned.

This repository currently holds the **frontend for the foundation phase** (Phase 1). The backend (FastAPI + PostgreSQL) and M-Pesa (Daraja) integration come next.

## Run locally

```bash
npm install
npm run dev        # development server
npm run build      # type-check + production build
```

## What's included

- Chama dashboard with savings progress
- Create a chama (rules, schedule, target, designated M-Pesa number)
- Member directory with roles (administrator, treasurer, member)
- Contribution entry with the **KSh 5 service fee** shown before saving
- Transaction history with unique references and statuses
- Reports and CSV export (contributions, members)

## Financial rules enforced in the UI

- Only **verified** contributions count toward savings totals.
- New entries are saved as **unverified**; there is no payment provider yet.
- Contribution and service fee are stored as separate fields.
- Verified records cannot be edited or deleted; only unverified entries can be removed.
- CSV export neutralises spreadsheet formula injection.

## Not implemented yet

Authentication, server-side authorization, backend database, invitations, audit logging, provider-backed payment verification, reconciliation, loans and live M-Pesa payments. Demo data is stored in the browser's local storage. Sample records labelled "Verified" and "Sample" are illustrative only. **No real money is collected, transferred or verified. Do not use for real funds.**

## Roadmap

1. **Foundation** — frontend done; backend, auth, invitations next
2. Savings management — schedules, dashboards, RBAC
3. Payment integration — Daraja sandbox, callbacks, fee logic, reconciliation
4. Loans and reporting
5. Testing and launch — security review, pilot group, regulatory and provider checks

## Structure

```
src/
  lib/     types, store (localStorage), formatting + fee logic, CSV
  pages/   Dashboard, CreateChama, ChamaDetail, About
  App.tsx  layout and routes
```

**Will — Save Together. Grow Together.**