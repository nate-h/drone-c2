import React from 'react';
import './SiteList.scss';

import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

import { Sites } from '../types/site.interface';

const SiteList = () => {
  const sites: Sites = useSelector((state: RootState) => state.sites);
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
              <tr key={id}>
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
