"""This is a quick and dirty script to generate fake drone paths.

python3.13 -m venv drone-c2
source drone-c2/bin/activate
pip install numpy ruff pandas
ruff format generate_flight_paths.py --line-length 100
"""

import math
import random
import numpy as np
import pandas as pd
from datetime import datetime, timedelta
from typing import NamedTuple, TypedDict
import os
from pathlib import Path


EARTH_RADIUS = 6378137.0  # Radius of Earth in meters

os.chdir(Path(__file__).parent)


class WaypointRow(TypedDict):
    tail_number: str
    latitude: float
    longitude: float
    altitude: float
    heading: float
    speed: float
    fuel: float
    timestamp: str


class Coord(NamedTuple):
    latitude: float
    longitude: float
    altitude: float

    @classmethod
    def from_row(cls, row: pd.Series):
        return cls(float(row.latitude), float(row.longitude), float(row.elevation))


def generate_oval_gps_points(
    tail_number: str,
    center: Coord,
    semi_major_axis: float,
    semi_minor_axis: float,
    speed: float,
    n_points_per_rotation: int,
    start_time: datetime,
    num_rotations: int = 1,
    rotation_angle: float = 0.0,  # Angle in degrees to rotate the ellipse.
) -> list[WaypointRow]:
    """
    Generate GPS points on a rotated oval (ellipse) based on the center, axes,
    speed, and number of points per rotation. The output includes the GPS
    coordinates, the heading in degrees, and the associated timestamp.
    """

    # Calculate the perimeter of the ellipse using an approximation.
    a, b = semi_major_axis, semi_minor_axis
    perimeter = math.pi * (3 * (a + b) - math.sqrt((3 * a + b) * (a + 3 * b)))

    # Time for one full rotation.
    rotation_time = perimeter / speed  # in seconds
    time_interval = rotation_time / n_points_per_rotation

    # Convert rotation angle to radians.
    rotation_angle_rad = math.radians(rotation_angle)

    points: list[WaypointRow] = []
    total_points = n_points_per_rotation * num_rotations
    fuel = 1.0

    for point_index in range(total_points):
        angle = (2 * math.pi * (point_index % n_points_per_rotation)) / n_points_per_rotation
        elapsed_time = timedelta(seconds=point_index * time_interval)

        # Parametric equation for an ellipse.
        x_unrotated = semi_major_axis * math.cos(angle)
        y_unrotated = semi_minor_axis * math.sin(angle)

        # Apply rotation transformation.
        x_rotated = x_unrotated * math.cos(rotation_angle_rad) - y_unrotated * math.sin(
            rotation_angle_rad
        )
        y_rotated = x_unrotated * math.sin(rotation_angle_rad) + y_unrotated * math.cos(
            rotation_angle_rad
        )

        # Convert rotated x and y into lat and lon offsets.
        d_lat = y_rotated / EARTH_RADIUS
        d_lon = x_rotated / (EARTH_RADIUS * math.cos(math.radians(center.latitude)))

        new_lat = center.latitude + math.degrees(d_lat)
        new_lon = center.longitude + math.degrees(d_lon)

        # Calculate the heading (in degrees).
        next_angle = (
            2 * math.pi * ((point_index + 1) % n_points_per_rotation)
        ) / n_points_per_rotation
        next_x_unrotated = semi_major_axis * math.cos(next_angle)
        next_y_unrotated = semi_minor_axis * math.sin(next_angle)

        next_x_rotated = next_x_unrotated * math.cos(
            rotation_angle_rad
        ) - next_y_unrotated * math.sin(rotation_angle_rad)
        next_y_rotated = next_x_unrotated * math.sin(
            rotation_angle_rad
        ) + next_y_unrotated * math.cos(rotation_angle_rad)

        delta_lon = next_x_rotated - x_rotated
        delta_lat = next_y_rotated - y_rotated
        heading = math.degrees(math.atan2(delta_lon, delta_lat)) % 360

        # Calculate the timestamp and fuel used.
        timestamp = start_time + elapsed_time
        fuel -= 0.001

        points.append(
            {
                "tail_number": tail_number,
                "latitude": round(new_lat, 6),
                "longitude": round(new_lon, 6),
                "altitude": round(center.altitude, 1),
                "heading": round(heading, 1),
                "speed": round(speed, 3),
                "fuel": round(fuel, 3),
                "timestamp": timestamp.isoformat(),
            }
        )

    return points


