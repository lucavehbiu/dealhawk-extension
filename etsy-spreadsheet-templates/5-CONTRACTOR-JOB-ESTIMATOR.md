# Contractor Job Estimator - Google Sheets Template

**Price on Etsy**: $20
**Build Time**: 2 hours
**Tabs**: 5 (Quote Builder, Materials Library, Labor Rates, Customer Invoices, Job Tracker)
**For**: Contractors, handymen, trades (plumbing, electrical, HVAC, landscaping, etc.)

---

## TAB 1: QUOTE BUILDER

### Layout:

```
Row 1-10: PROFESSIONAL QUOTE HEADER

┌────────────────────────────────────────────────────────────────┐
│  [YOUR COMPANY LOGO]                                           │
│  ABC Contracting Services                                      │
│  123 Business St, City, ST 12345                              │
│  Phone: (555) 123-4567 | Email: info@abccontracting.com      │
└────────────────────────────────────────────────────────────────┘

Quote #: Q-2025-001
Date: March 15, 2025
Valid Until: April 14, 2025

BILL TO:
John Smith
456 Oak Avenue
Springfield, IL 62701
Phone: (555) 987-6543

PROJECT: Kitchen Remodel - Replace Cabinets & Countertops

Row 15: MATERIALS & LABOR BREAKDOWN

| Item Description           | Qty | Unit  | Unit Price | Subtotal | Supplier      | Notes           |
|----------------------------|-----|-------|------------|----------|---------------|-----------------|
| MATERIALS:                 |     |       |            |          |               |                 |
| Kitchen cabinets (custom)  | 12  | Units | $450.00    | $5,400   | Cabinet World | White shaker    |
| Granite countertop         | 35  | Sq ft | $65.00     | $2,275   | Stone Pro     | Black pearl     |
| Cabinet hardware (pulls)   | 24  | Each  | $8.50      | $204     | Home Depot    | Brushed nickel  |
| Undermount sink            | 1   | Each  | $180.00    | $180     | Ferguson      | Stainless steel |
| Installation supplies      | 1   | Lot   | $125.00    | $125     | Various       | Screws, glue    |
| Subtotal Materials:        |     |       |            | $8,184   |               |                 |
|                            |     |       |            |          |               |                 |
| LABOR:                     |     |       |            |          |               |                 |
| Demo existing cabinets     | 8   | Hours | $65.00     | $520     | -             | 1 day           |
| Cabinet installation       | 16  | Hours | $75.00     | $1,200   | -             | 2 days          |
| Countertop template/install| 6   | Hours | $85.00     | $510     | -             | Specialist rate |
| Plumbing hookup            | 3   | Hours | $95.00     | $285     | -             | Licensed plumber|
| Final cleanup              | 2   | Hours | $50.00     | $100     | -             | -               |
| Subtotal Labor:            |     |       |            | $2,615   |               |                 |

Row 35: PRICING SUMMARY

Materials Total:              $8,184
Labor Total:                  $2,615
───────────────────────────
Subtotal:                     $10,799

Tax (if applicable):          $0 (labor exempt in IL)
───────────────────────────
TOTAL QUOTE:                  $10,799

Deposit Required (30%):       $3,240
Balance Due at Completion:    $7,559

Row 45: PROFIT ANALYSIS (Internal - Hidden when printing)

Material Cost (actual):       $7,350  (includes 10% markup)
Labor Cost (actual):          $1,920  (avg $60/hr)
Total Cost:                   $9,270
Quoted Price:                 $10,799
───────────────────────────
PROFIT:                       $1,529
PROFIT MARGIN:                14.2%

Target Margin: 20% ⚠️ (Below target - consider adjusting)

Row 55: PAYMENT SCHEDULE

| Payment # | Description           | Amount  | Due Date     | Status      |
|-----------|-----------------------|---------|--------------|-------------|
| 1         | Deposit (30%)         | $3,240  | Upon signing | ⏳ Pending  |
| 2         | Midpoint (40%)        | $4,320  | Day 3        | 📅 Scheduled|
| 3         | Final (30%)           | $3,239  | Completion   | 📅 Scheduled|

Row 62: TERMS & CONDITIONS

This quote is valid for 30 days. Work to begin within 14 days of deposit.
Estimated completion: 5 business days from start date.
Warranty: 1 year on workmanship, manufacturer warranty on materials.
Payment accepted: Check, cash, credit card (+3% fee), Zelle.
```

### Formulas:

**Subtotal (Column E):**
```
=B16*D16
```

**Materials Subtotal (E26):**
```
=SUM(E16:E21)
```

**Labor Subtotal (E33):**
```
=SUM(E28:E32)
```

**Subtotal (Row 38):**
```
=E26+E33
```

**Tax (Row 40):**
```
=E38*0  // or your state sales tax rate on materials only
```

