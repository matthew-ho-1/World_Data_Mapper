import React        from 'react';
import TableEntry   from './TableEntry';

const TableContents = (props) => {
    let entries = props.activeMap ? props.activeMap.regions : null;
    let regions = props.activeMap.regions ? props.activeMap.regions : null;
    let entryCount = 0;
    if(entries) {
        entries = entries.filter(entry => entry !== null && entry.parentid === props.activeMap._id);
        entryCount = entries.length
    } 
    let entriesSubregion = props.activeSubregion ? props.activeSubregion.subregions: null;
    let entryCountSubregion = 0;
    if(entriesSubregion) {
        entriesSubregion = regions.filter(entry => entry !== null && entry.parentid == props.activeRegions[props.activeRegions.length - 1]._id);
        entryCountSubregion = entriesSubregion.length
    } 
     return (
        entries !== undefined && entries.length > 0 && (entriesSubregion === undefined || entriesSubregion === null) ? <div className=' table-entries container-primary'>
        {
            entries.map((entry, index) => (
                <TableEntry
                    data={entry} key={entry._id} index={index} entryCount={entryCount}
                    setShowRegionView = {props.setShowRegionView} loadNewSubregion = {props.loadNewSubregion}
                    setShowDeleteRegion = {props.setShowDeleteRegion} _id = {entry._id}
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
                        setShowDeleteRegion = {props.setShowDeleteRegion}
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