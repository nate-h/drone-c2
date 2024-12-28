import React, { useState } from "react"
import "./HeaderControls.scss"
import Modal from './Modal';
import { ReactComponent as HumidIcon } from '../assets/weather/wi-humidity.svg'
import { ReactComponent as SunIcon } from '../assets/weather/wi-day-sunny.svg'
import { ReactComponent as LogoIcon } from '../assets/logo_2.svg'
import { ReactComponent as UserIcon } from '../assets/user-solid.svg'
import { ReactComponent as GPSIcon } from "../assets/gps.svg"

const HeaderControls = () => {
    const [showGPSModal, setShowGPSModal] = useState(false);
    return (
        <div className="HeaderControls">
            <a href='https://github.com/nate-h/drone-c2'>
                <LogoIcon />
                <div>Drone C2</div>
            </a>
            <ul className="weather">
                <li>72°F</li>
                <li> <SunIcon /></li>
                <li>3 mph&nbsp;<div className="marker">➤</div></li>
                <li> <div>43</div> <HumidIcon /></li>
                <li> <UserIcon className="small-svg" /></li>
                <li> <GPSIcon onClick={() => setShowGPSModal(true)} /></li>
            </ul>
            <Modal isOpen={showGPSModal} onClose={() => setShowGPSModal(false)} title="foo">
                <p>This is the modal content!</p>
                {/* {selectedDrone.events.map((event, index) => (
                    <div key={index}>
                        <pre>{JSON.stringify(event, null, 2)}</pre>
                    </div>
                ))} */}
            </Modal>
        </div>
    )
}

export default HeaderControls;