import React from 'react';
import './SiteList.scss';

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';

import { Site, Sites } from '../types/site.interface';
import { clearSite, selectSite } from '../store/selectedSiteSlice';

const SiteList = () => {
  const sites: Sites = useSelector((state: RootState) => state.sites);

  const selectedSite: Site | null = useSelector((state: RootState) => state.selectedSite.value);
  const dispatch = useDispatch();

  const toggleSelectedSite = (site: Site) => {
    if (selectedSite === site) {
      dispatch(clearSite());
    } else {
      dispatch(selectSite(site));
    }
  };

  return (
    <div className='SiteList'>
      <h2>Sites</h2>
      <div className='table-wrapper'>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(sites).map(([id, site]) => (
              <tr
                onClick={() => toggleSelectedSite(site)}
                className={site === selectedSite ? 'selected' : ''}
                key={id}
              >
                <td>{site.name}</td>
                <td>{site.site_type}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SiteList;