**Total Quote (Row 42):**
```
=E38+E40
```

**Deposit (Row 44):**
```
=E42*0.30
```

**Balance Due (Row 45):**
```
=E42-E44
```

**Profit (Row 51):**
```
=E42-E49
```

**Profit Margin (Row 52):**
```
=E51/E42
```

### Conditional Formatting:

**Profit Margin (Row 52):**
- If < 10%: Red background (too low)
- If 10-15%: Orange background (acceptable)
- If 15-20%: Yellow background (good)
- If > 20%: Green background (excellent)

---

## TAB 2: MATERIALS LIBRARY

### Layout:

```
Row 1: MATERIALS DATABASE

Row 3: Headers
| Material/Item Name        | Category      | Unit  | Cost Price | Sell Price | Markup % | Supplier      | Supplier Phone | Last Updated | Notes |

Example data:

| Material Name             | Category    | Unit  | Cost   | Sell   | Markup | Supplier      | Phone          | Updated    | Notes              |
|---------------------------|-------------|-------|--------|--------|--------|---------------|----------------|------------|--------------------|
| 2x4 Lumber (8ft)          | Lumber      | Each  | $4.50  | $6.00  | 33%    | Home Depot    | (555) 111-2222 | 2025-03-01 | Price varies       |
| Drywall sheet (4x8)       | Drywall     | Sheet | $9.00  | $12.00 | 33%    | Lowes         | (555) 222-3333 | 2025-03-01 | Standard 1/2"      |
| Paint (interior, gallon)  | Paint       | Gal   | $28.00 | $38.00 | 36%    | Sherwin-Williams| (555) 333-4444 | 2025-02-15 | Premium grade      |
| PVC pipe (1", 10ft)       | Plumbing    | Each  | $6.20  | $9.00  | 45%    | Ferguson      | (555) 444-5555 | 2025-03-10 | Schedule 40        |
| Electrical wire (12/2, ft)| Electrical  | Foot  | $0.85  | $1.30  | 53%    | Graybar       | (555) 555-6666 | 2025-03-12 | Romex NM-B         |
| Concrete mix (80lb bag)   | Concrete    | Bag   | $4.80  | $7.00  | 46%    | Home Depot    | (555) 111-2222 | 2025-03-05 | Quikrete           |
| Asphalt shingles (bundle) | Roofing     | Bundle| $28.50 | $40.00 | 40%    | ABC Supply    | (555) 666-7777 | 2025-02-28 | Architectural      |
| Granite (per sq ft)       | Countertops | Sq ft | $48.00 | $65.00 | 35%    | Stone Pro     | (555) 777-8888 | 2025-03-15 | Black pearl        |
| Kitchen cabinet (base)    | Cabinets    | Unit  | $320.00| $450.00| 41%    | Cabinet World | (555) 888-9999 | 2025-03-01 | Shaker style       |
| Toilet (standard)         | Plumbing    | Each  | $98.00 | $145.00| 48%    | Ferguson      | (555) 444-5555 | 2025-03-08 | Elongated bowl     |
| Light fixture (basic)     | Electrical  | Each  | $32.00 | $55.00 | 72%    | Lowes         | (555) 222-3333 | 2025-03-10 | LED compatible     |
```

### Data Validation:

**Column B (Category):**
Drop-down list:
- Lumber
- Drywall
- Paint
- Plumbing
- Electrical
- Concrete
- Roofing
- Flooring
- Cabinets
- Countertops
- HVAC
- Hardware
- Tools
- Other

**Column C (Unit):**
- Each
- Foot
- Yard
- Square Foot
- Cubic Yard
- Gallon
- Bag
- Box
- Bundle
- Sheet
- Roll
- Hour
- Lot

### Formulas:

**Markup % (Column F):**
```
=(E2-D2)/D2
```
*Format as percentage*

**Suggested Sell Price (if you want auto-calc):**
```
=D2*1.35
```
*35% markup - adjustable*

---

## TAB 3: LABOR RATES

### Layout:

