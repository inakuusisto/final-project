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


SELECT organisations.id, organisations.name, organisations.contact_first, organisations.contact_last, organisations.email, organisations.image, organisations.address, organisations.url, organisations.about, posts.description, posts.message, posts.timestamp
FROM organisations
JOIN posts
ON organisations.id = posts.organisation_id
ORDER BY posts.timestamp
DESC LIMIT 30
