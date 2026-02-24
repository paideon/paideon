# PROJECT NEXUS

## Library Management System Proposal

**Network for Educational eXchange and Universal Systems**

---

**Submitted to:**  
Mrs. Dulmini N. Senanayake  
Principal  
C.W.W. Kannangara Central College - Mathugama

**Submitted by:**  
**S.C. Roshana (Chamila Roshana)**  
_Codename: Cinderax_

**Teacher in Charge:**  
Mrs. Salika Senarathna

**Contact:**  
+94 750 604 820  
Email: cinderax@icloud.com

**Date:** January 26, 2026

---

## EXECUTIVE SUMMARY

Project NEXUS is a comprehensive, student-led initiative to modernize our school library through a custom-built digital management system. Developed by **S.C. Roshana (Chamila Roshana)** under the guidance of Mrs. Salika Senarathna, this proposal outlines a solution that will transform library operations, serving our community of **4,198 students, 188 academy staff, and 77 non-academy staff** with unprecedented efficiency and insight.

---

### The Problem in Numbers

Our current library system operates with 2012-era technology, creating significant inefficiencies:

- **Cataloging Time:** 5 minutes per book (manual data entry)
- **Dead Stock:** 47% of collection never circulated
- **Student Engagement:** Only 28% of students use the library actively
- **Staff Burden:** So much time is spent on tasks that should be automated

### The Solution

NEXUS replaces outdated workflows with intelligent automation:

- **ISBN Auto-Fetch:** Cataloging time reduced from 5 minutes to 1 minute.
- **Mobile-First Access:** Students check availability from phones, 24/7
- **Predictive Analytics:** Data-driven book acquisition recommendations
- **Automated Workflows:** Notifications, reservations, fine calculations - all automatic

**This is not just a library upgrade - it's a foundation for our school's digital transformation.**

---

## TABLE OF CONTENTS

1. Current State Analysis
2. Proposed Solution
3. Technical Architecture
4. Implementation Timeline
5. Budget & Cost-Benefit Analysis
6. Risk Management
7. Future Roadmap
8. Stakeholder Benefits
9. Resource Requirements
10. Implementation Support
11. Success Stories (Projected)
12. Decision Required
13. Sustainability
14. Conclusion

---

## 1. CURRENT STATE ANALYSIS

### 1.1 Existing System Assessment

**Technology Infrastructure:**

- Platform: Library Office Calc
- Operating System: Windows 10 (unsupported since October 14, 2025)
- Hardware: Single desktop PC (Intel Core i3 8th generation, 8GB RAM)
- Backup: Manual Excel export to USB drive
- Mobile Access: None
- Security: Single shared login, no encryption

**Critical Vulnerabilities:**

- **Single-Point-of-Failure (SPOF):** The database resides as a single `.xls` file on a desktop. Without a RAID setup or automated cloud backup, one hardware failure would result in the permanent loss of years of library history.
- 40% of books missing ISBN data
- Inconsistent author naming ("JK Rowling" vs "J.K. Rowling" vs "Rowling, J.K.")
- No audit trail
- System crashes

### 1.2 Quantified Pain Points

#### For Library Staff (3 Full-Time)

- Data Entry Fatigue: Every new book requires manual typing into an Excel sheet.
- Reporting Paralysis: Creating a monthly report requires "Manual Tallying."
- Manual Penalty Tracking: Fines are calculated manually using a calendar and calculator for every return.

#### For Students (4,800 Users)

- Struggle to find books they'd enjoy
- Frequently find desired books checked out
- Students say "library feels outdated"
- Students want to know whether the book they want is available or not

**Impact:** Low voluntary borrowing (only 28% use library monthly)

#### For Administration

**Current Data Available:**

- Gross Inventory: A simple total of books owned (often inaccurate due to untracked losses).
- Manual Ledger: A physical record of daily checkouts that is difficult to analyze for trends.

**Desired Data:**

