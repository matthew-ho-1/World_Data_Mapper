import React, { useState } from 'react';
import { WButton, WInput, WRow, WCol } from 'wt-frontend';

const LandmarkEntry = (props) => {
    return (
        <WRow className='table-entry'>
            <WCol size="1">
                
            </WCol>
            <WCol size="2">
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

export default LandmarkEntry;