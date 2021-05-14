import React, { useState } from 'react';
import { WButton, WInput, WRow, WCol} from 'wt-frontend';

const LandmarkEntry = (props) => {
    const handleDelete = () =>{
        props.setShowDeleteLandmark(props.region._id, props.data)
    }
    
    return (
       <WRow className = "landmark-entry" style = {{fontSize: "20px"}}>
           <WCol size = "1">
            <WButton className="table-entry-buttons" wType="texted" onClick = {handleDelete}>
                <i className="material-icons md-24">close</i>
            </WButton>
           </WCol>
           <WCol size = "11">
                <div className = "landmark" style = {{paddingTop: "10px"}}>
                {
                    props.data
                }
                </div>
           </WCol>
       </WRow>
    );
};

export default LandmarkEntry;