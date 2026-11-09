from sqlalchemy import (
    JSON,
    BigInteger,
    Boolean,
    Column,
    DateTime,
    ForeignKey,
    Index,
    Integer,
    MetaData,
    Numeric,
    String,
    Table,
    Text,
    UniqueConstraint,
    func,
)

metadata = MetaData()

users = Table(
    "users",
    metadata,
    Column("user_id", String(36), primary_key=True),
    Column("full_name", String(150), nullable=False),
    Column("email", String(320), nullable=False, unique=True),
    Column("password_hash", String(512), nullable=False),
    Column("role", String(30), nullable=False, server_default="user"),
    Column("is_active", Boolean, nullable=False, server_default="1"),
    Column("created_at", DateTime(timezone=True), nullable=False, server_default=func.now()),
    Column("updated_at", DateTime(timezone=True), nullable=False, server_default=func.now()),
)

auth_sessions = Table(
    "auth_sessions",
    metadata,
    Column("session_id", String(36), primary_key=True),
    Column("user_id", String(36), ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False),
    Column("token_jti", String(36), nullable=False, unique=True),
    Column("expires_at", DateTime(timezone=True), nullable=False),
    Column("revoked_at", DateTime(timezone=True)),
    Column("created_at", DateTime(timezone=True), nullable=False, server_default=func.now()),
)

password_reset_tokens = Table(
    "password_reset_tokens",
    metadata,
    Column("reset_id", String(36), primary_key=True),
    Column("user_id", String(36), ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False),
    Column("token_hash", String(64), nullable=False, unique=True),
    Column("expires_at", DateTime(timezone=True), nullable=False),
    Column("used_at", DateTime(timezone=True)),
    Column("created_at", DateTime(timezone=True), nullable=False, server_default=func.now()),
)

datasets = Table(
    "datasets",
    metadata,
    Column("dataset_id", String(36), primary_key=True),
    Column("user_id", String(36), ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False),
    Column("file_name", String(255), nullable=False),
    Column("storage_key", String(512), nullable=False, unique=True),
    Column("file_type", String(20), nullable=False),
    Column("file_size", BigInteger, nullable=False),
    Column("total_rows", BigInteger),
    Column("total_columns", Integer),
    Column("processing_status", String(30), nullable=False, server_default="pending"),
    Column("profile_json", JSON),
    Column("created_at", DateTime(timezone=True), nullable=False, server_default=func.now()),
    Column("updated_at", DateTime(timezone=True), nullable=False, server_default=func.now()),
)

dataset_columns = Table(
    "dataset_columns",
    metadata,
    Column("column_id", String(36), primary_key=True),
    Column("dataset_id", String(36), ForeignKey("datasets.dataset_id", ondelete="CASCADE"), nullable=False),
    Column("column_name", String(255), nullable=False),
    Column("data_type", String(80), nullable=False),
    Column("semantic_type", String(80)),
    Column("missing_count", BigInteger, nullable=False, server_default="0"),
    Column("unique_count", BigInteger, nullable=False, server_default="0"),
    Column("column_metadata", JSON),
    UniqueConstraint("dataset_id", "column_name", name="uq_dataset_column_name"),
)

conversations = Table(
    "conversations",
    metadata,
    Column("conversation_id", String(36), primary_key=True),
    Column("user_id", String(36), ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False),
    Column("dataset_id", String(36), ForeignKey("datasets.dataset_id", ondelete="CASCADE"), nullable=False),
    Column("title", String(255), nullable=False),
    Column("conversation_summary", Text),
    Column("created_at", DateTime(timezone=True), nullable=False, server_default=func.now()),
    Column("updated_at", DateTime(timezone=True), nullable=False, server_default=func.now()),
)

messages = Table(
    "messages",
    metadata,
    Column("message_id", String(36), primary_key=True),
    Column("conversation_id", String(36), ForeignKey("conversations.conversation_id", ondelete="CASCADE"), nullable=False),
    Column("role", String(20), nullable=False),
    Column("message_content", Text, nullable=False),
    Column("response_metadata", JSON),
    Column("created_at", DateTime(timezone=True), nullable=False, server_default=func.now()),
)

analyses = Table(
    "analyses",
    metadata,
    Column("analysis_id", String(36), primary_key=True),
    Column("conversation_id", String(36), ForeignKey("conversations.conversation_id", ondelete="CASCADE"), nullable=False),
    Column("dataset_id", String(36), ForeignKey("datasets.dataset_id", ondelete="CASCADE"), nullable=False),
    Column("question", Text, nullable=False),
    Column("analysis_type", String(80), nullable=False),
    Column("execution_result", JSON, nullable=False),
    Column("chart_configuration", JSON),
    Column("created_at", DateTime(timezone=True), nullable=False, server_default=func.now()),
)

reports = Table(
    "reports",
    metadata,
    Column("report_id", String(36), primary_key=True),
    Column("user_id", String(36), ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False),
    Column("dataset_id", String(36), ForeignKey("datasets.dataset_id", ondelete="CASCADE"), nullable=False),
    Column("conversation_id", String(36), ForeignKey("conversations.conversation_id", ondelete="SET NULL")),
    Column("report_name", String(255), nullable=False),
    Column("storage_key", String(512)),
    Column("report_status", String(30), nullable=False, server_default="pending"),
    Column("created_at", DateTime(timezone=True), nullable=False, server_default=func.now()),
)

ai_usage = Table(
    "ai_usage",
    metadata,
    Column("usage_id", String(36), primary_key=True),
    Column("user_id", String(36), ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False),
    Column("conversation_id", String(36), ForeignKey("conversations.conversation_id", ondelete="SET NULL")),
    Column("model_name", String(120), nullable=False),
    Column("input_tokens", Integer, nullable=False, server_default="0"),
    Column("output_tokens", Integer, nullable=False, server_default="0"),
    Column("estimated_cost", Numeric(12, 6), nullable=False, server_default="0"),
    Column("created_at", DateTime(timezone=True), nullable=False, server_default=func.now()),
)

background_jobs = Table(
    "background_jobs",
    metadata,
    Column("job_id", String(36), primary_key=True),
    Column("user_id", String(36), ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False),
    Column("dataset_id", String(36), ForeignKey("datasets.dataset_id", ondelete="CASCADE"), nullable=False),
    Column("job_type", String(80), nullable=False),
    Column("job_status", String(30), nullable=False, server_default="pending"),
    Column("attempt_count", Integer, nullable=False, server_default="0"),
    Column("error_message", Text),
    Column("started_at", DateTime(timezone=True)),
    Column("completed_at", DateTime(timezone=True)),
    Column("created_at", DateTime(timezone=True), nullable=False, server_default=func.now()),
)

Index("ix_sessions_user", auth_sessions.c.user_id)
Index("ix_datasets_user_created", datasets.c.user_id, datasets.c.created_at)
Index("ix_conversations_user_created", conversations.c.user_id, conversations.c.created_at)
Index("ix_messages_conversation_created", messages.c.conversation_id, messages.c.created_at)
Index("ix_reports_user_created", reports.c.user_id, reports.c.created_at)
Index("ix_jobs_user_status", background_jobs.c.user_id, background_jobs.c.job_status)
