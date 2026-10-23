# Will — Group Savings & Chama Management Platform

**A smarter way to save together.**

Will is a digital group savings platform designed to help people in Kenya create, join, and manage chamas online. It aims to make group savings more transparent, organized, accessible, and secure through digital contribution tracking, M-Pesa payment integration, group management, and financial reporting.

The platform will allow each chama to operate independently, with its own members, saving rules, contribution records, and designated M-Pesa account or payment number.

## 1. Project Overview

Traditional chama management can involve manual record-keeping, contribution disputes, delayed updates, and difficulty tracking loans and repayments.

Will aims to address these challenges by providing a centralized digital platform where members can participate in group savings while viewing accurate records of their contributions and their group's financial progress.

### Vision

To make organized group saving more accessible, transparent, and convenient for people across Kenya.

### Mission

To provide a simple, reliable digital platform that helps savings groups manage contributions, membership, financial records, and group activities while supporting convenient M-Pesa payments.

## 2. Core Features

### Group Management
- Create and manage independent chama groups.
- Invite members to join a group.
- Assign group administrators.
- Maintain a member directory.
- Set group descriptions, saving targets, and contribution rules.
- Configure weekly, monthly, or other agreed contribution schedules.
- Allow eligible members to leave groups according to group rules.

### Savings and Contributions
- Record and track individual contributions.
- Display each member's contribution history.
- Show total group savings and progress toward targets.
- Track expected, completed, pending, and failed contributions.
- Maintain a transaction history for accountability.
- Provide members with a view of their personal savings records.

### M-Pesa Integration
Will is intended to integrate with Safaricom M-Pesa payment services through an approved integration arrangement.

The planned payment process is:

1. A member selects their chama and enters a contribution amount.
2. Will displays the contribution amount and the KSh 5 service fee.
3. The member confirms the payment details.
4. The member completes the payment through the configured M-Pesa payment flow.
5. The platform receives and verifies the payment result.
6. The chama's contribution is recorded only after the required payment confirmation.
7. The member receives a transaction confirmation, and the group's records are updated.

Each chama will have its own designated M-Pesa account or payment number, subject to the supported Safaricom payment arrangement. The platform will not intentionally mix the savings of different chamas.

**Important:** The exact payment routing must be confirmed during integration. A payment number alone does not guarantee that contributions and service fees can be split automatically.

### Service Fee Model

Will will charge a **KSh 5 platform service fee per successful contribution**.

The proposed fee structure is:

| Item | Example |
|---|---:|
| Member's contribution | KSh 500 |
| Will service fee | KSh 5 |
| Total payable | KSh 505 |
| Amount credited to the chama | KSh 500 |

The KSh 5 fee is charged in addition to the member's intended contribution. This allows the chama to receive its full contribution amount.

The platform's service fee will be directed to a separate designated business account through a supported and approved payment arrangement.

The system must:
- Disclose the fee before the member confirms payment.
- Record the contribution and service fee separately.
- Charge the fee only for successful contributions.
- Prevent duplicate fee collection when payment notifications are repeated.
- Reconcile payment records against confirmed transactions.
- Clearly disclose any additional M-Pesa transaction charges.

Actual payment routing and fee collection will depend on the payment provider's supported capabilities and applicable requirements.

### Loans and Repayments
Subject to each group's agreed rules, Will may support:
- Recording member loan requests.
- Recording approved loans.
- Tracking outstanding loan balances.
- Recording repayments.
- Viewing loan and repayment histories.
- Generating loan reports for authorized members.

Loan approval and disbursement rules will be configurable according to the group's policies and applicable requirements.

### Reports and Financial Transparency
- Individual contribution statements.
- Group savings summaries.
- Contribution and payment histories.
- Loan and repayment reports.
- Outstanding contribution summaries.
- Downloadable financial reports.
- Administrative activity records.

Reports will only be accessible to users authorized to view the relevant information.

## 3. User Roles and Permissions

### 3.1 Platform Administrator
Responsible for managing the Will platform itself.

