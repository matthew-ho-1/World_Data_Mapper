import React from 'react';
import AncestorButtons from './AncestorButtons';
import {WButton} from 'wt-frontend';

const Logo = (props) => {
    const isActive = props.activeMap === undefined ? true : false;
    let regions = props.activeRegions;

    return (
        isActive ? <div className = 'logo'> The World Data Mapper</div>
        :
        <div className = "left">
             <WButton className='logo' wType = "transparent" onClick = {props.setInactive}>
                The World Data Mapper
            </WButton>
            <div className = "ancestor-buttons" style = {{display: "inline-block"}}>
            {   
                regions.map((region, index) => (<AncestorButtons activeRegions = {props.activeRegions} goToParent = {props.goToParent} data = {region} key={region._id} index={index - 1}
                toggleRegionView = {props.toggleRegionView}>
                </AncestorButtons>))
            }
            </div>
        </div>
    );
};

export default Logo;