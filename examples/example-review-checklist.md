# Example: Code Review Checklist

Comprehensive checklist for agents reviewing each other's pull requests.

**For**: QA and Copilot when reviewing Builder's code  
**Version**: 1.0  
**Last Updated**: June 2026

---

## How to Use This Checklist

This checklist helps agents review code systematically. Use it in pull request comments:

```markdown
## Code Review: [PR Title]

### ✓ Spec Compliance
- [ ] Matches specification
...

### ✓ Code Quality
- [ ] Readable code
...
```

---

## 1. Specification Compliance

**Does the code do what the spec says?**

- [ ] **Implements all requirements** from spec
  - [ ] Feature 1 complete
  - [ ] Feature 2 complete
  - [ ] Feature 3 complete
  - _If missing: Which requirements aren't implemented?_

- [ ] **No extra features** beyond spec (scope creep)
  - [ ] Only builds what was asked for
  - _If extra: Why? Is it necessary? Should it be in Phase 2?_

- [ ] **All edge cases handled** as per spec
  - [ ] Error case 1: Handled correctly
  - [ ] Error case 2: Handled correctly
  - _If missing: Which edge case isn't handled?_

- [ ] **Matches architecture** from design
  - [ ] Component structure as planned
  - [ ] Data flow as designed
  - [ ] API usage as specified
  - _If different: Why? Is the new approach better?_

- [ ] **Follows naming conventions** from spec
  - [ ] API endpoint names match spec
  - [ ] Database field names match spec
  - [ ] Function names descriptive
  - _If different: Why? Approved by Copilot?_

**Questions for Builder**:
- [ ] Any requirements you couldn't implement?
- [ ] Any parts you interpreted differently?
- [ ] Did you find issues with the spec?

---

## 2. Code Quality

**Is the code clean, readable, and maintainable?**

### Readability
- [ ] **Variable names are clear**
  ```javascript
  Good:   const userPreferences = getUserPrefs();
  Bad:    const up = getUp();
  ```

- [ ] **Function names describe what they do**
  ```javascript
  Good:   function calculateTotalPrice(items) { }
  Bad:    function calc(x) { }
  ```

