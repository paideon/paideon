**Version:** 2.0  
**Last Updated:** February 05, 2026  
**Database:** PostgreSQL 16+  
**ORM:** Prisma 6+

---

## Table of Contents

1. [Overview](#overview)
2. [Data Model](#data-model)
3. [Table Definitions](#table-definitions)
4. [Relationships](#relationships)
5. [Indexes](#indexes)
6. [Enumerations](#enumerations)
7. [Database Statistics](#database-statistics)
8. [Maintenance](#maintenance)

---

## Overview

### Database Architecture

The NEXUS Library Management System uses PostgreSQL as its primary database with the following key characteristics:

- **Total Tables:** 16
- **Primary Key Type:** UUID (universally unique identifier)
- **Indexing Strategy:** Comprehensive indexes on foreign keys, search fields, and frequently queried columns
- **Data Integrity:** Enforced through foreign keys, check constraints, and unique indexes
- **Scalability:** Designed to handle 5,000+ users and 10,000+ books

### Design Principles

1. **Normalization:** Tables are normalized to 3NF to reduce redundancy
2. **Denormalization:** Strategic denormalization in ReadingHistory for analytics performance
3. **Soft Deletes:** Critical tables use status fields instead of hard deletes
4. **Audit Trail:** All tables include createdAt and updatedAt timestamps
5. **Future-Ready:** Structured to support expansion into full LMS

---

## Data Model

### Core Entities

```
┌─────────────┐
│    User     │──┐
└─────────────┘  │
                 │
                 ├──< Loan >──┐
                 │            │
                 ├──< Reservation >
                 │            │
┌─────────────┐  │            │
│    Book     │──┤            │
└─────────────┘  │            │
                 ├──< Review >
                 │
                 ├──< Fine >
                 │
                 ├──< ReadingHistory >
                 │
                 ├──< BookRequest >
                 │
                 └──< Notification >
```

---

## Table Definitions

### 1. User Table

**Purpose:** Store all system users (students, teachers, librarians, admins)

**Row Estimate:** 4,500-6,000 rows

|Column|Type|Nullable|Default|Description|
|---|---|---|---|---|
|id|UUID|No|uuid_generate_v4()|Primary key|
|email|VARCHAR(255)|No|-|Unique email address|
|phoneNumber|VARCHAR(20)|Yes|NULL|Unique phone number|
|password|VARCHAR(255)|No|-|Hashed password (bcrypt)|
|role|ENUM|No|STUDENT|User role|
|status|ENUM|No|ACTIVE|Account status|
|firstName|VARCHAR(100)|No|-|First name|
|lastName|VARCHAR(100)|No|-|Last name|
|admissionNumber|VARCHAR(50)|Yes|NULL|Student admission number (unique)|
|employeeId|VARCHAR(50)|Yes|NULL|Staff employee ID (unique)|
|grade|INTEGER|Yes|NULL|Student grade (1-13)|
|classSection|VARCHAR(10)|Yes|NULL|Class section (e.g., "10A")|
|**teachingSubjects**|**ENUM[]**|**Yes**|**NULL**|**Subjects taught (for teachers)**|
|**department**|**VARCHAR(100)**|**Yes**|**NULL**|**Department (for teachers/staff)**|
|**profileImageUrl**|**VARCHAR(500)**|**Yes**|**NULL**|**Profile image URL**|
|**dateOfBirth**|**DATE**|**Yes**|**NULL**|**Date of birth**|
|address|TEXT|Yes|NULL|Home address|
|emergencyContact|VARCHAR(20)|Yes|NULL|Emergency contact number|
|cardNumber|VARCHAR(50)|No|cuid()|Library card number (unique)|
|cardQrCode|TEXT|Yes|NULL|QR code data for card|
|emailVerified|BOOLEAN|No|FALSE|Email verification status|
|lastLogin|TIMESTAMP|Yes|NULL|Last login timestamp|
|createdAt|TIMESTAMP|No|NOW()|Record creation time|
|updatedAt|TIMESTAMP|No|NOW()|Last update time|

**Indexes:**

- PRIMARY KEY (id)
- UNIQUE INDEX (email)
- UNIQUE INDEX (phoneNumber)
- UNIQUE INDEX (cardNumber)
- UNIQUE INDEX (admissionNumber)
- UNIQUE INDEX (employeeId)
- INDEX (role, status)
- INDEX (grade)

**Constraints:**

- CHECK (role IN ('STUDENT', 'TEACHER', 'LIBRARIAN', 'ADMIN', 'STAFF'))
- CHECK (status IN ('ACTIVE', 'SUSPENDED', 'GRADUATED', 'INACTIVE'))
- CHECK (grade BETWEEN 1 AND 13)

---

### 2. Book Table

**Purpose:** Store book catalog information

**Row Estimate:** 8,500-12,000 rows

|Column|Type|Nullable|Default|Description|
|---|---|---|---|---|
|id|UUID|No|uuid_generate_v4()|Primary key|
|isbn13|VARCHAR(20)|Yes|NULL|ISBN-13 (unique)|
|isbn10|VARCHAR(15)|Yes|NULL|ISBN-10|
|barcode|VARCHAR(50)|No|-|Internal barcode (unique)|
|title|VARCHAR(500)|No|-|Book title|
|subtitle|VARCHAR(500)|Yes|NULL|Book subtitle|
|authors|TEXT[]|No|'{}'|Array of author names|
|publisher|VARCHAR(255)|Yes|NULL|Publisher name|
|publishedDate|VARCHAR(50)|Yes|NULL|Publication date|
|language|VARCHAR(10)|No|'en'|Language code|
|pageCount|INTEGER|Yes|NULL|Number of pages|
|categories|TEXT[]|No|'{}'|Genre categories|
|subjects|TEXT[]|No|'{}'|Detailed subjects|
|**localSubjects**|**TEXT[]**|**No**|**'{}'**|**Sri Lankan curriculum subjects**|
|deweyDecimal|VARCHAR(20)|Yes|NULL|Dewey Decimal Classification|
|description|TEXT|Yes|NULL|Book description|
|coverImageUrl|VARCHAR(500)|Yes|NULL|Cover image URL|
|thumbnailUrl|VARCHAR(500)|Yes|NULL|Thumbnail URL|
|edition|VARCHAR(50)|Yes|NULL|Edition information|
|binding|VARCHAR(50)|Yes|NULL|Binding type (Hardcover/Paperback)|
|dimensions|VARCHAR(50)|Yes|NULL|Physical dimensions|
|weight|VARCHAR(50)|Yes|NULL|Weight|
|**targetAudience**|**VARCHAR(50)**|**Yes**|**NULL**|**Target audience (e.g., "Young Adult")**|
|**ageRange**|**VARCHAR(20)**|**Yes**|**NULL**|**Age range (e.g., "10-16")**|
|**seriesName**|**VARCHAR(255)**|**Yes**|**NULL**|**Series name**|
|**volumeNumber**|**INTEGER**|**Yes**|**NULL**|**Volume number in series**|
|**donatedBy**|**VARCHAR(255)**|**Yes**|**NULL**|**Donor name/organization**|
|**isDonation**|**BOOLEAN**|**No**|**FALSE**|**Donation flag**|
|**tags**|**TEXT[]**|**No**|**'{}'**|**Additional tags for search/discovery**|
|accessionNumber|VARCHAR(50)|No|-|Library accession number (unique)|
|location|VARCHAR(100)|No|-|Shelf location (e.g., "A-12-5")|
|purchaseDate|DATE|Yes|NULL|Purchase date|
|purchasePrice|DECIMAL(10,2)|Yes|NULL|Purchase price|
|vendor|VARCHAR(255)|Yes|NULL|Vendor name|
|status|ENUM|No|AVAILABLE|Book status|
|condition|ENUM|No|GOOD|Physical condition|
|totalCopies|INTEGER|No|1|Total copies owned|
|availableCopies|INTEGER|No|1|Currently available|
|totalLoans|INTEGER|No|0|Total times borrowed|
|totalReservations|INTEGER|No|0|Total reservations|
|lastBorrowed|TIMESTAMP|Yes|NULL|Last borrow date|
|popularity|DECIMAL(5,2)|No|0.0|Popularity score|
|createdAt|TIMESTAMP|No|NOW()|Record creation time|
|updatedAt|TIMESTAMP|No|NOW()|Last update time|
|createdBy|VARCHAR(100)|Yes|NULL|Staff who cataloged|

**Indexes:**

- PRIMARY KEY (id)
- UNIQUE INDEX (isbn13)
- UNIQUE INDEX (barcode)
- UNIQUE INDEX (accessionNumber)
- INDEX (status)
- GIN INDEX (categories)
- GIN INDEX (authors)
- GIN INDEX (tags)
- GIN INDEX (localSubjects)
- FULLTEXT INDEX (title, authors)

**Constraints:**

- CHECK (totalCopies >= 0)
- CHECK (availableCopies >= 0)
- CHECK (availableCopies <= totalCopies)
- CHECK (status IN ('AVAILABLE', 'CHECKED_OUT', 'RESERVED', 'DAMAGED', 'LOST', 'UNDER_REPAIR', 'WITHDRAWN'))
- CHECK (condition IN ('NEW', 'GOOD', 'FAIR', 'POOR', 'DAMAGED'))
- CHECK (volumeNumber > 0)

---

### 3. Loan Table

**Purpose:** Track book checkouts and returns

**Row Estimate:** 50,000-150,000 rows

|Column|Type|Nullable|Default|Description|
|---|---|---|---|---|
|id|UUID|No|uuid_generate_v4()|Primary key|
|userId|UUID|No|-|Foreign key to User|
|bookId|UUID|No|-|Foreign key to Book|
|checkoutDate|TIMESTAMP|No|NOW()|Checkout timestamp|
|dueDate|TIMESTAMP|No|-|Due date|
|returnDate|TIMESTAMP|Yes|NULL|Return timestamp|
|status|ENUM|No|ACTIVE|Loan status|
|renewalCount|INTEGER|No|0|Number of renewals|
|maxRenewals|INTEGER|No|2|Max renewals allowed|
|checkedOutBy|VARCHAR(100)|No|-|Librarian ID|
|checkedInBy|VARCHAR(100)|Yes|NULL|Librarian ID|
|checkoutCondition|ENUM|No|GOOD|Book condition at checkout|
|returnCondition|ENUM|Yes|NULL|Book condition at return|
|notes|TEXT|Yes|NULL|Additional notes|
|overdueNoticeSent|BOOLEAN|No|FALSE|Overdue notice sent|
|overdueNoticeDate|TIMESTAMP|Yes|NULL|Notice sent date|
|createdAt|TIMESTAMP|No|NOW()|Record creation time|
|updatedAt|TIMESTAMP|No|NOW()|Last update time|

**Indexes:**

- PRIMARY KEY (id)
- INDEX (userId)
- INDEX (bookId)
- INDEX (status)
- INDEX (dueDate)
- INDEX (returnDate)

**Constraints:**

- FOREIGN KEY (userId) REFERENCES User(id)
- FOREIGN KEY (bookId) REFERENCES Book(id)
- CHECK (status IN ('ACTIVE', 'RETURNED', 'OVERDUE', 'RENEWED', 'LOST'))
- CHECK (renewalCount <= maxRenewals)

---

### 4. Reservation Table

**Purpose:** Manage book reservation queue

**Row Estimate:** 500-1,500 rows (active)

|Column|Type|Nullable|Default|Description|
|---|---|---|---|---|
|id|UUID|No|uuid_generate_v4()|Primary key|
|userId|UUID|No|-|Foreign key to User|
|bookId|UUID|No|-|Foreign key to Book|
|requestDate|TIMESTAMP|No|NOW()|Request timestamp|
|availableDate|TIMESTAMP|Yes|NULL|When book available|
|expiryDate|TIMESTAMP|Yes|NULL|Claim deadline (24h)|
|claimDate|TIMESTAMP|Yes|NULL|When claimed|
|status|ENUM|No|PENDING|Reservation status|
|queuePosition|INTEGER|No|-|Position in queue|
|notificationSent|BOOLEAN|No|FALSE|Notification sent flag|
|createdAt|TIMESTAMP|No|NOW()|Record creation time|
|updatedAt|TIMESTAMP|No|NOW()|Last update time|

**Indexes:**

- PRIMARY KEY (id)
- INDEX (userId)
- INDEX (bookId)
- INDEX (status)
- UNIQUE INDEX (userId, bookId, status) WHERE status IN ('PENDING', 'AVAILABLE')

**Constraints:**

- FOREIGN KEY (userId) REFERENCES User(id)
- FOREIGN KEY (bookId) REFERENCES Book(id)
- CHECK (status IN ('PENDING', 'AVAILABLE', 'CLAIMED', 'EXPIRED', 'CANCELLED'))
- CHECK (queuePosition > 0)

---

### 5. Fine Table

**Purpose:** Track library fines and payments

**Row Estimate:** 10,000-30,000 rows

|Column|Type|Nullable|Default|Description|
|---|---|---|---|---|
|id|UUID|No|uuid_generate_v4()|Primary key|
|userId|UUID|No|-|Foreign key to User|
|loanId|UUID|Yes|NULL|Foreign key to Loan|
|type|ENUM|No|-|Fine type|
|amount|DECIMAL(10,2)|No|-|Fine amount (Rs.)|
|amountPaid|DECIMAL(10,2)|No|0.00|Amount paid (Rs.)|
|status|ENUM|No|PENDING|Payment status|
|daysOverdue|INTEGER|Yes|NULL|Days overdue|
|dailyRate|DECIMAL(10,2)|Yes|NULL|Rs. per day|
|paidDate|TIMESTAMP|Yes|NULL|Payment date|
|paymentMethod|VARCHAR(50)|Yes|NULL|Cash/Bank/Online|
|receiptNumber|VARCHAR(100)|Yes|NULL|Receipt number|
|waivedBy|VARCHAR(100)|Yes|NULL|Admin ID who waived|
|waiverReason|TEXT|Yes|NULL|Waiver reason|
|waivedDate|TIMESTAMP|Yes|NULL|Waiver date|
|description|TEXT|Yes|NULL|Fine description|
|createdAt|TIMESTAMP|No|NOW()|Record creation time|
|updatedAt|TIMESTAMP|No|NOW()|Last update time|

**Indexes:**

- PRIMARY KEY (id)
- INDEX (userId)
- INDEX (loanId)
- INDEX (status)
- INDEX (type)

**Constraints:**

- FOREIGN KEY (userId) REFERENCES User(id)
- FOREIGN KEY (loanId) REFERENCES Loan(id)
- CHECK (type IN ('OVERDUE', 'DAMAGE', 'LOST_BOOK', 'LATE_RETURN'))
- CHECK (status IN ('PENDING', 'PAID', 'WAIVED', 'OVERDUE'))
- CHECK (amount >= 0)
- CHECK (amountPaid >= 0)
- CHECK (amountPaid <= amount)

---

### 6. DamageReport Table

**Purpose:** Track book damage reports

**Row Estimate:** 500-1,000 rows

|Column|Type|Nullable|Default|Description|
|---|---|---|---|---|
|id|UUID|No|uuid_generate_v4()|Primary key|
|bookId|UUID|No|-|Foreign key to Book|
|reportedBy|VARCHAR(100)|No|-|Reporter ID|
|severity|ENUM|No|-|Damage severity|
|description|TEXT|No|-|Damage description|
|images|TEXT[]|No|'{}'|Damage photo URLs|
|repairCost|DECIMAL(10,2)|Yes|NULL|Repair cost (Rs.)|
|repairDate|TIMESTAMP|Yes|NULL|Repair date|
|withdrawn|BOOLEAN|No|FALSE|Book withdrawn flag|
|reportDate|TIMESTAMP|No|NOW()|Report date|
|createdAt|TIMESTAMP|No|NOW()|Record creation time|
|updatedAt|TIMESTAMP|No|NOW()|Last update time|

**Indexes:**

- PRIMARY KEY (id)
- INDEX (bookId)
- INDEX (severity)

**Constraints:**

- FOREIGN KEY (bookId) REFERENCES Book(id)
- CHECK (severity IN ('MINOR', 'MODERATE', 'SEVERE', 'TOTAL_LOSS'))

---

### 7. Review Table

**Purpose:** Book reviews and ratings

**Row Estimate:** 5,000-15,000 rows

|Column|Type|Nullable|Default|Description|
|---|---|---|---|---|
|id|UUID|No|uuid_generate_v4()|Primary key|
|userId|UUID|No|-|Foreign key to User|
|bookId|UUID|No|-|Foreign key to Book|
|rating|INTEGER|No|-|Rating (1-5 stars)|
|comment|TEXT|Yes|NULL|Review text|
|approved|BOOLEAN|No|FALSE|Moderation status|
|moderatedBy|VARCHAR(100)|Yes|NULL|Moderator ID|
|moderatedAt|TIMESTAMP|Yes|NULL|Moderation date|
|createdAt|TIMESTAMP|No|NOW()|Record creation time|
|updatedAt|TIMESTAMP|No|NOW()|Last update time|

**Indexes:**

- PRIMARY KEY (id)
- UNIQUE INDEX (userId, bookId)
- INDEX (bookId)
- INDEX (rating)

**Constraints:**

- FOREIGN KEY (userId) REFERENCES User(id)
- FOREIGN KEY (bookId) REFERENCES Book(id)
- CHECK (rating BETWEEN 1 AND 5)

---

### 8. ReadingHistory Table

**Purpose:** Track user reading patterns for analytics

**Row Estimate:** 100,000-300,000 rows

|Column|Type|Nullable|Default|Description|
|---|---|---|---|---|
|id|UUID|No|uuid_generate_v4()|Primary key|
|userId|UUID|No|-|Foreign key to User|
|bookId|VARCHAR(100)|No|-|Book ID (denormalized)|
|bookTitle|VARCHAR(500)|No|-|Book title (denormalized)|
|bookAuthors|TEXT[]|No|-|Authors (denormalized)|
|bookCategories|TEXT[]|No|-|Categories (denormalized)|
|borrowDate|TIMESTAMP|No|-|Borrow date|
|returnDate|TIMESTAMP|Yes|NULL|Return date|
|rating|INTEGER|Yes|NULL|User rating|
|createdAt|TIMESTAMP|No|NOW()|Record creation time|

**Indexes:**

- PRIMARY KEY (id)
- INDEX (userId)
- GIN INDEX (bookCategories)

**Note:** Denormalized for fast analytics queries

---

### 9. UserGamification Table

**Purpose:** Track gamification stats (badges, streaks, points)

**Row Estimate:** 4,500-6,000 rows (one per user)

|Column|Type|Nullable|Default|Description|
|---|---|---|---|---|
|id|UUID|No|uuid_generate_v4()|Primary key|
|userId|UUID|No|-|Foreign key to User (unique)|
|currentStreak|INTEGER|No|0|Current reading streak|
|longestStreak|INTEGER|No|0|Longest streak achieved|
|lastBorrowDate|TIMESTAMP|Yes|NULL|Last borrow date|
|totalBooksRead|INTEGER|No|0|Total books read|
|totalGenres|INTEGER|No|0|Unique genres explored|
|totalReviews|INTEGER|No|0|Total reviews written|
|points|INTEGER|No|0|Total points|
|level|INTEGER|No|1|User level|
|badges|TEXT[]|No|'{}'|Earned badges|
|gradeRank|INTEGER|Yes|NULL|Rank in grade|
|schoolRank|INTEGER|Yes|NULL|Rank in school|
|optedInLeaderboard|BOOLEAN|No|TRUE|Leaderboard opt-in|
|updatedAt|TIMESTAMP|No|NOW()|Last update time|

**Indexes:**

- PRIMARY KEY (id)
- UNIQUE INDEX (userId)
- INDEX (points)
- INDEX (currentStreak)

**Constraints:**

- FOREIGN KEY (userId) REFERENCES User(id)
- CHECK (currentStreak >= 0)
- CHECK (points >= 0)
- CHECK (level >= 1)

---

### 10. VaultResource Table

**Purpose:** Digital vault resources (textbooks, past papers)

**Row Estimate:** 500-1,000 rows

|Column|Type|Nullable|Default|Description|
|---|---|---|---|---|
|id|UUID|No|uuid_generate_v4()|Primary key|
|title|VARCHAR(500)|No|-|Resource title|
|description|TEXT|Yes|NULL|Description|
|type|ENUM|No|-|Resource type|
|grade|INTEGER|Yes|NULL|Grade level (1-13)|
|subject|VARCHAR(100)|Yes|NULL|Subject|
|year|INTEGER|Yes|NULL|Year (for past papers)|
|medium|VARCHAR(50)|Yes|NULL|Language medium|
|fileUrl|VARCHAR(500)|No|-|File URL|
|fileName|VARCHAR(255)|No|-|File name|
|fileSize|INTEGER|Yes|NULL|File size (bytes)|
|mimeType|VARCHAR(100)|Yes|NULL|MIME type|
|isPublic|BOOLEAN|No|TRUE|Public access flag|
|downloadCount|INTEGER|No|0|Download count|
|viewCount|INTEGER|No|0|View count|
|source|VARCHAR(255)|Yes|NULL|Source name|
|sourceUrl|VARCHAR(500)|Yes|NULL|Source URL|
|uploadedBy|VARCHAR(100)|Yes|NULL|Uploader ID|
|createdAt|TIMESTAMP|No|NOW()|Record creation time|
|updatedAt|TIMESTAMP|No|NOW()|Last update time|

**Indexes:**

- PRIMARY KEY (id)
- INDEX (type)
- INDEX (grade, subject)
- INDEX (year)

**Constraints:**

- CHECK (type IN ('TEXTBOOK', 'PAST_PAPER', 'STUDY_GUIDE', 'REFERENCE'))
- CHECK (grade BETWEEN 1 AND 13)

---

### 11. Notification Table

**Purpose:** User notifications

**Row Estimate:** 50,000 rows (30-day retention)

|Column|Type|Nullable|Default|Description|
|---|---|---|---|---|
|id|UUID|No|uuid_generate_v4()|Primary key|
|userId|UUID|No|-|Foreign key to User|
|type|ENUM|No|-|Notification type|
|channel|ENUM|No|-|Delivery channel|
|title|VARCHAR(255)|No|-|Notification title|
|message|TEXT|No|-|Notification message|
|actionUrl|VARCHAR(500)|Yes|NULL|Action URL|
|sent|BOOLEAN|No|FALSE|Sent flag|
|sentAt|TIMESTAMP|Yes|NULL|Sent timestamp|
|read|BOOLEAN|No|FALSE|Read flag|
|readAt|TIMESTAMP|Yes|NULL|Read timestamp|
|retryCount|INTEGER|No|0|Retry attempts|
|lastRetry|TIMESTAMP|Yes|NULL|Last retry time|
|createdAt|TIMESTAMP|No|NOW()|Record creation time|

**Indexes:**

- PRIMARY KEY (id)
- INDEX (userId)
- INDEX (sent)
- INDEX (type)

**Constraints:**

- FOREIGN KEY (userId) REFERENCES User(id)
- CHECK (type IN ('DUE_REMINDER', 'OVERDUE_NOTICE', 'RESERVATION_READY', 'FINE_NOTICE', 'NEW_BOOK_ALERT', 'ACHIEVEMENT_UNLOCKED'))
- CHECK (channel IN ('EMAIL', 'SMS', 'PUSH', 'IN_APP'))

---

### 12. DailyStatistics Table

**Purpose:** Daily aggregated statistics

**Row Estimate:** 365-1,095 rows

|Column|Type|Nullable|Default|Description|
|---|---|---|---|---|
|id|UUID|No|uuid_generate_v4()|Primary key|
|date|DATE|No|-|Statistics date (unique)|
|totalCheckouts|INTEGER|No|0|Checkouts on date|
|totalReturns|INTEGER|No|0|Returns on date|
|newReservations|INTEGER|No|0|New reservations|
|activeUsers|INTEGER|No|0|Active users|
|newUsers|INTEGER|No|0|New registrations|
|finesCollected|DECIMAL(10,2)|No|0.00|Fines collected (Rs.)|
|vaultDownloads|INTEGER|No|0|Vault downloads|
|vaultViews|INTEGER|No|0|Vault views|
|createdAt|TIMESTAMP|No|NOW()|Record creation time|

**Indexes:**

- PRIMARY KEY (id)
- UNIQUE INDEX (date)

---

### 13. SystemConfig Table

**Purpose:** System-wide configuration

**Row Estimate:** 1 row

|Column|Type|Nullable|Default|Description|
|---|---|---|---|---|
|id|UUID|No|uuid_generate_v4()|Primary key|
|maxLoansPerStudent|INTEGER|No|3|Max student loans|
|maxLoansPerTeacher|INTEGER|No|10|Max teacher loans|
|loanDurationDays|INTEGER|No|14|Loan duration|
|maxRenewals|INTEGER|No|2|Max renewals|
|overdueFinePerDay|DECIMAL(10,2)|No|5.00|Daily fine (Rs.)|
|maxFineAmount|DECIMAL(10,2)|No|500.00|Max fine (Rs.)|
|damageFinePenalty|DECIMAL(10,2)|No|0.50|Damage % penalty|
|reservationClaimHours|INTEGER|No|24|Claim window (hours)|
|maxActiveReservations|INTEGER|No|5|Max reservations|
|dueDateReminderDays|INTEGER|No|2|Reminder days before|
|enableSmsNotifications|BOOLEAN|No|FALSE|SMS enabled|
|enableEmailNotifications|BOOLEAN|No|TRUE|Email enabled|
|enablePushNotifications|BOOLEAN|No|TRUE|Push enabled|
|pointsPerBorrow|INTEGER|No|10|Points for borrowing|
|pointsPerReview|INTEGER|No|5|Points for review|
|pointsPerStreak|INTEGER|No|20|Points for streak|
|updatedAt|TIMESTAMP|No|NOW()|Last update time|
|updatedBy|VARCHAR(100)|Yes|NULL|Updated by|

**Note:** Single-row table for configuration

---

### 14. BookRequest Table ⭐ NEW

**Purpose:** Track student/teacher requests for new books

**Row Estimate:** 200-500 rows per year

|Column|Type|Nullable|Default|Description|
|---|---|---|---|---|
|id|UUID|No|uuid_generate_v4()|Primary key|
|userId|UUID|No|-|Foreign key to User|
|title|VARCHAR(500)|No|-|Requested book title|
|author|VARCHAR(255)|Yes|NULL|Requested author|
|isbn|VARCHAR(20)|Yes|NULL|ISBN if known|
|reason|TEXT|No|-|Request reason/justification|
|priority|INTEGER|No|1|Priority (1-5)|
|status|ENUM|No|PENDING|Request status|
|reviewedBy|VARCHAR(100)|Yes|NULL|Librarian ID|
|reviewedAt|TIMESTAMP|Yes|NULL|Review timestamp|
|reviewNotes|TEXT|Yes|NULL|Librarian notes|
|orderedDate|TIMESTAMP|Yes|NULL|Order date|
|receivedDate|TIMESTAMP|Yes|NULL|Receipt date|
|bookId|UUID|Yes|NULL|FK to created Book|
|requestDate|TIMESTAMP|No|NOW()|Request timestamp|
|createdAt|TIMESTAMP|No|NOW()|Record creation time|
|updatedAt|TIMESTAMP|No|NOW()|Last update time|

**Indexes:**

- PRIMARY KEY (id)
- INDEX (userId)
- INDEX (status)
- INDEX (priority)

**Constraints:**

- FOREIGN KEY (userId) REFERENCES User(id)
- FOREIGN KEY (bookId) REFERENCES Book(id)
- CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED', 'ORDERED', 'RECEIVED'))
- CHECK (priority BETWEEN 1 AND 5)

---

### 15. BookSuggestion Table ⭐ NEW

**Purpose:** AI-powered book recommendations for users

**Row Estimate:** 10,000-20,000 rows (active suggestions)

|Column|Type|Nullable|Default|Description|
|---|---|---|---|---|
|id|UUID|No|uuid_generate_v4()|Primary key|
|userId|UUID|Yes|NULL|FK to User (NULL for general)|
|bookId|UUID|No|-|Foreign key to Book|
|reason|VARCHAR(500)|No|-|Recommendation reason|
|score|DECIMAL(5,2)|No|-|Confidence score (0-100)|
|basedOn|TEXT[]|No|'{}'|Recommendation factors|
|shown|BOOLEAN|No|FALSE|Shown to user flag|
|clicked|BOOLEAN|No|FALSE|User clicked flag|
|borrowed|BOOLEAN|No|FALSE|User borrowed flag|
|createdAt|TIMESTAMP|No|NOW()|Record creation time|
|expiresAt|TIMESTAMP|No|-|Expiry timestamp|

**Indexes:**

- PRIMARY KEY (id)
- INDEX (userId)
- INDEX (bookId)
- INDEX (score)
- INDEX (expiresAt)

**Constraints:**

- FOREIGN KEY (userId) REFERENCES User(id)
- FOREIGN KEY (bookId) REFERENCES Book(id)
- CHECK (score BETWEEN 0 AND 100)

---

### 16. Announcement Table ⭐ NEW

**Purpose:** Library-wide announcements and notices

**Row Estimate:** 50-100 rows per year

|Column|Type|Nullable|Default|Description|
|---|---|---|---|---|
|id|UUID|No|uuid_generate_v4()|Primary key|
|title|VARCHAR(255)|No|-|Announcement title|
|message|TEXT|No|-|Announcement content|
|type|ENUM|No|GENERAL|Announcement type|
|targetRoles|TEXT[]|No|'{}'|Target user roles (empty = all)|
|targetGrades|INTEGER[]|No|'{}'|Target grades (empty = all)|
|isPinned|BOOLEAN|No|FALSE|Pinned to top flag|
|showUntil|TIMESTAMP|Yes|NULL|Display until date|
|createdBy|VARCHAR(100)|No|-|Admin/Librarian ID|
|createdAt|TIMESTAMP|No|NOW()|Record creation time|
|updatedAt|TIMESTAMP|No|NOW()|Last update time|

**Indexes:**

- PRIMARY KEY (id)
- INDEX (type)
- INDEX (isPinned)
- INDEX (showUntil)

**Constraints:**

- CHECK (type IN ('GENERAL', 'MAINTENANCE', 'NEW_ARRIVALS', 'EVENT', 'POLICY_CHANGE'))

---

## Relationships

### Entity Relationship Diagram

```
User (1) ──< (N) Loan
User (1) ──< (N) Reservation
User (1) ──< (N) Fine
User (1) ──< (N) Review
User (1) ──< (N) ReadingHistory
User (1) ──── (1) UserGamification
User (1) ──< (N) Notification
User (1) ──< (N) BookRequest          ⭐ NEW

Book (1) ──< (N) Loan
Book (1) ──< (N) Reservation
Book (1) ──< (N) Review
Book (1) ──< (N) DamageReport
Book (1) ──< (N) BookSuggestion       ⭐ NEW

Loan (1) ──< (N) Fine

BookRequest (N) ──── (1) Book         ⭐ NEW
```

### Relationship Cardinalities

|Relationship|Type|Description|
|---|---|---|
|User → Loan|One-to-Many|A user can have multiple loans|
|User → Reservation|One-to-Many|A user can have multiple reservations|
|User → Fine|One-to-Many|A user can have multiple fines|
|User → Review|One-to-Many|A user can write multiple reviews|
|User → UserGamification|One-to-One|Each user has one gamification record|
|User → BookRequest|One-to-Many|A user can request multiple books|
|Book → Loan|One-to-Many|A book can have multiple loans|
|Book → Reservation|One-to-Many|A book can have multiple reservations|
|Book → Review|One-to-Many|A book can have multiple reviews|
|Book → BookSuggestion|One-to-Many|A book can be suggested to many users|
|Loan → Fine|One-to-Many|A loan can incur multiple fines|

---

## Enumerations

### 1. UserRole

```sql
CREATE TYPE UserRole AS ENUM (
  'STUDENT',
  'TEACHER',
  'LIBRARIAN',
  'ADMIN',
  'STAFF'
);
```

### 2. UserStatus

```sql
CREATE TYPE UserStatus AS ENUM (
  'ACTIVE',
  'SUSPENDED',
  'GRADUATED',
  'INACTIVE'
);
```

### 3. Subject ⭐ NEW

```sql
CREATE TYPE Subject AS ENUM (
  'MATHEMATICS',
  'SCIENCE',
  'BIOLOGY',
  'CHEMISTRY',
  'PHYSICS',
  'ENGLISH',
  'SINHALA',
  'TAMIL',
  'HISTORY',
  'GEOGRAPHY',
  'ECONOMICS',
  'COMMERCE',
  'ACCOUNTING',
  'BUSINESS_STUDIES',
  'ICT',
  'ART',
  'MUSIC',
  'PHYSICAL_EDUCATION',
  'RELIGION',
  'DRAMA',
  'HOME_ECONOMICS',
  'AGRICULTURE',
  'ENGINEERING_TECHNOLOGY',
  'HEALTH_SCIENCE'
);
```

### 4. BookStatus

```sql
CREATE TYPE BookStatus AS ENUM (
  'AVAILABLE',
  'CHECKED_OUT',
  'RESERVED',
  'DAMAGED',
  'LOST',
  'UNDER_REPAIR',
  'WITHDRAWN'
);
```

### 5. BookCondition

```sql
CREATE TYPE BookCondition AS ENUM (
  'NEW',
  'GOOD',
  'FAIR',
  'POOR',
  'DAMAGED'
);
```

### 6. LoanStatus

```sql
CREATE TYPE LoanStatus AS ENUM (
  'ACTIVE',
  'RETURNED',
  'OVERDUE',
  'RENEWED',
  'LOST'
);
```

### 7. ReservationStatus

```sql
CREATE TYPE ReservationStatus AS ENUM (
  'PENDING',
  'AVAILABLE',
  'CLAIMED',
  'EXPIRED',
  'CANCELLED'
);
```

### 8. FineType

```sql
CREATE TYPE FineType AS ENUM (
  'OVERDUE',
  'DAMAGE',
  'LOST_BOOK',
  'LATE_RETURN'
);
```

### 9. FineStatus

```sql
CREATE TYPE FineStatus AS ENUM (
  'PENDING',
  'PAID',
  'WAIVED',
  'OVERDUE'
);
```

### 10. DamageSeverity

```sql
CREATE TYPE DamageSeverity AS ENUM (
  'MINOR',
  'MODERATE',
  'SEVERE',
  'TOTAL_LOSS'
);
```

### 11. BadgeType

```sql
CREATE TYPE BadgeType AS ENUM (
  'EXPLORER',        -- Borrowed from 5+ genres
  'SPEEDREADER',     -- Finished 5 books in a month
  'LOYAL_READER',    -- 30-day reading streak
  'REVIEWER',        -- Left 10+ reviews
  'GENRE_MASTER',    -- Read 10+ books in one genre
  'EARLY_BIRD'       -- First to borrow new releases
);
```

### 12. ResourceType

```sql
CREATE TYPE ResourceType AS ENUM (
  'TEXTBOOK',
  'PAST_PAPER',
  'STUDY_GUIDE',
  'REFERENCE'
);
```

### 13. NotificationType

```sql
CREATE TYPE NotificationType AS ENUM (
  'DUE_REMINDER',
  'OVERDUE_NOTICE',
  'RESERVATION_READY',
  'FINE_NOTICE',
  'NEW_BOOK_ALERT',
  'ACHIEVEMENT_UNLOCKED'
);
```

### 14. NotificationChannel

```sql
CREATE TYPE NotificationChannel AS ENUM (
  'EMAIL',
  'SMS',
  'PUSH',
  'IN_APP'
);
```

### 15. RequestStatus ⭐ NEW

```sql
CREATE TYPE RequestStatus AS ENUM (
  'PENDING',
  'APPROVED',
  'REJECTED',
  'ORDERED',
  'RECEIVED'
);
```

### 16. AnnouncementType ⭐ NEW

```sql
CREATE TYPE AnnouncementType AS ENUM (
  'GENERAL',
  'MAINTENANCE',
  'NEW_ARRIVALS',
  'EVENT',
  'POLICY_CHANGE'
);
```

---

## Indexes

### Index Strategy

1. **Primary Keys:** All tables use UUID primary keys with default B-tree index
2. **Foreign Keys:** All foreign keys are indexed for join performance
3. **Unique Constraints:** Email, phone, ISBN, barcode, card numbers
4. **Search Optimization:** Full-text indexes on book titles and authors
5. **Array Columns:** GIN indexes on array columns (categories, authors, tags)
6. **Composite Indexes:** For common query patterns

### Comprehensive Index List

|Table|Index Name|Columns|Type|Purpose|
|---|---|---|---|---|
|User|idx_user_email|email|UNIQUE|Login lookup|
|User|idx_user_phone|phoneNumber|UNIQUE|Login/contact lookup|
|User|idx_user_card|cardNumber|UNIQUE|Card scanning|
|User|idx_user_admission|admissionNumber|UNIQUE|Student lookup|
|User|idx_user_employee|employeeId|UNIQUE|Staff lookup|
|User|idx_user_role_status|role, status|BTREE|Filter active users by role|
|User|idx_user_grade|grade|BTREE|Student queries by grade|
|Book|idx_book_isbn13|isbn13|UNIQUE|ISBN lookup|
|Book|idx_book_barcode|barcode|UNIQUE|Barcode scanning|
|Book|idx_book_accession|accessionNumber|UNIQUE|Catalog lookup|
|Book|idx_book_status|status|BTREE|Available books query|
|Book|idx_book_categories|categories|GIN|Category search|
|Book|idx_book_authors|authors|GIN|Author search|
|Book|idx_book_tags|tags|GIN|Tag search|
|Book|idx_book_local_subjects|localSubjects|GIN|Curriculum search|
|Book|idx_book_fulltext|title, authors|FULLTEXT|Text search|
|Book|idx_book_series|seriesName|BTREE|Series lookup|
|Loan|idx_loan_user|userId|BTREE|User's loans|
|Loan|idx_loan_book|bookId|BTREE|Book's loans|
|Loan|idx_loan_status|status|BTREE|Active/overdue loans|
|Loan|idx_loan_due|dueDate|BTREE|Due date checks|
|Reservation|idx_reservation_user|userId|BTREE|User's reservations|
|Reservation|idx_reservation_book|bookId|BTREE|Book's queue|
|Reservation|idx_reservation_unique|userId, bookId, status|UNIQUE PARTIAL|Prevent duplicates|
|Fine|idx_fine_user|userId|BTREE|User's fines|
|Fine|idx_fine_status|status|BTREE|Unpaid fines|
|Fine|idx_fine_type|type|BTREE|Fine reporting|
|BookRequest|idx_request_user|userId|BTREE|User's requests|
|BookRequest|idx_request_status|status|BTREE|Pending requests|
|BookSuggestion|idx_suggestion_user|userId|BTREE|User recommendations|
|BookSuggestion|idx_suggestion_book|bookId|BTREE|Book popularity|
|BookSuggestion|idx_suggestion_score|score|BTREE|Top recommendations|
|Announcement|idx_announcement_type|type|BTREE|Filter by type|
|Announcement|idx_announcement_pinned|isPinned|BTREE|Pinned items first|
|Notification|idx_notification_user|userId|BTREE|User notifications|
|Notification|idx_notification_sent|sent|BTREE|Pending notifications|
|DailyStatistics|idx_stats_date|date|UNIQUE|Date lookup|
|UserGamification|idx_gamification_user|userId|UNIQUE|User stats|
|UserGamification|idx_gamification_points|points|BTREE|Leaderboard|

---

## Database Statistics

### Table Row Estimates

|Table|Initial|Year 1|Year 3|Growth Rate|
|---|---|---|---|---|
|User|4,500|5,000|6,000|+300/year|
|Book|8,500|10,000|12,000|+1,000/year|
|Loan|10,000|50,000|150,000|+50,000/year|
|Reservation|500|1,000|1,500|Active only|
|Fine|2,000|10,000|30,000|+10,000/year|
|Review|1,000|5,000|15,000|+5,000/year|
|ReadingHistory|20,000|100,000|300,000|+100,000/year|
|Notification|10,000|50,000|50,000|30-day retention|
|DailyStatistics|365|730|1,095|+365/year|
|VaultResource|300|500|1,000|+200/year|
|BookRequest|100|300|500|+100/year|
|BookSuggestion|5,000|10,000|20,000|Active only|
|Announcement|50|100|150|+25/year|

### Storage Estimates

|Component|Size|
|---|---|
|Database|500 MB (initial) → 6 GB (Year 3)|
|Indexes|250 MB (initial) → 2.5 GB (Year 3)|
|Book Covers|1 GB (initial) → 3 GB (Year 3)|
|Vault Files|5 GB (initial) → 20 GB (Year 3)|
|**Total**|**~7 GB → ~32 GB**|

### Performance Characteristics

|Operation|Expected Performance|
|---|---|
|Book Search|< 100ms (with indexes)|
|User Login|< 50ms|
|Checkout Book|< 200ms|
|Dashboard Load|< 300ms|
|Analytics Query|< 1s|
|Full-text Search|< 200ms|
|Recommendation Query|< 150ms|

---

## Maintenance

### Backup Strategy

- **Daily:** Automated full backup at 2:00 AM
- **Hourly:** Incremental backup during operating hours
- **Retention:** 30 days local + 90 days cloud
- **Location:** Local NAS + AWS S3/Google Cloud Storage
- **Testing:** Monthly restore tests

### Database Optimization

- **VACUUM:** Weekly (Sundays 3:00 AM)
- **ANALYZE:** Daily (after backup)
- **REINDEX:** Monthly (first Sunday)
- **Partitioning:** Loan table by year (after 500K rows)
- **Archiving:** Move old loans to archive table annually

### Monitoring

- Query performance logging (> 100ms)
- Slow query alerts (> 1s)
- Index usage statistics
- Connection pool monitoring
- Disk space alerts (< 20% free)
- Replication lag monitoring

### Security

- Row-level security (RLS) for multi-tenancy
- Encrypted connections (SSL/TLS)
- Encrypted backups
- Regular security audits
- Principle of least privilege for DB users
- Password rotation every 90 days

---

**Document Version:** 2.0  
**Schema Version:** 2.0  
**Last Review:** February 05, 2026  
**Next Review:** May 05, 2026