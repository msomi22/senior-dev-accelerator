# Part 3 - Engines

## Offline Engine

Storage:
- Free: 50MB
- Paid: configurable

Conflict Resolution:
1. Server authoritative for identity
2. Highest attempt timestamp for progress
3. Exam submissions immutable

Retry Policy:
- exponential backoff
- max 24h retry window

## Analytics

Events:
- lesson_start
- lesson_complete
- quiz_attempt
- exam_attempt
- struggle_point
- recommendation_click

## Video Engine

Providers:
- YouTube
- Vimeo
- Cloudflare Stream

Quality:
- 1080p
- 720p
- 480p
- 360p
- Audio only

Adaptive bitrate required.

## LMS Integration
- LTI 1.3
- Canvas
- Moodle
- Schoology
