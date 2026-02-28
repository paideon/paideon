### Project NEXUS · C.W.W. Kannangara Central College

> This document explains the psychological reasoning behind every color and typography decision made for the NEXUS platform. These are not aesthetic preferences — they are deliberate, research-backed choices made to serve the platform's core mission: to make students want to read, learn, and return.

---

## 1. The Core Design Problem

Most educational platforms fail at the same thing. They either look like a corporate tool — cold, clinical, transactional — or they look like a children's app — loud, playful, and not taken seriously by older students.

NEXUS is a library management system that will grow into a full learning management system serving students from primary level through A/L, alongside teachers and administrative staff. The design must:

- Feel **trustworthy and institutional** so staff and teachers take it seriously
- Feel **warm and inviting** so students want to spend time here
- Feel **focused and calm** so the environment supports deep reading and learning
- Feel **premium and considered** so the platform earns respect rather than demanding it

These four goals directly shaped every color and font decision documented below.

---

## 2. Color Psychology

### 2.1 The Palette

|Role|Token|Dark Mode|Light Mode|
|---|---|---|---|
|Background|`--background`|`#0e1117`|`#faf8f4`|
|Card Surface|`--background-card`|`#161b27`|`#ffffff`|
|Hover Surface|`--background-hover`|`#1c2333`|`#f0ede7`|
|Primary Text|`--foreground`|`#e8e4dc`|`#1a1f2e`|
|Secondary Text|`--foreground-muted`|`#8892a4`|`#5a6478`|
|Subtle Text|`--foreground-subtle`|`#3d4659`|`#a0a8b8`|
|Brand Green|`--primary`|`#4e7c6f`|`#4e7c6f`|
|Brand Green Light|`--primary-light`|`#6a9e8f`|`#6a9e8f`|
|Gold Accent|`--gold`|`#c9a84c`|`#c9a84c`|
|Danger|`--danger`|`#c0544d`|`#c0544d`|

---

### 2.2 Background Colors — Why Not Pure Black or Pure White

The single most psychologically significant decision in any dark/light UI is the background shade. Pure black (`#000000`) and pure white (`#ffffff`) are both perceptual extremes that cause measurable eye fatigue during extended reading sessions.

**Dark mode background — `#0e1117`**

This is a deep ink tone with a subtle cool-blue undertone rather than pure black. It was chosen for three reasons:

First, **contrast reduction**. The difference in luminance between `#0e1117` and the text color `#e8e4dc` is high enough for readability but not so extreme that it causes the halation effect — the blurring that happens when white text sits on pure black due to light bleeding on LCD screens. Students reading for extended periods will experience significantly less eye strain.

Second, **emotional depth**. Dark backgrounds with a blue or navy undertone are associated psychologically with depth, focus, and night-time productivity. They subconsciously signal "this is a focused space" rather than "this is an entertainment screen." This is the same principle behind why serious tools like GitHub, Linear, and Vercel all use near-black backgrounds with cool undertones rather than pure black.

Third, **perceived premium quality**. Pure black is associated with cheap or default styling. A carefully chosen near-black communicates that the interface has been deliberately crafted.

**Light mode background — `#faf8f4`**

This warm cream tone is one of the most psychologically significant decisions in the entire palette. It is not white. It is the color of aged paper — of books.

Research in environmental psychology shows that warm cream tones in reading environments reduce cognitive anxiety and increase the perceived pleasure of reading compared to clinical white environments. This is why most high-end e-readers and reading apps (Kindle, iBooks, Instapaper) use a warm paper tone as their default reading background rather than white.

For a library platform, this color choice sends a subconscious signal before a single word is read: **this is a place for books.** It connects the digital interface to the physical experience of holding a book.

---

### 2.3 Brand Green — `#4e7c6f`

Green is the most psychologically loaded color in the human brain due to evolutionary conditioning. Humans evolved to associate green with safety, abundance, and growth — environments where food was available and danger was low. This makes green uniquely powerful for an educational platform.

However, the specific shade matters enormously. Bright greens (`#00ff00`, `#22c55e`) trigger alertness and energy — useful for gaming or fitness apps, counterproductive for a reading environment. They create arousal rather than focus.

`#4e7c6f` is a **deep, desaturated sage green**. It has been pulled toward navy and gray, stripping out the arousal-triggering saturation while preserving the psychological associations of growth and calm. The result is a color that feels:

- **Trustworthy** — institutional without being corporate
- **Calm** — conducive to focus and sustained attention
- **Growth-oriented** — subconsciously reinforcing the purpose of education
- **Natural** — grounded and accessible rather than synthetic

