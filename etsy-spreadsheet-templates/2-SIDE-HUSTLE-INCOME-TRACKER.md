# Side Hustle Income Tracker - Google Sheets Template

**Price on Etsy**: $15
**Build Time**: 2 hours
**Tabs**: 6 (Dashboard, Income Log, Expense Log, Mileage Tracker, Tax Estimator, Monthly Reports)

---

## TAB 1: DASHBOARD

### Layout:

```
Row 1: SIDE HUSTLE INCOME TRACKER

Row 2: [Year: 2025] | [Your Name]

Row 4-9: KEY METRICS (6 boxes in 2 rows)

┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐
│  TOTAL INCOME YTD   │  │  TOTAL EXPENSES YTD │  │  NET PROFIT YTD     │
│  $18,450            │  │  $4,230             │  │  $14,220            │
└─────────────────────┘  └─────────────────────┘  └─────────────────────┘

┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐
│  ESTIMATED TAX DUE  │  │  TAX PAID (Q1-Q4)   │  │  TAX REMAINING      │
│  $2,133             │  │  $1,500             │  │  $633               │
└─────────────────────┘  └─────────────────────┘  └─────────────────────┘

Row 11: INCOME BY SOURCE (This Month)

| Platform/Client | Jan Income | Feb Income | Mar Income | Q1 Total | % of Total |
|-----------------|------------|------------|------------|----------|------------|
| Uber            | $1,200     | $1,350     | $1,180     | $3,730   | 35%        |
| DoorDash        | $800       | $920       | $850       | $2,570   | 24%        |
| Etsy Shop       | $450       | $380       | $520       | $1,350   | 13%        |
| Upwork          | $2,100     | $1,800     | $0         | $3,900   | 37%        |
| Other           | $50        | $30        | $0         | $80      | 1%         |
| TOTAL           | $4,600     | $4,480     | $2,550     | $11,630  | 100%       |

Row 20: PROFIT BY MONTH (Bar chart visualization)

Jan: ████████████ $3,450
Feb: ███████████░ $3,290
Mar: ██████░░░░░░ $1,820

Row 24: UPCOMING TAX DEADLINES

| Quarter | Deadline     | Estimated Tax | Status         | Amount Paid |
|---------|--------------|---------------|----------------|-------------|
| Q1 2025 | April 15     | $533          | ✅ Paid        | $600        |
| Q2 2025 | June 15      | $533          | ⏳ Upcoming    | $0          |
| Q3 2025 | Sept 15      | $533          | 📅 Scheduled   | $0          |
| Q4 2025 | Jan 15, 2026 | $534          | 📅 Scheduled   | $0          |

Row 30: THIS MONTH SNAPSHOT (Current month)

Total Income This Month: $2,550
Total Expenses This Month: $890
Net Profit This Month: $1,660
Best Day: March 12 ($285)
Hours Worked: 47 hours
Hourly Rate: $35.32/hr
```

### Formulas:

**Total Income YTD (B5):**
```
=SUM('Income Log'!D:D)
```

**Total Expenses YTD (B6):**
```
=SUM('Expense Log'!C:C)
```

**Net Profit YTD (B7):**
```
=B5-B6
```

**Estimated Tax Due (B8):**
```
=B7*0.15
```
*Assumes 15% self-employment tax rate - adjustable*

**Tax Remaining (B10):**
```
=B8-B9
```

**Income by Source - Q1 Total (Column E):**
```
=B12+C12+D12
```

**Income by Source - % of Total (Column F):**
```
=E12/E17
```
*Format as percentage*

### Conditional Formatting:

**Tax Remaining (B10):**
- If value > $500: Orange background
- If value > $1000: Red background
- If value < 0: Green background (overpaid)

**Upcoming Tax Deadlines - Deadline column:**
- If date within 30 days: Yellow background
- If date within 7 days: Orange background
- If date past and not paid: Red background

---

## TAB 2: INCOME LOG

### Layout:

