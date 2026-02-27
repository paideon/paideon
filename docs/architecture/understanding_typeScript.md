
> Why NEXUS uses TypeScript, what it actually does, and how it's used throughout this project.

---

## What is TypeScript?

TypeScript is JavaScript with one addition: **types**.

That's it. Everything you can do in JavaScript, you can do in TypeScript. TypeScript just lets you declare what kind of data a variable holds — and then tells you immediately when you're using it wrong.

```typescript
// JavaScript — no types, no warnings
function getBook(id) {
  return fetchBook(id);
}
getBook("hello")  // works
getBook(true)     // works — but probably wrong

// TypeScript — types declared, errors caught immediately
function getBook(id: number) {
  return fetchBook(id);
}
getBook("hello")  // ❌ Error: Argument of type 'string' is not assignable to type 'number'
getBook(true)     // ❌ Error: Argument of type 'boolean' is not assignable to type 'number'
getBook(42)       // ✅ Correct
```

TypeScript catches these errors **before you run the code** — in your editor, as you type.

---

## Why NEXUS Uses TypeScript

NEXUS is a large system. At full build it will have:

- 9+ NestJS modules in the API (auth, users, books, loans, reservations, fines, notifications, analytics, digital vault)
- Multiple React components in the web app
- Shared types used by both apps

Without TypeScript, a bug like passing a `string` where a `number` is expected would only be discovered when a student tries to check out a book and the app crashes. With TypeScript, that bug is caught the moment you type it — before it ever reaches the database.

**The three real benefits for this project:**

**1. Autocomplete everywhere** When you type `book.`, your editor immediately shows every property that exists on a book object. No guessing, no opening the database schema to remember what fields exist.

**2. Refactoring safety** When you rename a field in the Prisma schema — say `checkoutDate` to `borrowedAt` — TypeScript immediately shows every single place in the codebase that uses the old name. You fix them all before the app breaks.

**3. Self-documenting code** A function signature like `function calculateFine(loan: Loan, returnDate: Date): number` tells you everything — what it takes, what it returns — without reading the implementation.

---

## TypeScript Fundamentals Used in NEXUS

### Primitive Types

```typescript
const title: string = "Harry Potter";
const copies: number = 5;
const isAvailable: boolean = true;
const accessionNumber: string | null = null; // can be string OR null
```

### Arrays

```typescript
const authors: string[] = ["J.K. Rowling", "George R.R. Martin"];
const bookIds: number[] = [1, 2, 3, 4];
```

### Objects with Interfaces

An `interface` describes the shape of an object — what properties it has and what type each property is.

```typescript
interface Book {
  id: string;
  title: string;
  authors: string[];
  isbn: string | null;
  coverImage: string | null;
  publishedYear: number | null;
  isAvailable: boolean;
  createdAt: Date;
}

// Now every Book object must match this shape
const book: Book = {
  id: "cuid123",
  title: "To Kill a Mockingbird",
  authors: ["Harper Lee"],
  isbn: "978-0061935466",
  coverImage: null,
  publishedYear: 1960,
  isAvailable: true,
  createdAt: new Date(),
};
```

### Type vs Interface

Both describe object shapes. In NEXUS we use `interface` for objects (especially Prisma models and API responses) and `type` for unions and computed types.

```typescript
// interface — for objects
interface User {
  id: string;
  email: string;
  role: Role;
}

// type — for unions (multiple possible values)
type Role = 'STUDENT' | 'TEACHER' | 'STAFF' | 'LIBRARIAN' | 'ADMIN';

// type — for computed shapes
type CreateBookDto = Omit<Book, 'id' | 'createdAt' | 'updatedAt'>;
```

### Enums

Used for fixed sets of values. NEXUS uses enums for roles, statuses, and conditions.

```typescript
enum UserRole {
  STUDENT   = 'STUDENT',
  TEACHER   = 'TEACHER',
  STAFF     = 'STAFF',
  LIBRARIAN = 'LIBRARIAN',
  ADMIN     = 'ADMIN',
}

enum BookCondition {
  EXCELLENT = 'EXCELLENT',
  GOOD      = 'GOOD',
  FAIR      = 'FAIR',
  POOR      = 'POOR',
  DAMAGED   = 'DAMAGED',
}

enum LoanStatus {
  ACTIVE    = 'ACTIVE',
  RETURNED  = 'RETURNED',
  OVERDUE   = 'OVERDUE',
  LOST      = 'LOST',
}
```

### Functions with Types