- [ ] **Code is DRY (Don't Repeat Yourself)**
  - [ ] No duplicated logic
  - [ ] Reusable components/functions extracted
  - _If duplicated: Where? Should be abstracted?_

- [ ] **Logic is straightforward**
  - [ ] No unnecessarily complex code
  - [ ] Clear control flow
  - [ ] Understandable conditionals
  - _If complex: Could be simplified?_

### Comments & Documentation
- [ ] **Comments explain WHY, not WHAT**
  ```javascript
  Good:   // Retry 3 times because AWS SigV4 sometimes has timing issues
  Bad:    // Retry loop
  ```

- [ ] **Complex logic is documented**
  - [ ] Algorithms documented
  - [ ] Non-obvious patterns explained
  - _If unclear: What could be better explained?_

- [ ] **Function signatures are clear**
  ```javascript
  Good:   function getUserById(userId: string): Promise<User>
  Bad:    function get(x: any): any
  ```

### Structure
- [ ] **Related code is grouped together**
  - [ ] Related functions in same file (if file is <500 lines)
  - [ ] Related files in same directory
  - [ ] No random code placement

- [ ] **No god objects/functions**
  - [ ] Classes have single responsibility
  - [ ] Functions do one thing
  - [ ] Files are reasonable size (<500 lines)

- [ ] **Proper error handling**
  ```javascript
  Good:   try { ... } catch (e) { logError(e); throw new AppError(...); }
  Bad:    try { ... } catch (e) { }  // Silent failure
  ```

### No Code Smells
- [ ] **No console.log left in production code** (only debug when needed)
- [ ] **No TODO comments without context**
  ```javascript
  Bad:    // TODO: fix this
  Good:   // TODO: optimize this query (using index would help, estimated 50% faster)
  ```
- [ ] **No magic numbers** without explanation
  ```javascript
  Good:   const RETRY_ATTEMPTS = 3; // AWS API timeout issue
  Bad:    for (let i = 0; i < 3; i++) { }
  ```
- [ ] **No unused variables or imports**

---

## 3. Testing

**Is the code well-tested?**

### Unit Tests
- [ ] **Unit tests exist** for new code
  - [ ] Utility functions tested
  - [ ] Component logic tested
  - _Missing tests: For which functions?_

- [ ] **Tests are clear and understandable**
  ```javascript
  Good:   it('should calculate discount for VIP members', () => { })
  Bad:    it('test function', () => { })
  ```

- [ ] **Happy path is tested**
  - [ ] Normal operation tested
  - [ ] Expected inputs produce expected outputs
  - _Not tested: Which scenarios?_

- [ ] **Edge cases are tested**
  - [ ] Empty input
  - [ ] Null/undefined input
  - [ ] Boundary values
  - [ ] Invalid input
  - _Not tested: Which edge cases?_

- [ ] **Error cases are tested**
  ```javascript
  expect(() => { divideByZero(); }).toThrow();
  ```

### Integration Tests
- [ ] **API calls are tested**
  - [ ] API mocked or stubbed
  - [ ] Success and error responses tested
  - [ ] Different status codes handled

- [ ] **Database interactions tested** (if applicable)
  - [ ] Create, read, update, delete operations
  - [ ] Queries efficient (no N+1)
  - [ ] Transactions handled correctly

### Test Quality
- [ ] **Tests don't have side effects**
  - [ ] Each test independent
  - [ ] Tests can run in any order
  - [ ] No shared state between tests

- [ ] **No skipped tests** (@skip, @ignore, xdescribe)
  - [ ] All tests run
  - _Skipped: Why? Should be fixed or removed?_

- [ ] **Tests are not flaky**
  - [ ] No random timeouts
  - [ ] No date-dependent tests
  - [ ] No tests that sometimes pass/sometimes fail

### Coverage
- [ ] **Code coverage is adequate**
  - [ ] Target: 80%+ for new code
  - [ ] Critical paths covered
  - [ ] Edge cases covered

**Questions for Builder**:
- [ ] Why is this function not tested?
- [ ] Why this specific test case?
- [ ] Did you manually test locally?
- [ ] How did you verify this works?

---

## 4. Security

**Is the code secure?**

### Secrets & Credentials
- [ ] **No hardcoded secrets**
  ```javascript
  Bad:    const API_KEY = "sk_live_abc123";
  Good:   const API_KEY = process.env.API_KEY;
  ```

- [ ] **No passwords in code**
- [ ] **No private keys in code**
- [ ] **No API tokens in code**
- [ ] **No database credentials in code**

### Input Validation
- [ ] **User input is validated**
  ```javascript
  Good:   const schema = z.object({ email: z.string().email() });
           const validated = schema.parse(userInput);
  Bad:    const email = req.body.email; // No validation
  ```

- [ ] **No SQL injection risks** (if SQL database)
  ```javascript
  Good:   db.query("SELECT * FROM users WHERE id = ?", [userId]);
  Bad:    db.query("SELECT * FROM users WHERE id = " + userId);
  ```

- [ ] **No XSS risks** (if web app)
  ```javascript
  Good:   <div>{sanitize(userContent)}</div>
  Bad:    <div dangerouslySetInnerHTML={{__html: userContent}} />
  ```

### Authentication & Authorization
- [ ] **Auth tokens validated**
  - [ ] JWT verified
  - [ ] Expiry checked
  - [ ] Signature valid

- [ ] **Authorization enforced**
  - [ ] User can only access own data
  - [ ] Admin-only endpoints protected
  - [ ] Permissions checked

- [ ] **No default credentials**
- [ ] **No hardcoded admin accounts**

### Data Protection
- [ ] **Sensitive data encrypted** (passwords, tokens, etc.)
  - [ ] Passwords hashed (bcrypt, Argon2, etc.)
  - [ ] Tokens encrypted
  - [ ] PII encrypted at rest

- [ ] **Data in transit encrypted** (if applicable)
  - [ ] HTTPS enforced
  - [ ] No plaintext passwords

### Dependencies
- [ ] **No known vulnerabilities** in dependencies
  - [ ] `npm audit` passes
  - [ ] Dependencies are maintained
  - [ ] No old/abandoned packages

**Questions for Builder**:
- [ ] How is user input validated?
- [ ] How are secrets stored?
- [ ] What's the auth/authorization approach?
- [ ] Did you run `npm audit`?

---

## 5. Performance

**Does the code perform well?**

### Efficiency
- [ ] **No obvious bottlenecks**
  - [ ] Heavy operations don't block UI (if web app)
  - [ ] No synchronous I/O in performance-critical paths
  - [ ] Algorithms efficient

- [ ] **Database queries optimized**
  - [ ] Proper indexes used
  - [ ] No N+1 queries
  - [ ] Queries return only needed fields
  - [ ] Pagination used for large datasets

- [ ] **No memory leaks**
  - [ ] Event listeners cleaned up
  - [ ] Large objects released when done
  - [ ] Circular references avoided

### Load & Scale
- [ ] **Code handles load**
  - [ ] Can handle concurrent requests
  - [ ] No obvious race conditions
  - [ ] Timeout handling present

- [ ] **Scalability considered**
  - [ ] No hardcoded limits
  - [ ] Can handle 10x current load?
  - [ ] Database scaling plan considered

### Frontend Performance (if applicable)
- [ ] **Bundle size reasonable**
  - [ ] No huge dependencies for small features
  - [ ] Unused code removed
  - [ ] Tree-shaking works

- [ ] **Renders efficient**
  - [ ] No unnecessary re-renders (React)
  - [ ] Memoization used where needed
  - [ ] List rendering optimized (keys, virtualization)

- [ ] **Network requests optimized**
  - [ ] Requests batched where possible
  - [ ] Caching implemented
  - [ ] Compression used

**Questions for Builder**:
- [ ] How does this scale to 1000s of items?
- [ ] What's the database query like?
- [ ] Any performance concerns you're aware of?

---

## 6. Accessibility (If Web App)

**Is the code accessible?**

- [ ] **Keyboard navigation works**
  - [ ] Can use app with keyboard only
  - [ ] Tab order is logical
  - [ ] Focus visible

- [ ] **Screen reader friendly**
  - [ ] Semantic HTML used
  - [ ] aria-labels where needed
  - [ ] Images have alt text
  - [ ] No "click here" links

- [ ] **Color contrast sufficient**
  - [ ] Text readable (4.5:1 ratio)
  - [ ] Color not only way to convey info

- [ ] **Responsive design**
  - [ ] Works on mobile
  - [ ] Touch targets adequate (48x48 px)
  - [ ] Text resizable

- [ ] **Forms accessible**
  - [ ] Labels linked to inputs
  - [ ] Error messages clear
  - [ ] Required fields marked

---

## 7. Browser/Platform Compatibility

**Does the code work everywhere needed?**

- [ ] **Browser support**
  - [ ] Chrome ✓
  - [ ] Firefox ✓
  - [ ] Safari ✓
  - [ ] Edge ✓

- [ ] **Mobile devices** (if web app)
  - [ ] iOS ✓
  - [ ] Android ✓
  - [ ] Tablet ✓

- [ ] **No console errors** in any browser
- [ ] **No visual bugs** in any browser

---

## 8. Documentation

**Is the code documented?**

- [ ] **README updated** (if project structure changed)
- [ ] **API endpoints documented** (if API changed)
- [ ] **Complex features documented**
- [ ] **Setup instructions updated** (if dependencies changed)

---

## Summary Questions

**Overall**:
1. Would you be comfortable supporting this code in production?
2. Would another developer be able to understand and modify this code?
3. Is this code maintainable long-term?

**Approval Decision**:
- [ ] **Approved**: Ready to merge
- [ ] **Approved with minor notes**: Merge after builder addresses notes
- [ ] **Request changes**: Builder should make revisions

---

## Example Review Comment

```markdown
## Code Review: feat(auth): add JWT refresh token

### ✓ Spec Compliance
- [x] Implements all requirements
- [x] No scope creep
- [x] Handles edge cases (expired tokens, invalid tokens)
- [x] Matches architecture from spec

### ✓ Code Quality
- [x] Variable names clear
- [x] Functions well-named
- [x] No DRY violations
- [x] Comments explain WHY

### ✓ Testing
- [x] Unit tests for token validation
- [x] Integration tests for refresh endpoint
- [x] Edge cases tested (expired, malformed)
- [x] 87% coverage on new code ✓

### ⚠️ Security
- [x] No secrets in code
- [x] Tokens validated
- [x] Authorization enforced
- [ ] Question: Are refresh tokens also short-lived? Spec says 15 minutes for access token, but doesn't mention refresh token lifetime.

### ✓ Performance
- [x] No obvious bottlenecks
- [x] Database query efficient
- [x] No memory leaks

### Questions for Builder
1. How is the refresh token stored? HTTP-only cookie? localStorage?
2. What's the refresh token expiry time?
3. Did you test expired token handling?

### Recommendation
Approved with one clarification needed on refresh token lifetime. Once addressed, ready to merge.

Cc: @builder
```

---

## Using This Checklist

1. **Print or copy** this checklist for each PR review
2. **Go through each section** systematically
3. **Mark ✓ or note issues** as you review
4. **Ask questions** if unclear
5. **Be constructive** and suggest improvements
6. **Approve when satisfied** that code meets standards

---

**Last Updated**: June 2026  
**Used by**: QA and Copilot agents  
**Reference**: docs/PROMPT_TEMPLATES.md, docs/SAFETY_GUARDRAILS.md