```
Row 1: LABOR RATE CALCULATOR

Row 3: BASE SETTINGS

Your Desired Hourly Wage:       $35/hour
Overhead & Expenses:            50% ($17.50/hour)
Profit Margin Target:           30% ($15.75/hour)
───────────────────────────────
Billable Rate Needed:           $68.25/hour

Rounded Rate to Charge:         $70/hour ✅

Row 11: LABOR CATEGORIES & RATES

| Job Type              | Skill Level  | Base Rate | Billable Rate | Notes                    |
|-----------------------|--------------|-----------|---------------|--------------------------|
| General Labor         | Entry        | $25/hr    | $50/hr        | Cleanup, demo, hauling   |
| Carpentry (Basic)     | Intermediate | $35/hr    | $65/hr        | Framing, trim            |
| Carpentry (Finish)    | Advanced     | $45/hr    | $75/hr        | Cabinets, custom work    |
| Plumbing (Standard)   | Licensed     | $50/hr    | $95/hr        | Repairs, installations   |
| Plumbing (Complex)    | Master       | $60/hr    | $110/hr       | Gas lines, repiping      |
| Electrical (Standard) | Licensed     | $55/hr    | $100/hr       | Outlets, fixtures        |
| Electrical (Complex)  | Master       | $65/hr    | $120/hr       | Panels, service upgrades |
| HVAC                  | Licensed     | $60/hr    | $115/hr       | Install, repair          |
| Painting (Interior)   | Intermediate | $30/hr    | $60/hr        | Walls, ceilings          |
| Painting (Exterior)   | Advanced     | $35/hr    | $70/hr        | Houses, difficult access |
| Drywall               | Intermediate | $32/hr    | $60/hr        | Hanging, taping          |
| Flooring              | Advanced     | $40/hr    | $75/hr        | Tile, hardwood           |
| Roofing               | Advanced     | $45/hr    | $85/hr        | Shingle, repairs         |
| Concrete              | Intermediate | $40/hr    | $75/hr        | Pouring, finishing       |

Row 30: HELPER/APPRENTICE RATES

| Role          | Hourly Cost | Billable Rate | Profit Margin |
|---------------|-------------|---------------|---------------|
| Helper        | $18/hr      | $35/hr        | $17/hr (94%)  |
| Apprentice    | $22/hr      | $45/hr        | $23/hr (104%) |

Row 35: TIME MULTIPLIERS

| Situation             | Multiplier | Example (base $70/hr) |
|-----------------------|------------|------------------------|
| Standard hours        | 1.0x       | $70/hr                |
| After hours (6pm-10pm)| 1.25x      | $87.50/hr             |
| Weekend               | 1.5x       | $105/hr               |
| Emergency/Holiday     | 2.0x       | $140/hr               |
| Rush job (<24hr)      | 1.5x       | $105/hr               |

Row 43: TRAVEL TIME

| Distance           | Charge                |
|--------------------|----------------------|
| 0-10 miles         | No charge (included) |
| 11-25 miles        | $25 trip fee         |
| 26-50 miles        | $50 trip fee         |
| 50+ miles          | $50 + $1/mile        |
```

### Formulas:

**Billable Rate (Row 7):**
```
=C4+C5+C6
```

**Rounded Rate (Row 9):**
```
=ROUND(C7,-1)
```
*Rounds to nearest $10*

**Profit Margin (Helper table):**
```
=C32-B32
```

---

## TAB 4: CUSTOMER INVOICES

### Layout:

```
Row 1-10: INVOICE HEADER

┌────────────────────────────────────────────────────────────────┐
│  INVOICE                                                       │
│  ABC Contracting Services                                      │
│  License #: ABC-12345                                          │
│  123 Business St, City, ST 12345                              │
│  Phone: (555) 123-4567 | Email: info@abccontracting.com      │
└────────────────────────────────────────────────────────────────┘

Invoice #: INV-2025-001
Date: March 20, 2025
Due Date: April 20, 2025 (Net 30)
Quote Reference: Q-2025-001

BILL TO:
John Smith
456 Oak Avenue
Springfield, IL 62701

PROJECT: Kitchen Remodel - Completed March 19, 2025

Row 20: WORK COMPLETED

| Description                | Qty | Rate    | Amount   |
|----------------------------|-----|---------|----------|
| Cabinet demolition         | 8   | $65/hr  | $520     |
| New cabinet installation   | 16  | $75/hr  | $1,200   |
| Granite countertop install | 6   | $85/hr  | $510     |
| Plumbing hookup            | 3   | $95/hr  | $285     |
| Final cleanup              | 2   | $50/hr  | $100     |
| Materials (per attached)   | 1   | $8,184  | $8,184   |
|                            |     |         |          |
| Subtotal:                  |     |         | $10,799  |
| Tax:                       |     |         | $0       |
| **TOTAL DUE:**             |     |         | **$10,799** |
|                            |     |         |          |
| Deposit Paid (3/15):       |     |         | -$3,240  |
| Progress Payment (3/18):   |     |         | -$4,320  |
| **BALANCE DUE:**           |     |         | **$3,239**  |

Row 40: PAYMENT HISTORY

| Date       | Payment Method | Amount    | Confirmation | Status      |
|------------|----------------|-----------|--------------|-------------|
| 2025-03-15 | Check #1234    | $3,240    | -            | ✅ Cleared  |
| 2025-03-18 | Zelle          | $4,320    | Z789456      | ✅ Received |
| 2025-03-20 | Pending        | $3,239    | -            | ⏳ Due      |

Row 46: PAYMENT INSTRUCTIONS

Please make payment to:
ABC Contracting Services
Checks payable to: ABC Contracting LLC
Zelle: payments@abccontracting.com
Credit cards accepted (+3% processing fee)

Thank you for your business!
```

