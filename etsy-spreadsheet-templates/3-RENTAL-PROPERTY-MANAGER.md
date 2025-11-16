# Rental Property Manager - Google Sheets Template

**Price on Etsy**: $25
**Build Time**: 3 hours
**Tabs**: 7 (Dashboard, Properties, Tenants, Rent Payments, Expenses, Maintenance, Tax Report)
**Supports**: 1-50 properties

---

## TAB 1: DASHBOARD

### Layout:

```
Row 1: RENTAL PROPERTY PORTFOLIO DASHBOARD

Row 2: [Owner Name] | [Year: 2025]

Row 4-11: KEY METRICS (8 boxes in 2 rows)

┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐
│  TOTAL PROPERTIES   │  │  OCCUPIED UNITS     │  │  VACANT UNITS       │  │  OCCUPANCY RATE     │
│  12                 │  │  11                 │  │  1                  │  │  92%                │
└─────────────────────┘  └─────────────────────┘  └─────────────────────┘  └─────────────────────┘

┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐
│  MONTHLY RENT       │  │  YTD RENTAL INCOME  │  │  YTD EXPENSES       │  │  NET PROFIT YTD     │
│  $18,500            │  │  $55,500            │  │  $18,240            │  │  $37,260            │
└─────────────────────┘  └─────────────────────┘  └─────────────────────┘  └─────────────────────┘

Row 13: PROPERTIES AT A GLANCE

| Property Address      | Tenant Name      | Monthly Rent | Rent Status  | Lease Expires | Days to Expire | Action         |
|-----------------------|------------------|--------------|--------------|---------------|----------------|----------------|
| 123 Main St, Unit A   | John Smith       | $1,500       | ✅ Paid      | 12/31/2025    | 289            | ✅ Current     |
| 123 Main St, Unit B   | Sarah Johnson    | $1,500       | ✅ Paid      | 08/15/2025    | 151            | ✅ Current     |
| 456 Oak Ave           | Mike Chen        | $2,200       | ⏳ Due 3/15  | 06/30/2026    | 471            | ⚠️ Payment Due |
| 789 Elm Street        | VACANT           | $1,800       | 🏠 Vacant    | -             | -              | 📢 List Now    |
| 321 Pine Rd           | Lisa Brown       | $1,600       | ✅ Paid      | 03/31/2025    | 45             | ⚠️ Renew Soon  |
| 654 Maple Dr          | David Lee        | $1,900       | ⚠️ Late (5d) | 11/15/2025    | 243            | 📞 Contact Now |

Row 23: RENT COLLECTION STATUS (This Month)

| Status              | # of Units | Total Rent  | % of Portfolio |
|---------------------|------------|-------------|----------------|
| ✅ Paid on Time     | 9          | $15,300     | 75%            |
| ⏳ Due (not late)   | 1          | $2,200      | 8%             |
| ⚠️ Late (1-7 days)  | 1          | $1,900      | 8%             |
| 🚫 Late (8+ days)   | 0          | $0          | 0%             |
| 🏠 Vacant           | 1          | ($1,800)    | 8%             |
| TOTAL               | 12         | $17,600     | 100%           |

Row 31: UPCOMING TASKS & ALERTS

| Date       | Type              | Property          | Description                  | Priority | Status      |
|------------|-------------------|-------------------|------------------------------|----------|-------------|
| 2025-03-15 | Payment Due       | 456 Oak Ave       | Rent payment due ($2,200)    | 🔴 High  | ⏳ Pending  |
| 2025-03-20 | Lease Renewal     | 321 Pine Rd       | Lease expires in 45 days     | 🟡 Med   | 📧 Contact  |
| 2025-03-22 | Maintenance       | 123 Main St, A    | Annual HVAC inspection       | 🟢 Low   | 📅 Scheduled|
| 2025-03-25 | Late Rent Follow-up| 654 Maple Dr     | Rent 5 days late - call today| 🔴 High  | ⏳ Pending  |
| 2025-04-01 | Vacancy Marketing | 789 Elm Street    | Unit vacant 15 days          | 🟡 Med   | 📢 Listing  |

Row 40: PROFIT & LOSS (This Month)

Income:
  Rent Collected:         $17,600
  Late Fees:              $50
  Other Income:           $0
  TOTAL INCOME:           $17,650

Expenses:
  Mortgage Payments:      $8,200
  Property Tax:           $1,100
  Insurance:              $450
  Maintenance/Repairs:    $680
  Utilities (if included): $320
  Property Management:    $0
  Other Expenses:         $150
  TOTAL EXPENSES:         $10,900

NET PROFIT THIS MONTH:    $6,750
Profit Margin:            38%
```

