# Example: Generic App Specification Template

Use this template for any new app specification in AppFactory.

**For**: Copilot agent when designing new features  
**Version**: 1.0  
**Last Updated**: June 2026

---

## [App/Feature Name] Specification

**Status**: [Design/In Progress/Complete]  
**Owner**: [Copilot]  
**Last Updated**: [Date]  
**Review Date**: [Target completion date]

---

## 1. Overview

### Vision
[1-2 sentence description of what this app/feature does]

### Target Users
[Who are the primary users?]
[Who are secondary users?]

### Core Features
- [Feature 1]
- [Feature 2]
- [Feature 3]

### Out of Scope (Phase 1)
- [Feature to defer]
- [Feature to defer]

### Technology Stack
- **Frontend**: [Framework, language, tools]
- **Backend**: [Runtime, framework, language]
- **Database**: [What database?]
- **Hosting**: [Where will it run?]
- **Authentication**: [Auth method: JWT, OAuth, session, etc.]

---

## 2. User Stories

### Story 1: [Feature Title]
**As a** [user type]  
**I want to** [action]  
**So that** [benefit]

**Acceptance Criteria**:
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

**Edge Cases**:
- Case 1: [how to handle]
- Case 2: [how to handle]

### Story 2: [Feature Title]
[Repeat format above]

### Story 3: [Feature Title]
[Repeat format above]

---

## 3. Data Model

### Entity: [Entity Name]
```json
{
  "id": "unique-id",
  "field1": "value",
  "field2": 123,
  "createdAt": "2026-01-01T00:00:00Z"
}
```

### Entity: [Entity Name]
[Repeat format above]

### Relationships
[Describe how entities relate to each other]

### Storage Architecture
- **[Component]**: [Where is it stored? Why?]
- **[Component]**: [Where is it stored? Why?]

---

## 4. API Design

### Endpoints

#### GET /api/v1/[resource]
**Purpose**: [What does this do?]  
**Request**: [Query params if any]  
**Response**:
```json
{
  "data": [{ "id": "...", "name": "..." }],
  "total": 100,
  "page": 1
}
```
**Status Codes**: 200 (success), 400 (bad request), 404 (not found)

#### POST /api/v1/[resource]
**Purpose**: [What does this do?]  
**Request**:
```json
{
  "name": "...",
  "description": "..."
}
```
**Response**:
```json
{
  "id": "new-id",
  "name": "...",
  "createdAt": "2026-01-01"
}
```
**Status Codes**: 201 (created), 400 (bad request), 409 (conflict)

#### PUT /api/v1/[resource]/:id
**Purpose**: [What does this do?]  
**Request**: [Body structure]  
**Response**: [Updated resource]  
**Status Codes**: 200 (success), 400 (bad request), 404 (not found)

#### DELETE /api/v1/[resource]/:id
**Purpose**: [What does this do?]  
**Response**: [Confirm message]  
**Status Codes**: 204 (success), 404 (not found)

---

## 5. UI/UX Design

### User Flows

#### Flow 1: [Flow Name]
```
User starts → Does action A → Sees result → Done
  ↓
If error → Sees message → Retries
```

### Pages

#### Page 1: [Page Name]
[Describe layout, components, elements]

```
┌─────────────────┐
│ Header          │
├─────────────────┤
│                 │
│ Main content    │
│                 │
├─────────────────┤
│ Footer          │
└─────────────────┘
```

#### Page 2: [Page Name]
[Repeat format above]

### Design System
- **Colors**: [Primary], [Secondary], [Accent]
- **Typography**: [Font families, sizes]
- **Spacing**: [Standard margins/padding]
- **Buttons**: [Style for primary, secondary, destructive]
- **Forms**: [Form field styles]

### Mobile Design
[How does it differ from desktop?]
[Mobile-first or desktop-first?]

### Accessibility
- WCAG level: [A, AA, or AAA target]
- Key considerations: [Screen readers, keyboard nav, color contrast, etc.]

---

## 6. Technical Specifications

### Frontend
- **Framework/Library**: [React, Vue, Svelte, etc.]
- **State Management**: [Redux, Vuex, Context, etc.]
- **HTTP Client**: [Fetch, Axios, etc.]
- **Testing**: [Jest, Vitest, Playwright, etc.]
- **Build Tool**: [Vite, Webpack, Parcel, etc.]
- **Styling**: [Tailwind, CSS Modules, Styled Components, etc.]

### Backend
- **Runtime**: [Node.js, Python, Go, etc.]
- **Framework**: [Express, Django, FastAPI, etc.]
- **Authentication**: [JWT, OAuth2, Session, etc.]
- **Authorization**: [Role-based, Attribute-based, etc.]
- **Database**: [PostgreSQL, MongoDB, SQLite, etc.]
- **Caching**: [Redis, In-memory, etc.]
- **Validation**: [Zod, Joi, Pydantic, etc.]