### Formulas:

**Amount (Column D):**
```
=B21*C21
```

**Subtotal (Row 28):**
```
=SUM(D21:D26)
```

**Total Due (Row 30):**
```
=D28+D29
```

**Balance Due (Row 35):**
```
=D30+SUM(D32:D34)
```

---

## TAB 5: JOB TRACKER

### Layout:

```
Row 1: ACTIVE JOBS DASHBOARD

Row 3: Headers
| Job # | Customer | Project Description | Quote Amt | Actual Cost | Profit | Margin | Start Date | End Date | Status | Days | Next Action |

Example data:

| Job   | Customer     | Project             | Quote   | Cost    | Profit  | Margin | Start      | End        | Status      | Days | Action          |
|-------|--------------|---------------------|---------|---------|---------|--------|------------|------------|-------------|------|-----------------|
| J001  | John Smith   | Kitchen remodel     | $10,799 | $9,270  | $1,529  | 14%    | 2025-03-15 | 2025-03-20 | ✅ Complete | 5    | Send invoice    |
| J002  | Mary Johnson | Bathroom renovation | $8,500  | $0      | TBD     | TBD    | 2025-03-22 | 2025-04-05 | ⏳ Scheduled| -    | Order materials |
| J003  | Bob Williams | Deck construction   | $15,200 | $8,450  | $6,750  | 44%    | 2025-02-28 | 2025-03-25 | 🔨 In Progress| 25  | Install railings|
| J004  | Lisa Garcia  | Roof replacement    | $22,000 | $0      | TBD     | TBD    | 2025-04-01 | 2025-04-08 | 📋 Quoted   | -    | Follow up       |
| J005  | Tom Davis    | Fence installation  | $6,800  | $4,200  | $2,600  | 38%    | 2025-03-10 | 2025-03-15 | ✅ Complete | 5    | Collect final $ |

Row 15: SUMMARY STATS

Total Active Jobs: 5
In Progress: 1
Scheduled: 1
Completed (this month): 2

Total Quoted Value: $63,299
Total Actual Costs: $21,920
Projected Profit: $10,879
Projected Margin: 17.2%
```

### Data Validation:

**Column J (Status):**
- 📋 Quoted
- ✅ Accepted
- ⏳ Scheduled
- 🔨 In Progress
- 🏁 Awaiting Inspection
- ✅ Complete - Paid
- ⏸️ On Hold
- ❌ Cancelled

### Formulas:

**Profit (Column F):**
```
=D2-E2
```

**Margin (Column G):**
```
=F2/D2
```

**Days (Column K):**
```
=I2-H2
```

**Summary Stats:**
```
=COUNTIF(J:J,"🔨 In Progress")
=SUM(D:D)
=SUM(F:F)
=SUM(F:F)/SUM(D:D)
```

---

## FORMATTING INSTRUCTIONS

### Color Scheme:
- **Primary**: #FF9800 (Orange - construction theme)
- **Secondary**: #FFFFFF (White)
- **Accent**: #607D8B (Blue-gray - professional)
- **Success**: #4CAF50 (Green)
- **Warning**: #FFC107 (Yellow)

### Fonts:
- **Headers**: Roboto Condensed, Bold, 14pt
- **Body**: Roboto, Regular, 11pt
- **Numbers**: Roboto Mono, Regular, 11pt

---

## ETSY LISTING TEMPLATE

### Title:
"Contractor Job Estimator Google Sheets | Quote Builder Invoice Template | Plumbing Electrical HVAC Trades"

### Tags (13):
1. contractor estimate
2. job quote template
3. contractor invoice
4. construction estimate
5. trade business
6. plumbing estimate
7. electrical quote
8. hvac invoice
9. google sheets
10. contractor template
11. job tracker
12. materials list
13. labor calculator

### Description:
```
🔨 PROFESSIONAL QUOTES IN 10 MINUTES!

Stop losing money on jobs. This template ensures you:
✅ Never underprice a job again
✅ Track every material cost
✅ Calculate profit margins instantly
✅ Create professional invoices

🎯 PERFECT FOR:
• General contractors
• Plumbers
• Electricians
• HVAC technicians
• Handymen
• Carpenters
• Landscapers
• Any trade business!

💰 STOP LEAVING MONEY ON THE TABLE:
→ Built-in profit calculator
→ Materials library with markups
→ Labor rate calculator
→ Job tracker for all projects

📥 INSTANT DOWNLOAD - Use it today!

Price: $20
```

---

## BUILD TIME: 2 hours

## EXPECTED REVENUE: $200-600/month (10-30 sales)