- Which books are never borrowed (dead stock)
- What should we buy next year
- Is the library budget justified
- How does usage correlate with academic performance

> "Every department wants more budget. Library can't show why they deserve it more than lab equipment."

---

## 2. PROPOSED SOLUTION

### 2.1 What is NEXUS?

NEXUS (Network for Educational eXchange and Universal Systems) is a **mobile-first, AI-powered library management system** built specifically for our school's context - designed by a student, for students and staff.

**Three-Pillar Transformation:**

#### Pillar 1: EFFICIENCY (For Staff)

**ISBN Auto-Fetch System**

- Scan book barcode → System retrieves all metadata from Google Books API
- Auto-populates: Title, Authors, Publisher, Description, Cover Image, Categories
- Time: 5 minutes → 1 minute
- Bulk import: Process 50 books in one operation

**Automated Workflows**

- Due date reminders (sent automatically 2 days before)
- Overdue notices (daily, no manual calling)
- Fine calculations (automatic on return)
- Reservation notifications (instant when book available)

#### Pillar 2: EXPERIENCE (For Users)

**Netflix-Style Discovery**

- Personalized homepage: "Because you borrowed Harry Potter..."
- "Trending in Grade 10" section
- Visual browsing with book covers
- Smart search (handles typos: "Hary Poter" → "Harry Potter")

**Mobile PWA (Progressive Web App)**

- Install on phone like Instagram
- Works offline (view current loans during internet outages)
- Push notifications ("Your reserved book is ready!")
- QR code library card

**Gamification**

- Reading streaks: "🔥 12-day streak! Don't break it!"
- Achievement badges: "Explorer: borrowed from 5 genres"
- Grade-level leaderboards (opt-in, privacy-protected)

**Reservation System**

- Join waitlist for checked-out books
- Automatic notification when available
- 24-hour claim window (fair, automated)

**The Nexus Digital Vault**

- **All-in-One Repository:** Centralized access to freely available Ministry of Education textbooks and past papers.
- **Zero-Cost Learning:** Students can view or download materials directly to their devices, reducing the need for expensive printing or heavy physical books.
- **Searchable Archives:** Filter papers by Year, Grade, and Subject in seconds.

**Result:** Library becomes daily habit.

#### Pillar 3: INTELLIGENCE (For Administration)

**Dead Stock Dashboard**

- "3,980 books (47%) haven't been borrowed in 12+ months"
- "Estimated waste: Rs. 597,000"
- "Recommend weeding 2,500 books for donation"
- **Action: Reallocate budget to high-demand categories**

**Acquisition Intelligence**

- "Top 10 books requested by students not in collection"
- "Grade 10 searched 'Climate Change' 89 times, we have 1 book"
- "Science genre 15% below optimal allocation"
- **Action: Data-driven purchasing decisions**

**Predictive Analytics**

- Forecast demand by genre/month (machine learning)
- "Fiction demand drops 40% in May (exam month) - delay purchases until June"
- Peak circulation times (optimize staffing)
- Popular vs. unpopular categories (budget reallocation)

**Result:** Every rupee justified with data.

### 2.2 Why NEXUS vs. Commercial Systems?

|Feature|Commercial Systems (Koha, Destiny)|NEXUS|
|---|---|---|
|**Initial Cost**|Rs. 200,000-500,000|Rs. 0 (student-led)|
|**Annual License**|Rs. 30,000-80,000|Rs. 0|
|**Hosting**|Rs. 50,000-100,000|Rs. 5,000|
|**Customization**|Limited/Extra Cost|Unlimited|
|**Mobile Experience**|Desktop-first (poor mobile)|Mobile-first (PWA)|
|**Local Context**|Generic (US/UK-focused)|Built for Sri Lankan schools|
|**Gamification**|None|Full system|
|**Predictive Analytics**|Basic reports only|ML-powered insights|
|**Data Ownership**|Vendor-controlled|School-owned|
|**Future LMS**|New purchase required|Built-in roadmap|

