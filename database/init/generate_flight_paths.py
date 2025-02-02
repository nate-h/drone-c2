"""This is a quick and dirty script to generate fake drone paths.

python3.13 -m venv drone-c2
source drone-c2/bin/activate
pip install numpy ruff pandas pandas-stubs
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


EARTH_RADIUS = 3963.1  # Radius of Earth in miles
SIM_START = datetime(2025, 1, 1, 10)
SIM_END = datetime(2025, 1, 1, 12)

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

    def noise(self, max_offset: float = 0.0001) -> "Coord":
        """Generates a random point near the current position."""
        return Coord(
            latitude=self.latitude + random.uniform(-max_offset, max_offset),
            longitude=self.longitude + random.uniform(-max_offset, max_offset),
            altitude=self.altitude,
        )


def generate_oval_gps_points(
    tail_number: str,
    center: Coord,
    semi_major_axis: float,
    semi_minor_axis: float,
    speed_mph: float,
    n_points_per_rotation: int,
    start_time: datetime,
    num_rotations: int = 1,
    rotation_angle: float = 0.0,  # Angle in degrees to rotate the ellipse.
) -> list[WaypointRow]:
    """Generate GPS points on a rotated oval (ellipse) based on the center, axes,
    speed, and number of points per rotation. The output includes the GPS
    coordinates, the heading in degrees, and the associated timestamp.

    Args:
        tail_number (str): Airplane tail number
        center (Coord): GPS point of center
        semi_major_axis (float): Major axis radius in miles
        semi_minor_axis (float): Minor axis radius in miles
        speed_mph (float): Speed of thing
        n_points_per_rotation (int): Number of points to use per rotation
        start_time (datetime): Start time for the path.
        num_rotations (int, optional): How many ovals should be created. Defaults to 1.
        rotation_angle (float, optional): Rotation angle of oval about center. Defaults to 0.0.

    Returns:
        list[WaypointRow]: List of waypoints that are prepped for csv saving.
    """

    # Calculate the perimeter of the ellipse using an approximation.
    a, b = semi_major_axis, semi_minor_axis
    perimeter = math.pi * (3 * (a + b) - math.sqrt((3 * a + b) * (a + 3 * b)))

    # Time for one full rotation.
    rotation_time = perimeter / speed_mph  # in seconds
    time_interval = rotation_time / n_points_per_rotation

    # Convert rotation angle to radians.
    rotation_angle_rad = math.radians(rotation_angle)

    points: list[WaypointRow] = []
    total_points = n_points_per_rotation * num_rotations + 1
    fuel = 1.0
    coord_a = center

    for point_index in range(total_points):
        angle = (2 * math.pi * (point_index % n_points_per_rotation)) / n_points_per_rotation
        elapsed_time = timedelta(hours=point_index * time_interval)

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

        center = center.noise(0.0005)
        new_lat = center.latitude + math.degrees(d_lat)
        new_lon = center.longitude + math.degrees(d_lon)

        # Calculate the heading (in degrees).
        coord_b = Coord(new_lat, new_lon, 0)
        heading = calculate_heading(coord_a, coord_b)
        coord_a = coord_b

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
                "speed": round(speed_mph, 3),
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
    phi1, phi2 = np.radians(coord_a.latitude), np.radians(coord_b.latitude)
    delta_phi = np.radians(coord_b.latitude - coord_a.latitude)
    delta_lambda = np.radians(coord_b.longitude - coord_a.longitude)
    a = np.sin(delta_phi / 2) ** 2 + np.cos(phi1) * np.cos(phi2) * np.sin(delta_lambda / 2) ** 2
    c = 2 * np.arctan2(np.sqrt(a), np.sqrt(1 - a))
    return EARTH_RADIUS * c


def get_random_row(df: pd.DataFrame) -> pd.Series:
    """
    Returns a random row from the given DataFrame.

    Args:
        df (pd.DataFrame): The input DataFrame.

    Returns:
        pd.Series: A randomly selected row from the DataFrame.
    """
    if df.empty:
        raise ValueError("The DataFrame is empty.")
    random_index = random.randint(0, len(df) - 1)
    return df.iloc[random_index]


def format_waypoint_row(
    tail_number: str,
    coord: Coord,
    time: datetime,
    heading: float,
    speed_mph: float,
) -> WaypointRow:
    return {
        "tail_number": tail_number,
        "latitude": round(coord.latitude, 6),
        "longitude": round(coord.longitude, 6),
        "altitude": round(coord.altitude, 1),
        "heading": round(heading, 1),
        "speed": round(speed_mph, 3),
        "fuel": round(1, 3),
        "timestamp": time.isoformat(),
    }


if __name__ == "__main__":
    # Prepare sites.
    sites_df = pd.read_csv("./sites.csv")
    airfields_df = sites_df[sites_df["site_type"] == "airfield"]

    # Prepare drones.
    drone_models_df = pd.read_csv("./drone_models.csv")
    drones_df = pd.read_csv("./drones.csv")
    drones_df = pd.merge(drones_df, drone_models_df, how="left")

    # Extract out of different drones.
    drones_a = drones_df[drones_df["model"] == "Drone A"]
    drones_b = drones_df[drones_df["model"] == "Drone B"]
    drones_c = drones_df[drones_df["model"] == "Drone C"]
    drones_d = drones_df[drones_df["model"] == "Drone D"]

    waypoint_rows = []

    # Drone "model A" will circle the targets.
    for drone in drones_a.itertuples(index=False):
        poi_gps = Coord(latitude=34.68856, longitude=-117.58324, altitude=1283)
        random_time = timedelta(seconds=random.randint(0, 3000))
        waypoint_rows.extend(
            generate_oval_gps_points(
                tail_number=drone.tail_number,
                center=poi_gps,
                semi_major_axis=14 / 2,
                semi_minor_axis=5 / 2,
                speed_mph=drone.max_speed,
                n_points_per_rotation=40,
                start_time=SIM_START - random_time,  # Start at random times before base_date.
                num_rotations=4,
                rotation_angle=20,
            )
        )

    # Drone "model B" will move between bases then break for 30 minutes.
    ground_time = timedelta(hours=0.5)
    curr_times = [SIM_START - timedelta(hours=random.randint(0, 1)) for _ in drones_b]
    curr_places = [get_random_row(airfields_df) for _ in drones_b]
    for i, drone in enumerate(drones_b.itertuples(index=False)):
        while curr_times[i] < SIM_END:
            next_place = get_random_row(airfields_df)
            while next_place.equals(curr_places[i]):
                next_place = get_random_row(airfields_df)
            # Get end time
            curr_coord = Coord.from_row(curr_places[i])
            next_coord = Coord.from_row(next_place)
            distance = haversine_distance(curr_coord, next_coord)
            next_time = curr_times[i] + timedelta(hours=distance / drone.max_speed)
            heading = calculate_heading(curr_coord, next_coord)
            waypoint_rows.extend(
                [
                    format_waypoint_row(
                        drone.tail_number,
                        curr_coord,
                        curr_times[i],
                        heading,
                        drone.max_speed,
                    ),
                    format_waypoint_row(drone.tail_number, next_coord, next_time, heading, 0),
                ]
            )
            curr_times[i] = next_time + ground_time
            curr_places[i] = next_place

    # Drone "model C".

    # Write rows.
    file_name = "drone_waypoints.csv"
    pd.DataFrame(waypoint_rows).to_csv(file_name, index=False)
    print(f"CSV file '{file_name}' created successfully with {len(waypoint_rows)} rows.")
