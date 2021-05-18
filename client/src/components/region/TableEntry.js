import React, { useState } from 'react';
import { WButton, WInput, WRow, WCol } from 'wt-frontend';

export function importAll(r) {
    let images = {};
    r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
    return images;
}

const TableEntry = (props) => {
    const { data } = props;
    const name = data.name;
    const capital = data.capital;
    const leader = data.leader;
    const landmarks = data.landmarks.length === 0 ? "No landmarks": data.landmarks[0] + ", ...";
    let editing = props.index === props.indexChange ? props.editing : ""
    
    
    const images = importAll(require.context('../Pictures/The World', false, /\.(png|jpe?g|svg)$/));

    const [editingName, toggleNameEdit] = useState(false);
    const [editingCapital, toggleCapitalEdit] = useState(false);
    const [editingLeader, toggleLeaderEdit] = useState(false);


    const handleNameEdit = (e) =>{
        toggleNameEdit(false);
        const newName = e.target.value ? e.target.value : "No Name";
        const prevName = name;
        if(newName !== prevName){
            props.editRegion(data._id, 'name', newName, prevName);
        }
    }

    const handleCapitalEdit = (e) =>{
        toggleCapitalEdit(false);
        const newCapital = e.target.value ? e.target.value : "No Capital";
        const prevCapital = capital;
        if(newCapital !== prevCapital){
            props.editRegion(data._id, 'capital', newCapital, prevCapital);
        }
    }

    const handleLeaderEdit = (e) =>{
        toggleLeaderEdit(false);
        const newLeader = e.target.value ? e.target.value : "No Leader";
        const prevLeader = leader;
        if(newLeader !== prevLeader){
            props.editRegion(data._id, 'leader', newLeader, prevLeader);
        }
    }

    const handleMoveLeft = (e) =>{
        if(editingCapital){
           handleCapitalEdit(e);
           toggleNameEdit(!editingName)
        }
        else if(editingLeader){
            handleLeaderEdit(e)
            toggleCapitalEdit(!editingCapital);
        }
    }

    const handleMoveRight = (e) =>{
        if(editingName){
            handleNameEdit(e);
            toggleCapitalEdit(!editingCapital)
         }
         else if(editingCapital){
             handleCapitalEdit(e)
             toggleLeaderEdit(!editingLeader);
         }
    }

    const handleMoveUp = (e) =>{
        if(editingName){
            handleNameEdit(e);
            props.handleMoveUp(props.index - 1, "name");
         }
         else if(editingCapital){
             handleCapitalEdit(e)
             props.handleMoveUp(props.index - 1, "capital");
         }
         else if(editingLeader){
            handleLeaderEdit(e)
            props.handleMoveUp(props.index - 1, "leader");
        }
    }

    const handleMoveDown = (e) =>{
        if(editingName){
            handleNameEdit(e);
            props.handleMoveDown(props.index + 1, "name");
         }
         else if(editingCapital){
             handleCapitalEdit(e)
             props.handleMoveDown(props.index + 1, "capital");
         }
         else if(editingLeader){
            handleLeaderEdit(e)
            props.handleMoveDown(props.index + 1, "leader");
        }
    }


    const handleShowRegionView = () => {
        props.setShowRegionView(data)
    }

    const handleNavigateToSubregion = () =>{
        props.loadNewSubregion(data)
        
    }

    const handleDeleteRegion = () =>{
        props.setShowDeleteRegion(data._id, props.index, data)
    }

    return (
        <WRow className='table-entry'>
            <WCol size="1">
                <WButton className="table-entry-buttons" wType="texted" onClick = {handleDeleteRegion}>
                         <i className="material-icons md-24">close</i>
                </WButton>
                {
                    <WButton className="table-entry-buttons" wType="texted" onClick  ={() => toggleNameEdit(!editingName)}>
                      <i className="material-icons md-24">edit</i>
                    </WButton>
                }
            </WCol>
            <WCol size="2">
                {
                    editingName || name === ' ' ?
                    <WInput
                    className='table-input' onBlur={handleNameEdit}
                    onKeyDown={(e) => {if(e.keyCode === 13) handleNameEdit(e); if(e.keyCode === 39) handleMoveRight(e); if(e.keyCode === 40) handleMoveDown(e);
                     if(e.keyCode === 38) handleMoveUp(e);} }
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
                     onKeyDown={(e) => {if(e.keyCode === 13) handleCapitalEdit(e); if(e.keyCode === 37) handleMoveLeft(e); if(e.keyCode === 39) handleMoveRight(e);
                        if(e.keyCode === 40) handleMoveDown(e); if(e.keyCode === 38) handleMoveUp(e);}}
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
                     onKeyDown={(e) => {if(e.keyCode === 13) handleLeaderEdit(e); if(e.keyCode === 37) handleMoveLeft(e);
                        if(e.keyCode === 40) handleMoveDown(e); if(e.keyCode === 38) handleMoveUp(e);}}
                     autoFocus={true} defaultValue={leader} type='text'
                     inputClass="table-input-class"/>
                     :
                    <div className= "table-text" onClick = {() => toggleLeaderEdit(!editingLeader)}>{leader} </div>
                }
            </WCol>
            <WCol size="2">
            {
                <img src = {images[name + " Flag.png"]} alt = "Flag Not Found" style = {{paddingTop: "10px", width: "100px", height: "50px"}}/>
            }   
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