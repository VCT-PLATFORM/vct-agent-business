# SOP-303: Invoice & Billing — Xuất Hóa đơn & Thu tiền

> **Actor**: Accounting Manager + Sales Manager

## Billing Workflow
```
// turbo
1. TRIGGER: Contract signed / Subscription renewed / Usage milestone
2. GENERATE: Accounting tạo invoice (PDF + Email)
   ├── Invoice number: INV-YYYY-XXXX
   ├── Customer info, Service description, Amount, Tax (VAT 8%)
   ├── Payment terms: NET 15 / NET 30
   └── Bank details
3. SEND: Email to customer billing contact
4. TRACK: Log in accounting system
5. FOLLOW-UP:
   ├── Day 7: Gentle reminder (if unpaid)
   ├── Day 15: Firm reminder + escalate to AE
   ├── Day 30: Final notice + escalate to Sales Manager
   └── Day 45: Escalate to General Counsel (legal action consideration)
6. RECEIVE: Confirm payment, update records
7. RECONCILE: Monthly bank reconciliation
```

## Revenue Recognition
```
// turbo
├── SaaS Subscription: Recognize monthly (pro-rata)
├── Annual prepaid: Deferred revenue, recognize 1/12 monthly
├── One-time service: Recognize on delivery
├── Implementation fee: Recognize over implementation period
```
