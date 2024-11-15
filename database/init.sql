CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS pgcrypto;


CREATE TABLE IF NOT EXISTS sites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    city VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    latitude FLOAT8 NOT NULL,
    longitude FLOAT8 NOT NULL,
    elevation INT -- Units: ft
);

INSERT INTO sites (name, city, country, latitude, longitude, elevation)
VALUES
    ('LAX', 'Los Angeles', 'United States', 33.942791, -118.410042, 125),
    ('BUR', 'Burbank', 'United States', 34.1808, -118.30897, 778),
    ('ONT', 'Ontario', 'United States', 34.053666452, -117.600664264, 944)
ON CONFLICT (name) DO NOTHING;
