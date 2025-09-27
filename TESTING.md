# Testing Documentation

This document outlines the comprehensive testing strategy implemented for the GST Invoices application.

## Overview

The application includes:

- **Unit Tests** with Vitest for utility functions and business logic
- **E2E Tests** with Playwright for user journey validation
- **Plan-based Access Control** with comprehensive middleware protection
- **CI/CD Pipeline** with automated testing, linting, and type checking

## Test Structure

```
├── src/
│   ├── lib/
│   │   ├── utils.test.ts           # Core utility function tests
│   │   └── plan-utils.test.ts      # Plan management integration tests
│   └── test/
│       └── setup.ts                # Test configuration and mocks
├── e2e/
│   ├── happy-path.spec.ts          # Complete user journey tests
│   ├── plan-restrictions.spec.ts   # Plan-based access control tests
│   └── test-helpers.ts             # E2E test utilities and helpers
├── vitest.config.ts                # Vitest configuration
├── playwright.config.ts            # Playwright configuration
└── .github/workflows/ci.yml        # CI/CD pipeline
```

## Plan-Based Access Control

### Implemented Features

#### Middleware Protection

- **Route Gating**: `/analytics` and `/settings` require premium subscription
- **Plan Resolution**: Automatic detection of user plan based on subscription status
- **Graceful Degradation**: Redirects to pricing page with upgrade prompts
- **Error Handling**: Treats database errors as free plan for security

#### Plan Features Matrix

| Feature            | Free Plan | Premium Plan |
| ------------------ | --------- | ------------ |
| Invoices per month | 10        | Unlimited    |
| Analytics          | ❌        | ✅           |
| Bulk Operations    | ❌        | ✅           |
| Priority Support   | ❌        | ✅           |
| API Access         | ❌        | ✅           |

#### Route Access Control

| Route         | Free Plan       | Premium Plan |
| ------------- | --------------- | ------------ |
| `/dashboard`  | ✅              | ✅           |
| `/invoices`   | ✅              | ✅           |
| `/customers`  | ✅              | ✅           |
| `/businesses` | ✅              | ✅           |
| `/items`      | ✅              | ✅           |
| `/analytics`  | ❌ → `/pricing` | ✅           |
| `/settings`   | ❌ → `/pricing` | ✅           |

## Running Tests

### Unit Tests

```bash
# Run all unit tests with coverage
npm run test:unit

# Run tests in watch mode
npm run test:unit:watch

# Run tests without coverage
npm run test
```

### E2E Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui

# Run specific test file
npx playwright test plan-restrictions.spec.ts
```

### All Tests

```bash
# Run both unit and E2E tests
npm run test:all
```

## Test Coverage

The current test suite covers:

### Unit Tests (100% coverage on utils)

- ✅ Plan management functions
- ✅ Subscription status resolution
- ✅ Feature access control
- ✅ Route access validation
- ✅ Currency formatting
- ✅ Date formatting
- ✅ Email validation
- ✅ Invoice number generation
- ✅ GST calculations
- ✅ Utility functions (debounce, etc.)

### Integration Tests

- ✅ End-to-end plan management flows
- ✅ Feature access matrix validation
- ✅ Route access control scenarios
- ✅ Subscription expiry handling

### E2E Tests (Planned)

- 🔄 Complete user journey: signup → business → invoice → export → email → upgrade → analytics
- 🔄 Plan restriction enforcement
- 🔄 Invoice limit validation
- 🔄 Premium feature access verification

## CI/CD Pipeline

### GitHub Actions Workflow

The CI pipeline includes:

1. **Lint and Type Check**
   - ESLint validation
   - TypeScript type checking

2. **Unit Tests**
   - Vitest execution with coverage
   - Coverage report upload to Codecov

3. **E2E Tests**
   - Playwright browser testing
   - Test artifact collection

4. **Build Verification**
   - Next.js build validation
   - Environment configuration testing

### Pipeline Triggers

- Push to `main` or `develop` branches
- Pull requests to `main` or `develop` branches

## Test Data Management

### Test Helpers

The E2E tests use comprehensive helpers for:

- User signup and authentication
- Business entity creation
- Customer management
- Item catalog management
- Invoice generation and processing
- Plan upgrade simulation

### Mock Data

- Realistic test data generators
- Consistent data patterns
- Cleanup procedures for test isolation

## Security Testing

### Access Control Validation

- ✅ Unauthenticated user redirects
- ✅ Plan-based route restrictions
- ✅ Subscription expiry handling
- ✅ Error case graceful degradation

### Middleware Testing

- ✅ Authentication flow validation
- ✅ Subscription status checking
- ✅ Plan resolution accuracy
- ✅ Redirect logic correctness

## Performance Considerations

### Test Optimization

- Parallel test execution
- Efficient test data setup
- Minimal database interactions
- Smart test isolation

### Coverage Targets

- Unit tests: 95%+ coverage on business logic
- E2E tests: Critical user paths covered
- Integration tests: Plan management flows validated

## Maintenance

### Adding New Tests

1. Follow existing patterns in test files
2. Use provided test helpers for consistency
3. Update coverage thresholds if needed
4. Document test scenarios in comments

### Updating Plan Features

1. Update `PLAN_FEATURES` constant in `utils.ts`
2. Add corresponding tests in `plan-utils.test.ts`
3. Update E2E tests for new restrictions
4. Update documentation tables above

## Troubleshooting

### Common Issues

- **Vitest environment**: Ensure jsdom is configured
- **Playwright browsers**: Run `npx playwright install`
- **Coverage reports**: Check v8 provider configuration
- **E2E timeouts**: Adjust timeouts in playwright.config.ts

### Debug Commands

```bash
# Debug specific test
npm run test -- --reporter=verbose utils.test.ts

# Debug E2E test with UI
npm run test:e2e:ui -- --debug

# Generate coverage report
npm run test:unit -- --coverage --reporter=html
```

This testing strategy ensures robust plan-based access control and comprehensive validation of the GST Invoices application functionality.
