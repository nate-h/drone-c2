import { useDispatch, useSelector } from 'react-redux';
import { selectDrone, clearDrone } from '../store/selectedDroneSlice';
import { updateDroneStates } from '../store/droneStatesSlice';
import { Drone, DroneState } from '../types/drone.interface';
import { RootState } from '../store/store';

const DroneListRow = ({ drone }: { drone: Drone }) => {
  const droneState: DroneState = useSelector(
    (state: RootState) => state.droneStates[drone.tailNumber],
  );

  const toggleSelectedDrone = (drone: Drone) => {
    if (selectedDrone === drone) {
      dispatch(clearDrone());
    } else {
      dispatch(selectDrone(drone));
    }
  };

  const dispatch = useDispatch();
  const selectedDrone: Drone = useSelector((state: any) => state.selectedDrone.value);

  const toggleShowPath = (e: React.ChangeEvent<HTMLInputElement>, droneId: string) => {
    e.stopPropagation();
    const newDroneState: Record<string, Partial<DroneState>> = {
      [droneId]: { showPath: e.target.checked },
    };
    dispatch(updateDroneStates(newDroneState));
  };

  return (
    <tr
      onClick={() => toggleSelectedDrone(drone)}
      className={drone === selectedDrone ? 'selected' : ''}
    >
      <td>{drone.tailNumber}</td>
      <td>{drone.model}</td>
      <td>{droneState.isGrounded ? 'Grounded' : 'Air'}</td>
      <td>
        <input
          type='checkbox'
          checked={droneState.showPath}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => toggleShowPath(e, drone.tailNumber)}
        ></input>
      </td>
    </tr>
  );
};

export default DroneListRow;
