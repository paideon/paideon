**Version:** 1.0  
**Date:** January 27, 2026  
**Project:** NEXUS Library Management System  
**School:** C.W.W. Kannangara Central College - Mathugama

---

## Document Control

|Version|Date|Author|Changes|
|---|---|---|---|
|1.0|2026-01-27|S.C. Roshana|Initial requirements document|
|1.1|2026-02-24|S.C. Roshana|Updated architecture diagram (added Redis, monorepo structure), updated compatibility table (Next.js 15, Nx, pnpm, Prisma, Redis), expanded security requirements|

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [System Overview](#2-system-overview)
3. [User Roles & Permissions](#3-user-roles--permissions)
4. [Functional Requirements](#4-functional-requirements)
5. [User Stories](#5-user-stories)
6. [Business Rules](#6-business-rules)
7. [Data Requirements](#7-data-requirements)
8. [Integration Requirements](#8-integration-requirements)
9. [Reporting Requirements](#9-reporting-requirements)
10. [Non-Functional Requirements](#10-non-functional-requirements)

---

## 1. Introduction

### 1.1 Purpose

This document specifies the functional requirements for the NEXUS Library Management System, designed to replace the current manual Excel-based system at C.W.W. Kannangara Central College.

### 1.2 Scope

NEXUS will serve:

- **4,198 Students** (Grades 1-13)
- **188 Academy Staff** (Teachers)
- **77 Non-Academy Staff** (Administrative)
- **5 Librarians**
- **1 System Administrator**

### 1.3 Objectives

- Automate library operations (cataloging, circulation, fines)
- Provide 24/7 mobile access to library resources
- Enable data-driven decision making
- Increase student engagement through gamification
- Reduce manual workload by 80%

### 1.4 Definitions

|Term|Definition|
|---|---|
|**Accession Number**|Unique identifier assigned to each physical book copy|
|**ISBN**|International Standard Book Number (10 or 13 digits)|
|**Loan Period**|Duration a book can be borrowed (14 days default)|
|**Dead Stock**|Books not borrowed in 12+ months|
|**PWA**|Progressive Web App (installable mobile web application)|
|**QR Code**|Quick Response code for library card|
|**Reservation Queue**|Waitlist for checked-out books|

---

## 2. System Overview

### 2.1 System Architecture

```
┌──────────────────────────────────────────────────────┐
│              User Interfaces (PWA)                   │
│        apps/web  →  Next.js 15 + Tailwind CSS        │
├──────────────────────────────────────────────────────┤
│  Student   │  Teacher  │  Librarian  │  Admin        │
└───────────────────────┬──────────────────────────────┘
                        │ HTTPS / WebSocket
                        ▼
              ┌──────────────────────┐
              │      API Layer        │
              │  apps/api  →  NestJS  │
              │  JWT Auth + RBAC      │
              └──────────────────────┘
                        │
          ┌─────────────┼──────────────┐
          ▼             ▼              ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────────┐
│  PostgreSQL  │ │    Redis      │ │  External APIs   │
│  (Primary DB)│ │  (Cache +     │ │  - Google Books  │
│  via Prisma  │ │   Sessions)   │ │  - Email SMTP    │
└──────────────┘ └──────────────┘ │  - SMS Gateway   │
                                  │  - Cloud Storage  │
                                  └──────────────────┘

Shared packages (packages/):
  @nexus/database  →  Prisma schema + client (used by api)
  @nexus/types     →  Shared TypeScript types (used by api + web)
  @nexus/ui        →  Shared React components (used by web)
```

### 2.2 Core Modules

|Module|Description|
|---|---|
|**User Management**|Authentication, authorization, profile management|
|**Catalog Management**|Book CRUD, ISBN auto-fetch, search|
|**Circulation**|Check-out, check-in, renewals|
|**Reservations**|Queue management, notifications|
|**Fines & Penalties**|Automated calculation, payment tracking|
|**Digital Vault**|Textbooks, past papers repository|
|**Analytics**|Usage reports, dead stock analysis|
|**Gamification**|Badges, streaks, leaderboards|
|**Notifications**|Email, SMS, push notifications|

---

## 3. User Roles & Permissions

### 3.1 Role Hierarchy

```
┌──────────────┐
│  ADMIN       │ (Full system access)
└──────┬───────┘
       │
┌──────▼───────┐
│  LIBRARIAN   │ (Operational management)
└──────┬───────┘
       │
┌──────▼───────┬──────────────┐
│  TEACHER     │  STAFF       │ (Extended borrowing privileges)
└──────┬───────┴──────────────┘
       │
┌──────▼───────┐
│  STUDENT     │ (Standard library user)
└──────────────┘
```

### 3.2 Permissions Matrix

|Feature|Student|Teacher|Staff|Librarian|Admin|
|---|---|---|---|---|---|
|**Books**||||||
|Browse catalog|✅|✅|✅|✅|✅|
|View book details|✅|✅|✅|✅|✅|
|Search books|✅|✅|✅|✅|✅|
|Add new books|❌|❌|❌|✅|✅|
|Edit book details|❌|❌|❌|✅|✅|
|Delete books|❌|❌|❌|❌|✅|
|ISBN auto-fetch|❌|❌|❌|✅|✅|
|Bulk import|❌|❌|❌|✅|✅|
|**Circulation**||||||
|Check-out (self)|❌|❌|❌|✅|✅|
|Check-in (self)|❌|❌|❌|✅|✅|
|Renew books|✅|✅|✅|✅|✅|
|View loan history|✅ (own)|✅ (own)|✅ (own)|✅ (all)|✅ (all)|
|**Reservations**||||||
|Create reservation|✅|✅|✅|✅|✅|
|Cancel reservation|✅ (own)|✅ (own)|✅ (own)|✅ (all)|✅ (all)|
|View queue position|✅|✅|✅|✅|✅|
|**Fines**||||||
|View own fines|✅|✅|✅|✅|✅|
|Pay fines|✅|✅|✅|✅|✅|
|Waive fines|❌|❌|❌|❌|✅|
|View all fines|❌|❌|❌|✅|✅|
|**Digital Vault**||||||
|View resources|✅|✅|✅|✅|✅|
|Download resources|✅|✅|✅|✅|✅|
|Upload resources|❌|❌|❌|✅|✅|
|Delete resources|❌|❌|❌|❌|✅|
|**Analytics**||||||
|View personal stats|✅|✅|✅|✅|✅|
|View library stats|❌|❌|❌|✅|✅|
|Generate reports|❌|❌|❌|✅|✅|
|Dead stock analysis|❌|❌|❌|✅|✅|
|**Gamification**||||||
|View leaderboard|✅|✅|✅|✅|✅|
|Opt-in/out leaderboard|✅|✅|✅|✅|✅|
|View badges|✅|✅|✅|✅|✅|
|**User Management**||||||
|Edit own profile|✅|✅|✅|✅|✅|
|View other profiles|❌|❌|❌|✅|✅|
|Create users|❌|❌|❌|❌|✅|
|Suspend users|❌|❌|❌|❌|✅|
|Assign roles|❌|❌|❌|❌|✅|
|**System**||||||
|View system logs|❌|❌|❌|❌|✅|
|Modify system config|❌|❌|❌|❌|✅|
|Backup database|❌|❌|❌|❌|✅|

---

## 4. Functional Requirements

### 4.1 User Management Module

#### FR-UM-001: User Registration

**Priority:** HIGH  
**Description:** System shall allow new user registration with email verification.

**Acceptance Criteria:**

- User can register with email, password, first name, last name
- Students must provide admission number and grade
- Teachers/staff must provide employee ID
- Email verification required before first login
- Automatic library card number generation
- QR code generation for library card
- Password must meet security criteria (8+ chars, uppercase, lowercase, number)

**Validation Rules:**

- Email must be unique
- Admission number must be unique (students)
- Employee ID must be unique (staff)
- Grade must be between 1-13 (students)

---

#### FR-UM-002: User Login

**Priority:** HIGH  
**Description:** System shall authenticate users and provide JWT token.

**Acceptance Criteria:**

- Login with email and password
- Return JWT token valid for 7 days
- Track last login timestamp
- Block login for suspended accounts
- Show error for inactive accounts
- Support "Remember Me" functionality

**Security:**

- Password hashing with bcrypt (10 rounds)
- Rate limiting: 5 failed attempts = 15-minute lockout
- Session management with JWT

---

#### FR-UM-003: Profile Management

**Priority:** MEDIUM  
**Description:** Users can view and edit their profile information.

**Acceptance Criteria:**

- View full profile details
- Edit contact information (phone, address)
- Change password (requires old password)
- Upload profile picture (max 2MB)
- View library card with QR code
- Download library card as PDF/PNG

---

#### FR-UM-004: Password Reset

**Priority:** MEDIUM  
**Description:** Users can reset forgotten passwords via email.

**Acceptance Criteria:**

- Request password reset via email
- Receive reset link valid for 1 hour
- Create new password
- Invalidate old tokens after successful reset
- Send confirmation email after reset

---

### 4.2 Catalog Management Module

#### FR-CM-001: Add Book Manually

**Priority:** HIGH  
**Description:** Librarians can manually add books to the catalog.

**Acceptance Criteria:**

- Enter book details: title, authors, ISBN, publisher, etc.
- Upload book cover image (optional)
- Assign accession number (auto-generated)
- Generate barcode (auto-generated)
- Set physical location (shelf/rack)
- Set purchase details (date, price, vendor)
- Set number of copies
- Save and view confirmation

**Mandatory Fields:**

- Title
- Authors (at least one)
- Accession number
- Location
- Status
- Condition

---

#### FR-CM-002: ISBN Auto-Fetch

**Priority:** HIGH  
**Description:** System shall fetch book metadata from Google Books API using ISBN.

**Acceptance Criteria:**

- Enter ISBN-10 or ISBN-13
- System queries Google Books API
- Auto-populate: title, authors, publisher, description, cover image, page count, categories
- Display preview before saving
- Allow manual override of auto-fetched data
- Handle cases where ISBN not found
- Cache API responses for 24 hours

**Performance:**

- API response time < 2 seconds
- Show loading indicator during fetch
- Fallback to manual entry if API fails

---

#### FR-CM-003: Bulk Import Books

**Priority:** MEDIUM  
**Description:** Librarians can import multiple books via CSV file.

**Acceptance Criteria:**

- Upload CSV file (max 10MB)
- CSV format: ISBN, Title, Authors, Publisher, Copies, Location, Price
- Validate all rows before import
- Show preview with error highlighting
- Process valid rows, skip invalid ones
- Generate import report (success/failure count)
- Auto-fetch missing metadata via ISBN
- Create accession numbers automatically

**CSV Validation:**

- Required fields must not be empty
- ISBN format validation
- Duplicate ISBN detection
- Invalid data type detection

---

#### FR-CM-004: Search Books

**Priority:** HIGH  
**Description:** Users can search for books using multiple criteria.

**Acceptance Criteria:**

- **Quick Search:** Single search box for title/author/ISBN
- **Advanced Search:** Filter by:
    - Title (partial match)
    - Author (partial match)
    - ISBN (exact match)
    - Category/Genre
    - Publisher
    - Publication year range
    - Availability status
    - Location
- **Search Features:**
    - Fuzzy matching ("Hary Poter" → "Harry Potter")
    - Auto-complete suggestions
    - Search history (last 10 searches)
    - Sort by: relevance, title, author, newest, most popular
- **Pagination:** 20 results per page
- **Results Display:** Book card with cover, title, author, availability

**Performance:**

- Search results < 500ms
- Full-text search enabled
- Index on frequently searched fields

---

#### FR-CM-005: View Book Details

**Priority:** HIGH  
**Description:** Users can view comprehensive book information.

**Acceptance Criteria:**

- Display all book metadata
- Show cover image (large)
- Availability status (Available/Checked Out/Reserved)
- Number of copies available
- Current location (shelf)
- Average rating (if reviewed)
- User reviews
- "Similar Books" recommendations
- Borrowing history statistics
- Check-out/Reserve buttons (based on availability)

---

#### FR-CM-006: Edit Book Details

**Priority:** MEDIUM  
**Description:** Librarians can update book information.

**Acceptance Criteria:**

- Edit all book fields
- Update cover image
- Modify number of copies
- Change location
- Update condition status
- Track modification history (who, when, what changed)
- Require confirmation for critical changes

---

#### FR-CM-007: Delete Book

**Priority:** LOW  
**Description:** Admins can delete books from the catalog.

**Acceptance Criteria:**

- Soft delete (mark as withdrawn)
- Cannot delete if book has active loans
- Require confirmation with password
- Archive book data (not permanent deletion)
- Log deletion action with reason

---

#### FR-CM-008: Book Categories Management

**Priority:** MEDIUM  
**Description:** System shall maintain book categorization.

**Acceptance Criteria:**

- Predefined categories: Fiction, Non-Fiction, Science, History, Biography, etc.
- Books can have multiple categories
- Filter/browse by category
- Display category statistics (book count)
- Admin can add/edit categories

---

### 4.3 Circulation Module

#### FR-CR-001: Check-Out Book

**Priority:** HIGH  
**Description:** Librarians can check out books to users.

**Acceptance Criteria:**

- Scan/enter user library card number
- Scan/enter book barcode
- Display user info and loan limits
- Display book details
- Check eligibility:
    - User has not exceeded loan limit
    - User has no overdue books
    - User has no unpaid fines > Rs. 100
    - Book is available
- Set due date (14 days from checkout)
- Record checkout condition
- Print/email receipt
- Update book availability instantly

**Loan Limits:**

- Students: 3 books maximum
- Teachers: 10 books maximum
- Staff: 5 books maximum

**Business Rules:**

- Cannot check out if more than Rs. 100 in unpaid fines
- Cannot check out same book twice
- Automatic due date calculation

---

#### FR-CR-002: Check-In Book

**Priority:** HIGH  
**Description:** Librarians can check in returned books.

**Acceptance Criteria:**

- Scan/enter book barcode
- Display loan details
- Record return date
- Record return condition
- Calculate overdue days (if any)
- Automatically calculate fines
- Update book availability
- Process reservation queue if applicable
- Send notification to next person in queue
- Print return receipt

**Overdue Fine Calculation:**

- Rs. 5 per day
- Maximum Rs. 500 per book
- Grace period: None
- Weekends/holidays counted

---

#### FR-CR-003: Renew Book

**Priority:** HIGH  
**Description:** Users can renew borrowed books.

**Acceptance Criteria:**

- Self-service renewal via mobile/web
- Renewal limits: 2 times maximum
- Cannot renew if:
    - Book is reserved by another user
    - Book is overdue
    - Maximum renewals reached
    - User has unpaid fines > Rs. 100
- Extend due date by 14 days from renewal date
- Send confirmation notification
- Update loan record

---

#### FR-CR-004: View Loan History

**Priority:** MEDIUM  
**Description:** Users can view their borrowing history.

**Acceptance Criteria:**

- Display all past loans
- Filter by: date range, status (returned/active)
- Sort by: checkout date, due date, title
- Show: book title, author, checkout date, due date, return date
- Export as CSV/PDF
- Pagination: 20 records per page

---

#### FR-CR-005: View Current Loans

**Priority:** HIGH  
**Description:** Users can view books they currently have borrowed.

**Acceptance Criteria:**

- Display all active loans
- Show: book cover, title, checkout date, due date, days remaining
- Color-code: green (5+ days), yellow (2-4 days), red (overdue)
- "Renew" button for eligible books
- Quick access to book details
- Total fine amount if overdue

---

### 4.4 Reservations Module

#### FR-RV-001: Create Reservation

**Priority:** HIGH  
**Description:** Users can reserve checked-out books.

**Acceptance Criteria:**

- Reserve book only if all copies are checked out
- Cannot reserve if book is available
- Maximum 5 active reservations per user
- Automatically join queue
- Display queue position
- Display estimated availability date
- Send confirmation notification
- Cannot reserve same book twice

**Queue Logic:**

- FIFO (First In, First Out)
- Position based on request timestamp
- Notify next person when book returned

---

#### FR-RV-002: Cancel Reservation

**Priority:** MEDIUM  
**Description:** Users can cancel their reservations.

**Acceptance Criteria:**

- View all active reservations
- Cancel any reservation
- Update queue positions for remaining users
- Send cancellation confirmation
- No penalty for cancellation

---

#### FR-RV-003: Reservation Notification

**Priority:** HIGH  
**Description:** System notifies users when reserved book is available.

**Acceptance Criteria:**

- Send notification when book is returned
- Notification channels: Email + SMS + Push
- 24-hour claim window
- Display expiry countdown
- If not claimed, move to next in queue
- Reminder notification 6 hours before expiry

---

#### FR-RV-004: Claim Reserved Book

**Priority:** HIGH  
**Description:** Users can claim books they reserved.

**Acceptance Criteria:**

- Librarian checks reservation status
- Verify user identity (library card)
- Check claim window (must be within 24 hours)
- If expired, deny claim and move to next user
- Check out book normally
- Mark reservation as claimed
- Update reservation history

---

### 4.5 Fines & Penalties Module

#### FR-FN-001: Automatic Fine Calculation

**Priority:** HIGH  
**Description:** System automatically calculates overdue fines.

**Acceptance Criteria:**

- Run daily at 12:01 AM
- Calculate fines for all overdue loans
- Formula: Days Overdue × Rs. 5.00
- Maximum fine: Rs. 500 per book
- Create fine records in database
- Send overdue notification
- Update user account

**Fine Types:**

- Overdue: Rs. 5/day
- Damaged: 50% of book price
- Lost: 100% of book price + Rs. 100 processing fee

---

#### FR-FN-002: View Fines

**Priority:** HIGH  
**Description:** Users can view their fine details.

**Acceptance Criteria:**

- Display all fines (pending, paid, waived)
- Show: book title, fine type, amount, days overdue, status
- Filter by status
- Sort by date, amount
- Total outstanding amount prominently displayed
- Payment history
- Download fine report (PDF)

---

#### FR-FN-003: Pay Fines

**Priority:** HIGH  
**Description:** Users can pay fines at library counter.

**Acceptance Criteria:**

- Librarian records payment
- Payment methods: Cash, Bank Transfer
- Generate receipt number
- Update fine status to "Paid"
- Record payment date and method
- Print/email receipt
- Allow partial payments
- Update user's total fine amount

---

#### FR-FN-004: Waive Fines

**Priority:** MEDIUM  
**Description:** Admins can waive fines for legitimate reasons.

**Acceptance Criteria:**

- Admin only permission
- Select fine to waive
- Enter waiver reason (mandatory)
- Require admin password confirmation
- Record who waived, when, and why
- Send notification to user
- Update fine status to "Waived"
- Generate waiver report

**Waiver Reasons:**

- System error
- First-time offender
- Special circumstances
- School closure
- Book lost by library

---

#### FR-FN-005: Fine Reminders

**Priority:** MEDIUM  
**Description:** System sends fine payment reminders.

**Acceptance Criteria:**

- Send reminder for fines > Rs. 100
- Reminder schedule:
    - 7 days after fine incurred
    - 14 days after fine incurred
    - Monthly thereafter
- Notification channels: Email + SMS
- Include payment instructions
- Highlight borrowing restrictions

---

### 4.6 Digital Vault Module

#### FR-DV-001: Browse Vault Resources

**Priority:** HIGH  
**Description:** Users can browse digital resources (textbooks, past papers).

**Acceptance Criteria:**

- Browse by: Type, Grade, Subject, Year
- Display resource cards with: title, type, grade, subject, file size
- Filter combinations (e.g., Grade 10 + Mathematics + 2024)
- Search by title
- Sort by: upload date, downloads, title
- Pagination: 30 resources per page

---

#### FR-DV-002: Download Resources

**Priority:** HIGH  
**Description:** Users can download vault resources.

**Acceptance Criteria:**

- One-click download
- Track download count
- Support file types: PDF, DOCX, ZIP
- Show file size before download
- Download history (personal)
- Offline access (PWA cache)
- No authentication required for public resources

---

#### FR-DV-003: Upload Resources

**Priority:** MEDIUM  
**Description:** Librarians can upload resources to vault.

**Acceptance Criteria:**

- Upload file (max 50MB)
- Enter metadata: title, description, type, grade, subject, year, medium
- Support bulk upload (ZIP)
- Auto-extract metadata from filename
- Preview before publishing
- Virus scan before upload
- Set public/private access

**Filename Convention:**

- Grade[X]_Subject_Year_Medium.pdf
- Example: Grade10_Mathematics_2024_English.pdf

---

#### FR-DV-004: Resource Statistics

**Priority:** LOW  
**Description:** Track resource usage analytics.

**Acceptance Criteria:**

- Most downloaded resources
- Downloads by grade/subject
- Popular search terms
- Download trends over time
- User engagement metrics

---

### 4.7 Analytics & Reporting Module

#### FR-AN-001: Dashboard Overview

**Priority:** HIGH  
**Description:** Display key library metrics on dashboard.

**Acceptance Criteria:**

- **Student Dashboard:**
    - Books currently borrowed
    - Upcoming due dates
    - Reading streak
    - Points and badges
    - Recommended books
- **Librarian Dashboard:**
    - Today's checkouts/check-ins
    - Overdue books count
    - Pending reservations
    - Unpaid fines total
    - Low stock alerts
    - Popular books this month
- **Admin Dashboard:**
    - All librarian metrics
    - User statistics
    - Financial summary
    - System health metrics
    - Dead stock analysis

---

#### FR-AN-002: Dead Stock Analysis

**Priority:** HIGH  
**Description:** Identify books not borrowed in 12+ months.

**Acceptance Criteria:**

- List all books with zero circulation in past 12 months
- Calculate total investment wasted
- Group by category
- Filter by location, purchase date
- Export as CSV/Excel
- Recommendations for withdrawal
- Visualize with charts

**Report Includes:**

- Book title, author, accession number
- Purchase date, purchase price
- Last borrowed date (if any)
- Total times borrowed
- Recommendation (Keep/Donate/Withdraw)

---

#### FR-AN-003: Acquisition Intelligence

**Priority:** HIGH  
**Description:** Recommend books to purchase based on demand.

**Acceptance Criteria:**

- Top requested books not in collection
- Most reserved books (high demand)
- Popular categories below optimal allocation
- Trending books from search data
- Budget allocation suggestions
- Export recommendation report
- Compare with current collection

**Metrics:**

- Request frequency
- Search frequency
- Reservation queue length
- Category deficit percentage

---

#### FR-AN-004: Usage Reports

**Priority:** MEDIUM  
**Description:** Generate various usage reports.

**Report Types:**

1. **Circulation Report**
    
    - Total checkouts/check-ins
    - Date range filter
    - Group by: grade, book category, user type
2. **User Activity Report**
    
    - Most active borrowers
    - Inactive users (no borrowing in X months)
    - New user signups
3. **Collection Report**
    
    - Total books by category
    - Average age of collection
    - Condition distribution
4. **Financial Report**
    
    - Fines collected
    - Outstanding fines
    - Payment methods breakdown

**Export Formats:**

- PDF (formatted)
- Excel (data)
- CSV (raw data)

---

#### FR-AN-005: Predictive Analytics

**Priority:** LOW  
**Description:** Forecast demand patterns using historical data.

**Acceptance Criteria:**

- Predict demand by month (e.g., fiction drops in May)
- Optimal restocking times
- Genre popularity trends
- Peak usage hours/days
- Seasonal patterns
- ML-based recommendations

---

### 4.8 Gamification Module

#### FR-GM-001: Reading Streaks

**Priority:** MEDIUM  
**Description:** Track consecutive days with active loans.

**Acceptance Criteria:**

- Count days with at least one active loan
- Display current streak and longest streak
- Fire emoji indicator (🔥)
- Streak breaks if no active loan for 24 hours
- Send "Don't break your streak" reminders
- Award points: 20 points per 7-day streak

---

#### FR-GM-002: Achievement Badges

**Priority:** MEDIUM  
**Description:** Award badges for milestones.

**Badge Definitions:**

|Badge|Criteria|Points|
|---|---|---|
|📚 **Explorer**|Borrowed from 5+ genres|100|
|⚡ **Speed Reader**|5 books in one month|150|
|🔥 **Loyal Reader**|30-day reading streak|200|
|⭐ **Reviewer**|Left 10+ reviews|100|
|🎯 **Genre Master**|10+ books in one genre|150|
|🏆 **Early Bird**|First to borrow 5 new releases|250|

**Acceptance Criteria:**

- Automatically detect achievements
- Send notification on badge unlock
- Display on profile
- Show progress toward next badge

---

#### FR-GM-003: Points System

**Priority:** MEDIUM  
**Description:** Award points for library activities.

**Point Awards:**

|Activity|Points|
|---|---|
|Borrow a book|10|
|Return on time|15|
|Write a review|5|
|7-day streak|20|
|Earn a badge|100|

**Acceptance Criteria:**

- Track total points
- Calculate level (Level = Points ÷ 100)
- Display on profile
- Points history/ledger
- Cannot lose points

---

#### FR-GM-004: Leaderboards

**Priority:** MEDIUM  
**Description:** Rank users by reading activity.

**Leaderboard Types:**

1. **Grade Leaderboard:** Top 10 in each grade
2. **School Leaderboard:** Top 50 overall
3. **Monthly Challenge:** Reset each month

**Acceptance Criteria:**

- Opt-in only (privacy-protected)
- Rank by points
- Display: rank, name (or anonymous), points, badges
- Update every 6 hours
- Filter by grade
- "My Rank" indicator

---

#### FR-GM-005: Recommendations Engine

**Priority:** LOW  
**Description:** Suggest books based on reading history.

**Recommendation Logic:**

- "Because you borrowed [Book]..." (similar genre/author)
- "Popular in Grade X"
- "Trending this month"
- Collaborative filtering (users who borrowed X also borrowed Y)
- Category-based suggestions

**Acceptance Criteria:**

- Display 5 personalized recommendations on home screen
- Update recommendations weekly
- Click to view book details

---

### 4.9 Notifications Module

#### FR-NT-001: Due Date Reminders

**Priority:** HIGH  
**Description:** Send reminders before books are due.

**Acceptance Criteria:**

- Send 2 days before due date
- Notification channels: Email + Push
- Include: book title, due date, renewal link
- Send at 8:00 AM user's local time
- Batch process (not individual)

---

#### FR-NT-002: Overdue Notices

**Priority:** HIGH  
**Description:** Send notices for overdue books.

**Acceptance Criteria:**

- Send day of overdue
- Send every 3 days thereafter
- Include: book title, days overdue, fine amount
- Escalation: Email → SMS after 7 days
- Stop after 30 days (refer to admin)

---

#### FR-NT-003: Reservation Notifications

**Priority:** HIGH  
**Description:** Notify users when reserved books are ready.

**Acceptance Criteria:**

- Instant notification when book returned
- Notification channels: Email + SMS + Push
- Include: book title, expiry time (24 hours), claim instructions
- Reminder 6 hours before expiry
- Cancellation notice if expired

---

#### FR-NT-004: New Book Alerts

**Priority:** LOW  
**Description:** Notify users about new additions matching their interests.

**Acceptance Criteria:**

- Weekly digest of new books
- Filter by user's favorite genres
- Include: book cover, title, author, description
- Opt-in/opt-out option
- Send every Friday at 5:00 PM

---

#### FR-NT-005: Achievement Notifications

**Priority:** MEDIUM  
**Description:** Notify users when they unlock badges or milestones.

**Acceptance Criteria:**

- Instant notification on achievement
- Notification channels: Email + Push + In-App
- Include: badge image, congratulatory message, points earned
- Share option (social media)

---

#### FR-NT-006: Notification Preferences

**Priority:** MEDIUM  
**Description:** Users can customize notification settings.

**Acceptance Criteria:**

- Enable/disable by type: Due reminders, Overdue, Reservations, Achievements, New books
- Choose channels: Email, SMS, Push
- Set quiet hours (no notifications during certain times)
- Test notification feature
- Apply changes immediately

---

### 4.10 System Administration Module

#### FR-AD-001: User Management

**Priority:** HIGH  
**Description:** Admins can manage user accounts.

**Acceptance Criteria:**

- View all users (searchable, filterable)
- Create new users (bulk import via CSV)
- Edit user details
- Change user roles
- Suspend/activate accounts
- Reset user passwords
- Delete users (soft delete)
- Export user list

---

#### FR-AD-002: System Configuration

**Priority:** HIGH  
**Description:** Configure system-wide settings.

**Configurable Settings:**

- Loan duration (days)
- Maximum loans per role
- Renewal limit
- Overdue fine rate (Rs./day)
- Maximum fine amount
- Reservation claim window (hours)
- Notification timing
- Gamification point values

**Acceptance Criteria:**

- Edit settings via admin panel
- Require password confirmation
- Log all changes
- Take effect immediately
- Validate inputs

---

#### FR-AD-003: Database Backup

**Priority:** HIGH  
**Description:** Admins can backup and restore database.

**Acceptance Criteria:**

- Manual backup on-demand
- Automated daily backup at 2:00 AM
- Store backups for 30 days
- Download backup file
- Restore from backup (with confirmation)
- Backup includes: database + uploaded files
- Encryption of backup files

---

#### FR-AD-004: Audit Logs

**Priority:** MEDIUM  
**Description:** Track all system actions for accountability.

**Logged Actions:**

- User login/logout
- Book added/edited/deleted
- Checkout/check-in
- Fine waived
- Settings changed
- User role changed

**Log Details:**

- Timestamp
- User who performed action
- Action type
- Resource affected (book ID, user ID)
- Old value → New value
- IP address

**Acceptance Criteria:**

- View logs (filterable, searchable)
- Export logs
- Retention: 1 year
- Cannot delete logs

---

#### FR-AD-005: System Health Monitoring

**Priority:** MEDIUM  
**Description:** Monitor system performance and health.

**Metrics:**

- Database size
- API response time
- Active users (current)
- Error rate
- Disk space usage
- Backup status
- Notification delivery rate

**Acceptance Criteria:**

- Real-time dashboard
- Alert on critical issues
- Weekly health report email

---

## 5. User Stories

### 5.1 Student User Stories

**US-001: As a student, I want to search for books on my phone so I can check availability before visiting the library.**

**Acceptance Criteria:**

- Given I am on the home screen
- When I enter a book title in the search bar
- Then I see matching books with availability status
- And I can filter by availability (Available only)

---

**US-002: As a student, I want to reserve a book that's checked out so I don't have to keep checking manually.**

**Acceptance Criteria:**

- Given a book is checked out
- When I click "Reserve"
- Then I join the queue and see my position
- And I receive a notification when it's my turn

---

**US-003: As a student, I want to see my reading streak so I feel motivated to keep reading.**

**Acceptance Criteria:**

- Given I have borrowed books consecutively
- When I view my profile
- Then I see my current streak with fire emoji
- And I see my longest streak record

---

**US-004: As a student, I want to renew my books online so I don't have to visit the library.**

**Acceptance Criteria:**

- Given I have an active loan
- When I click "Renew" on my loans page
- Then the due date extends by 14 days
- And I receive a confirmation notification

---

**US-005: As a student, I want to download past papers from the Digital Vault so I can study offline.**

**Acceptance Criteria:**

- Given I am on the Digital Vault page
- When I filter by Grade 10 > Mathematics > 2024
- Then I see all matching past papers
- And I can download them with one click

---

### 5.2 Teacher User Stories

**US-006: As a teacher, I want to reserve multiple copies of a book for my class so we can do a group reading activity.**

**Acceptance Criteria:**

- Given I am logged in as a teacher
- When I reserve a book and specify quantity (30)
- Then the system queues 30 copies
- And notifies me when all are available

---

**US-007: As a teacher, I want to see which students in my class are most active readers so I can recognize them.**

**Acceptance Criteria:**

- Given I am a class teacher
- When I view class analytics
- Then I see students ranked by books borrowed
- And I can export this list

---

### 5.3 Librarian User Stories

**US-008: As a librarian, I want to scan a book's ISBN and have all details auto-filled so I save time cataloging.**

**Acceptance Criteria:**

- Given I am adding a new book
- When I scan the ISBN barcode
- Then the system fetches data from Google Books
- And pre-fills title, author, description, cover image
- And I can edit before saving

---

**US-009: As a librarian, I want to see which books have never been borrowed so I can recommend removing them.**

**Acceptance Criteria:**

- Given I am on the analytics page
- When I click "Dead Stock Analysis"
- Then I see all books with zero loans in 12+ months
- And I see the total cost of dead stock

---

**US-010: As a librarian, I want the system to automatically calculate fines so I don't have to use a calculator.**

**Acceptance Criteria:**

- Given a book is returned late
- When I check it in
- Then the system displays the fine amount
- And creates a fine record automatically

---

**US-011: As a librarian, I want to get notified when a reserved book is returned so I can hold it for the next user.**

**Acceptance Criteria:**

- Given a book with active reservations is checked in
- When I process the return
- Then the system shows an alert "Hold for [User Name]"
- And sends notification to the user

---

### 5.4 Admin User Stories

**US-012: As an admin, I want to bulk import 500 student records from a CSV so I don't add them one by one.**

**Acceptance Criteria:**

- Given I have a CSV with student data
- When I upload it via the admin panel
- Then the system validates all rows
- And imports valid records with auto-generated passwords

---

**US-013: As an admin, I want to see monthly usage reports so I can justify the library budget.**

**Acceptance Criteria:**

- Given I am on the reports page
- When I select "Monthly Usage Report"
- Then I see checkouts, active users, fines collected
- And I can export as PDF for presentations

---

**US-014: As an admin, I want to change the late fine rate so I can adjust for inflation.**

**Acceptance Criteria:**

- Given I am in system settings
- When I update the fine rate from Rs. 5 to Rs. 10
- Then the change takes effect immediately
- And future fines use the new rate

---

## 6. Business Rules

### 6.1 Loan Rules

|Rule ID|Rule Description|
|---|---|
|BR-LN-001|Students can borrow maximum 3 books at once|
|BR-LN-002|Teachers can borrow maximum 10 books at once|
|BR-LN-003|Staff can borrow maximum 5 books at once|
|BR-LN-004|Default loan period is 14 days|
|BR-LN-005|Books can be renewed maximum 2 times|
|BR-LN-006|Cannot renew if book is reserved by another user|
|BR-LN-007|Cannot borrow if user has unpaid fines > Rs. 100|
|BR-LN-008|Cannot borrow if user has overdue books|
|BR-LN-009|Grace period for returns: None (due date is strict)|
|BR-LN-010|Reference books cannot be borrowed (in-library use only)|

---

### 6.2 Reservation Rules

|Rule ID|Rule Description|
|---|---|
|BR-RV-001|Can only reserve books that are fully checked out|
|BR-RV-002|Maximum 5 active reservations per user|
|BR-RV-003|Cannot reserve the same book twice|
|BR-RV-004|Reservation queue is FIFO (First In, First Out)|
|BR-RV-005|Claim window is 24 hours after notification|
|BR-RV-006|Unclaimed reservations automatically expire|
|BR-RV-007|Next in queue gets notified after expiry|

---

### 6.3 Fine Rules

|Rule ID|Rule Description|
|---|---|
|BR-FN-001|Overdue fine: Rs. 5.00 per day|
|BR-FN-002|Maximum fine per book: Rs. 500.00|
|BR-FN-003|Damaged book fine: 50% of purchase price|
|BR-FN-004|Lost book fine: 100% of purchase price + Rs. 100 processing fee|
|BR-FN-005|Fines are calculated automatically daily at 12:01 AM|
|BR-FN-006|Fines accumulate until book is returned|
|BR-FN-007|Partial payments are allowed|
|BR-FN-008|Fine waivers require admin approval and documented reason|
|BR-FN-009|Cannot borrow new books if outstanding fines > Rs. 100|
|BR-FN-010|Fines carry over across academic years|

---

### 6.4 User Account Rules

|Rule ID|Rule Description|
|---|---|
|BR-UA-001|Each user must have unique email address|
|BR-UA-002|Students must have unique admission number|
|BR-UA-003|Staff must have unique employee ID|
|BR-UA-004|Email verification required before first login|
|BR-UA-005|Password must be 8+ characters with uppercase, lowercase, number|
|BR-UA-006|Accounts auto-suspend if user has overdue books > 30 days|
|BR-UA-007|Graduated students' accounts change to "GRADUATED" status|
|BR-UA-008|Graduated students can still access Digital Vault (read-only)|
|BR-UA-009|Suspended accounts cannot login or borrow|

---

### 6.5 Book Catalog Rules

|Rule ID|Rule Description|
|---|---|
|BR-BC-001|Each book must have unique accession number|
|BR-BC-002|Accession numbers are auto-generated sequentially|
|BR-BC-003|Books marked "LOST" are not available for checkout|
|BR-BC-004|Books marked "DAMAGED" require admin approval to checkout|
|BR-BC-005|Withdrawn books are soft-deleted (archived)|
|BR-BC-006|Multiple copies of same book share ISBN but have unique barcodes|
|BR-BC-007|Books without ISBN can be cataloged manually|

---

### 6.6 Gamification Rules

|Rule ID|Rule Description|
|---|---|
|BR-GM-001|Reading streak requires at least 1 active loan per day|
|BR-GM-002|Streak breaks after 24 hours without active loan|
|BR-GM-003|Points are awarded automatically on qualifying action|
|BR-GM-004|Points cannot be lost or deducted|
|BR-GM-005|Level = Total Points ÷ 100 (rounded down)|
|BR-GM-006|Leaderboard is opt-in only (GDPR compliance)|
|BR-GM-007|Leaderboard updates every 6 hours|
|BR-GM-008|Badge achievements are permanent|

---

## 7. Data Requirements

### 7.1 Data Retention

|Data Type|Retention Period|Archive Strategy|
|---|---|---|
|User accounts|3 years after graduation|Soft delete, archive to cold storage|
|Loan records|Permanent|No deletion|
|Fine records|Permanent|No deletion|
|Audit logs|1 year|Compress and archive|
|Notifications|30 days|Auto-delete|
|Search history|90 days|Auto-delete|
|Book catalog|Permanent|Soft delete for withdrawn books|

---

### 7.2 Data Backup

|Backup Type|Frequency|Retention|Storage Location|
|---|---|---|---|
|Full database|Daily (2:00 AM)|30 days|AWS S3 / Local NAS|
|Incremental|Every 6 hours|7 days|Local disk|
|File uploads|Daily|30 days|AWS S3 / Local NAS|
|Config files|On change|90 days|Git repository|

---

### 7.3 Data Security

|Security Measure|Implementation|
|---|---|
|**Passwords**|Bcrypt hashing (10 rounds)|
|**JWT Tokens**|7-day expiry, secure signing|
|**API Keys**|Environment variables, not in code|
|**Database**|SSL/TLS encryption in transit, AES-256 at rest|
|**File Uploads**|Virus scanning, type validation|
|**Personal Data**|GDPR-compliant, opt-in for sharing|
|**Audit Logging**|All sensitive operations logged|

---

### 7.4 Data Privacy

|Data Category|Access Level|Sharing Policy|
|---|---|---|
|**User email**|Private|Not shared without consent|
|**Phone number**|Private|Not shared without consent|
|**Borrowing history**|Private|User + Librarian only|
|**Fines**|Private|User + Librarian + Admin only|
|**Leaderboard**|Opt-in|Public if opted in|
|**Reviews**|Public|Visible to all users|
|**Search queries**|Anonymous|Aggregated for analytics only|

---

## 8. Integration Requirements

### 8.1 Google Books API

**Purpose:** Fetch book metadata using ISBN

**Integration Details:**

- **Endpoint:** `https://www.googleapis.com/books/v1/volumes`
- **Authentication:** API Key
- **Rate Limit:** 1,000 requests/day (free tier)
- **Caching:** 24 hours for successful responses
- **Error Handling:** Fallback to manual entry if API fails

**Data Retrieved:**

- Title, subtitle
- Authors
- Publisher, publication date
- ISBN-10, ISBN-13
- Description
- Page count
- Categories
- Cover images (thumbnail, large)
- Language

---

### 8.2 Email Service (SMTP/SendGrid)

**Purpose:** Send notifications and alerts

**Integration Details:**

- **Provider:** SendGrid / SMTP (Gmail)
- **Authentication:** API Key / SMTP credentials
- **Rate Limit:** 100 emails/day (free tier)
- **Templates:** HTML email templates
- **Tracking:** Open rates, click rates

**Email Types:**

- Welcome email
- Password reset
- Due date reminders
- Overdue notices
- Reservation ready
- Achievement notifications

---

### 8.3 SMS Gateway (Sri Lanka)

**Purpose:** Send critical notifications via SMS

**Recommended Providers:**

- Dialog Ideamart
- SMS.lk
- TextIT

**Integration Details:**

- **Authentication:** API Key
- **Rate Limit:** Based on subscription
- **Character Limit:** 160 characters
- **Cost:** ~Rs. 0.50 per SMS

**SMS Types:**

- Reservation ready (critical)
- Overdue notices (7+ days)
- Password reset OTP

---

### 8.4 Payment Gateway (Future)

**Purpose:** Online fine payment

**Note:** Phase 2 implementation

**Recommended Providers:**

- PayHere (Sri Lanka)
- Stripe
- Razorpay

---

## 9. Reporting Requirements

### 9.1 Standard Reports

#### Report 1: Daily Activity Report

**Frequency:** Daily (auto-generated at 11:59 PM)

**Includes:**

- Total checkouts
- Total check-ins
- New reservations
- Fines collected
- New user registrations
- System errors/downtime

**Recipients:** Librarians, Admin

---

#### Report 2: Monthly Circulation Report

**Frequency:** Monthly (1st of each month)

**Includes:**

- Total books borrowed
- Most borrowed books (Top 20)
- Most active borrowers (Top 20)
- Category-wise circulation
- Average books per student
- Comparison with previous month

**Recipients:** Admin, Principal

---

#### Report 3: Dead Stock Report

**Frequency:** Quarterly

**Includes:**

- Books with zero circulation in 12+ months
- Total dead stock count and value
- Category breakdown
- Recommendations for withdrawal
- Space savings if withdrawn

**Recipients:** Admin, Principal, Finance

---

#### Report 4: Financial Report

**Frequency:** Monthly

**Includes:**

- Total fines issued
- Total fines collected
- Outstanding fines
- Payment method breakdown
- Waived fines (with reasons)
- Collection rate percentage

**Recipients:** Admin, Finance

---

#### Report 5: User Engagement Report

**Frequency:** Monthly

**Includes:**

- Total active users
- New user signups
- Inactive users (no borrowing in 60 days)
- Digital Vault usage
- Gamification participation rate
- App installation rate (PWA)

**Recipients:** Admin, Management

---

### 9.2 Custom Reports

Admins and Librarians can generate custom reports by:

- Selecting date range
- Choosing metrics
- Applying filters
- Exporting as PDF/Excel/CSV

---

## 10. Non-Functional Requirements

### 10.1 Performance Requirements

|Metric|Target|Measurement Method|
|---|---|---|
|**API Response Time**|< 200ms (p95)|Server-side logging|
|**Page Load Time**|< 2 seconds|Lighthouse audit|
|**Search Results**|< 500ms|Database query profiling|
|**Concurrent Users**|500+ simultaneous|Load testing|
|**Database Queries**|< 100ms (p95)|Query optimization|
|**File Upload**|< 5 seconds for 10MB|Progress tracking|

---

### 10.2 Scalability Requirements

|Requirement|Specification|
|---|---|
|**User Base**|Support up to 10,000 users|
|**Book Catalog**|Support up to 50,000 books|
|**Concurrent Loans**|Support up to 5,000 active loans|
|**Daily Transactions**|Support 1,000+ checkouts/day|
|**Storage**|100GB for files (covers, PDFs)|
|**Database Growth**|5GB/year estimated|

---

### 10.3 Availability Requirements

|Metric|Target|
|---|---|
|**Uptime**|99.5% (excluding maintenance)|
|**Maintenance Window**|Sundays 2:00 AM - 4:00 AM|
|**Recovery Time Objective (RTO)**|< 4 hours|
|**Recovery Point Objective (RPO)**|< 24 hours|
|**Backup Frequency**|Daily automated backups|

---

### 10.4 Security Requirements

|Requirement|Implementation|
|---|---|
|**Authentication**|JWT with 7-day expiry via @nestjs/jwt|
|**Password Policy**|Min 8 chars, uppercase, lowercase, number|
|**Password Hashing**|bcrypt (10 rounds)|
|**Data Encryption**|AES-256 at rest, TLS 1.3 in transit|
|**API Rate Limiting**|100 requests/minute per user via @nestjs/throttler|
|**File Upload Scanning**|ClamAV virus scanning|
|**SQL Injection Protection**|Parameterized queries enforced by Prisma ORM|
|**XSS Protection**|Input sanitization, CSP headers|
|**CSRF Protection**|CSRF tokens on state-changing requests|
|**Session Management**|Secure, HTTP-only cookies|
|**Role Enforcement**|NestJS Guards with RBAC (5 roles: STUDENT, TEACHER, STAFF, LIBRARIAN, ADMIN)|

---

### 10.5 Usability Requirements

|Requirement|Specification|
|---|---|
|**Mobile Responsiveness**|Works on all screen sizes (320px+)|
|**PWA Installation**|One-click install on iOS/Android|
|**Accessibility**|WCAG 2.1 Level AA compliance|
|**Browser Support**|Chrome, Firefox, Safari, Edge (last 2 versions)|
|**Language Support**|English, Sinhala, Tamil (future)|
|**Offline Support**|View current loans offline|
|**Loading States**|Show skeletons/spinners for all async actions|
|**Error Messages**|Clear, actionable error messages|

---

### 10.6 Compatibility Requirements

|Component|Requirement|
|---|---|
|**Backend Runtime**|Node.js 20 LTS|
|**Backend Framework**|NestJS (latest stable)|
|**Database**|PostgreSQL 16+|
|**ORM**|Prisma (latest stable)|
|**Cache**|Redis 7+|
|**Frontend**|Next.js 15+ (App Router)|
|**Package Manager**|pnpm 9+|
|**Monorepo Tool**|Nx 19+|
|**Mobile OS**|iOS 14+, Android 9+|
|**Desktop OS**|Windows 10+, macOS 11+, Ubuntu 20.04+|
|**Minimum Screen**|320px width|
|**Internet Speed**|2G (minimum), 4G (optimal)|

---

### 10.7 Localization Requirements

**Phase 1 (Launch):**

- English interface (default)
- Currency: Sri Lankan Rupees (Rs.)
- Date format: DD/MM/YYYY
- Time format: 12-hour with AM/PM

**Phase 2 (Future):**

- Sinhala interface
- Tamil interface
- Unicode support for Sinhala/Tamil book titles

---

### 10.8 Compliance Requirements

|Standard|Applicability|
|---|---|
|**GDPR**|User data privacy, right to deletion|
|**COPPA**|Protection for users under 13|
|**WCAG 2.1**|Web accessibility standards|
|**ISO 27001**|Information security (aspirational)|

---

## 11. Assumptions & Dependencies

### 11.1 Assumptions

1. All students have access to smartphones or computers
2. School has stable internet connection (at least 10 Mbps)
3. Librarians have basic computer literacy
4. Current Excel data can be exported to CSV
5. Google Books API will remain free for our usage volume
6. School email system can forward to external SMTP
7. Students will adopt the mobile app within 3 months

### 11.2 Dependencies

|Dependency|Impact|Mitigation|
|---|---|---|
|**Google Books API**|High - Core feature|Cache responses, fallback to manual entry|
|**Internet connectivity**|High - Cloud hosting|Offline mode for core features (PWA)|
|**School database**|Medium - User import|Manual CSV export as backup|
|**Email service**|Medium - Notifications|SMS fallback for critical notifications|
|**Developer availability**|High - Maintenance|Train backup developer, comprehensive documentation|

---

## 12. Success Criteria

### 12.1 Launch Success Metrics (Month 1)

|Metric|Target|
|---|---|
|User registrations|50% of student body (2,100 students)|
|Books cataloged|80% of collection (6,800 books)|
|Daily active users|200+|
|System uptime|99%+|
|Critical bugs|0|
|User satisfaction|4+ stars (out of 5)|

---

### 12.2 6-Month Success Metrics

|Metric|Target|
|---|---|
|User registrations|90% of student body (3,780 students)|
|Monthly circulation|30% increase vs. old system|
|Dead stock identified|47% of collection (3,980 books)|
|Librarian time saved|6 hours/day → 2 hours/day|
|Fine collection rate|80%+|
|Student engagement|50% monthly active users|
|PWA installations|1,000+ students|

---

### 12.3 1-Year Success Metrics

|Metric|Target|
|---|---|
|Return on Investment|Break-even or positive|
|Catalog accuracy|100% (all books tracked)|
|Collection optimization|20% space freed, reallocated to high-demand|
|Student literacy|15% increase in books read per student|
|System stability|99.5% uptime|
|User satisfaction|4.5+ stars|

---

## Appendix A: Glossary

|Term|Definition|
|---|---|
|**Accession Number**|Unique identifier for each physical book copy (e.g., ACC001)|
|**API**|Application Programming Interface|
|**Barcode**|Machine-readable code for book identification|
|**CSRF**|Cross-Site Request Forgery (security attack)|
|**Dead Stock**|Books not borrowed in 12+ months|
|**FIFO**|First In, First Out (queue ordering)|
|**ISBN**|International Standard Book Number|
|**JWT**|JSON Web Token (authentication mechanism)|
|**ORM**|Object-Relational Mapping (Prisma)|
|**PWA**|Progressive Web App (installable web app)|
|**QR Code**|Quick Response code (2D barcode)|
|**SMTP**|Simple Mail Transfer Protocol (email)|
|**TLS**|Transport Layer Security (encryption)|
|**XSS**|Cross-Site Scripting (security vulnerability)|

---

## Appendix B: Change Log

|Version|Date|Changes|
|---|---|---|
|1.0|2026-01-27|Initial functional requirements document|
|1.1|2026-02-24|Architecture diagram updated with Redis and monorepo structure. Compatibility table updated to reflect final stack (Next.js 15, Nx, pnpm, Prisma, Redis). Security requirements expanded.|

---

## Appendix C: Approval

|Role|Name|Signature|Date|
|---|---|---|---|
|**Developer**|S.C. Roshana|___________|_________|
|**Head Librarian**|___________|___________|_________|
|**Principal**|Mrs. Dulmini N. Senanayake|___________|_________|
|**IT Coordinator**|___________|___________|_________|

---

**Document End**

_This document is a living artifact and will be updated as requirements evolve during development._