```
Row 1: Headers
| Date | Platform/Client | Service/Product | Amount | Payment Method | Payment Status | Hours Worked | Invoice # | Notes |

Row 2-1000: Data entries (example data below)

| Date       | Platform/Client | Service/Product        | Amount | Payment Method | Payment Status | Hours | Invoice # | Notes                    |
|------------|-----------------|------------------------|--------|----------------|----------------|-------|-----------|--------------------------|
| 2025-03-01 | Uber            | Rides (5 trips)        | $85.20 | Direct Deposit | ✅ Received    | 3.5   | -         | Friday evening rush      |
| 2025-03-02 | DoorDash        | Deliveries (12)        | $142.50| Direct Deposit | ✅ Received    | 4     | -         | Lunch + dinner shift     |
| 2025-03-03 | Upwork          | Website design         | $500   | PayPal         | ⏳ Pending     | 8     | INV-001   | 50% upfront payment      |
| 2025-03-05 | Etsy            | Product sales (3)      | $87.00 | Etsy Payments  | ✅ Received    | -     | -         | Custom orders            |
| 2025-03-07 | Uber            | Rides (8 trips)        | $128.40| Direct Deposit | ✅ Received    | 5.5   | -         | Weekend premium          |
| 2025-03-08 | DoorDash        | Deliveries (15)        | $178.25| Direct Deposit | ✅ Received    | 5     | -         | Saturday busy day        |
| 2025-03-10 | Upwork          | Website design final   | $500   | PayPal         | ✅ Received    | 10    | INV-002   | Final 50% payment        |
| 2025-03-12 | Uber            | Rides (15 trips)       | $285.60| Direct Deposit | ✅ Received    | 8     | -         | Best day! St Patty prep  |
| 2025-03-15 | Etsy            | Product sales (5)      | $145.00| Etsy Payments  | ✅ Received    | -     | -         | Spring collection launch |
```