Permissions may include:
- Managing platform users and system settings.
- Reviewing and supporting chama accounts.
- Monitoring payment integration status.
- Reviewing service-fee records and transaction reconciliation.
- Investigating reported issues and suspicious activity.
- Managing platform-level reports and audit records.

Platform administrators must not have unrestricted authority to alter or withdraw group funds.

### 3.2 Chama Administrator
Responsible for managing a specific savings group.

Permissions may include:
- Creating or configuring a chama.
- Inviting and managing members.
- Setting contribution schedules and saving targets.
- Viewing group contribution records.
- Managing group loan records according to agreed permissions.
- Generating group reports.
- Reviewing group financial activity.

Sensitive actions should be logged, and financial changes should require appropriate authorization.

### 3.3 Chama Treasurer
Responsible for supporting the group's financial administration.

Permissions may include:
- Reviewing contribution records.
- Reconciling group payment records.
- Recording authorized financial activities.
- Tracking loan repayments.
- Generating financial summaries.

The treasurer's permissions should be separate from those of other group administrators where appropriate.

### 3.4 Chama Member
A registered member of one or more savings groups.

Permissions may include:
- Creating an account and signing in securely.
- Joining groups through invitations or approved membership processes.
- Viewing personal contribution records.
- Viewing permitted group savings summaries.
- Making contributions through the supported payment process.
- Viewing transaction receipts and payment status.
- Reviewing applicable group rules.
- Viewing authorized loan and repayment information.

Members must not be able to edit their own confirmed payment records or access private information belonging to unrelated groups.

## 4. Financial and Transaction Rules

Will must maintain a clear distinction between the chama's money and the platform's revenue.

The following rules are fundamental:

1. Every chama has its own identifiable group records and designated payment arrangement.
2. Every contribution has a unique transaction reference.
3. A contribution is not marked successful based only on a member's claim or a payment request being initiated.
4. Payment confirmation must come from a trusted payment-provider notification or verification process.
5. Repeated notifications must not create duplicate contributions or service fees.
6. Failed or cancelled payments must not be recorded as successful savings.
7. Payment reversals and refunds must be handled through a defined reconciliation process.
8. Changes to financial records must be traceable through audit logs.
9. The system must not treat its own database balance as proof that funds have actually been received or remain available.
10. Withdrawals and transfers must follow the group's authorized procedures and the approved payment arrangement.

## 5. Security and Privacy

Will is intended to protect members' personal information and financial records.

Planned security measures include:
- Secure authentication and password protection.
- Role-based access control.
- Secure storage of sensitive information.
- Server-side validation of financial transactions.
- Verification of payment callbacks and notifications.
- Protection against duplicate transaction processing.
- Audit logs for sensitive administrative actions.
- Secure handling of API credentials and environment variables.
- Rate limiting and protection against common web attacks.
- Appropriate backups and recovery procedures.
- Privacy controls and a process for handling user data requests.

Production deployment must also account for applicable Kenyan data-protection requirements.

## 6. Proposed Technology Stack

The final technology stack can be confirmed during development. A suitable starting point is:

| Component | Proposed Technology |
|---|---|
| Frontend | React |
| Backend API | Python with FastAPI |
| Database | PostgreSQL |
| Payment integration | Safaricom Daraja API, subject to approval and supported payment flows |
| Version control | Git and GitHub |
| Testing | Automated backend, frontend, and payment-flow tests |
| Deployment | A suitable frontend and backend hosting provider |

Payment credentials must remain on the server and must never be exposed in frontend code or committed to GitHub.

## 7. Suggested Database Entities

The database will need to represent the following core entities:

- **Users:** account information and authentication details.
- **Chamas:** group details, saving rules, and designated payment information.
- **Memberships:** users' membership status and permissions within each group.
- **Invitations:** group invitations and their statuses.
- **Contribution Schedules:** expected contribution amounts and due dates.
- **Contributions:** individual savings records and payment statuses.
- **Transactions:** payment references, amounts, and provider responses.
- **Service Fees:** the KSh 5 fee associated with each eligible successful contribution.
- **Loans:** loan requests, approvals, balances, and status.
- **Repayments:** repayment transactions and outstanding balances.
- **Audit Logs:** records of sensitive actions and financial changes.
- **Notifications:** payment confirmations, reminders, and group updates.

