import React, { useState } from 'react';

import "./FooterControls.scss"
import TimeSlider from './TimeSlider';


const FooterControls = () => {

    // TODO: add to store.
    const [selectedDate, setSelectedDate] = useState("2024-05-26")
    const onDateChange = (event: any) => {
        setSelectedDate(event.target.value);
    };

    const [time, setTime] = useState("12:00")
    const onTimeChange = (event: any) => {
        setTime(event.target.value);
    };

    return (
        <div style={{ height: "10vh" }} className='FooterControls'>
            <div className='date-selection'>
                <label htmlFor="">Date</label>
                <input type='date' value={selectedDate} onChange={onDateChange}></input>
                <label htmlFor="">Time</label>
                <input type="text" value={time} onChange={onTimeChange} />
            </div>
            <TimeSlider />
        </div>
    );
};

export default FooterControls;