This shade also has a practical connection to the school's identity. Green is the school's primary institutional color. By using a sophisticated, desaturated version of green as the brand color, NEXUS maintains visual continuity with the institution while elevating it into a modern digital context.

The same green is used for `--success` states — completed readings, returned books, achieved streaks — reinforcing the psychological association: **green equals accomplishment.**

---

### 2.4 Gold Accent — `#c9a84c`

Gold carries one of the strongest psychological associations in human culture: **earned achievement.** Across virtually every culture, gold signals excellence, reward, and value that has been worked for. This is not coincidental — it is why trophies, medals, and certificates are gold.

In the NEXUS context, gold is reserved for:

- Call-to-action buttons and interactive elements
- Achievement badges and reading milestones
- Reading streak highlights
- Premium content indicators

This deliberate restriction is psychologically important. If gold appeared everywhere, it would lose its signal value. By appearing only on things worth noticing and achieving, every appearance of gold becomes a small dopamine trigger — the brain recognizes it as "something rewarding is here." This is a direct application of variable reward psychology, the same principle that makes achievement systems in games so motivating.

For a library system trying to build a reading culture, this is not a trivial detail. Every time a student sees their reading streak highlighted in gold, or earns a gold badge for finishing a book, the brain makes the association: **reading = reward.**

---

### 2.5 Danger Red — `#c0544d`

Danger states (overdue books, failed actions, errors, warnings) use a muted, slightly desaturated red. Pure red (`#ff0000` or `#ef4444`) is too aggressive for an educational environment. It triggers an acute stress response.

`#c0544d` communicates urgency clearly — the brain immediately reads it as requiring attention — but without the anxiety spike of pure red. For a student who sees an overdue fine notification, the goal is to prompt action, not cause distress. The muted version achieves this.

---

### 2.6 Text Colors — The Three-Level System

Three levels of text color serve distinct psychological roles:

**Primary foreground** (`#e8e4dc` / `#1a1f2e`) — warm off-white and deep navy respectively. Neither is pure white or pure black. This is intentional. Pure contrast is not the same as good readability. These slightly off-center shades are easier to focus on during long reading sessions because they don't create the optical vibration that pure-contrast text produces on many screens.

**Muted foreground** (`#8892a4` / `#5a6478`) — used for secondary information, descriptions, and supporting text. Psychologically, this creates a visual hierarchy that guides the eye naturally from what matters most to what matters less, reducing cognitive load. Users don't have to decide what to read first — the contrast levels make it obvious.

**Subtle foreground** (`#3d4659` / `#a0a8b8`) — used for placeholders, disabled states, and decorative text. This level signals "this is available but not currently relevant," reducing visual noise without hiding information.

---

## 3. Typography Psychology

### 3.1 The Three-Font System

NEXUS uses three typefaces, each with a specific psychological function. This is not decoration — each font triggers different cognitive and emotional responses.

---

### 3.2 Display Font — Cormorant Garamond

**Used for:** All headings, hero text, section titles, pull quotes, anything 32px and above.

Cormorant Garamond is a contemporary digital serif typeface inspired by the work of Claude Garamond, a sixteenth-century French typographer whose letterforms defined European scholarly publishing for centuries. Garamond type appeared in the books of universities, libraries, and academic institutions across Europe for over four hundred years.

The psychological effect of encountering Garamond-style type is well-documented in typography research. Readers associate it with:

- **Intellectual seriousness** — the subconscious memory of seeing similar letterforms in books, academic papers, and institutional documents creates an immediate trust signal
- **Heritage and permanence** — serifs carry the psychological weight of printed tradition, communicating that knowledge here has been considered and is worth keeping
- **Elegance and restraint** — the thin, precise strokes of Cormorant Garamond communicate refinement without arrogance

For a school library evolving into an LMS, this font says: **we take knowledge seriously.** It positions NEXUS not as another app but as an institution.

The light weight (300) is used intentionally. Heavy serif fonts feel oppressive at large sizes. Light serif fonts at large sizes feel architectural — like the carved lettering on a library building. The effect is authority without aggression.

---

### 3.3 Body Font — Inter

**Used for:** All body text, UI elements, buttons, navigation, forms, descriptions, anything under 32px.

Inter was designed by Rasmus Andersson specifically for screen readability. Unlike fonts designed for print and adapted to screen (which describes most typefaces), Inter was built from the ground up around the constraints and requirements of digital display.

Its key characteristics serve specific psychological functions:

