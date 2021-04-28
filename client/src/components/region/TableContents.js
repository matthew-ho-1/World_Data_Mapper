import React        from 'react';
import TableEntry   from './TableEntry';
import {WSidebar} from 'wt-frontend';

const TableContents = (props) => {
    let entries = props.activeMap ? props.activeMap.regions : null;
    let entryCount = 0;
    if(entries) {
        entries = entries.filter(entry => entry !== null);
        entryCount = entries.length
    } 
     return (
        entries !== undefined && entries.length > 0 ? <div className=' table-entries container-primary'>
        {
            entries.map((entry, index) => (
                <TableEntry
                    data={entry} key={entry._id} index={index} entryCount={entryCount}
                />
            ))
        }
        </div>
        : <div className='container-primary' >
            {
                props.activeMap._id ? <h2 className="nothing-msg"> Nothing to do!</h2> : <></> 
            }               
        </div>
    );
};

export default TableContents;