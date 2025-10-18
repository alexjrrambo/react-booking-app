## Architecture Overview

![System architecture diagram](docs/architecture/stack.png)

# How to Run & Test

## How to Run

### Development
```bash
npm run dev
# opens at http://localhost:5173
```

### Production Build
```bash
npm run build
npm run preview
# preview at http://localhost:4173
```

### Lint
```bash
npm run lint
```

---

## Tests

### Unit / Component (Vitest + Testing Library)

**Run once:**
```bash
npm run test
```

**Watch mode:**
```bash
npm run test:watch
```

**Vitest UI:**
```bash
npm run test:ui
```

**Coverage:**
```bash
npm run coverage
```

---

### E2E (Cypress)

**Open runner** (starts Vite and opens Cypress):
```bash
npm run cy:e2e:open
```

**Headless:**
```bash
npm run cy:e2e:run
```

**E2E scope:**
- `cypress/e2e/smoke.cy.ts` — page load & primary CTAs
- `cypress/e2e/filters.cy.ts` — property & date filters (incl. clear)
- `cypress/e2e/availability.cy.ts` — availability modal, enabled/disabled by property
- `cypress/e2e/crud.cy.ts` — create, edit, validations, delete booking
- `cypress/e2e/list.cy.ts` — list rendering, empty state, basic interactions

---

## Features

### Bookings Page

**Filter Header**
- Filter by **property**
- Filter by **date range**

**Bookings List**
- Cards with **dates**, **guest**, **property**
- **Edit** (prefilled modal)
- **Delete**

**Right-side Actions**
- **Availability** (see property availability and open create pre-filled)

### Create / Edit Booking

Form fields:
- **Guest name** (input)
- **Property** (select)
- **Date range** (DatePicker)

Modal flows:
- **Create** / **Edit** (same form component with a `mode`)

---

## Validations (dates & consistency)

### Zod (form)
- **Guest name**: `min(3)` and `max(50)`
- **Property**: required
- **Dates**: `{ from: Date, to: Date }` with both present

### Business validators (chained)
- `ensureDateRangePresent(start, end)`  
  Message: **“Please select both a check-in and a check-out date.”**
- `ensureChronologicalOrder(start, end)`  
  Message: **“Check-out must be after start date.”**
- `ensureNoOverlapForProperty({ startDate, endDate, property, existingBookings, ignoreBookingId, ignorePastBookings })`  
  Ensures **no overlap** with existing bookings for the same property.  
  Message: **“These dates overlap an existing booking for this property.”**

> Note: “start date in the past” validation was **removed** as it’s not a requirement for the challenge and simplifies editing seeded data.
