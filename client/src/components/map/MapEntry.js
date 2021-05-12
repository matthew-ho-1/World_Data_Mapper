import React, { useState }  from 'react';
import { WNavItem, WInput, WButton, WRow, WCol } from 'wt-frontend';

const MapEntry = (props) => {
    const [editing, toggleEditing] = useState(false);
    const [preEdit, setPreEdit] = useState(props.name);

    const handleEditing = (e) => {
        e.stopPropagation();
        setPreEdit(props.name);
        toggleEditing(!editing);
    };

    const handleSubmit = (e) => {
        handleEditing(e);
        const { name, value } = e.target;
        props.updateMapField(props._id, name, value, preEdit);
    };

    const handleDelete = () =>{
        props.setShowDeleteMap(props._id);
    }

    const handleMoveToSpreadsheet = () =>{
        props.handleSetActive(props._id);
        props.setAncestorRegion(props.activeMap)
    }
 

    const entryStyle = props._id === props.activeid ? 'list-item-active' : 'list-item ';
    
    return (
        <WNavItem className={entryStyle}>
            <WRow className = "sidebar">
                <WCol size = "1">
                    <WButton className="table-entry-buttons" wType="texted" onClick={handleEditing}>
                         <i className="material-icons md-24" style = {{paddingTop: "5px"}}>edit</i>
                    </WButton>
                </WCol>
                <WCol size = "10">
                {
                    editing ?   <WInput className="list-item-edit" inputClass="list-item-edit-input" name='name' onBlur={handleSubmit} autoFocus={true} defaultValue={props.name} 
                                style = {{marginLeft: "100px", width: "600px"}}/>
                            :   
                                <div className='list-text' style = {{color: "white", fontSize: "25px", marginLeft: "100px"}} onClick={handleMoveToSpreadsheet}>
                                    {props.name}
                                </div>
                }
                </WCol>
                <WCol size = "1">
                    {
                        editing ?  <WButton className="table-entry-buttons" wType="texted" disabled = {true}>
                                       <i className="material-icons md-24" style = {{paddingTop: "14px"}}>delete</i>
                                   </WButton>
                        :
                         <WButton className="table-entry-buttons" wType="texted" onClick = {handleDelete}>
                         <i className="material-icons md-24" style = {{paddingTop: "5px"}}>delete</i>
                        </WButton>
                    }
                </WCol>
            </WRow>
        </WNavItem>
    );
};

export default MapEntry;