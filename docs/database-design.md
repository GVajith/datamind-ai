# Database relationship design

All tables use SQLAlchemy Core metadata. Tenant-owned resources carry a `user_id` either directly or through a parent whose ownership is checked in every query.

```text
users 1---* auth_sessions
users 1---* datasets 1---* dataset_columns
users 1---* conversations *---1 datasets
conversations 1---* messages
conversations 1---* analyses *---1 datasets
users 1---* reports *---1 datasets
conversations 1---* reports
users 1---* ai_usage *---1 conversations
users 1---* background_jobs *---1 datasets
```

- `users`: unique normalized email, password hash, role, active flag, timestamps.
- `auth_sessions`: JWT `jti`, owning user, expiry and revocation timestamps.
- `datasets`: storage key, safe display filename, content facts, processing status and JSON profile.
- `dataset_columns`: inferred physical/semantic type and quality facts; unique per dataset/name.
- `conversations`: dataset-scoped title and rolling summary.
- `messages`: immutable ordered user/assistant/system messages with structured metadata.
- `analyses`: deterministic execution result and chart specification for a question.
- `reports`: generated artifact metadata and lifecycle status.
- `ai_usage`: model/token/cost audit rows without prompts or dataset contents.
- `background_jobs`: idempotent processing state, attempts, timing, and sanitized failures.
- `password_reset_tokens`: one-time hashed reset token with expiry and consumption time.

Foreign keys cascade only for subordinate records. Dataset deletion is coordinated by a service so stored files and vectors are removed too. Emails and session JTIs are unique. Common list paths index `(user_id, created_at)` and foreign keys. JSON fields hold dynamic profile and chart structures, never identity or ownership facts.
