import React from 'react';
import "./DroneList.scss"
import droneList from "../example_data/drones.json"
import battery from "../assets/battery.png"
import { Drone } from '../types/drone.interface';

import { useSelector, useDispatch } from 'react-redux'
import { selectDrone, clearDrone } from "../store/selectedDrone"

const DroneList = () => {

    const dispatch = useDispatch()
    const selectedDrone: Drone = useSelector((state: any) => state.selectedDrone.value)

    const toggleSelectedDrone = (drone: Drone) => {
        if (selectedDrone === drone) {
            dispatch(clearDrone())
        } else {
            dispatch(selectDrone(drone))
        }
    }

    return (
        <div className='DroneList'>
            <h2>Drones</h2>
            <div className='table-wrapper'>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Model</th>
                            <th><img src={battery} alt="battery pic"></img></th>
                            <th>Alt</th>
                            <th>Speed</th>
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
                                <td>90%</td>
                                <td>500 ft</td>
                                <td>300 kts</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DroneList;