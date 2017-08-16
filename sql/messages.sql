DROP TABLE IF EXISTS messages;

CREATE TABLE messages (
    id SERIAL primary key,
    organisation_id INTEGER NOT NULL,
    sender_name VARCHAR(100) NOT NULL,
    sender_email VARCHAR(100) NOT NULL,
    subject TEXT NOT NULL,
    private_message TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT NOW()
);