### Column Widths:
- A (Date): 100px
- B (Platform/Client): 150px
- C (Service/Product): 200px
- D (Amount): 100px
- E (Payment Method): 130px
- F (Payment Status): 120px
- G (Hours Worked): 80px
- H (Invoice #): 100px
- I (Notes): 250px

### Data Validation:

**Column B (Platform/Client):**
Drop-down list (customizable):
- Uber
- Lyft
- DoorDash
- Uber Eats
- Instacart
- Etsy
- eBay
- Upwork
- Fiverr
- Freelance Client
- Other

**Column E (Payment Method):**
- Direct Deposit
- PayPal
- Venmo
- Cash
- Check
- Stripe
- Zelle
- Cash App
- Platform Payout

**Column F (Payment Status):**
- ✅ Received
- ⏳ Pending
- 📅 Scheduled
- ❌ Late
- 🚫 Disputed

### Formulas:

**Row 1001 (Totals):**
```
=SUM(D2:D1000)  // Total Income
=SUM(G2:G1000)  // Total Hours
=AVERAGE(D2:D1000/G2:G1000)  // Avg Hourly Rate
```

### Conditional Formatting:

**Payment Status column (F2:F1000):**
- If "✅ Received": Green background
- If "⏳ Pending": Yellow background
- If "❌ Late": Red background
- If "🚫 Disputed": Dark red background

**Date column (A2:A1000):**
- If payment pending and date > 30 days old: Orange background (flag for follow-up)

---

## TAB 3: EXPENSE LOG

### Layout:

```
Row 1: Headers
| Date | Category | Description | Amount | Payment Method | Deductible? | Receipt | Vendor | Notes |

Row 2-1000: Data entries (example data below)

| Date       | Category           | Description              | Amount | Payment Method | Deductible | Receipt | Vendor           | Notes                    |
|------------|--------------------|--------------------------|--------|----------------|------------|---------|------------------|--------------------------|
| 2025-03-01 | Vehicle - Gas      | Gas fill-up              | $45.00 | Credit Card    | ✅ Yes     | ✅ Yes  | Shell            | For Uber driving         |
| 2025-03-02 | Supplies           | Packaging materials      | $28.50 | Debit Card     | ✅ Yes     | ✅ Yes  | UPS Store        | For Etsy orders          |
| 2025-03-05 | Vehicle - Maintenance| Oil change             | $65.00 | Credit Card    | ✅ Yes     | ✅ Yes  | Jiffy Lube       | 3,000 mile service       |
| 2025-03-07 | Software           | Canva Pro subscription   | $12.99 | Credit Card    | ✅ Yes     | ✅ Yes  | Canva            | Monthly design tools     |
| 2025-03-10 | Fees               | Etsy listing fees        | $3.40  | Etsy Balance   | ✅ Yes     | ✅ Yes  | Etsy             | 17 active listings       |
| 2025-03-12 | Food - On the Job  | Lunch during delivery    | $12.00 | Cash           | ⚠️ Partial | ❌ No   | McDonald's       | 50% deductible           |
| 2025-03-15 | Phone              | Phone bill (50% business)| $40.00 | Auto-pay       | ⚠️ Partial | ✅ Yes  | Verizon          | 50% business use         |
| 2025-03-18 | Marketing          | Facebook ads             | $50.00 | Credit Card    | ✅ Yes     | ✅ Yes  | Meta             | Etsy shop promotion      |
| 2025-03-20 | Professional Dev   | Online course            | $99.00 | Credit Card    | ✅ Yes     | ✅ Yes  | Udemy            | SEO marketing course     |
```

### Data Validation:

**Column B (Category):**
Drop-down list:
- Vehicle - Gas
- Vehicle - Maintenance
- Vehicle - Insurance
- Vehicle - Repairs
- Supplies
- Equipment
- Software
- Phone
- Internet
- Fees (platform fees)
- Marketing
- Professional Development
- Office Supplies
- Food - On the Job
- Travel
- Other

**Column F (Deductible?):**
- ✅ Yes (100%)
- ⚠️ Partial
- ❌ No

**Column G (Receipt):**
- ✅ Yes
- ❌ No
- 📧 Digital

### Formulas:

**Row 1001 (Totals):**
```
=SUM(D2:D1000)  // Total Expenses
=SUMIF(F2:F1000,"✅ Yes",D2:D1000)  // Fully Deductible
=SUMIF(F2:F1000,"⚠️ Partial",D2:D1000)*0.5  // Partially Deductible (assume 50%)
```

### Conditional Formatting:

**Deductible column (F2:F1000):**
- If "✅ Yes": Green background
- If "⚠️ Partial": Yellow background
- If "❌ No": Red background

**Receipt column (G2:G1000):**
- If "❌ No" AND Deductible = "✅ Yes": Orange background (warning - need receipt for taxes)

---

## TAB 4: MILEAGE TRACKER

### Layout:

```
Row 1: MILEAGE LOG FOR TAX DEDUCTION

Row 3: Current IRS Mileage Rate: $0.67/mile (2024 rate - update annually)

Row 5: Headers
| Date | Starting Location | Ending Location | Purpose | Odometer Start | Odometer End | Miles Driven | Deductible | Value | Platform | Notes |

Example data:

| Date       | Start Location  | End Location       | Purpose              | Odo Start | Odo End | Miles | Deduct | Value  | Platform | Notes              |
|------------|-----------------|-------------------|----------------------|-----------|---------|-------|--------|--------|----------|--------------------|
| 2025-03-01 | Home            | Downtown Area     | Uber pickups         | 45,230    | 45,267  | 37    | ✅ Yes | $24.79 | Uber     | Friday evening     |
| 2025-03-01 | Downtown Area   | Home              | Return from work     | 45,267    | 45,284  | 17    | ❌ No  | $0.00  | Personal | Commute (not tax)  |
| 2025-03-02 | Home            | Restaurant Dist   | DoorDash deliveries  | 45,284    | 45,326  | 42    | ✅ Yes | $28.14 | DoorDash | Lunch shift        |
| 2025-03-03 | Home            | UPS Store         | Ship Etsy orders     | 45,326    | 45,333  | 7     | ✅ Yes | $4.69  | Etsy     | Package drop       |
| 2025-03-05 | Home            | Client Office     | Website consultation | 45,340    | 45,382  | 42    | ✅ Yes | $28.14 | Upwork   | In-person meeting  |
| 2025-03-07 | Home            | Airport Area      | Uber rides           | 45,390    | 45,458  | 68    | ✅ Yes | $45.56 | Uber     | Weekend shift      |
```

### Formulas:

**Miles Driven (Column G):**
```
=F2-E2
```

**Value (Column I):**
```
=IF(H2="✅ Yes",G2*$C$3,0)
```
*Where C3 contains current IRS mileage rate*

**Totals (Row 102):**
```
=SUM(G2:G100)  // Total Miles
=SUMIF(H2:H100,"✅ Yes",G2:G100)  // Deductible Miles
=SUM(I2:I100)  // Total Deduction Value
```

### Data Validation:

**Column D (Purpose):**
- Ride-share driving
- Food delivery
- Product delivery
- Client meeting
- Supplier pickup
- Post office/shipping
- Business errands
- Commute (not deductible)
- Personal (not deductible)

**Column H (Deductible):**
- ✅ Yes
- ❌ No

### Summary Section (Row 104-108):

```
MILEAGE SUMMARY:
Total Miles Driven: 5,847
Business Miles: 4,923 (84%)
Personal Miles: 924 (16%)
Total Deduction Value: $3,298.41
```

### Conditional Formatting:

**Deductible column (H2:H100):**
- If "✅ Yes": Green background
- If "❌ No": Red background

---

## TAB 5: TAX ESTIMATOR

### Layout:

```
Row 1: QUARTERLY TAX ESTIMATOR & PAYMENTS

Row 3: TAX SETTINGS (Editable)
Self-Employment Tax Rate: 15.3%
Federal Income Tax Rate: 12%
State Income Tax Rate: 5%
Total Effective Rate: 32.3%

Row 8: QUARTERLY BREAKDOWN

| Quarter | Income    | Expenses  | Net Profit | Self-Emp Tax | Fed Tax | State Tax | Total Tax | Paid Date | Conf # | Status      |
|---------|-----------|-----------|------------|--------------|---------|-----------|-----------|-----------|--------|-------------|
| Q1 2025 | $11,630   | $2,145    | $9,485     | $1,451       | $1,138  | $474      | $3,063    | 4/10/25   | 123456 | ✅ Paid     |
| Q2 2025 | $8,200    | $1,680    | $6,520     | $997         | $782    | $326      | $2,105    | -         | -      | ⏳ Upcoming |
| Q3 2025 | $0        | $0        | $0         | $0           | $0      | $0        | $0        | -         | -      | 📅 Future   |
| Q4 2025 | $0        | $0        | $0         | $0           | $0      | $0        | $0        | -         | -      | 📅 Future   |
| TOTAL   | $19,830   | $3,825    | $16,005    | $2,448       | $1,920  | $800      | $5,168    | -         | -      | -           |

Row 20: TAX PAYMENT SCHEDULE

| Payment Due Date | Quarter | Amount Due | Amount Paid | Status         | Days Until Due | Action Needed         |
|------------------|---------|------------|-------------|----------------|----------------|----------------------|
| April 15, 2025   | Q1      | $3,063     | $3,100      | ✅ Paid        | -30 (past)     | ✅ Done               |
| June 17, 2025    | Q2      | $2,105     | $0          | ⏳ Upcoming    | 45             | 💰 Save money now     |
| Sept 16, 2025    | Q3      | TBD        | $0          | 📅 Future      | 136            | 📊 Track Q3 income    |
| Jan 15, 2026     | Q4      | TBD        | $0          | 📅 Future      | 257            | 📊 Track Q4 income    |

Row 28: SAVINGS TRACKER

Goal: Save 33% of each payment for taxes

| Month   | Income    | 33% Saved | Actual Saved | Difference | Running Balance |
|---------|-----------|-----------|--------------|------------|-----------------|
| January | $4,600    | $1,518    | $1,500       | -$18       | $1,500          |
| February| $4,480    | $1,478    | $1,500       | +$22       | $3,000          |
| March   | $2,550    | $842      | $900         | +$58       | $3,900          |

Row 35: TAX DEDUCTION SUMMARY

| Category              | Amount    | % of Expenses |
|-----------------------|-----------|---------------|
| Vehicle (gas + maint) | $1,240    | 32%           |
| Mileage Deduction     | $3,298    | -             |
| Platform Fees         | $285      | 7%            |
| Software/Tools        | $156      | 4%            |
| Supplies              | $412      | 11%           |
| Marketing             | $200      | 5%            |
| Phone (50% business)  | $240      | 6%            |
| TOTAL DEDUCTIONS      | $5,831    | 100%          |

Note: Take mileage OR actual vehicle expenses - whichever is higher (usually mileage)
```

### Formulas:

**Net Profit (Column D):**
```
=B9-C9
```

**Self-Employment Tax (Column E):**
```
=D9*$C$3
```
*Where C3 is the self-employment tax rate*

**Federal Tax (Column F):**
```
=D9*$C$4
```

**State Tax (Column G):**
```
=D9*$C$5
```

**Total Tax (Column H):**
```
=E9+F9+G9
```

**Days Until Due (Column P in Tax Payment Schedule):**
```
=A21-TODAY()
```

**33% Saved (Column C in Savings Tracker):**
```
=B29*0.33
```

**Difference (Column E in Savings Tracker):**
```
=D29-C29
```

**Running Balance (Column F in Savings Tracker):**
```
=SUM($D$29:D29)
```

### Conditional Formatting:

**Tax Payment Schedule - Days Until Due:**
- If < 7 days: Red background
- If < 30 days: Orange background
- If < 60 days: Yellow background

**Savings Tracker - Difference:**
- If positive: Green background
- If negative: Red background

---

## TAB 6: MONTHLY REPORTS

### Layout:

```
Row 1: MONTHLY INCOME REPORTS

Row 3: SELECT MONTH: [Dropdown: Jan, Feb, Mar... Dec]

Row 5: SELECTED MONTH SUMMARY (Example: March 2025)

┌──────────────────────────────────────────────────────────────┐
│                    MARCH 2025 SUMMARY                         │
├──────────────────────────────────────────────────────────────┤
│  Total Income:        $2,550.00                              │
│  Total Expenses:      $890.00                                │
│  Net Profit:          $1,660.00                              │
│  Profit Margin:       65%                                    │
│                                                               │
│  Hours Worked:        47 hours                               │
│  Effective Hourly:    $35.32/hour                            │
│                                                               │
│  Tax Set Aside:       $536.58 (33%)                          │
│  Take-Home Pay:       $1,123.42                              │
└──────────────────────────────────────────────────────────────┘

Row 15: INCOME BREAKDOWN

| Platform      | # Transactions | Total Income | Avg per Trans | Hours | $/Hour | % of Total |
|---------------|----------------|--------------|---------------|-------|--------|------------|
| Uber          | 28 trips       | $1,180.00    | $42.14        | 16.5  | $71.52 | 46%        |
| DoorDash      | 27 deliveries  | $850.00      | $31.48        | 14    | $60.71 | 33%        |
| Etsy          | 5 sales        | $520.00      | $104.00       | -     | -      | 20%        |
| Other         | 1              | $0.00        | $0.00         | 0.5   | $0.00  | 0%         |
| TOTAL         | 61             | $2,550.00    | $41.80        | 47    | $54.26 | 100%       |

Row 24: EXPENSE BREAKDOWN

| Category           | # of Expenses | Total Amount | % of Expenses |
|--------------------|---------------|--------------|---------------|
| Vehicle - Gas      | 4             | $180.00      | 20%           |
| Vehicle - Maint    | 1             | $65.00       | 7%            |
| Supplies           | 3             | $85.50       | 10%           |
| Software           | 2             | $25.98       | 3%            |
| Platform Fees      | 15            | $51.20       | 6%            |
| Marketing          | 1             | $50.00       | 6%            |
| Phone (50%)        | 1             | $40.00       | 4%            |
| Other              | 8             | $392.32      | 44%           |
| TOTAL              | 35            | $890.00      | 100%          |

Row 36: TOP 5 EARNING DAYS

| Date       | Platform | Income   | Hours | $/Hour | Notes              |
|------------|----------|----------|-------|--------|--------------------|
| 2025-03-12 | Uber     | $285.60  | 8     | $35.70 | St Patty weekend   |
| 2025-03-16 | Multiple | $227.50  | 7.5   | $30.33 | Uber + DoorDash    |
| 2025-03-08 | DoorDash | $178.25  | 5     | $35.65 | Saturday busy      |
| 2025-03-15 | Etsy     | $145.00  | -     | -      | Spring collection  |
| 2025-03-07 | Uber     | $128.40  | 5.5   | $23.35 | Friday evening     |

Row 44: YEAR-OVER-YEAR COMPARISON (If previous year data exists)

| Month | 2024 Income | 2025 Income | Change  | % Change |
|-------|-------------|-------------|---------|----------|
| Jan   | $3,850      | $4,600      | +$750   | +19.5%   |
| Feb   | $4,100      | $4,480      | +$380   | +9.3%    |
| Mar   | $3,200      | $2,550      | -$650   | -20.3%   |
```

### Formulas:

**Total Income (B7):**
```
=SUMIFS('Income Log'!D:D,'Income Log'!A:A,">="&DATE(2025,3,1),'Income Log'!A:A,"<"&DATE(2025,4,1))
```
*Adjust month based on dropdown selection*

**Total Expenses (B8):**
```
=SUMIFS('Expense Log'!D:D,'Expense Log'!A:A,">="&DATE(2025,3,1),'Expense Log'!A:A,"<"&DATE(2025,4,1))
```

**Net Profit (B9):**
```
=B7-B8
```

**Profit Margin (B10):**
```
=B9/B7
```

**Hours Worked (B12):**
```
=SUMIFS('Income Log'!G:G,'Income Log'!A:A,">="&DATE(2025,3,1),'Income Log'!A:A,"<"&DATE(2025,4,1))
```

**Effective Hourly (B13):**
```
=B7/B12
```

**Tax Set Aside (B15):**
```
=B9*0.33
```

**Take-Home Pay (B16):**
```
=B9-B15
```

---

## FORMATTING INSTRUCTIONS

### Color Scheme:
- **Primary**: #4CAF50 (Green - money theme)
- **Secondary**: #FFFFFF (White)
- **Accent**: #2196F3 (Blue)
- **Success**: #81C784 (Light green)
- **Warning**: #FFB74D (Orange)
- **Danger**: #E57373 (Red)

### Fonts:
- **Headers**: Roboto, Bold, 14pt
- **Body**: Roboto, Regular, 11pt
- **Numbers**: Roboto Mono, Regular, 11pt

### Currency Formatting:
- All money columns: $#,##0.00
- Negative: ($#,##0.00) in red

### Date Formatting:
- All dates: MM/DD/YYYY

---

## ETSY LISTING TEMPLATE

### Title:
"Side Hustle Income Tracker Google Sheets | Tax Estimator for Gig Workers | Uber DoorDash Etsy Upwork"

### Tags (13):
1. side hustle tracker
2. gig economy income
3. tax tracker
4. 1099 income tracker
5. uber driver tracker
6. doordash earnings
7. freelance income
8. expense tracker
9. mileage log
10. quarterly tax
11. google sheets
12. self employed
13. income spreadsheet

### Price: $15

---

## BUILD TIME: 2 hours

## EXPECTED REVENUE: $150-450/month (10-30 sales)
