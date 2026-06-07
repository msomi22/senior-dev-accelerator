# Learning Node Framework v1.0

## Status

Proposed Architecture

---

## Purpose

This document defines the foundational architecture used by the Multi-Academy Learning Platform.

The framework is designed to support multiple academies, curricula, learning models, and future capabilities without requiring changes to the core learning model.

Examples include:

- CBC Academy
- Tech Academy
- Customer Experience Academy
- Corporate Training Academy
- Future AI-assisted academies

The framework is intentionally academy-agnostic.

---

## Design Goals

### Goal 1: Everything Is A LearningNode

The platform must never hardcode educational concepts such as:

- Grade
- Subject
- Learning Area
- Strand
- Topic
- Module
- Lesson
- Practice
- Assessment
- Exam
- Course
- Track

Instead, everything is represented using a universal structure called:

`LearningNode`

Each academy defines its own hierarchy using `LearningNode`s.

---

### Goal 2: Stable Core Model

The core `LearningNode` model should change very rarely.

Future platform growth should happen through:

- Attributes
- Features
- Actions
- Appearances
- Registries

rather than modifying the `LearningNode` schema itself.

---

### Goal 3: Declarative Architecture

`LearningNode`s describe:

- what something is
- what it contains
- what capabilities it offers
- what actions can be performed
- how it should appear

`LearningNode`s do **not** describe:

- React components
- CSS classes
- routes
- pages
- implementation details

---

## Core LearningNode Model

```typescript
type LearningNode = {
  id: string;
  kind: string;
  label: string;
  summary?: string;
  parentId?: string;
  childIds?: string[];
  attributes?: NodeAttribute[];
  features?: NodeFeature[];
  actions?: NodeAction[];
  appearances?: NodeAppearance[];
  version?: number;
};
```

---

## LearningNode Fields

| Field        | Description                         |
|--------------|-------------------------------------|
| id           | Unique identifier                   |
| kind         | Logical node type                   |
| label        | Human-readable name                 |
| summary      | Optional description                |
| parentId     | Parent node identifier              |
| childIds     | Child node identifiers              |
| attributes   | Additional contextual information   |
| features     | Capabilities offered by the node    |
| actions      | Available intents                   |
| appearances  | Presentation hints                  |
| version      | Schema version                      |

---

## Attributes

### Purpose

Attributes store descriptive information about a node.

Attributes should **describe** the node.

Attributes should **never** contain implementation details.

---

### Structure

```typescript
type NodeAttribute = {
  key: string;
  value: unknown;
};
```

---

### Example

```json
attributes: [
  { "key": "curriculum", "value": "CBC" },
  { "key": "gradeLevel", "value": 1 },
  { "key": "estimatedMinutes", "value": 15 }
]
```

---

### Good Examples

- curriculum
- gradeLevel
- difficulty
- language
- estimatedMinutes
- recommendedAge
- examCode

---

### Bad Examples

- cssClass
- reactComponent
- route
- buttonColor
- pageName

---

## Features

### Purpose

Features describe capabilities available on a node.

Features answer the question:

**What does this node offer?**

---

### Structure

```typescript
type NodeFeature = {
  kind: string;
};
```

---

### Example

```json
features: [
  { "kind": "guidedContent" },
  { "kind": "practice" },
  { "kind": "assessment" }
]
```

---

### Future Examples

```json
features: [
  { "kind": "aiTutor" },
  { "kind": "videoLesson" },
  { "kind": "parentReview" },
  { "kind": "teacherAssignment" },
  { "kind": "gamification" }
]
```

---

## Actions

### Purpose

Actions describe available intents.

Actions answer the question:

**What can the learner, parent, teacher, or system do next?**

---

### Structure

```typescript
type NodeAction = {
  intent: string;
};
```

---

### Example

```json
actions: [
  { "intent": "openChildren" },
  { "intent": "resume" },
  { "intent": "startPractice" },
  { "intent": "takeAssessment" }
]
```

---

### Good Examples

- openChildren
- resume
- startGuidedLearning
- startPractice
- takeAssessment
- reviewResults
- readAloud
- startExam

---

### Bad Examples

- openEnglishPage
- goToGradeOne
- openTopicScreen
- navigateToRoute

---

## Appearances

### Purpose

Appearances provide presentation hints.

Appearances answer the question:

**How should this node appear?**

Appearances should remain implementation-independent.

