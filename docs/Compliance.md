# CareNest — Compliance

**Status:** Planning document — not legal advice

CareNest handles health-related information. This document outlines compliance considerations. **Consult legal counsel before processing real PHI in production.**

---

## Regulatory Context

| Framework              | Relevance                                                                                  |
| ---------------------- | ------------------------------------------------------------------------------------------ |
| **HIPAA**              | Applies if CareNest is a Business Associate or Covered Entity handling PHI                 |
| **State privacy laws** | CCPA and others may apply depending on users                                               |
| **FDA**                | Medication assistance features may trigger regulatory review — treat as informational only |

---

## HIPAA Considerations

### UI Notice (Phase 6)

Care Recipient onboarding includes a **HIPAA notice** — plain-language privacy reassurance. This is a UX element, not compliance certification.

### Technical Safeguards (Phase 10+)

| Safeguard             | Plan                                       |
| --------------------- | ------------------------------------------ |
| Encryption in transit | HTTPS everywhere                           |
| Encryption at rest    | Supabase PostgreSQL encryption             |
| Access controls       | RLS policies per user                      |
| Audit logs            | `audit_logs` table (see Database.md)       |
| Session management    | Supabase Auth + sign-out                   |
| Minimum necessary     | Users access only their care relationships |

### Business Associate Agreement (BAA)

- Supabase offers BAA on eligible plans — **required before real PHI**
- OpenAI: review data processing terms; may require zero-retention API settings
- Twilio: BAA available for HIPAA-eligible products

### What we do NOT claim in MVP

- HIPAA compliance certification
- Medical device status
- Clinical decision support

---

## Data Classification

| Data               | Classification | Mock storage              | Production storage     |
| ------------------ | -------------- | ------------------------- | ---------------------- |
| Email, name        | PII            | sessionStorage            | Supabase (encrypted)   |
| Health description | PHI            | sessionStorage (dev only) | Supabase + RLS         |
| Notes content      | PHI            | sessionStorage (dev only) | Supabase + RLS         |
| Voice recordings   | PHI            | Not stored in mock        | Supabase Storage + RLS |

**Rule:** Never store PHI in `localStorage`.

---

## User Consent (Planned)

| Consent                 | When                             |
| ----------------------- | -------------------------------- |
| Terms of Service        | Phase 10 (first real auth)       |
| Privacy Policy          | Phase 10                         |
| AI processing consent   | Phase 11 (before any AI feature) |
| Voice recording consent | Phase 11                         |

---

## Data Retention

| Data           | Retention policy (to define with legal) |
| -------------- | --------------------------------------- |
| Notes          | Until user deletes or account closure   |
| Audit logs     | Minimum 6 years (HIPAA recommendation)  |
| Deleted notes  | Soft delete; hard purge policy TBD      |
| AI transcripts | Same as parent note                     |

---

## Incident Response (Future)

Document before production:

1. Breach detection process
2. Notification timeline (HIPAA: 60 days)
3. Supabase support contact
4. User notification template

---

## AI-Specific Compliance

| Risk                        | Mitigation                                 |
| --------------------------- | ------------------------------------------ |
| Hallucinated medical advice | Disclaimers; informational only; no dosing |
| Training on user data       | OpenAI API with no-training flags          |
| Voice recording consent     | Explicit UI consent before recording       |
| Cross-border data           | Document Supabase region selection         |

---

## Pre-Production Checklist

- [ ] Legal review of Privacy Policy and Terms
- [ ] Supabase BAA signed
- [ ] RLS policies tested with multiple users
- [ ] Penetration test or security audit
- [ ] AI disclaimer reviewed by counsel
- [ ] Data retention policy published
- [ ] Incident response plan documented

---

## Related Documents

- [Security.md](./Security.md)
- [AI.md](./AI.md)
- [Database.md](./Database.md)
