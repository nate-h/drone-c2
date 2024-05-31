import React, { useState } from 'react';
import "./DroneViewer.scss"
import dronePic from "../assets/drone.png"
import batteryPic from "../assets/battery.png"
import { Drone } from '../types/drone.interface';



const DroneViewer = ({ drone }: { drone: Drone }) => {

    return (
        <div className='DroneViewer'>
            <h2>DroneViewer</h2>
            <div className='metaData'>
                <img src={dronePic}></img>
                <ul>
                    <li>ID: {drone.id}</li>
                    <li>Model: {drone.model}</li>
                    <li><img src={batteryPic}></img>:  {100 * drone.battery}%</li>
                </ul>

            </div>
            {drone.events.map((event, index) => (
                <div key={index}><pre>{JSON.stringify(event, null, 2)}</pre></div>
            ))}
        </div>
    );
};


export default DroneViewer;