**Key Differentiator:** NEXUS is designed by Gen Z for Gen Z - mobile-first, social, gamified, and built specifically for our school's needs.

### 2.3 The Nexus Digital Vault: Bridging the Resource Gap

Current physical libraries are limited by their four walls. NEXUS breaks this boundary by integrating a **Digital Learning Resource Center (DLRC)**.

- **Content:** Government-issued textbooks, past papers (O/L & A/L), and school-specific monthly test papers.
- **Accessibility:** 24/7 availability. Even if the physical library is closed, the "Digital Vault" is open.

**2.3.1 Content Legitimacy & Intellectual Property**

To ensure Project NEXUS operates within the legal framework of Sri Lanka's **Intellectual Property Act, No. 36 of 2003**, the following protocols will be observed:

- **Government Resources:** Textbooks will be sourced exclusively from the **Educational Publications Department** (official portals like _e-thaksalawa_). Since these are provided for free for student use, we will include clear attribution to the Ministry of Education.
- **Past Papers:** National Exam papers (O/L & A/L) are public records, but we will seek a formal "No Objection" letter from the **Department of Examinations** via the School Principal to host them locally for faster student access.
- **School-Generated Content:** Internal term test papers and teacher handouts will only be uploaded after the respective **Head of Department (HoD)** provides written/digital clearance.
- **DMCA/Copyright Policy:** The system will include a "Report Content" feature, allowing copyright holders to flag any material for immediate review or removal.

---

## 3. TECHNICAL ARCHITECTURE

### 3.1 Technology Stack (Industry-Standard)

**Backend:**

- NestJS (Node.js framework) + TypeScript
- Why: Enterprise-grade, used by Fortune 500 companies

**Database:**

- PostgreSQL (Industry standard)
- Why: ACID compliance, scalability, JSON support
- Design: Inspired by Koha Library System (10,000+ libraries worldwide)

**Frontend:**

- Next.js (React framework) + Tailwind CSS
- Why: Fast, SEO-friendly, mobile-optimized

**Caching:**

- Redis (In-memory data store)
- Why: Lightning-fast searches (<50ms response time)

**Infrastructure:**

- Cloud hosting (99.9% uptime guarantee)
- Automatic backups (daily, 30-day retention)
- SSL encryption (industry-standard security)
- **Storage:** Google Cloud Storage or AWS S3
- **Optimization:** PDF compression and CDN (Content Delivery Network) for fast loading

### 3.2 Database Design: Record vs. Item Model

```
Book Record (The "Concept")
├─ Title: "Harry Potter and the Philosopher's Stone"
├─ Author: J.K. Rowling
├─ ISBN: 978-0-7475-3269-9
├─ Dewey Decimal: 823.914
│
└─ Physical Items (Individual Copies)
    ├─ Item #1: Barcode HP-001, Condition: Excellent, Shelf A3
    ├─ Item #2: Barcode HP-002, Condition: Good, Shelf A3
    └─ Item #3: Barcode HP-003, Condition: Damaged, Repair Section
```

**Why This Matters:**

- Track 5 copies of same book independently
- Know exactly which copy is damaged/lost
- Detailed circulation history per physical item
- Industry best practice (used by British Library, Library of Congress)

### 3.3 Security & Privacy

**Data Protection:**

- Passwords: bcrypt encryption (industry standard)
- Database: SSL/TLS encryption in transit
- Role-based access control (Student ≠ Librarian ≠ Admin)
- Audit logging: Every action tracked (who, what, when)

---

**Privacy Compliance:**

- Student data: Minimal collection (only library-related)
- Parental consent: For students under 13
- Data retention: Deleted 1 year after graduation (Upon a student leaving the school or graduating, their personal identifiable information (PII) is purged, leaving only anonymized transaction data for historical analytics.)
- Analytics: Anonymized, aggregated only

---

**Backup & Recovery:**

- Automated daily backups
- 30-day retention
- Point-in-time recovery (restore to any moment)
- Monthly restore testing (verify backup integrity)

