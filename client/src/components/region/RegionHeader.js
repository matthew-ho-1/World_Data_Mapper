import React from 'react';

import { WButton, WRow, WCol } from 'wt-frontend';

const regionHeader = (props) => {
    const clickDisabled = () => { };

    const undoOptions = {
        className: !props.canUndo ? ' table-header-button-disabled ' : 'table-header-button',
        onClick: !props.canUndo  ? clickDisabled : props.tpsUndo,
        clickAnimation: !props.canUndo ? "" : "ripple-light",  
        shape: "rounded",
        wType: "texted",
        style: {visibility: !props.canUndo ? "hidden" : "visible"}
    }

    const redoOptions = {
        className: !props.canRedo ? ' table-header-button-disabled ' : 'table-header-button ',
        onClick: !props.canRedo   ? clickDisabled : props.tpsRedo, 
        clickAnimation: !props.canRedo ? "" : "ripple-light" ,
        shape: "rounded",
        wType: "texted",
        style: {visibility: !props.canRedo ? "hidden" : "visible"}
    }

    return (
        <div className = "region-header">
            <WButton className="region-buttons" wType="texted" onClick = {props.addRegion} clickAnimation = "ripple-light" shape=  "rounded" style = {{marginLeft: "28px"}}>
                <i className="material-icons" style = {{color: "#1ddbdb"}}>add_box</i>
            </WButton>
            <WButton {...undoOptions}>
                <i className="material-icons md-24" style = {{color: "white"}}>undo</i>
            </WButton>
            <WButton {...redoOptions}>
                <i className="material-icons md-24" style = {{color: "white"}}>redo</i>
            </WButton>
            <div className = "region-text">Region Name: </div>
            <div className =  "map-name" style = {{display: "inline-block"}}>
            {
                props.activeSubregionName === "" ?
                props.activeMapName
                :
                props.activeSubregionName
            } 
            </div>
        </div>
    );
};

export default regionHeader;