### Formulas:

**Total Properties (B5):**
```
=COUNTA(Properties!A2:A100)
```

**Occupied Units (B6):**
```
=COUNTIF(Tenants!F2:F100,"✅ Active")
```

**Vacant Units (B7):**
```
=B5-B6
```

**Occupancy Rate (B8):**
```
=B6/B5
```
*Format as percentage*

**Monthly Rent (B9):**
```
=SUM(Properties!D2:D100)
```

**YTD Rental Income (B10):**
```
=SUMIFS('Rent Payments'!D:D,'Rent Payments'!A:A,">="&DATE(2025,1,1))
```

**YTD Expenses (B11):**
```
=SUMIFS(Expenses!C:C,Expenses!A:A,">="&DATE(2025,1,1))
```

**Net Profit YTD (B12):**
```
=B10-B11
```

### Conditional Formatting:

**Rent Status column (D14:D50):**
- If "✅ Paid": Green background
- If "⏳ Due": Yellow background
- If "⚠️ Late": Orange background
- If "🚫 Late (8+)": Red background
- If "🏠 Vacant": Gray background

**Days to Expire column (F14:F50):**
- If < 30: Red background (lease ending soon)
- If < 60: Orange background
- If < 90: Yellow background

---

## TAB 2: PROPERTIES

### Layout:

```
Row 1: Headers
| Property ID | Address | City | State | ZIP | Purchase Date | Purchase Price | Current Value | Monthly Rent | Property Type | Bedrooms | Bathrooms | Sqft | Status | Notes |

Example data:

| ID  | Address              | City      | State | ZIP   | Purchase    | Purchase Price | Value    | Rent   | Type      | Bed | Bath | Sqft  | Status     | Notes              |
|-----|----------------------|-----------|-------|-------|-------------|----------------|----------|--------|-----------|-----|------|-------|------------|--------------------|
| P001| 123 Main St, Unit A  | Springfield| IL    | 62701 | 2018-05-15  | $145,000       | $185,000 | $1,500 | Condo     | 2   | 1    | 950   | 🏠 Rented  | Corner unit, pool  |
| P002| 123 Main St, Unit B  | Springfield| IL    | 62701 | 2018-05-15  | $145,000       | $185,000 | $1,500 | Condo     | 2   | 1    | 950   | 🏠 Rented  | Same building      |
| P003| 456 Oak Ave          | Springfield| IL    | 62702 | 2019-08-22  | $265,000       | $310,000 | $2,200 | SFH       | 3   | 2    | 1,650 | 🏠 Rented  | Nice neighborhood  |
| P004| 789 Elm Street       | Lincoln    | IL    | 62656 | 2020-03-10  | $180,000       | $205,000 | $1,800 | Townhouse | 3   | 2.5  | 1,400 | 🔓 Vacant  | Recently renovated |
| P005| 321 Pine Rd          | Springfield| IL    | 62703 | 2020-11-05  | $155,000       | $175,000 | $1,600 | SFH       | 2   | 1    | 1,100 | 🏠 Rented  | Needs new roof soon|
| P006| 654 Maple Dr         | Decatur    | IL    | 62521 | 2021-07-18  | $220,000       | $250,000 | $1,900 | SFH       | 3   | 2    | 1,500 | 🏠 Rented  | Great school dist  |
```

### Column Widths:
- A (ID): 60px
- B (Address): 200px
- C-E (City/State/ZIP): 100px each
- F (Purchase Date): 110px
- G-H (Purchase Price/Value): 120px each
- I (Monthly Rent): 100px
- J (Type): 100px
- K-M (Bed/Bath/Sqft): 70px each
- N (Status): 100px
- O (Notes): 250px

