/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';
import './landing.scss';
import Loading from '../loading/Loading';
import DisplaySchematic from '../displaySchematic/DisplaySchematic';
import { notifySuccess } from '../../util-components/Notifications';

function Landing({ schematicsFilter }) {
  const [schematics, setSchematics] = useState([]);
  const [cachedSchematics, setCachedSchematics] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch schematics when component mounts
  useEffect(() => {
    async function fetchSchematics() {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}get-schematics`);
      const data = await response.json();
      setSchematics(data);
      setCachedSchematics(data); // Cache initial fetched schematics
    }
    fetchSchematics();
  }, []);

  // Filter schematics based on schematicsFilter
  useEffect(() => {
    if (schematicsFilter) {
      const filteredSchematics = cachedSchematics.filter((schematic) => {
        const matchesName = schematic.name.toLowerCase().includes(schematicsFilter.toLowerCase());
        const matchesTags = schematic.tags.some((tag) => tag.toLowerCase().includes(schematicsFilter.toLowerCase()));
        return matchesName || matchesTags;
      });
      setSchematics(filteredSchematics);
    } else {
      setSchematics(cachedSchematics);
    }
  }, [schematicsFilter, cachedSchematics]);

  // Removes the schematic from display
  function popSchematic(event) {
    const schematicId = event.target.name;
    const newSchematicList = schematics.filter((schematic) => schematic._id !== schematicId);
    setSchematics(newSchematicList);
  }

  return (
    <div className="landing-content">
      <div className="schematics-container">
        {schematics.length === 0 && cachedSchematics.length === 0 ? (
          <Loading zIndex="1" />
        )
          : schematics.length !== 0
            ? (
              schematics.map((schematic) => (
                <DisplaySchematic
                  schematic={schematic}
                  index={schematic._id}
                  key={schematic._id}
                  popSchematic={popSchematic}
                  popupMethod={notifySuccess}
                />
              ))
            ) : (
              <Loading zIndex="1" text="Pedro stole all schematics..." />
            )}
      </div>
    </div>
  );
}

export default Landing;