### 3.4 Performance Specifications

**Designed for 5,300+ Users:**

- Response time: <500ms for 95% of requests
- Search results: <50ms
- Concurrent users: 500+ without lag
- Uptime: 99.9% (43 minutes downtime/month max)

---

## 4. IMPLEMENTATION TIMELINE

### Phase 1: Foundation (Months 1-3)

**Month 1: Database & Core API**

- Week 1-2: Database schema design + approval
- Week 3-4: API foundation (CRUD operations)
- **Deliverable:** Functioning backend

**Month 2: Cataloging System**

- Week 5-6: Google Books API integration
- Week 7-8: Librarian interface + bulk import
- **Deliverable:** Librarian can catalog via ISBN auto-fetch

**Month 3: Circulation Management**

- Week 9-10: Check-out/Check-in workflows
- Week 11-12: Fine calculation + overdue tracking
- **Deliverable:** Complete circulation system

### Phase 2: User Experience (Months 4-6)

**Month 4: Student Interface**

- Week 13-14: Mobile PWA (search, browse, account)
- Week 15-16: Reservation queue system
- **Deliverable:** Student-facing app live

**Month 5: Automation**

- Week 17-18: Notification system (email/SMS)
- Week 19-20: Kiosk mode for self-service
- **Deliverable:** Automated workflows operational

**Month 6: Discovery Engine**

- Week 21-22: Recommendation algorithms
- Week 23-24: Gamification (streaks, badges)
- **Deliverable:** Personalized experience

### Phase 3: Intelligence Layer (Months 7-9)

**Month 7-8: Analytics Dashboard**

- Dead stock analysis
- Acquisition recommendations
- Usage pattern insights
- **Deliverable:** Data-driven decision tools

**Month 9: Polish & Testing**

- Beta testing (50 students + librarian)
- Bug fixes, performance optimization
- User documentation
- **Deliverable:** Production-ready system

### Phase 4: Deployment (Months 10-12)

**Month 10: Training & Migration**

- Week 37-38: Librarian training (8 hours total)
- Week 39-40: Data migration (import existing records)
- **Deliverable:** Staff ready, data migrated

**Month 11: Soft Launch**

- Week 41-42: Grade 10 pilot (300 students)
- Week 43-44: Expand to other grades
- **Deliverable:** 2,000 users onboarded

**Month 12: Full Launch**

- Week 45: School-wide rollout (all grades)
- Week 46-48: Support, optimization, celebration
- **Deliverable:** System live for 5,300 users

---

## 5. BUDGET & COST-BENEFIT ANALYSIS

### 5.1 Total Cost of Ownership (Year 1)

|Category|Cost|Notes|
|---|---|---|
|**Development**|Rs. 0|Student-led initiative by **S.C. Roshana**|
|**Cloud Hosting**|Rs. 5,000|Google Cloud Platform|
|**Domain & SSL**|Rs. 5,000|Annual registration|
|**Workstation PC (1 Unit)**|Rs. 100,000|Core i5 / 8GB RAM / SSD (Reliable unit for the main desk)|
|**Barcode Scanners (2 units)**|Rs. 40,000|USB scanners for cataloging|
|**Internet**|Rs. 60,000|Rs. 5,000/month|
|**Contingency (20%)**|Rs. 50,000|Buffer for unexpected costs|
|**TOTAL YEAR 1**|**Rs. 260,000**||

**Recurring Annual Cost (Year 2+):** Rs. 70,000  
(Includes Hosting, Domain, and Internet only)

### 5.2 The Strategic Advantage

Unlike expensive commercial platforms, NEXUS offers unique long-term value for the school:

