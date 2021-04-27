import React        from 'react';
import MapEntry from './MapEntry';

const MapList = (props) => {
    let tempID = 0
    return (
        <>
            {
                props.mapIDs &&
                props.mapIDs.map(entry => (
                    <MapEntry
                        handleSetActive={props.handleSetActive} activeMap={props.activeMap}
                        id={tempID++} key={entry._id+props.activeMap} name={entry.name} _id={entry._id}
                        updateMapField = {props.updateMapField} setShowDeleteMap = {props.setShowDeleteMap}
                    />
                ))
            }
        </>
    );
};

export default MapList;