# StudentOS architecture

## Mobile-first boundaries

```text
Presentation (React Native / Expo, Android / iOS)
  └── application services
        ├── identity gateway
        ├── scheduling + study engine
        ├── learning / spaced repetition engine
        ├── mobile-control adapter
        ├── notification adapter
        ├── curriculum gateway
        └── API client
              └── authenticated StudentOS API
                    ├── PostgreSQL
                    ├── object storage
                    ├── queued notifications
                    ├── curriculum importer + verifier
                    └── AI provider (server-side key only)
```

The current browser preview uses the same service boundaries and a local persistence implementation. It does **not** masquerade as a native application.

## API contracts to implement server-side

All endpoints require a verified bearer token unless noted.

| Area | Endpoint | Purpose |
| --- | --- | --- |
| Identity | Firebase Auth or OIDC verification | Verify provider-issued tokens; passwords are never handled by StudentOS API. |
| Profile | `GET/PUT /v1/me` | Profile, education context, language, consent. |
| Planning | `/v1/tasks`, `/v1/schedules`, `/v1/study-sessions` | Per-user CRUD and append-only session events. |
| Learning | `/v1/subjects`, `/v1/recall-cards`, `/v1/tests` | Curriculum-linked learning objects. |
| AI | `POST /v1/ai/tutor` | Server validates entitlement/context and calls approved model provider. |
| Curriculum | `GET /v1/curricula` | Return only imported, source-attributed, verified versions. |
| Family | `/v1/family-groups`, `/v1/guardian-links` | Explicit invite, approval and narrow sharing scopes. |
| Privacy | `/v1/me/export`, `DELETE /v1/me` | Audited export/deletion workflows. |

## Progressive education profile

The client stores an education profile using canonical, non-localized values rather than hard-coded country fields:

```text
country → educationSystem → educationLevel → grade/year → track → specialization
                                                └─ university: degree, major, year, semester
                                                └─ vocational: program, specialization, year
                                                └─ self-learning: selected interests
```

`education_level` values are `early_childhood`, `primary`, `middle`, `high`, `university`, `vocational`, `adult`, `self_learning`, and `other`. A user may leave optional values `null`; no service is permitted to infer a country, curriculum, grade, track, major, or subject. The profile includes a separate `studyLanguage`, which is never inferred from app UI language.

At the API layer, expose small cached option queries (`/v1/education/countries`, `/systems?country=`, `/levels`, `/grades`, `/tracks`) rather than downloading a global curriculum dataset at first login. Only verified curriculum versions may return recommended subjects. Until then return `official_source_unavailable`.

On an education-profile change, retain a versioned education-history record and preserve existing tasks, sessions, subjects, and learning history. The API may propose an explicit subject/curriculum update but must never delete data as a side effect.

## Data ownership and authorization

Use opaque UUIDs, row-level authorization keyed by `user_id`, rate limits, security-event audit logs, and object storage access through short-lived scoped URLs. Guardian sharing is opt-in and must be scoped to aggregate study statistics; conversations, notes, uploads, and private answers are denied by default.

## Curriculum provenance

`curriculum_sources` stores authority, country, official URL, language, publication date, retrieved date and license. `curriculum_versions` stores academic year, verification state, hash, reviewer, last checked timestamp and supersession link. The AI service must refuse a curriculum-specific assertion if no verified version exists.

## Platform adapter contract

```ts
interface MobileControlService {
  getCapabilities(): Promise<DeviceCapability[]>;
  requestPermission(kind: PermissionKind): Promise<PermissionState>;
  startStudyPolicy(policy: StudyPolicy): Promise<PolicyResult>;
  stopStudyPolicy(activePolicyId: string): Promise<void>;
  getUsage(category: EntertainmentCategory, period: DateRange): Promise<UsageResult>;
}
```

- **Android:** implement only via documented APIs, such as notification permission and optional Usage Access / device-owner APIs when the deployment and user grant permit it. Never claim a consumer app can universally block apps.
- **iOS/iPadOS:** use Screen Time APIs only with Apple-approved entitlement and user authorization. Until granted and confirmed, show unavailable.
- **Web preview:** offers browser notification permission only. Usage reading and app restriction are unsupported.

## Offline and synchronization

On mobile, use an encrypted local store/SQLite with an outbox of mutation records (`operationId`, entity, payload, device time, version). Sync is idempotent, uses server revisions, and leaves conflicted user edits visible for resolution. The preview's local storage is intentionally not presented as an encrypted cloud store.
