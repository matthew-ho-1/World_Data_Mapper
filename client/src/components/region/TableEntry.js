import React, { useState } from 'react';
import { WButton, WInput, WRow, WCol } from 'wt-frontend';

const TableEntry = (props) => {
    const { data } = props;
    const name = data.name;
    const capital = data.capital;
    const leader = data.leader;
    const landmarks = data.landmarks.length === 0 ? "No landmarks": data.landmarks[0] + "...";

    const [editingName, toggleNameEdit] = useState(false);
    const [editingCapital, toggleCapitalEdit] = useState(false);
    const [editingLeader, toggleLeaderEdit] = useState(false);

    const handleNameEdit = (e) =>{
        toggleNameEdit(false);
        const newName = e.target.value ? e.target.value : "No Name";
        const prevName = name;
        if(newName !== prevName){
            props.editRegion(data._id, 'name', newName);
        }
    }

    const handleCapitalEdit = (e) =>{
        toggleCapitalEdit(false);
        const newCapital = e.target.value ? e.target.value : "No Capital";
        const prevCapital = capital;
        if(newCapital !== prevCapital){
            props.editRegion(data._id, 'capital', newCapital);
        }
    }

    const handleLeaderEdit = (e) =>{
        toggleLeaderEdit(false);
        const newLeader = e.target.value ? e.target.value : "No Leader";
        const prevLeader = leader;
        if(newLeader !== prevLeader){
            props.editRegion(data._id, 'leader', newLeader);
        }
    }


    const handleShowRegionView = () => {
        props.setShowRegionView(data)
    }

    const handleNavigateToSubregion = () =>{
        props.loadNewSubregion(data)
        
    }

    const handleDeleteRegion = () =>{
        props.setShowDeleteRegion(data._id)
    }

    return (
        <WRow className='table-entry'>
            <WCol size="1">
                <WButton className="table-entry-buttons" wType="texted" onClick = {handleDeleteRegion}>
                         <i className="material-icons md-24">close</i>
                </WButton>
                <WButton className="table-entry-buttons" wType="texted" onClick  ={() => toggleNameEdit(!editingName)}>
                         <i className="material-icons md-24">edit</i>
                </WButton>
            </WCol>
            <WCol size="2">
                {
                    editingName || name === ' ' ?
                    <WInput
                    className='table-input' onBlur={handleNameEdit}
                    onKeyDown={(e) => {if(e.keyCode === 13) handleNameEdit(e)}}
                    autoFocus={true} defaultValue={name} type='text'
                    inputClass="table-input-class"/>
                    :
                    <div className="table-text" onClick = {handleNavigateToSubregion}>{name}</div>
                }
            </WCol>

            <WCol size="2">
                {
                     editingCapital || capital === ' ' ?
                     <WInput
                     className='table-input' onBlur={handleCapitalEdit}
                     onKeyDown={(e) => {if(e.keyCode === 13) handleCapitalEdit(e)}}
                     autoFocus={true} defaultValue={capital} type='text'
                     inputClass="table-input-class"/>
                     :
                   <div className="table-text" onClick = {() => toggleCapitalEdit(!editingCapital)}>{capital}</div>
                }
            </WCol>

            <WCol size="2">
                {
                    editingLeader || leader === ' ' ?
                     <WInput
                     className='table-input' onBlur={handleLeaderEdit}
                     onKeyDown={(e) => {if(e.keyCode === 13) handleLeaderEdit(e)}}
                     autoFocus={true} defaultValue={leader} type='text'
                     inputClass="table-input-class"/>
                     :
                    <div className= "table-text" onClick = {() => toggleLeaderEdit(!editingLeader)}>{leader} </div>
                }
            </WCol>
            <WCol size="2">
        
            </WCol>
            <WCol size="3" onClick = {handleShowRegionView}>
                {
                    <div className= "table-text">{landmarks}</div>
                }
            </WCol>
        </WRow>
    );
};

export default TableEntry;