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

  const toggleShowPath = (droneId: string, showPath: boolean) => {
    const newDroneState: Record<string, Partial<DroneState>> = { [droneId]: { showPath } };
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
          onChange={() => toggleShowPath(drone.tailNumber, droneState.showPath)}
        ></input>{' '}
      </td>
    </tr>
  );
};

export default DroneListRow;