### Data Validation:

**Column J (Property Type):**
- Single Family Home (SFH)
- Condo
- Townhouse
- Duplex
- Multi-Family (3-4 units)
- Multi-Family (5+ units)
- Commercial

**Column N (Status):**
- 🏠 Rented
- 🔓 Vacant
- 🔧 Under Renovation
- 🏗️ Under Construction
- 💰 For Sale

### Formulas:

**Row 101 (Totals):**
```
=SUM(G2:G100)  // Total Purchase Price
=SUM(H2:H100)  // Total Current Value
=SUM(I2:I100)  // Total Monthly Rent
```

**Equity (add column P):**
```
=H2-G2
```

**Cap Rate (add column Q):**
```
=(I2*12)/(H2)
```
*Format as percentage*

### Conditional Formatting:

**Status column (N2:N100):**
- If "🏠 Rented": Green background
- If "🔓 Vacant": Orange background
- If "🔧 Under Renovation": Yellow background

---

## TAB 3: TENANTS

### Layout:

```
Row 1: Headers
| Tenant ID | Full Name | Property ID | Property Address | Phone | Email | Emergency Contact | Lease Start | Lease End | Monthly Rent | Security Deposit | Status | Rating | Notes |

Example data:

| ID   | Full Name      | Prop ID | Address             | Phone          | Email               | Emergency       | Start      | End        | Rent   | Deposit | Status     | Rating | Notes           |
|------|----------------|---------|---------------------|----------------|---------------------|-----------------|------------|------------|--------|---------|------------|--------|-----------------|
| T001 | John Smith     | P001    | 123 Main St, A      | (555) 111-2222 | john@email.com      | Jane (wife) 5551| 2024-01-01 | 2025-12-31 | $1,500 | $1,500  | ✅ Active  | ⭐⭐⭐⭐⭐ | Great tenant    |
| T002 | Sarah Johnson  | P002    | 123 Main St, B      | (555) 222-3333 | sarah@email.com     | Mom 555-2222    | 2023-09-01 | 2025-08-31 | $1,500 | $1,500  | ✅ Active  | ⭐⭐⭐⭐   | Usually on time |
| T003 | Mike Chen      | P003    | 456 Oak Ave         | (555) 333-4444 | mike@email.com      | Brother 555-3333| 2024-07-01 | 2026-06-30 | $2,200 | $2,200  | ✅ Active  | ⭐⭐⭐⭐⭐ | Excellent       |
| T004 | VACANT         | P004    | 789 Elm Street      | -              | -                   | -               | -          | -          | $1,800 | $0      | 🔓 Vacant  | -      | Listing active  |
| T005 | Lisa Brown     | P005    | 321 Pine Rd         | (555) 444-5555 | lisa@email.com      | Husband 555-4444| 2023-04-01 | 2025-03-31 | $1,600 | $1,600  | ⚠️ Expiring| ⭐⭐⭐    | Wants to renew  |
| T006 | David Lee      | P006    | 654 Maple Dr        | (555) 555-6666 | david@email.com     | Sister 555-5555 | 2024-12-01 | 2025-11-30 | $1,900 | $1,900  | ⚠️ Late Pay| ⭐⭐      | Often late      |
```

### Data Validation:

**Column L (Status):**
- ✅ Active - On Time
- ✅ Active - Occasional Late
- ⚠️ Late Payment
- ⚠️ Expiring Soon
- 🔓 Vacant
- 🚫 Eviction Process
- 📤 Move-Out Scheduled
- 🔚 Former Tenant

**Column M (Rating):**
- ⭐⭐⭐⭐⭐ (5 stars)
- ⭐⭐⭐⭐ (4 stars)
- ⭐⭐⭐ (3 stars)
- ⭐⭐ (2 stars)
- ⭐ (1 star)

### Formulas:

**Days Until Lease End (add column O):**
```
=I2-TODAY()
```

**Lease Duration (add column P):**
```
=I2-H2
```

### Conditional Formatting:

**Status column (L2:L100):**
- If "✅ Active": Green background
- If "⚠️ Late Payment": Orange background
- If "⚠️ Expiring Soon": Yellow background
- If "🚫 Eviction": Red background
- If "🔓 Vacant": Gray background

