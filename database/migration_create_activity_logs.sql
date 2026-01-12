-- migration_create_activity_logs.sql

CREATE TYPE action_type AS ENUM ('CREATE', 'UPDATE', 'DELETE');

CREATE TABLE activity_logs (
    id SERIAL PRIMARY KEY,
    action_type action_type NOT NULL,
    entity_type VARCHAR(50) NOT NULL, -- e.g., 'product'
    entity_id INT NOT NULL,
    details TEXT, -- Can be a JSON string with details about the change
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Optional: Add an index for faster querying by entity
CREATE INDEX idx_activity_logs_entity ON activity_logs (entity_type, entity_id);