- **School-Specific Customization:** Unlike generic "one-size-fits-all" software, NEXUS is built specifically for the workflows of our library and our students.
- **Full Data & Code Ownership:** The school owns the source code. There is no "Vendor Lock-in," meaning we never have to pay a third party to access our own data.
- **Unlimited Scalability:** We can add features (like the Digital Vault for PDFs) at any time without the "Extra Feature" fees charged by commercial companies.
- **Foundation for LMS Expansion:** While commercial systems require a separate purchase for a Learning Management System, NEXUS is built to evolve into a full school platform.
- **Student Learning Opportunity:** This project provides a "live lab" to learn software engineering, database management, and digital literacy.
- **School Prestige:** Launching a custom, student-built system positions C.W.W. Kannangara Central College as a leading technology showcase in the province.

---

## 6. RISK MANAGEMENT

### 6.1 Risk Register

|Risk|Probability|Impact|Mitigation|
|---|---|---|---|
|**Technical Risks**||||
|Database performance issues|Low|High|PostgreSQL indexing, Redis caching, load testing|
|Data loss/corruption|Low|Critical|Daily backups, point-in-time recovery, monthly restore tests|
|Security breach|Medium|High|Industry-standard encryption, role-based access, regular audits|
|System downtime|Low|Medium|99.9% uptime SLA, failover mechanisms|
|**Adoption Risks**||||
|Librarian resistance|Low|High|8 hours training, parallel old+new system for 1 month|
|Low student adoption|Medium|Medium|Launch campaign, gamification, QR codes everywhere|
|Staff capability gaps|Low|Medium|Video tutorials, 24/7 support, developer on-call (first month)|
|**Project Risks**||||
|Timeline delay|Medium|Low|Phased delivery (working system at Month 3)|
|Developer unavailability|Low|Medium|Complete code documentation; teacher supervision provides continuity; junior students trained as backup|
|Copyright Infringement|Medium|Medium|Use only official government APIs/Links; require Teacher approval for internal uploads|

### 6.2 Contingency Plans

**If Developer Becomes Unavailable:**

- Complete code documentation (every function explained) ensures any developer can continue the work
- Teacher in charge (Mrs. Salika Senarathna) provides oversight and coordination
- Video walkthroughs of system architecture
- Junior students being trained as backup support
- All source code hosted on school-owned GitHub Organization account

**If Budget Exceeds Estimate:**

- Phase 2-3 features become Year 2 (core system in Year 1)
- Use free hosting tier initially (upgrade when needed)
- Seek sponsorship (local IT companies for CSR)

**If Adoption Lower Than Expected:**

- Mandatory training for all students (Grade 10+ first)
- Integration with curriculum (library assignments)
- Incentives (early adopters get priority for new books)

---

## 7. FUTURE ROADMAP

### 7.1 Year 2: Advanced Library Features

**Quarter 1-2:**