**Days Until Lease End:**
- If < 30: Red background
- If < 60: Orange background
- If < 90: Yellow background

---

## TAB 4: RENT PAYMENTS

### Layout:

```
Row 1: Headers
| Date Paid | Property ID | Property Address | Tenant Name | Rent Due | Amount Paid | Late Fee | Total Received | Payment Method | Confirmation # | Days Late | Status | Notes |

Example data:

| Date       | Prop | Address           | Tenant         | Due    | Paid   | Late | Total  | Method       | Conf#   | Late | Status      | Notes           |
|------------|------|-------------------|----------------|--------|--------|------|--------|--------------|---------|------|-------------|-----------------|
| 2025-03-01 | P001 | 123 Main St, A    | John Smith     | $1,500 | $1,500 | $0   | $1,500 | Auto-pay ACH | 123456  | 0    | ✅ On Time  | Auto-payment    |
| 2025-03-01 | P002 | 123 Main St, B    | Sarah Johnson  | $1,500 | $1,500 | $0   | $1,500 | Check        | 7890    | 0    | ✅ On Time  | -               |
| 2025-03-05 | P006 | 654 Maple Dr      | David Lee      | $1,900 | $1,900 | $50  | $1,950 | Venmo        | V123    | 5    | ⚠️ Late     | 5 days late     |
| 2025-03-10 | P003 | 456 Oak Ave       | Mike Chen      | $2,200 | $0     | $0   | $0     | -            | -       | 10   | 🚫 Unpaid   | Called 3/8      |
| 2025-03-01 | P005 | 321 Pine Rd       | Lisa Brown     | $1,600 | $1,600 | $0   | $1,600 | Zelle        | Z456    | 0    | ✅ On Time  | -               |
| 2025-02-28 | P001 | 123 Main St, A    | John Smith     | $1,500 | $1,500 | $0   | $1,500 | Auto-pay ACH | 123401  | -1   | ✅ Early    | Paid day early  |
```

### Data Validation:

**Column I (Payment Method):**
- Auto-pay ACH
- Check
- Cash
- Venmo
- Zelle
- PayPal
- Wire Transfer
- Money Order
- Not Paid

**Column L (Status):**
- ✅ On Time (0 days late)
- ✅ Early (paid before due)
- ⚠️ Late (1-7 days)
- 🚫 Late (8-30 days)
- 🔴 Severely Late (31+ days)
- 🚫 Unpaid

### Formulas:

**Days Late (Column K):**
```
=A2-1  // Assuming rent due on 1st of month
```
*Adjust based on actual due date from lease*

**Status (Column L):**
```
=IF(F2=0,"🚫 Unpaid",IF(K2<0,"✅ Early",IF(K2=0,"✅ On Time",IF(K2<=7,"⚠️ Late",IF(K2<=30,"🚫 Late","🔴 Severely Late")))))
```

**Monthly Totals (Row 1002):**
```
=SUM(E2:E1000)  // Total Rent Due
=SUM(F2:F1000)  // Total Paid
=SUM(G2:G1000)  // Total Late Fees
=SUM(H2:H1000)  // Total Received
```

### Conditional Formatting:

**Status column (L2:L1000):**
- If "✅ On Time" or "✅ Early": Green background
- If "⚠️ Late": Orange background
- If "🚫 Late" or "🔴 Severely Late": Red background
- If "🚫 Unpaid": Dark red background

**Days Late column (K2:K1000):**
- If > 0: Orange to red gradient based on number

---

## TAB 5: EXPENSES

### Layout:

