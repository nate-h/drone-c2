"""This is a quick and dirty script to generate fake drone paths.

python3.13 -m venv drone-c2
source drone-c2/bin/activate
pip install numpy ruff pandas
ruff format generate_flight_paths.py --line-length 100
"""

import random
import numpy as np
import pandas as pd
from datetime import datetime, timedelta
from typing import NamedTuple


class Coord(NamedTuple):
    lat: float
    lon: float
    alt: float

    @classmethod
    def from_row(cls, row: pd.Series):
        return cls(float(row.latitude), float(row.longitude), float(row.elevation))


def haversine_distance(coord_a: Coord, coord_b: Coord) -> float:
    """Function to calculate the Haversine distance."""
    R = 3958.8  # Earth's radius in miles
    phi1, phi2 = np.radians(coord_a.lat), np.radians(coord_b.lat)
    delta_phi = np.radians(coord_b.lat - coord_a.lat)
    delta_lambda = np.radians(coord_b.lon - coord_a.lon)

    a = np.sin(delta_phi / 2) ** 2 + np.cos(phi1) * np.cos(phi2) * np.sin(delta_lambda / 2) ** 2
    c = 2 * np.arctan2(np.sqrt(a), np.sqrt(1 - a))
    return R * c


def generate_arc_points_rows(
    tail_number: str,
    coord_a: Coord,
    coord_b: Coord,
    speed_mph: float,
    start_time: datetime,
    time_step_seconds=10,
) -> list[tuple[float, float, float]]:
    """Function to generate arc points."""
    distance = haversine_distance(coord_a, coord_b)
    total_time = distance / speed_mph  # in hours
    steps = int(total_time * 3600 / time_step_seconds)  # convert hours to seconds

    latitudes = np.linspace(coord_a.lat, coord_b.lat, steps)
    longitudes = np.linspace(coord_a.lon, coord_b.lon, steps)
    altitudes = np.linspace(coord_a.alt, coord_b.alt, steps)
    rows = []
    current_time = start_time
    for lat, lon, alt in zip(latitudes, longitudes, altitudes):
        lat = round(lat, 6)
        lon = round(lon, 6)
        alt = round(alt, 1)
        rows.append(
            {
                "tail_number": tail_number,
                "lat": lat,
                "lon": lon,
                "alt": alt,
                "timestamp": current_time.isoformat(),
            }
        )
        current_time += timedelta(seconds=time_step_seconds)
    return rows


def create_paths(drones_df: pd.DataFrame, coord_a: Coord, coord_b: Coord) -> list[dict]:
    rows = []
    for tail_number, max_speed in drones_df.itertuples(index=False):
        # Create random speed that is approximately the max speed of this drone.
        speed = random.uniform(0.9, 1) * max_speed

        # Create random starting time after 10am.
        base_date = datetime(2025, 1, 1, 10)
        random_time = timedelta(seconds=random.randint(0, 2 * 3600))
        start_time = base_date + random_time
        rows.extend(generate_arc_points_rows(tail_number, coord_a, coord_b, speed, start_time))
    return rows


if __name__ == "__main__":
    # Prepare sites.
    sites_df = pd.read_csv("./sites.csv")
    assert len(sites_df) == 3, "Expecting just 3 test sites."
    lax = Coord.from_row(sites_df.loc[0])
    bur = Coord.from_row(sites_df.loc[1])
    ont = Coord.from_row(sites_df.loc[2])

    # Prepare drones.
    drone_models_df = pd.read_csv("./drone_models.csv")
    drones_df = pd.read_csv("./drones.csv")
    drones_df = pd.merge(drones_df, drone_models_df, how="left")
    drones_df = drones_df.drop(["model", "max_cargo_weight"], axis=1)
    assert len(drones_df) == 30, "Expecting just 30 test drones."

    # Create paths from point A to B for the 3 different models of drones we have.
    rows = []
    rows.extend(create_paths(drones_df[0::5], lax, bur))
    rows.extend(create_paths(drones_df[1::5], lax, ont))
    rows.extend(create_paths(drones_df[2::5], bur, lax))
    rows.extend(create_paths(drones_df[3::5], bur, ont))
    rows.extend(create_paths(drones_df[4::5], ont, lax))
    rows.extend(create_paths(drones_df[5::5], ont, bur))

    # Write rows.
    file_name = "waypoints.csv"
    pd.DataFrame(rows).to_csv(file_name, index=False)
    print(f"CSV file '{file_name}' created successfully with {len(rows)} rows.")