def calculate_heading(coord1: Coord, coord2: Coord) -> float:
    """
    Calculate the initial bearing (heading) from coord1 to coord2.

    Args:
        coord1 (Coord): Starting GPS coordinate.
        coord2 (Coord): Destination GPS coordinate.

    Returns:
        float: Initial bearing in degrees (0° is north, clockwise is east).
    """
    # Convert latitude and longitude from degrees to radians.
    lat1 = math.radians(coord1.latitude)
    lon1 = math.radians(coord1.longitude)
    lat2 = math.radians(coord2.latitude)
    lon2 = math.radians(coord2.longitude)

    # Calculate the initial bearing in radians.
    delta_lon = lon2 - lon1
    x = math.sin(delta_lon) * math.cos(lat2)
    y = math.cos(lat1) * math.sin(lat2) - math.sin(lat1) * math.cos(lat2) * math.cos(delta_lon)
    initial_bearing = math.atan2(x, y)

    # Convert the bearing from radians to degrees and normalize it to [0, 360).
    initial_bearing = math.degrees(initial_bearing)
    return (initial_bearing + 360) % 360


def haversine_distance(coord_a: Coord, coord_b: Coord) -> float:
    """Function to calculate the Haversine distance."""
    R = 3958.8  # Earth's radius in miles
    phi1, phi2 = np.radians(coord_a.latitude), np.radians(coord_b.latitude)
    delta_phi = np.radians(coord_b.latitude - coord_a.latitude)
    delta_lambda = np.radians(coord_b.longitude - coord_a.longitude)
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
) -> list[WaypointRow]:
    """Function to generate arc points."""
    distance = haversine_distance(coord_a, coord_b)
    total_time = distance / speed_mph  # in hours
    steps = int(total_time * 3600 / time_step_seconds)  # convert hours to seconds
    heading = calculate_heading(coord_a, coord_b)
    latitudes = np.linspace(coord_a.latitude, coord_b.latitude, steps)
    longitudes = np.linspace(coord_a.longitude, coord_b.longitude, steps)
    altitudes = np.linspace(coord_a.altitude, coord_b.altitude, steps)
    rows: list[WaypointRow] = []
    current_time = start_time
    fuel = 1.0
    for lat, lon, alt in zip(latitudes, longitudes, altitudes):
        fuel = max(0, fuel - 0.001)
        rows.append(
            {
                "tail_number": tail_number,
                "latitude": round(lat, 6),
                "longitude": round(lon, 6),
                "altitude": round(alt, 1),
                "heading": round(heading, 1),
                "speed": round(speed_mph, 3),
                "fuel": round(fuel, 3),
                "timestamp": current_time.isoformat(),
            }
        )
        current_time += timedelta(seconds=time_step_seconds)
    return rows


def create_paths(drones_df: pd.DataFrame, coord_a: Coord, coord_b: Coord) -> list[WaypointRow]:
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
    base_date = datetime(2025, 1, 1, 10)
    # Prepare sites.
    sites_df = pd.read_csv("./sites.csv")
    # lax = Coord.from_row(sites_df.loc[0])

    # Prepare drones.
    drone_models_df = pd.read_csv("./drone_models.csv")
    drones_df = pd.read_csv("./drones.csv")
    drones_df = pd.merge(drones_df, drone_models_df, how="left")

    # Extract out of different drones.
    drones_a = drones_df[drones_df["model"] == "Drone A"]
    drones_b = drones_df[drones_df["model"] == "Drone B"]
    drones_c = drones_df[drones_df["model"] == "Drone C"]
    drones_d = drones_df[drones_df["model"] == "Drone D"]

    rows = []

    # tail_number,latitude,longitude,altitude,heading,speed,fuel,timestamp
    for drone in drones_a.itertuples(index=False):
        poi_gps = Coord(latitude=34.68856, longitude=-117.58324, altitude=1283)
        rows.extend(
            generate_oval_gps_points(
                drone.tail_number, poi_gps, 12000, 6000, drone.max_speed, 20, base_date, 1, 30
            )
        )
        break

    # # Create paths from point A to B for the 3 different models of drones we have.
    # rows = []
    # rows.extend(create_paths(drones_df[0::5], lax, bur))
    # rows.extend(create_paths(drones_df[1::5], lax, ont))
    # rows.extend(create_paths(drones_df[2::5], bur, lax))
    # rows.extend(create_paths(drones_df[3::5], bur, ont))
    # rows.extend(create_paths(drones_df[4::5], ont, lax))

    # Write rows.
    file_name = "drone_waypoints.csv"
    pd.DataFrame(rows).to_csv(file_name, index=False)
    print(f"CSV file '{file_name}' created successfully with {len(rows)} rows.")
