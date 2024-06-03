import React from 'react';
import "./DroneViewer.scss"
import dronePic from "../assets/drone.png"
import batteryPic from "../assets/battery.png"
import { Drone } from '../types/drone.interface';

import { useSelector, useDispatch } from 'react-redux'
import { clearDrone } from '../store/selectedDrone'



const DroneViewer = () => {

    const dispatch = useDispatch()
    const selectedDrone: Drone = useSelector((state: any) => state.selectedDrone.value)

    // TODO: Use when add close button.
    if (false) {
        dispatch(clearDrone())
    }

    return (
        <div className='DroneViewer'>
            <h2>Drone Viewer</h2>
            <div className='card-body'>
                <div className='metaData'>
                    <img src={dronePic} alt="Drone Pic"></img>
                    <ul>
                        <li>ID: {selectedDrone.id}</li>
                        <li>Model: {selectedDrone.model}</li>
                        <li><img src={batteryPic} alt="Battery Pic"></img>:  {100 * selectedDrone.battery}%</li>
                    </ul>
                </div>
                {selectedDrone.events.map((event, index) => (
                    <div key={index}><pre>{JSON.stringify(event, null, 2)}</pre></div>
                ))}
            </div>
        </div>
    );
};


export default DroneViewer;