```
Row 1: Headers
| Date | Property ID | Property Address | Category | Description | Amount | Paid To | Payment Method | Deductible? | Receipt | Notes |

Example data:

| Date       | Prop | Address         | Category        | Description           | Amount  | Paid To          | Method      | Deduct | Receipt | Notes                |
|------------|------|-----------------|-----------------|----------------------|---------|------------------|-------------|--------|---------|----------------------|
| 2025-03-01 | ALL  | All Properties  | Mortgage        | Monthly mortgage P001-P003| $8,200 | First Bank      | Auto-pay    | ✅ Yes | ✅ Yes  | 3 properties         |
| 2025-03-05 | P004 | 789 Elm St      | Repairs         | Fix leaky faucet     | $125    | ABC Plumbing     | Check       | ✅ Yes | ✅ Yes  | Kitchen sink         |
| 2025-03-08 | ALL  | All Properties  | Insurance       | Property insurance   | $450    | State Farm       | Auto-pay    | ✅ Yes | ✅ Yes  | Annual premium/12    |
| 2025-03-10 | P003 | 456 Oak Ave     | Landscaping     | Lawn mowing service  | $80     | Green Lawns LLC  | Cash        | ✅ Yes | ❌ No   | Monthly service      |
| 2025-03-12 | P006 | 654 Maple Dr    | Utilities       | Water bill (included)| $45     | City Utilities   | Online      | ✅ Yes | ✅ Yes  | Tenant reimburses    |
| 2025-03-15 | ALL  | All Properties  | Property Tax    | Quarterly tax payment| $1,100  | County Tax       | Check       | ✅ Yes | ✅ Yes  | Q1 2025              |
| 2025-03-18 | P004 | 789 Elm St      | Marketing       | Zillow listing fee   | $50     | Zillow           | Credit Card | ✅ Yes | ✅ Yes  | Vacancy listing      |
| 2025-03-20 | P001 | 123 Main St, A  | Maintenance     | HVAC annual service  | $150    | Cool Air HVAC    | Check       | ✅ Yes | ✅ Yes  | Preventive maint     |
```

### Data Validation:

**Column D (Category):**
- Mortgage/Loan Payment
- Property Tax
- Insurance
- Repairs
- Maintenance
- Utilities (if included)
- HOA Fees
- Property Management
- Landscaping
- Snow Removal
- Pest Control
- Advertising/Marketing
- Legal/Professional Fees
- Supplies
- Travel (property visits)
- Other

**Column I (Deductible?):**
- ✅ Yes (100%)
- ⚠️ Partial (specify %)
- ❌ No

**Column J (Receipt):**
- ✅ Yes
- ❌ No
- 📧 Digital

### Formulas:

**Monthly Totals (Row 1002):**
```
=SUM(F2:F1000)  // Total Expenses
=SUMIF(I2:I1000,"✅ Yes",F2:F1000)  // Tax Deductible
```

**Expense by Category (separate summary section):**
```
=SUMIF(D:D,"Repairs",F:F)
=SUMIF(D:D,"Maintenance",F:F)
// etc for each category
```

### Conditional Formatting:

**Deductible column (I2:I1000):**
- If "✅ Yes": Green background
- If "⚠️ Partial": Yellow background
- If "❌ No": Red background

**Receipt column (J2:J1000):**
- If "❌ No" AND Deductible = "✅ Yes": Orange background (warning)

---

## TAB 6: MAINTENANCE

### Layout:

```
Row 1: Headers
| Request Date | Property ID | Address | Tenant | Issue Category | Description | Priority | Status | Assigned To | Scheduled Date | Completed Date | Cost | Notes |

Example data:

| Request    | Prop | Address         | Tenant        | Category    | Description              | Priority | Status       | Assigned       | Scheduled  | Completed  | Cost    | Notes             |
|------------|------|-----------------|---------------|-------------|--------------------------|----------|--------------|----------------|------------|------------|---------|-------------------|
| 2025-03-01 | P001 | 123 Main St, A  | John Smith    | Plumbing    | Toilet running constantly| 🟡 Medium| 📅 Scheduled | ABC Plumbing   | 2025-03-05 | 2025-03-05 | $85     | Fixed flapper     |
| 2025-03-08 | P003 | 456 Oak Ave     | Mike Chen     | HVAC        | Heating not working      | 🔴 High  | ✅ Completed | Cool Air HVAC  | 2025-03-08 | 2025-03-08 | $225    | Emergency service |
| 2025-03-12 | P005 | 321 Pine Rd     | Lisa Brown    | Electrical  | Outlet not working       | 🟢 Low   | ⏳ In Progress| John Electric  | 2025-03-20 | -          | -       | Scheduled         |
| 2025-03-15 | P006 | 654 Maple Dr    | David Lee     | Appliance   | Dishwasher leaking       | 🟡 Medium| 📞 Contacted | Appliance Pro  | TBD        | -          | -       | Getting quote     |
| 2025-03-18 | P004 | 789 Elm St      | VACANT        | Cosmetic    | Paint touch-ups          | 🟢 Low   | 📝 New       | -              | -          | -          | -       | Before showing    |
| 2025-03-20 | P002 | 123 Main St, B  | Sarah Johnson | Plumbing    | Leaky faucet in bathroom | 🟡 Medium| 📝 New       | -              | -          | -          | -       | Just reported     |
```

