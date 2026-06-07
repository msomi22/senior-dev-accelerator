# Part 1 - Product, Learning Graph & Adaptive Learning

## Learning Graph
Academy -> Module -> Competency -> Skill -> Topic -> Lesson -> Activity -> Assessment

## Mastery Model
- Beginner: 0-39
- Developing: 40-59
- Competent: 60-79
- Strong: 80-94
- Mastered: 95-100

Mastery achieved when:
- >=80% score
- 3 consecutive successful attempts
- Retention score >=70% after review cycle

## Learner Intelligence Profile
Tracks:
- strengths
- weaknesses
- mastery
- retention
- learning velocity
- intervention history

## Recommendation Engine
Score content using:
recommendationScore =
(masteryGap * 0.4) +
(retentionRisk * 0.3) +
(curriculumPriority * 0.2) +
(recentPerformance * 0.1)

## Intervention Rules
- Mastery < 40% for 3 attempts -> learner intervention
- No improvement after 2 weeks -> parent notification
- No improvement after 4 weeks -> teacher intervention

## Dynamic Difficulty Adjustment
- 2 failures -> easier practice
- 3 scores >=90% -> harder practice
- Difficulty range controlled by academy config
