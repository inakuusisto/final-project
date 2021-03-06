DROP TABLE IF EXISTS organisations;

CREATE TABLE organisations (
    id SERIAL primary key,
    name VARCHAR(100) NOT NULL,
    contact_first VARCHAR(100) NOT NULL,
    contact_last VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    image VARCHAR(300),
    address VARCHAR(300),
    url TEXT,
    about VARCHAR(1000),
    timestamp TIMESTAMP DEFAULT NOW()
);