### Data Validation:

**Column E (Issue Category):**
- Plumbing
- HVAC
- Electrical
- Appliance
- Roof
- Flooring
- Doors/Windows
- Pest Control
- Locks/Security
- Cosmetic
- Landscaping
- Other

**Column G (Priority):**
- 🔴 High (Emergency)
- 🟡 Medium
- 🟢 Low (Routine)

**Column H (Status):**
- 📝 New Request
- 📞 Contacted Vendor
- 💰 Awaiting Approval
- 📅 Scheduled
- ⏳ In Progress
- ✅ Completed
- ❌ Cancelled
- ⏸️ On Hold

### Formulas:

**Days Open (add column N):**
```
=IF(K2="","",K2-A2)
```
*Shows how long it took to complete*

**Average Response Time:**
```
=AVERAGE(N:N)
```

### Conditional Formatting:

**Priority column (G2:G100):**
- If "🔴 High": Red background
- If "🟡 Medium": Orange background
- If "🟢 Low": Green background

**Status column (H2:H100):**
- If "✅ Completed": Green background
- If "⏳ In Progress": Yellow background
- If "📝 New Request" AND Priority = "🔴 High": Red background

---

## TAB 7: TAX REPORT

### Layout:

```
Row 1: ANNUAL TAX REPORT FOR RENTAL PROPERTIES

Row 2: [Year: 2025] | Generated: [Today's Date]

Row 5: RENTAL INCOME SUMMARY

| Property Address      | Annual Rent | Rent Collected | Late Fees | Other Income | Total Income | Occupancy Rate |
|-----------------------|-------------|----------------|-----------|--------------|--------------|----------------|
| 123 Main St, Unit A   | $18,000     | $18,000        | $0        | $0           | $18,000      | 100%           |
| 123 Main St, Unit B   | $18,000     | $18,000        | $0        | $0           | $18,000      | 100%           |
| 456 Oak Ave           | $26,400     | $26,400        | $0        | $0           | $26,400      | 100%           |
| 789 Elm Street        | $21,600     | $14,400        | $0        | $0           | $14,400      | 67% (vacant 4mo)|
| 321 Pine Rd           | $19,200     | $19,200        | $0        | $0           | $19,200      | 100%           |
| 654 Maple Dr          | $22,800     | $22,600        | $200      | $0           | $22,800      | 100%           |
| TOTAL                 | $126,000    | $118,600       | $200      | $0           | $118,800     | 94%            |

Row 15: DEDUCTIBLE EXPENSES BY CATEGORY (IRS Schedule E Format)

| Category                    | Amount    | % of Total | IRS Line # |
|-----------------------------|-----------|------------|------------|
| Mortgage Interest           | $42,500   | 47%        | Line 12    |
| Property Taxes              | $8,400    | 9%         | Line 16    |
| Insurance                   | $5,400    | 6%         | Line 9     |
| Repairs                     | $3,840    | 4%         | Line 14    |
| Maintenance                 | $2,650    | 3%         | Line 14    |
| Utilities (if paid)         | $1,200    | 1%         | Line 18    |
| HOA Fees                    | $2,400    | 3%         | Line 8     |
| Property Management Fees    | $0        | 0%         | Line 11    |
| Legal & Professional Fees   | $850      | 1%         | Line 11    |
| Advertising                 | $450      | 0%         | Line 5     |
| Landscaping/Snow Removal    | $1,800    | 2%         | Line 14    |
| Pest Control                | $480      | 1%         | Line 14    |
| Supplies                    | $320      | 0%         | Line 15    |
| Travel (property visits)    | $650      | 1%         | Line 6     |
| Depreciation (calculated)   | $18,545   | 20%        | Line 18    |
| TOTAL EXPENSES              | $89,485   | 100%       |            |

Row 34: NET INCOME CALCULATION

Gross Rental Income:          $118,800
Total Expenses:               ($89,485)
───────────────────────────
NET RENTAL INCOME:            $29,315

Effective Tax Rate (assume 25%): $7,329
After-Tax Cash Flow:          $21,986

Row 42: DEPRECIATION SCHEDULE (27.5 years residential)

| Property          | Purchase Price | Land Value | Depreciable | Annual Deprec | Years Held | Total Deprec | Remaining |
|-------------------|----------------|------------|-------------|---------------|------------|--------------|-----------|
| 123 Main St, A    | $145,000       | $29,000    | $116,000    | $4,218        | 7          | $29,527      | $86,473   |
| 123 Main St, B    | $145,000       | $29,000    | $116,000    | $4,218        | 7          | $29,527      | $86,473   |
| 456 Oak Ave       | $265,000       | $53,000    | $212,000    | $7,709        | 6          | $46,255      | $165,745  |
| 789 Elm Street    | $180,000       | $36,000    | $144,000    | $5,236        | 5          | $26,182      | $117,818  |
| 321 Pine Rd       | $155,000       | $31,000    | $124,000    | $4,509        | 4          | $18,036      | $105,964  |
| 654 Maple Dr      | $220,000       | $44,000    | $176,000    | $6,400        | 3          | $19,200      | $156,800  |
| TOTAL             | $1,110,000     | $222,000   | $888,000    | $32,291       | -          | $168,727     | $719,273  |

Row 53: IMPORTANT TAX NOTES

✅ Keep all receipts for deductible expenses
✅ Track mileage for property visits (2025 rate: $0.67/mile)
✅ Depreciation reduces taxable income but not cash flow
⚠️ Consult with a CPA - this is for tracking only, not official tax advice
📋 Use this report to complete IRS Schedule E (Form 1040)
```

