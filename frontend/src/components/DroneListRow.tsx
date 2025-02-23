import { useDispatch, useSelector } from "react-redux";
import { selectDrone, clearDrone } from '../store/selectedDroneSlice';
import { Drone, DroneState } from "../types/drone.interface";
import { RootState } from '../store/store';



const DroneListRow = ({ drone }: { drone: Drone }) => {

    const droneState: DroneState = useSelector((state: RootState) => state.droneStates[drone.tailNumber]);

    const toggleSelectedDrone = (drone: Drone) => {
        if (selectedDrone === drone) {
            dispatch(clearDrone());
        } else {
            dispatch(selectDrone(drone));
        }
    };

    const dispatch = useDispatch();
    const selectedDrone: Drone = useSelector((state: any) => state.selectedDrone.value);


    return (
        <tr
            onClick={() => toggleSelectedDrone(drone)}
            className={drone === selectedDrone ? 'selected' : ''}
        >
            <td>{drone.tailNumber}</td>
            <td>{drone.model}</td>
            <td>{droneState.isGrounded ? "Grounded" : "Air"}</td>
            <td>{droneState.showPath}</td>
        </tr>
    )
}

export default DroneListRow;