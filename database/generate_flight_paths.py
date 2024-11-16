"""This is a quick and dirty script to generate fake drone paths.

python3.13 -m venv drone-c2
source drone-c2/bin/activate
pip install numpy ruff
ruff format generate_flight_paths.py --line-length 100
"""

import csv
import numpy as np
from datetime import datetime, timedelta
from typing import NamedTuple


class Coord(NamedTuple):
    lat: float
    lon: float
    alt: float


def haversine_distance(coord_a: Coord, coord_b: Coord) -> float:
    """Function to calculate the Haversine distance."""
    R = 3958.8  # Earth's radius in miles
    phi1, phi2 = np.radians(coord_a.lat), np.radians(coord_b.lat)
    delta_phi = np.radians(coord_b.lat - coord_a.lat)
    delta_lambda = np.radians(coord_b.lon - coord_a.lon)

    a = np.sin(delta_phi / 2) ** 2 + np.cos(phi1) * np.cos(phi2) * np.sin(delta_lambda / 2) ** 2
    c = 2 * np.arctan2(np.sqrt(a), np.sqrt(1 - a))
    return R * c


def generate_arc_points(
    coord_a: Coord, coord_b: Coord, speed_mph: float, time_step_seconds: float, start_time: datetime
) -> list[tuple[float, float, float]]:
    """Function to generate arc points."""
    distance = haversine_distance(coord_a, coord_b)
    total_time = distance / speed_mph  # in hours
    steps = int(total_time * 3600 / time_step_seconds)  # convert hours to seconds

    latitudes = np.linspace(coord_a.lat, coord_b.lat, steps)
    longitudes = np.linspace(coord_a.lon, coord_b.lon, steps)
    altitudes = np.linspace(coord_a.alt, coord_b.alt, steps)
    points = []
    current_time = start_time
    for lat, lon, alt in zip(latitudes, longitudes, altitudes):
        lat = round(lat, 6)
        lon = round(lon, 6)
        alt = round(alt, 1)
        points.append((lat, lon, alt, current_time.isoformat()))
        current_time += timedelta(seconds=time_step_seconds)
    return points


def create_csv_file(
    filename,
    coord_a: Coord,
    coord_b: Coord,
    speed_mph: float,
    time_step_seconds: float,
    start_time_str: str,
):
    """Generate arc points and save them to a CSV file."""
    start_time = datetime.fromisoformat(start_time_str)
    points = generate_arc_points(coord_a, coord_b, speed_mph, time_step_seconds, start_time)
    with open(filename, mode="w", newline="") as file:
        writer = csv.writer(file)
        writer.writerow(["latitude", "longitude", "altitude", "timestamp"])  # CSV header
        writer.writerows(points)
    print(f"CSV file '{filename}' created successfully with {len(points)} points.")


if __name__ == "__main__":
    create_csv_file(
        "arc_points.csv",
        Coord(34.052235, -118.243683, 305),  # Los Angeles
        Coord(40.712776, -74.005974, 10),  # New York
        500,  # Speed in mph
        10,  # Time step in seconds
        "2024-11-15T08:00:00",  # Start time in ISO 8601 format
    )
