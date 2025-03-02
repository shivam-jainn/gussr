CREATE TABLE cities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE images (
    id SERIAL PRIMARY KEY,
    city_id INTEGER REFERENCES cities(id),
    url TEXT NOT NULL
);

CREATE TABLE clues (
    id SERIAL PRIMARY KEY,
    city_id INTEGER REFERENCES cities(id),
    clue TEXT NOT NULL
);

CREATE TABLE fun_facts (
    id SERIAL PRIMARY KEY,
    city_id INTEGER REFERENCES cities(id),
    fact TEXT NOT NULL
);

CREATE TABLE airbnb_listings (
    id SERIAL PRIMARY KEY,
    city_id INTEGER REFERENCES cities(id),
    url TEXT NOT NULL
);

CREATE TABLE headout_links (
    id SERIAL PRIMARY KEY,
    city_id INTEGER REFERENCES cities(id),
    url TEXT
);

CREATE TABLE wiki_history (
    id SERIAL PRIMARY KEY,
    city_id INTEGER REFERENCES cities(id),
    url TEXT
);