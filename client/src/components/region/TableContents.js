import React, { useState }      from 'react';
import TableEntry   from './TableEntry';

const TableContents = (props) => {
    let entries = props.activeMap ? props.activeMap.regions : null;
    let regions = props.activeMap.regions ? props.activeMap.regions : null;
    let entryCount = 0;
    const [editing, setEditing] = useState("");
    const [indexChange, setIndex] = useState(-1);
    if(entries) {
        entries = entries.filter(entry => entry !== null && entry.parentid === props.activeMap._id);
        entryCount = entries.length
    } 
    let entriesSubregion = props.activeSubregion ? true : null;
    let entryCountSubregion = 0;
    if(entriesSubregion) {
        entriesSubregion = regions.filter(entry => entry !== null && entry.parentid === props.activeRegions[props.activeRegions.length - 1]._id);
        entryCountSubregion = entriesSubregion.length
    } 

    const handleMoveUp = (index, colediting) =>{
        if(index >= 0){
            setEditing(colediting);
            setIndex(index);
        }
    }

    const handleMoveDown = (index, colediting) =>{
        if(index < entryCount || index < entryCountSubregion){
            setEditing(colediting);
            setIndex(index);
        }
    }

     return (
        entries !== undefined && entries.length > 0 && (entriesSubregion === undefined || entriesSubregion === null) ? <div className=' table-entries container-primary'>
        {
            entries.map((entry, index) => (
                <TableEntry
                    data={entry} key={entry._id} index={index} entryCount={entryCount}
                    setShowRegionView = {props.setShowRegionView} loadNewSubregion = {props.loadNewSubregion}
                    setShowDeleteRegion = {props.setShowDeleteRegion} _id = {entry._id} editRegion = {props.editRegion} handleMoveUp = {handleMoveUp} handleMoveDown = {handleMoveDown}
                    editing = {editing}  setEditing = {setEditing} indexChange = {indexChange}
                />
            ))
        }
        </div>
        :  entriesSubregion !== undefined && entriesSubregion !== null && entriesSubregion.length > 0 ?
            <div className=' table-entries container-primary'>{
                entriesSubregion.map((entry, index) => (
                    <TableEntry
                        data={entry} key={entry._id} index={index} entryCountSubregion ={entryCountSubregion}
                        setShowRegionView = {props.setShowRegionView} loadNewSubregion = {props.loadNewSubregion}
                        setShowDeleteRegion = {props.setShowDeleteRegion} editRegion = {props.editRegion} activeRegions = {props.activeRegions} handleMoveUp = {handleMoveUp} handleMoveDown = {handleMoveDown}
                        editing = {editing} setEditing= {setEditing} indexChange = {indexChange}
                    />
                ))
            }
            </div>
        :
        <div className='container-primary' >
            {
                props.activeMap._id ?
                props.activeSubregion._id ?
                 <h2 className="nothing-msg"> Nothing to do!</h2> 
                 : <></>
                 : <></> 
            }               
        </div>
    );
};

export default TableContents;