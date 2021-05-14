import React        from 'react';
import {WSidebar} from 'wt-frontend';
import LandmarkEntry from './LandmarkEntry';

const LandmarkContents = (props) => {
    let entries = props.landmarks;
    let entryCount = 0;
    entries = entries.filter(entry => entry !== null);
    entryCount = entries.length

     return (
        entries.length > 0 ? <div className= 'landmark-entries'>{
            entries.map((entry, index) => (
                <LandmarkEntry
                    data = {entry} key = {index} index = {index} entryCount = {entryCount} deleteLandmark = {props.deleteLandmark} setShowDeleteLandmark = {props.setShowDeleteLandmark}
                    region = {props.region}
                />
            ))
        }
        </div> :
        <div className='landmark-entries' >
        {
            <h2 className="nothing-msg"> No Landmarks!</h2> 
        }               
        </div>
    );
};

export default LandmarkContents;