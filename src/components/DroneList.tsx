import React, { useState } from 'react';
import "./DroneList.scss"
import droneList from "../example_data/drones.json"
import battery from "../assets/battery.png"
import DroneViewer from './DroneViewer';
import { Drone } from '../types/drone.interface';

const DroneList = () => {

    const [selectedDrone, setSelectedDrone] = useState<null | Drone>(null)

    const toggleSelectedDrone = (drone: Drone) => {
        if (selectedDrone === drone) {
            setSelectedDrone(null)
        } else {
            setSelectedDrone(drone)
        }
    }

    return (
        <div className='DroneList'>
            <h2>Drones</h2>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Model</th>
                        <th><img src={battery}></img></th>
                    </tr>
                </thead>
                <tbody>
                    {droneList.map((drone, index) => (
                        <tr key={index}
                            onClick={() => toggleSelectedDrone(drone)}
                            className={drone === selectedDrone ? 'selected' : ''}
                        >
                            <td>{drone.id}</td>
                            <td>{drone.model}</td>
                            <td>{drone.battery * 100}%</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {selectedDrone ? <DroneViewer drone={selectedDrone} /> : null}

        </div>
    );
};

export default DroneList;