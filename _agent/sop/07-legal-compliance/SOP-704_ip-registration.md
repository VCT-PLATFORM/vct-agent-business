# SOP-704: IP Registration — Đăng ký Sở hữu Trí tuệ

> **Actor**: IP Specialist + General Counsel | **Trigger**: New brand, product name, invention, or content

## IP Registration Workflow

### Trademark
```
// turbo
1. SEARCH: Tra cứu nhãn hiệu tại NOIP database (1-2 tuần)
   ├── Identical/similar marks in relevant classes?
   ├── If conflict → Rename or seek legal opinion
2. FILE: Nộp đơn tại Cục SHTT (NOIP)
   ├── Classes: 9 (software), 35 (advertising), 42 (SaaS)
   ├── Through IP agent or direct
   ├── Cost: 3-5M VNĐ/class
3. WAIT: Formality exam (1-2 tháng) → Substantive exam (6-12 tháng) → Publication (2 tháng)
4. MONITOR: Set up watch service for similar marks
5. ENFORCE: Cease & desist for infringement
```

### Software Copyright
```
// turbo
├── Automatic: Copyright exists from creation (no registration required)
├── Optional registration: Cục Bản quyền Tác giả (for stronger enforcement)
├── Cost: ~300K-500K VNĐ
├── Employee IP assignment: Clause in HĐLĐ (work product → company)
```

### Domain Names
```
// turbo
├── Register primary domain in all relevant TLDs (.com, .vn, .com.vn)
├── Register common typos/variations
├── Auto-renew enabled
├── WHOIS privacy enabled
├── Monitor for cybersquatting
```

### Open Source Compliance
```
// turbo
├── Run license audit: npm license-checker, license-gradle-plugin
├── SBOM (Software Bill of Materials): Generated per release
├── Red list: GPL, AGPL → DO NOT use without GC approval
├── Green list: MIT, Apache 2.0, BSD → Safe for commercial use
├── Review: IP Specialist audit quarterly → SOP-405 Security Audit
```
