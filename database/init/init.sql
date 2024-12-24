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
    max_cargo_weight DECIMAL(10,2),
    max_speed DECIMAL(10,2),
    image_path VARCHAR(50)
);

COPY drone_models(model, max_cargo_weight, max_speed, image_path)
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

--------------------------------------------------------------------------------
-- Drone Waypoints.
--------------------------------------------------------------------------------

CREATE TABLE drone_waypoints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tail_number VARCHAR(50),
    latitude FLOAT NOT NULL,
    longitude FLOAT NOT NULL,
    altitude FLOAT,
    heading FLOAT,  -- degrees 0-360
    speed FLOAT,  -- mph
    fuel FLOAT,
    timestamp TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (tail_number) REFERENCES drones(tail_number) ON DELETE CASCADE ON UPDATE CASCADE
);

COPY drone_waypoints(tail_number, latitude, longitude, altitude, heading, speed, fuel, timestamp)
FROM '/docker-entrypoint-initdb.d/drone_waypoints.csv'
DELIMITER ','
CSV HEADER;
