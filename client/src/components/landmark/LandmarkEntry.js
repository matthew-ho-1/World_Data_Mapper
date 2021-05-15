import React, { useState } from 'react';
import { WButton, WInput, WRow, WCol} from 'wt-frontend';

const LandmarkEntry = (props) => {
    const [editingLandmark, toggleLandmarkEdit] = useState(false);
    const isApartOfRegion = props.data.includes(" - ") ? true : false

    const handleDelete = () =>{
        props.setShowDeleteLandmark(props.region._id, props.data)
    }

    const handleLandmarkEdit = (e) =>{
        toggleLandmarkEdit(false);
        const newLandmark = e.target.value ? e.target.value :  "No Landmark";
        const prevLandmark = props.data;
        if(newLandmark !== prevLandmark);
            props.updateLandmark(prevLandmark, newLandmark, props.region._id)
    }

    return (
       <WRow className = "landmark-entry" style = {{fontSize: "20px"}}>
           <WCol size = "1">
            {
                <WButton className="table-entry-buttons" wType="texted" onClick = {handleDelete} style = {{visibility: !isApartOfRegion ? "visible" : "hidden"}}>
                    <i className="material-icons md-24">close</i>
                </WButton>
            }
           </WCol>
           <WCol size = "11">
            {
                (editingLandmark || props.data === ' ') && !isApartOfRegion ? 
                <WInput
                className='table-input' onBlur={handleLandmarkEdit}
                onKeyDown={(e) => {if(e.keyCode === 13) handleLandmarkEdit(e)}}
                autoFocus={true} defaultValue={props.data} type='text'
                inputClass="table-input-class"/>
                :
                <div className = "landmark" style = {{paddingTop: "10px"}} onClick = {() => toggleLandmarkEdit(!editingLandmark)}>
                {
                    props.data
                }
                </div>
            }
           </WCol>
       </WRow>
    );
};

export default LandmarkEntry;