**Slightly wider letterforms** — Inter's characters are marginally wider than comparable fonts like Helvetica or Roboto. This increases the horizontal distance between characters during reading, reducing the visual crowding effect that causes fatigue during long reading sessions. For students reading book descriptions, reviews, and notifications, this matters.

**Large x-height** — The lowercase letters in Inter are tall relative to the capitals. This increases legibility at small sizes — important for UI labels, metadata, and captions where font size is constrained.

**Neutral personality** — Inter has no strong stylistic identity of its own. It does not compete with Cormorant Garamond for attention. It simply disappears into readability, letting the content speak. This is exactly what a body font should do.

The psychological effect of Inter is **invisible comfort** — users never consciously notice it, which is the highest compliment a body font can receive. They simply find the interface easy to read.

---

### 3.4 Mono Font — JetBrains Mono

**Used for:** Small labels, tags, metadata, ISBN numbers, dates, section counters, and any text with wide letter-spacing tracking.

JetBrains Mono was designed for developers but has found wide use in premium interface design precisely because of one quality: **mechanical precision.** Its equal-width characters and slightly technical appearance communicate exactness and attention to detail.

In the NEXUS interface, mono is used sparingly and almost always at small sizes with wide letter-spacing. The psychological effect is:

**Precision signals** — When a user sees `01 — About` in monospaced type with wide tracking, the brain reads it as a system label — authoritative, structured, and carefully organized. It communicates that the interface has been engineered, not just styled.

**Contrast anchor** — Mono text next to Cormorant display text creates a typographic contrast that makes both fonts more effective. The mechanical quality of mono makes the elegance of Garamond feel more elegant. The elegance of Garamond makes the precision of mono feel more precise. They define each other.

**Restraint** — Because mono is used only for small details, its appearances feel intentional. Users notice it as a considered choice rather than a default. This contributes to the overall sense that NEXUS has been crafted with care.

---

### 3.5 The Typography Hierarchy in Practice

```
Cormorant Garamond Light     →  Hero titles, section headings
Cormorant Garamond Italic    →  Pull quotes, emphasis, brand voice moments
Inter Regular / Light        →  Body text, descriptions, paragraphs
Inter Medium / Semibold      →  Buttons, navigation, UI labels, strong emphasis
JetBrains Mono               →  Tags, metadata, counters, ISBN, dates
```

This hierarchy creates a reading experience with clear visual levels. The eye moves naturally from display → body → detail without conscious effort. Cognitive load is reduced because the visual grammar is consistent and learnable — after one page, users know what each font level means.

---

## 4. Dark Mode vs Light Mode — The Psychological Case for Both

The decision to offer both themes and default to dark was not arbitrary.

**Why dark by default:**

Research on digital reading environments shows that dark mode reduces blue light emission significantly, which is directly linked to melatonin suppression. For a school context where students may use the platform in the evening for homework research or reading, dark mode is genuinely better for sleep health and eye comfort. Dark mode also creates the focused, immersive feeling appropriate to serious study.

Additionally, NEXUS's primary audience includes students aged 12–20, a demographic that strongly associates dark interfaces with modernity and quality. First impressions matter — a dark default immediately signals that NEXUS is not another generic school system.

**Why offer light mode:**

Light mode is demonstrably better for extended reading comprehension in bright environments. A student using NEXUS in a classroom with sunlight coming through windows will read more accurately and comfortably in light mode. Teachers and librarians doing administrative work during daytime hours benefit from light mode's clarity.

The warm cream background (`#faf8f4`) ensures the light mode doesn't feel like switching to a different product — it feels like opening the same book in better light.

**Why user choice matters psychologically:**

Giving users control over their environment is itself a psychological intervention. Research in self-determination theory shows that perceived autonomy — the feeling of being in control of one's environment — increases engagement, motivation, and time spent in that environment. A student who chooses their preferred theme is more invested in the platform than one who has no choice.

---

## 5. Summary

Every decision documented here serves the same goal: **to make NEXUS feel like a place worth coming back to.**

Colors were chosen not for beauty but for the specific emotional and behavioral responses they trigger. Fonts were chosen not for style but for the cognitive and cultural associations they carry. The combination — deep ink backgrounds, warm paper light mode, institutional serif headings, invisible body text, precise mono labels, growth-green brand color, achievement-gold accents — tells a coherent psychological story:

**This is a serious place. A warm place. A place where learning is valued, rewarded, and made as effortless as possible.**

That is the foundation every component in NEXUS is built on.

---

_Document maintained by the NEXUS design system._ _Last updated: 2026_ _Related: `design_system_&_visual_identity.md`_