These entities should be linked through unique identifiers so each transaction can be traced to the correct user, chama, and payment reference.

## 8. Development Roadmap

### Phase 1 — Foundation
- Set up the project repository.
- Design the database and core system architecture.
- Build user registration and authentication.
- Implement chama creation and membership management.

### Phase 2 — Savings Management
- Add contribution rules and schedules.
- Build contribution tracking and group dashboards.
- Add transaction histories and financial summaries.
- Implement role-based permissions.

### Phase 3 — Payment Integration
- Register and configure the appropriate payment integration.
- Test payment requests using the provider's sandbox.
- Implement payment verification and callback handling.
- Implement the KSh 5 service-fee logic.
- Test duplicate notifications, failures, reversals, and reconciliation.

### Phase 4 — Loans and Reporting
- Add loan and repayment records.
- Build financial reports.
- Add notifications and reminders.
- Improve audit logging and administrative tools.

### Phase 5 — Testing and Launch
- Perform security and functional testing.
- Test the platform with a small group of volunteer users.
- Verify payment reconciliation.
- Complete necessary regulatory and payment-provider checks.
- Deploy only after the financial flows are properly tested and approved.

## 9. Important Compliance Considerations

Will is intended to facilitate group savings and payment tracking. Because the platform may facilitate the collection, transfer, or management of other people's money, the exact business model and payment structure must be reviewed before handling real funds.

Before launch:
- Confirm the appropriate Safaricom integration and account structure.
- Confirm how chama funds and platform fees can be routed separately.
- Determine whether the proposed activities require authorization, licensing, or a regulated payment partner.
- Review applicable Central Bank of Kenya requirements and data-protection obligations.
- Establish clear terms of service, fee disclosures, refund procedures, and dispute-resolution processes.

The initial version should be developed and tested using simulated transactions and the payment provider's sandbox. It should not be presented as a live money-holding service before the necessary arrangements are in place.

## 10. Current Project Status

The repository contains a responsive, frontend-only demo for the foundation phase.

### Run locally

```bash
npm install
npm run dev
```

The demo includes a chama dashboard, local chama creation, member and contribution views, and CSV export. New contribution entries are saved as unverified and do not change group savings totals. Demo records are stored in the current browser's local storage.

This is not a production financial system. Authentication, server-side authorization, a backend database, invitations, audit logging, provider-backed payment verification, reconciliation, and live M-Pesa payments are not implemented. The sample records labeled "Verified" are illustrative only. No real money is collected, transferred, or verified.

Do not use this demo to make financial decisions or handle real funds. Complete the security, data-protection, payment-provider, and regulatory work described above before any production launch.

The initial product direction remains:
- **Project name:** Will
- **Purpose:** Group-based digital chama savings and management
- **Target market:** Chamas and community savings groups in Kenya
- **Contribution channel:** M-Pesa integration
- **Service fee:** KSh 5 per successful contribution, charged on top of the intended savings amount
- **Payment structure:** Each chama has a separate designated M-Pesa account or payment number
- **Revenue model:** Platform service fees
- **Initial priority:** Build and test group management, contribution tracking, and transaction records before enabling live payments

## 11. Long-Term Goals

Potential future improvements include:
- Mobile-friendly progressive web application.
- Automated contribution reminders.
- Multiple chama membership under one user account.
- Configurable savings goals and contribution cycles.
- Improved financial analytics.
- Notifications for payment confirmations and missed contributions.
- Additional supported payment methods.
- Better reconciliation and administrative reporting.

## 12. Project Principles

Will will be developed around five principles:

- **Transparency:** Members should understand how contributions, fees, and group records work.
- **Accountability:** Financial activities should be traceable.
- **Security:** Members' accounts and financial information must be protected.
- **Simplicity:** The platform should be easy to use, including on mobile devices.
- **Trust:** Group funds, platform revenue, and transaction records must remain clearly distinguished.

---

**Will — Save Together. Grow Together.**

A digital platform built to make group savings more organized, transparent, and accessible.