- Multi-language support (Sinhala, Tamil translations)
- AI-powered recommendations (deep learning models)
- E-book integration (PDF/EPUB reader)
- Parent portal (view child's reading activity)

**Quarter 3-4:**

- Inter-school book sharing network (regional collaboration)
- Author visit scheduling system
- Reading analytics (reading level assessment)
- Advanced social features (book clubs, challenges)

### 7.2 Year 3: LMS Foundation

**Assignment Management Module:**

- Teachers create and distribute assignments
- Students submit work digitally
- Auto-grading for MCQs
- Plagiarism detection

**Grading & Assessment:**

- Digital gradebook (all subjects)
- Report card generation
- Parent access to real-time grades
- Trend analysis

### 7.3 Year 4+: Full School Management Platform

**Complete Ecosystem:**

- Attendance tracking
- Timetable management
- School-wide calendar
- Sports & extracurricular management
- Alumni portal
- Fee management

**Commercialization:**

- License to other schools (Rs. 50,000-100,000/school/year)
- First Sinhala/Tamil-native LMS in Sri Lanka
- Potential Ministry of Education partnership

**This positions our school as a technology leader in Sri Lankan education.**

---

## 8. STAKEHOLDER BENEFITS

### 8.1 For Students

**Immediate:**

- 24/7 mobile access to library catalog
- No more lunch rush queues
- Personalized book recommendations
- Reserve books, get notified when available
- Track reading history and achievements
- **Exam Readiness:** Access to 10 years of past papers and marking schemes from any smartphone, anywhere.

**Long-term:**

- Better reading culture (gamification makes it fun)
- Improved literacy (easier access = more reading)
- Digital literacy (using modern web apps)
- Pride in school's innovation

### 8.2 For Library Staff

**Immediate:**

- 98% faster cataloging (5 min → 1 min)
- Zero manual overdue calls (automated)
- No more queue stress
- Data-driven decisions (dead stock reports)

**Long-term:**

- Meaningful work (curation, student consultations vs. data entry)
- Professional development (learn modern library tech)
- Job satisfaction (less tedium, more impact)
- Recognition (showcase system to librarian community)

### 8.3 For Teachers

**Immediate:**

- Reserve books for class readings (one-click)
- See reading analytics by class (anonymized)
- Request new books (tracked, prioritized)

**Long-term:**

- LMS integration (assignments, grading - Year 3)
- Better curriculum planning (know book availability)
- Student engagement data (correlate reading with performance)

### 8.4 For Administration

**Immediate:**

- Budget justification (data-driven decisions)
- ROI tracking (prove library value)
- Dead stock visibility
- Operational efficiency (staff time saved)

**Long-term:**

- Technology leadership (prestige for school)
- Foundation for digital transformation (LMS roadmap)
- Cost savings (avoid commercial LMS fees)

### 8.5 For Parents

**Immediate:**

- Visibility into child's reading habits
- Confidence in school's technology investment
- Reduced library fines (automated reminders)

**Long-term:**

- Future portal access (grades, attendance - Year 3)
- Improved academic outcomes (better literacy)

---

## 9. RESOURCE REQUIREMENTS

### 9.1 From School Administration

**Approvals:**

- Permission to develop and deploy system
- Budget approval (Rs. 260,000 Year 1)
- Access to student database (for account creation)
- Authorization to purchase hardware (scanners, Workstation PC)
- Official appointment of Mrs. Salika Senarathna as Teacher in Charge

**Resources:**

- Current library data (Excel/handwritten records)
- Beta testers (50 volunteer students, Grade 10)
- School email/SMS system integration
- Assembly announcement slot (launch campaign)
- Dedicated workspace during development

**Support:**

- Librarian time: 3 hours/week consultation
- Training time: 8 hours total (4 sessions × 2 hours)
- Permission for posters, QR codes, promotional materials
- Teacher supervision and guidance (Mrs. Salika Senarathna)

### 9.2 From S.C. Roshana (Developer)

**Time Commitment:**

- Months 1-9: 30 hours/week (full development phase)
- Months 10-12: 20 hours/week (deployment, training, migration)
- Ongoing: 10 hours/week (maintenance and support)

**Responsibilities:**

- System architecture and database design
- Backend API development (NestJS)
- Frontend development (Next.js)
- Mobile PWA optimization
- UI/UX design and implementation
- Google Books API integration
- Analytics dashboard development
- Security implementation
- Testing and quality assurance
- User documentation and training materials
- Post-launch support

### 9.3 From Teacher in Charge (Mrs. Salika Senarathna)

**Supervision:**

- Weekly progress meetings
- Review and approve major design decisions
- Liaise between developer and administration
- Ensure project stays on schedule and meets requirements

**Support:**

- Facilitate communication with library staff
- Coordinate beta testing programs
- Oversee training sessions
- Provide educational guidance and mentorship

### 9.4 From Library Staff

**During Development:**

- Document current workflows (2 hours)
- Validate features weekly (30 min/week)
- Provide test data (sample records)

**During Deployment:**

- Training participation (8 hours total)
- Data migration assistance (verify imported records)
- Beta testing (use alongside old system for 2 weeks)

**Post-Launch:**

- Student support (first month)
- Ongoing feedback (bug reports, feature requests)
- Create tutorial videos (common tasks)

---

## 10. IMPLEMENTATION SUPPORT

### 10.1 Training Program

**Librarian Training (8 hours total):**

**Session 1 (2 hours): System Overview**

- NEXUS philosophy and features
- Hands-on: Login, navigation, dashboard

**Session 2 (2 hours): Cataloging Mastery**

- ISBN auto-fetch demo
- Bulk import from Excel
- Manual entry for edge cases
- Barcode label generation

**Session 3 (2 hours): Circulation Operations**

- Check-out/check-in workflows
- Fine management and waivers
- Damage tracking

**Session 4 (2 hours): Analytics & Reporting**

- Dead stock analysis
- Acquisition recommendations
- Usage reports
- Exporting data

**Materials Provided:**

- Video recordings of all sessions
- Written manual (50+ pages)
- Quick reference cards (laminated)
- 24/7 support contact

### 10.2 Student Onboarding

- Assembly presentation
- Hands-on demo stations (library entrance)
- Classroom visits (10 min per class)
- Instagram/Facebook promotional posts
- Simplified tutorial videos

### 10.3 Support Infrastructure

**Post-Launch Support:**

- Developer on-call: 24/7 (first month)
- Response time: <4 hours for critical issues
- Bug fixes: <48 hours deployment
- Feature requests: Tracked, prioritized, quarterly releases

**Help Resources:**

- Video tutorial library (20+ videos)
- Searchable knowledge base (FAQ)
- In-app help tooltips
- Email support: cinderax@icloud.com

---

## 11. SUCCESS STORIES (PROJECTED)

### 11.1 Librarian (6 months post-launch)

> "Before NEXUS, I spent 6 hours daily on paperwork and checkout queues. The system now handles 80% of transactions automatically. Last month, I started a Grade 8 book club—something I never had time for before. A student who never borrowed books voluntarily asked for a recommendation. That never happened when I was buried in manual tasks. NEXUS gave me my job back."
> 
> **— Head Librarian**

### 11.2 Student (3 months post-launch)

> "I can check if a book is available from my phone during class break. If it's checked out, I join the queue and get a notification when it's my turn. No more wasting time. I've read 7 books this term—my personal record! The reading streak feature makes it competitive with my friends."
> 
> **— Grade 10 Student**

### 11.3 Principal (1 year post-launch)

> "The analytics dashboard revealed we were spending 40% of our budget on reference books that students never use. We reallocated funds to fiction and saw circulation triple. The system paid for itself in savings within 6 months. Student library engagement is at an all-time high, and parents are asking about our 'innovative library app' during school tours."
> 
> **— Principal (Projected)**

### 11.4 Teacher (9 months post-launch)

> "I can reserve 30 copies of a book for my class with one click, and the system notifies me when they're all available. Last year, I scrapped a planned novel study because the library only had 12 copies. This year, my entire class read 'To Kill a Mockingbird' together. The reading analytics show which students are keeping up—game changer."
> 
> **— English Teacher (Projected)**

---

## 12. DECISION REQUIRED

### 12.1 Approval Request

We respectfully request approval to:

1. **Proceed with Project NEXUS development** (12-month timeline)
2. **Allocate Rs. 260,000 budget** for Year 1 infrastructure and operations
3. **Officially appoint Mrs. Salika Senarathna** as Teacher in Charge
4. **Authorize S.C. Roshana** to lead the development effort
5. **Grant access** to student database for account creation
6. **Commit librarian time** (3 hours/week consultation during development)
7. Authorize a Student Data-Entry Task Force (5 students) to assist in digitizing the current library catalog and manual records
8. **Approve promotional activities** (assembly announcements, posters, QR codes)
9. **Administrative Liaison:** Assist in obtaining formal permission from the **Educational Publications Department**and **Department of Examinations** to aggregate their public links/PDFs into the school portal.

### 12.2 Timeline

- **Proposal Submission:** January 26, 2026
- **Decision Required By:** February 2, 2026 (1 week)
- **Project Start:** February 9, 2026 (upon approval)
- **Beta Launch:** November 2026 (Month 10)
- **Full Launch:** January 2027 (Month 12)

---

## 13. SUSTAINABILITY

To ensure the system remains operational for decades, Project NEXUS includes a built-in succession plan:

- **The Nexus Fellows:** Every year, S.C. Roshana will mentor three Grade 10-11 students as "Junior System Admins." They will be trained in the technical stack (Node.js/Postgres) to handle basic maintenance.
    
- **Knowledge Transfer:** Full documentation of every system component will be produced and kept up to date, enabling any trained developer to take over the project.
    
- **Open Documentation:** All source code will be hosted on a school-owned **GitHub Organization** account. Every line of code will be documented, and a "System Recovery Manual" will be provided in both digital and printed formats.
    
- **Teacher Oversight:** Mrs. Salika Senarathna will maintain institutional knowledge and continuity, ensuring smooth transitions as students graduate.
    
- **Escrow Protocol:** A master "Emergency Key" containing all passwords and recovery procedures will be stored in a sealed envelope in the Principal's safe.
    

---

## 14. CONCLUSION

Project NEXUS represents a transformational opportunity for C.W.W. Kannangara Central College - Mathugama. By transitioning from a manual, spreadsheet-based system to a modern digital infrastructure, the school will:

- **Modernize Library Operations:** Eliminate the daily burden of manual data entry, allowing library staff to focus on student guidance and literacy programs.
- **Enhance Student Access:** Provide a 24/7 digital gateway where students can discover books, access study materials, and engage with the library from any device.
- **Enable Data-Driven Decisions:** Replace guesswork with clear insights into which resources the students actually need and use.
- **Eliminate Resource Waste:** Identify stagnant sections of the collection and optimize the library's physical space and future growth.
- **Establish a Digital Foundation:** Create a scalable platform ready to support future school-wide Learning Management (LMS) features.

**This is more than a software upgrade. It is an investment in:**

- **Student Literacy:** Using modern technology and gamification to make reading a daily habit for the digital generation.
- **Operational Excellence:** Moving away from fragile Excel files toward a secure, professional, and high-performance system.
- **Educational Innovation:** Setting a benchmark for other schools by showcasing what is possible when school leadership supports student-led technology.
- **School Prestige:** Attracting prospective families by demonstrating a commitment to 21st-century educational tools.

**Most importantly:** Project NEXUS is a **student-led initiative**. It serves as a living testament to C.W.W. Kannangara Central College's commitment to nurturing student talent, fostering local innovation, and solving real-world challenges within our own community.

---

### Personal Note from S.C. Roshana

Dear Mrs. Senanayake,

As a student of C.W.W. Kannangara Central College, I have experienced firsthand the limitations of our current library system — from the uncertainty of book availability to the manual hurdles our fellow students face daily. Yet, I have also seen the dedication of our librarians, who strive to provide world-class service despite being restricted by outdated tools.

This proposal is not about technology for technology's sake. It is about empowering our staff to do what they do best: connecting students with knowledge by removing the burden of manual data entry. It is about giving our fellow students a modern, accessible, and engaging platform that makes reading a first choice, not a chore. Finally, it is about providing you and the school administration with clear, actionable data to ensure every rupee spent on our library is a wise investment.

Under the guidance of Mrs. Salika Senarathna, I am committed to developing Project NEXUS with the same level of care, security, and quality expected of a professional product. I believe our college deserves a library system that reflects the excellence of its students and the vision of its leadership.

Thank you for your time and for considering this contribution to our school's digital future.

Respectfully,

**S.C. Roshana (Chamila Roshana)**

**Supervised by:**  
**Mrs. Salika Senarathna** - Teacher in Charge

**Contact:**  
+94 750 604 820  
cinderax@icloud.com

---

**"Empowering Readers, Digitizing Dreams."**  
**S.C. Roshana | Cinderax**  
+94 750 604 820 | cinderax@icloud.com  
_Built with heart for C.W.W. Kannangara Central College._

**Project NEXUS © 2026**

---