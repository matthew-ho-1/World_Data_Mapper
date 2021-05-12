import React, { useState } from 'react';
import { WButton, WInput, WRow, WCol } from 'wt-frontend';

const TableEntry = (props) => {
    const { data } = props;
    const name = data.name;
    const capital = data.capital;
    const leader = data.leader;
    const landmarks = data.landmarks[0] === undefined ? "No landmarks": data.landmarks[0] + "...";

    const handleShowRegionView = () => {
        props.setShowRegionView(data)
    }

    const handleNavigateToSubregion = () =>{
        props.loadNewSubregion(data)
        
    }

    return (
        <WRow className='table-entry'>
            <WCol size="1">
                
            </WCol>
            <WCol size="2" onClick = {handleNavigateToSubregion}>
                {
                    <div className="table-text">{name}</div>
                }
            </WCol>

            <WCol size="2">
                {
                   <div className="table-text">{capital}</div>
                }
            </WCol>

            <WCol size="2">
                {
                    <div className= "table-text">{leader}</div>
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