```typescript
// Parameters typed, return type typed
function calculateFine(
  dueDate: Date,
  returnDate: Date,
  ratePerDay: number
): number {
  const msPerDay = 1000 * 60 * 60 * 24;
  const overdueDays = Math.max(
    0,
    Math.floor((returnDate.getTime() - dueDate.getTime()) / msPerDay)
  );
  return Math.min(overdueDays * ratePerDay, 500); // Max Rs. 500
}

// Arrow function — same idea
const isOverdue = (dueDate: Date): boolean => {
  return new Date() > dueDate;
};
```

### Optional Properties

```typescript
interface CreateUserDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;        // ? means optional — may or may not be provided
  profileImage?: string;
}
```

### Generics

Generics let you write reusable code that works with any type.

```typescript
// Without generics — only works for strings
function getFirst(arr: string[]): string {
  return arr[0];
}

// With generics — works for any type
function getFirst<T>(arr: T[]): T {
  return arr[0];
}

getFirst<string>(["a", "b", "c"])   // returns "a"
getFirst<number>([1, 2, 3])         // returns 1
getFirst<Book>([book1, book2])      // returns book1
```

In NEXUS you'll see generics in API response wrappers:

```typescript
interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

// Used as:
ApiResponse<Book>        // response containing a single book
ApiResponse<Book[]>      // response containing an array of books
ApiResponse<Loan>        // response containing a loan
```

### Utility Types

TypeScript has built-in tools for transforming types. These are used constantly in NEXUS DTOs.

```typescript
interface Book {
  id: string;
  title: string;
  isbn: string;
  coverImage: string;
  createdAt: Date;
  updatedAt: Date;
}

// Omit — remove specific fields
type CreateBookDto = Omit<Book, 'id' | 'createdAt' | 'updatedAt'>;
// Result: { title: string; isbn: string; coverImage: string; }

// Partial — make all fields optional (useful for update DTOs)
type UpdateBookDto = Partial<Omit<Book, 'id' | 'createdAt' | 'updatedAt'>>;
// Result: { title?: string; isbn?: string; coverImage?: string; }

// Pick — keep only specific fields
type BookSummary = Pick<Book, 'id' | 'title'>;
// Result: { id: string; title: string; }

// Required — make all fields required (opposite of Partial)
type RequiredBook = Required<Book>;
```

### Union Types

```typescript
// A value that can be one of multiple types
type Id = string | number;
type NullableString = string | null;
type SearchField = 'title' | 'author' | 'isbn' | 'category';

// Used in NEXUS search:
function searchBooks(query: string, field: SearchField) {
  // TypeScript guarantees field can only be those 4 values
}

searchBooks("Rowling", "author")    // ✅
searchBooks("Rowling", "publisher") // ❌ Error — 'publisher' not in SearchField
```

---

## How TypeScript Works in the NEXUS Monorepo

### The `tsconfig.base.json` at the root

This is the shared TypeScript configuration. All apps and packages inherit from it.

```json
{
  "compilerOptions": {
    "strict": true,           // Enables all strict type checks
    "target": "ES2022",       // What JavaScript version to compile to
    "moduleResolution": "bundler",
    "paths": {
      "@nexus/types/*": ["packages/types/src/*"],
      "@nexus/database/*": ["packages/database/src/*"],
      "@nexus/ui/*": ["packages/ui/src/*"]
    }
  }
}
```

The `paths` section is what makes `import { Book } from '@nexus/types'` work everywhere without needing relative paths like `../../../../packages/types/src/book`.

### App-specific overrides

Each app extends the base and only adds what's different:

```json
// apps/api/tsconfig.json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "module": "commonjs",           // Node.js modules
    "emitDecoratorMetadata": true,  // Required for NestJS decorators
    "experimentalDecorators": true
  }
}

// apps/web/tsconfig.json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "jsx": "preserve",   // Next.js handles JSX transformation
    "module": "ESNext"   // Browser modules
  }
}
```

### Shared types in `packages/types`

Types defined once, imported everywhere:

```typescript
// packages/types/src/book.types.ts
export interface Book {
  id: string;
  title: string;
  authors: string[];
  isbn: string | null;
  isAvailable: boolean;
}

// Used in the API (apps/api):
import { Book } from '@nexus/types';

// Used in the Web (apps/web):
import { Book } from '@nexus/types';
```

If the `Book` type changes, it changes once and both apps see the update immediately. No duplication.

---

## TypeScript in NestJS (API)

NestJS is built specifically for TypeScript. It uses **decorators** — annotations that start with `@` — to define routes, inject services, and validate data.