### Formulas:

**Annual Rent (Column B in Income Summary):**
```
=VLOOKUP(A6,Properties!A:I,9,FALSE)*12
```

**Rent Collected (Column C):**
```
=SUMIFS('Rent Payments'!F:F,'Rent Payments'!C:C,A6)
```

**Late Fees (Column D):**
```
=SUMIFS('Rent Payments'!G:G,'Rent Payments'!C:C,A6)
```

**Total Income (Column F):**
```
=C6+D6+E6
```

**Occupancy Rate (Column G):**
```
=C6/B6
```

**Expenses by Category:**
```
=SUMIF(Expenses!D:D,"Repairs",Expenses!F:F)
```
*Repeat for each category*

**Annual Depreciation:**
```
=D43/27.5
```
*27.5 years is IRS standard for residential rental*

---

## FORMATTING INSTRUCTIONS

### Color Scheme:
- **Primary**: #1976D2 (Blue - professional)
- **Secondary**: #FFFFFF (White)
- **Accent**: #388E3C (Green - money)
- **Success**: #81C784 (Light green)
- **Warning**: #FFB74D (Orange)
- **Danger**: #E57373 (Red)

### Fonts:
- **Headers**: Roboto, Bold, 14pt
- **Body**: Roboto, Regular, 11pt
- **Numbers**: Roboto Mono, Regular, 11pt

### Currency Formatting:
- All money: $#,##0.00
- Negative: ($#,##0.00) in red

---

## ETSY LISTING TEMPLATE

### Title:
"Rental Property Tracker Spreadsheet Google Sheets | Landlord Manager for 1-50 Properties | Income Expense Tax Report"

### Tags (13):
1. rental property tracker
2. landlord spreadsheet
3. property management
4. rental income tracker
5. real estate spreadsheet
6. property manager
7. landlord template
8. rental tracker
9. property income
10. google sheets
11. real estate tracker
12. tenant tracker
13. rental expenses

### Price: $25

---

## BUILD TIME: 3 hours

## EXPECTED REVENUE: $250-750/month (10-30 sales)