### Infrastructure
- **Hosting**: [Vercel, Railway, AWS, etc.]
- **Database Hosting**: [Managed service, self-hosted, etc.]
- **Storage**: [S3, local filesystem, etc.]
- **CDN**: [Cloudflare, AWS CloudFront, etc.]
- **Monitoring**: [Sentry, DataDog, etc.]
- **Logging**: [CloudWatch, Loggly, etc.]

### Security
- **Authentication**: [Method and flow]
- **Authorization**: [How permissions work]
- **Data Encryption**: [At rest and in transit]
- **API Security**: [Rate limiting, CORS, etc.]
- **Secrets Management**: [Environment variables, vault, etc.]

### Performance Targets
- **Page Load Time**: [Target in seconds]
- **API Response Time**: [Target in ms]
- **Database Query Time**: [Target in ms]
- **Memory Usage**: [Target in MB]
- **Uptime**: [Target percentage, e.g., 99.9%]

---

## 7. Implementation Plan

### Phase 1: [Name] (Week 1-2)
**Goal**: [What are you trying to accomplish?]

**Tasks**:
1. [Task 1]
2. [Task 2]
3. [Task 3]

**Owner**: [Who leads this phase?]

**Deliverables**:
- [What gets built?]
- [What gets tested?]
- [What documentation needed?]

### Phase 2: [Name] (Week 3-4)
[Repeat format above]

### Phase 3: [Name] (Week 5-6)
[Repeat format above]

---

## 8. Risk Analysis

### Technical Risks
| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|-----------|
| [Risk 1] | High/Med/Low | High/Med/Low | [How to mitigate] |
| [Risk 2] | High/Med/Low | High/Med/Low | [How to mitigate] |

### Resource Risks
| Risk | Mitigation |
|------|-----------|
| [Risk 1] | [How to mitigate] |

### Timeline Risks
| Risk | Mitigation |
|------|-----------|
| [Risk 1] | [How to mitigate] |

---

## 9. Testing Strategy

### Unit Tests
- [What components to test]
- [What functions to test]
- [Target coverage: 80%+]

### Integration Tests
- [What systems to test together]
- [API + Database tests]
- [Service interactions]

### E2E Tests
- [What user flows to test]
- [Happy path tests]
- [Error path tests]

### Manual QA
- [What to test manually]
- [Browser compatibility]
- [Device compatibility]
- [Performance checks]

### Load Testing
- [Expected user load]
- [How to test it]
- [Target response time under load]

---

## 10. Success Criteria

### Functional
- [ ] All requirements implemented
- [ ] All user stories satisfied
- [ ] All edge cases handled

### Quality
- [ ] 80%+ test coverage
- [ ] No lint errors
- [ ] Build succeeds
- [ ] Tests pass

### Performance
- [ ] Page loads in [time]
- [ ] API responds in [time]
- [ ] Database queries in [time]

### Security
- [ ] No security vulnerabilities
- [ ] No secrets in code
- [ ] All data encrypted
- [ ] Auth working correctly

### Deployment
- [ ] Deployed to staging
- [ ] Staging tests pass
- [ ] Deployed to production
- [ ] Production monitoring active

---

## 11. Known Limitations

### Current (MVP)
- [Limitation 1]
- [Limitation 2]
- [Limitation 3]

### Phase 2 Improvements
- [Future feature 1]
- [Future feature 2]

### Not In Scope (Ever)
- [Feature that won't be built]

---

## 12. Questions for Clarification

**For Builder**:
- [ ] [Question 1?]
- [ ] [Question 2?]

**For QA**:
- [ ] [Question 1?]
- [ ] [Question 2?]

**For Deployer**:
- [ ] [Question 1?]
- [ ] [Question 2?]

---

## Appendix: Reference Materials

- [Link to design mockups]
- [Link to competitor analysis]
- [Link to industry standards]
- [Link to similar apps]

---

## Approval

- [ ] Copilot wrote spec
- [ ] Builder reviewed for implementability
- [ ] QA reviewed for testability
- [ ] Josh approved spec
- [ ] Ready to implement

**Approved by**: Josh  
**Date**: [Date]  
**Version**: 1.0

---

**How to use this template**:
1. Copy and save as `docs/specs/[app-name]-spec.md`
2. Fill in all sections with your specific details
3. Share with Builder and QA for review
4. Get Josh's approval
5. Builder implements per spec
6. QA tests per spec
7. Deployer releases per checklist

For an example, see: examples/kids-worship-app-spec.md

**Last Updated**: June 2026
