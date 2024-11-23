CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS pgcrypto;


--------------------------------------------------------------------------------
-- Sites
--------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS sites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    city VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    latitude FLOAT8 NOT NULL,
    longitude FLOAT8 NOT NULL,
    elevation INT -- Units: ft
);

COPY sites(name, city, country, latitude, longitude, elevation)
FROM '/docker-entrypoint-initdb.d/sites.csv'
DELIMITER ','
CSV HEADER;


--------------------------------------------------------------------------------
-- Drone Models.
--------------------------------------------------------------------------------

CREATE TABLE drone_models (
    model VARCHAR(50) PRIMARY KEY,
    max_cargo_weight DECIMAL(10,2)
);

COPY drone_models(model, max_cargo_weight)
FROM '/docker-entrypoint-initdb.d/drone_models.csv'
DELIMITER ','
CSV HEADER;

--------------------------------------------------------------------------------
-- Drones.
--------------------------------------------------------------------------------

CREATE TABLE drones (
    tail_number VARCHAR(10) PRIMARY KEY,
    model VARCHAR(50),
    FOREIGN KEY (model) REFERENCES drone_models(model) ON DELETE CASCADE ON UPDATE CASCADE
);

COPY drones(tail_number,model)
FROM '/docker-entrypoint-initdb.d/drones.csv'
DELIMITER ','
CSV HEADER;
