# Testing Requirements

## Coverage Targets

| Type | Coverage Target |
|------|-----------------|
| Utility functions | 100% |
| API route handlers | 80% |
| React hooks | 80% |
| E2E critical paths | 100% |

---

## Unit Tests (Jest)

### Setup

```bash
npm install -D jest @testing-library/react @testing-library/jest-dom jest-environment-jsdom
```

```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};
```

### Example Tests

```typescript
// lib/utils/__tests__/formatCurrency.test.ts
import { formatCurrency } from '../formatCurrency';

describe('formatCurrency', () => {
  it('formats cents to dollars', () => {
    expect(formatCurrency(19900)).toBe('$199.00');
  });

  it('handles zero', () => {
    expect(formatCurrency(0)).toBe('$0.00');
  });

  it('handles large amounts', () => {
    expect(formatCurrency(100000)).toBe('$1,000.00');
  });
});
```

### Mocking Supabase

```typescript
// __mocks__/supabase.ts
export const createClient = () => ({
  from: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis(),
  single: jest.fn().mockResolvedValue({ data: mockData, error: null }),
});
```

---

## E2E Tests (Playwright)

### Setup

```bash
npm install -D @playwright/test
npx playwright install
```

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  use: {
    baseURL: 'http://localhost:3000',
  },
  webServer: {
    command: 'npm run dev',
    port: 3000,
  },
});
```

### Critical Path Tests

```typescript
// e2e/checkout.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Checkout Flow', () => {
  test('complete purchase', async ({ page }) => {
    await page.goto('/shop');
    await page.click('[data-testid="buy-button"]');
    await expect(page).toHaveURL(/checkout\.stripe\.com/);
    // In test mode with Stripe test card
    await expect(page).toHaveURL('/checkout/success');
  });
});

// e2e/portal.spec.ts
test.describe('Client Portal', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    // Login steps
  });

  test('client sees their albums', async ({ page }) => {
    await page.goto('/portal');
    await expect(page.locator('[data-testid="album-card"]')).toHaveCount(2);
  });

  test('cannot access other client albums', async ({ page }) => {
    await page.goto('/portal/albums/other-client-id');
    await expect(page).toHaveURL('/portal');
  });
});
```

---

## Test Database Strategy

**Unit Tests:** Mock Supabase client, no real DB calls.

**Integration Tests:** Use local Supabase:
```bash
# .env.test
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<local-key>
```

**E2E Tests:** Dedicated test tenant with seeded data.

---

## Test Data Seeds

```sql
-- supabase/seed.sql
-- Run with: supabase db reset

-- Test tenant
INSERT INTO tenants (id, slug, name, subscription_plan) VALUES
  ('00000000-0000-0000-0000-000000000001', 'test', 'Test Studio', 'pro');

-- Test admin
UPDATE profiles SET role = 'tenant_admin', tenant_id = '00000000-0000-0000-0000-000000000001'
WHERE email = 'admin@test.com';

-- Test client
UPDATE profiles SET tenant_id = '00000000-0000-0000-0000-000000000001'
WHERE email = 'client@test.com';

-- Test products
INSERT INTO products (tenant_id, name, price_cents, product_type) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Basic Package', 14900, 'package'),
  ('00000000-0000-0000-0000-000000000001', 'Premium Package', 44900, 'package');
```

---

## Load Testing (k6)

```bash
brew install k6
```

```javascript
// load-tests/shop.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 20 },
    { duration: '1m', target: 50 },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'],
    http_req_failed: ['rate<0.01'],
  },
};

export default function() {
  const res = http.get('https://your-site.com/shop');
  check(res, {
    'status 200': (r) => r.status === 200,
    'fast enough': (r) => r.timings.duration < 2000,
  });
  sleep(1);
}
```

### Performance Targets

| Page | Concurrent Users | Target p95 |
|------|-----------------|------------|
| Homepage | 100 | < 1s |
| Portfolio | 100 | < 1.5s |
| Shop | 50 | < 2s |
| Checkout API | 20 | < 3s |

---

## Accessibility Testing

### Automated (axe-core)

```bash
npm install -D @axe-core/playwright
```

```typescript
// e2e/accessibility.spec.ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const pages = ['/', '/portfolio', '/shop', '/login'];

for (const path of pages) {
  test(`${path} passes a11y`, async ({ page }) => {
    await page.goto(path);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();
    expect(results.violations).toEqual([]);
  });
}
```

### Manual Checklist

- [ ] All images have alt text
- [ ] All form inputs have labels
- [ ] Color contrast ≥ 4.5:1
- [ ] Keyboard navigation works
- [ ] Focus states visible
- [ ] Skip link exists
- [ ] Headings in logical order

---

## Pre-Commit Checks

```json
// package.json
{
  "scripts": {
    "precommit": "npm run lint && npm run typecheck && npm run test"
  }
}
```

Run before every commit:
```bash
npm run lint       # ESLint
npm run typecheck  # TypeScript
npm run test       # Jest
```

---

## CI Pipeline

```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm run test -- --coverage
      - run: npm run build

  e2e:
    runs-on: ubuntu-latest
    needs: test
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run test:e2e
```
