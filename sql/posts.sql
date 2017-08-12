DROP TABLE IF EXISTS posts;

CREATE TABLE posts (
    id SERIAL primary key,
    organisation_id INTEGER NOT NULL,
    description TEXT NOT NULL,
    message TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT NOW()
);