```typescript
// A real NestJS controller in NEXUS
import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';

@Controller('books')             // All routes start with /books
export class BooksController {

  constructor(
    private readonly booksService: BooksService  // TypeScript injects this
  ) {}

  @Get()                         // GET /books
  findAll() {
    return this.booksService.findAll();
  }

  @Get(':id')                    // GET /books/:id
  findOne(@Param('id') id: string) {
    return this.booksService.findOne(id);
  }

  @Post()                        // POST /books
  create(@Body() createBookDto: CreateBookDto) {
    // TypeScript guarantees createBookDto matches CreateBookDto shape
    return this.booksService.create(createBookDto);
  }
}
```

### DTOs (Data Transfer Objects)

DTOs define exactly what shape of data an API endpoint accepts. Combined with `class-validator`, they provide automatic request validation.

```typescript
// apps/api/src/books/dto/create-book.dto.ts
import { IsString, IsNotEmpty, IsOptional, IsNumber, Min } from 'class-validator';

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString({ each: true })
  @IsNotEmpty()
  authors: string[];

  @IsString()
  @IsOptional()
  isbn?: string;

  @IsNumber()
  @Min(1)
  @IsOptional()
  publishedYear?: number;
}
```

If a request comes in with `title: 123` instead of a string, NestJS automatically rejects it with a 400 error before the code even runs.

---

## TypeScript in Next.js (Web)

In React components, TypeScript types props:

```typescript
// A typed React component in NEXUS
interface BookCardProps {
  book: {
    id: string;
    title: string;
    authors: string[];
    coverImage: string | null;
    isAvailable: boolean;
  };
  onReserve?: (bookId: string) => void; // optional callback
}

export function BookCard({ book, onReserve }: BookCardProps) {
  return (
    <div>
      <h3>{book.title}</h3>
      <p>{book.authors.join(', ')}</p>
      {book.isAvailable ? (
        <span>Available</span>
      ) : (
        <button onClick={() => onReserve?.(book.id)}>
          Reserve
        </button>
      )}
    </div>
  );
}
```

TypeScript ensures you can never pass a `number` where `string` is expected, never access `.title` on something that might be `undefined`, and always handle `null` cases explicitly.

### Typed `useState`

```typescript
const [books, setBooks] = useState<Book[]>([]);
const [selectedBook, setSelectedBook] = useState<Book | null>(null);
const [isLoading, setIsLoading] = useState<boolean>(false);
```

### Typed `useRef`

```typescript
const inputRef = useRef<HTMLInputElement>(null);
const sectionRef = useRef<HTMLElement>(null);
```

---

## The `strict` Mode

NEXUS has `"strict": true` in `tsconfig.base.json`. This enables the most thorough type checking. The most important rules it turns on:

**`strictNullChecks`** — The single most impactful rule. Without it, `null` and `undefined` can be assigned to anything silently. With it:

```typescript
let book: Book = null;  // ❌ Error — null is not a Book

let book: Book | null = null;  // ✅ Explicitly allowed
if (book !== null) {
  console.log(book.title);  // ✅ TypeScript knows it's not null here
}
```

**`noImplicitAny`** — Every variable must have a known type. No silent `any`.

```typescript
function process(data) { ... }        // ❌ Error — data has implicit 'any' type
function process(data: unknown) { ... } // ✅ Explicit
```

---

## Common TypeScript Errors You Will See

|Error|What it means|How to fix|
|---|---|---|
|`Type 'string' is not assignable to type 'number'`|Wrong type passed|Pass the correct type|
|`Object is possibly 'null'`|Value might be null, not handled|Add null check: `if (x !== null)`|
|`Property 'x' does not exist on type 'Y'`|Accessing a field that doesn't exist|Check the type definition, fix the property name|
|`Argument of type 'X' is not assignable to parameter of type 'Y'`|Wrong type passed to a function|Fix what you're passing in|
|`Cannot find module '@nexus/types'`|Path alias not configured|Check `tsconfig.base.json` paths|

---

## Summary

|Concept|Used in NEXUS for|
|---|---|
|`interface`|Defining Book, User, Loan shapes|
|`type`|Role unions, utility types, DTOs|
|`enum`|UserRole, BookCondition, LoanStatus|
|Generics|ApiResponse<T>, reusable hooks|
|Utility types|CreateDto, UpdateDto from existing interfaces|
|Decorators|NestJS controllers, services, validation|
|Strict mode|Catching null errors, implicit any|
|Shared types|`@nexus/types` package used by API and Web|

TypeScript does not change how the code runs. It only changes how you write it — and how many bugs reach production (fewer).

---

_Project NEXUS © 2026 — Cinderax | C.W.W. Kannangara Central College_