---

### Structure

```typescript
type NodeAppearance = {
  key: string;
  value: unknown;
};
```

---

### Example

```json
appearances: [
  { "key": "layout", "value": "grid" },
  { "key": "density", "value": "comfortable" },
  { "key": "tone", "value": "playful" },
  { "key": "icon", "value": "book" }
]
```

---

### Future Examples

```json
appearances: [
  { "key": "animation", "value": "bounce" },
  { "key": "mascot", "value": "owl" },
  { "key": "soundEffect", "value": "success-chime" }
]
```

---

## Registries

### Purpose

LearningNodes **declare**.

Registries **implement**.

The `LearningNode` never contains implementation details.

---

### Registry Examples

- Feature Registry
- Action Registry
- Appearance Registry
- Attribute Registry

---

### Example

```
featureRegistry["practice"]
actionRegistry["startPractice"]
appearanceRegistry["playful"]
```

---

## CBC Academy Example

### Hierarchy

The CBC academy can be configured entirely using `LearningNode`s.

#### Level 1

CBC Academy

#### Level 2

Grades

- Grade 1
- Grade 2
- Grade 3
- Grade 4
- Grade 5
- Grade 6
- Grade 7
- Grade 8
- Grade 9

#### Level 3

Learning Areas

Examples:

- English
- Kiswahili
- Mathematics
- Environmental Activities
- Creative Activities
- Religious Education

#### Level 4

Strands

Example for English:

- Listening and Speaking
- Reading
- Writing
- Spelling
- Comprehension

#### Level 5

Lessons

Examples:

- Listening to Sounds
- Greetings
- Naming Objects

#### Level 6

Learning Activities

Examples:

- Guided Learning
- Practice
- Assessment
- Exam

---

### Example Learner Journey

A learner may navigate through the hierarchy as follows:

> CBC Academy → Grade 1 → English → Listening and Speaking → Lesson: Listening to Sounds → Guided Learning → Practice → Assessment → Exam

---

### Example Node Definitions

#### CBC Root Node

**Purpose:**  
Represents the root of the CBC academy.

**Kind:**  
`academy`

**Children:**  
Grade 1, Grade 2, Grade 3, Grade 4, Grade 5, Grade 6, Grade 7, Grade 8, Grade 9

---

#### Grade 1 Node

**Purpose:**  
Represents Grade 1 content.

**Kind:**  
`grade`

**Children:**  
English, Kiswahili, Mathematics, Environmental Activities, Creative Activities, Religious Education

**Attributes:**  
- curriculum = CBC  
- gradeLevel = 1

**Actions:**  
- openChildren

---

#### English Node

**Purpose:**  
Represents the English learning area.

**Kind:**  
`learningArea`

**Children:**  
Listening and Speaking, Reading, Writing, Spelling, Comprehension

---

#### Listening and Speaking Node

**Purpose:**  
Represents a strand.

**Kind:**  
`strand`

**Features:**  
- guidedContent  
- practice  
- assessment

**Actions:**  
- startGuidedLearning  
- startPractice  
- takeAssessment

---

#### Lesson Node

**Purpose:**  
Represents a lesson.

**Kind:**  
`lesson`

**Features:**  
- guidedContent  
- readAloud

---

#### Practice Node

**Purpose:**  
Represents practice activities.

**Kind:**  
`practice`

**Actions:**  
- startPractice

---

#### Assessment Node

**Purpose:**  
Represents assessment activities.

**Kind:**  
`assessment`

**Actions:**  
- takeAssessment

---

#### Exam Node

**Purpose:**  
Represents formal examinations.

**Kind:**  
`exam`

**Actions:**  
- startExam

---

## Tech Academy Example

The same `LearningNode` engine can support a completely different academy.

Example hierarchy:

```
Tech Academy
→ System Design
→ Scalability
→ Load Balancing
→ Guided Learning
→ Practice
→ Assessment
```

or

```
Tech Academy
→ Java
→ Collections
→ HashMap
→ Guided Learning
→ Practice
→ Assessment
```

No `LearningNode` schema changes are required.  
Only hierarchy configuration changes.

---

## Architecture Rule

The `LearningNode` must remain:

- Small
- Stable
- Academy-agnostic

Future expansion should occur through:

- Attributes
- Features
- Actions
- Appearances
- Registries

rather than modifying the `LearningNode` schema.
