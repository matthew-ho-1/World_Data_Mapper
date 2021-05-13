import React from 'react';

import { WButton, WRow, WCol } from 'wt-frontend';

const regionHeader = (props) => {
    const clickDisabled = () => { };
    const className = "region " + props.activeMapName;
    const buttonStyle = props.disabled ? ' table-header-button-disabled ' : 'table-header-button ';
    const undoOptions = {
        className: props.disabled || !props.canUndo ? ' table-header-button-disabled ' : 'table-header-button',
        onClick: props.disabled || !props.canUndo  ? clickDisabled : props.undo,
        wType: "texted", 
        clickAnimation: props.disabled || !props.canUndo ? "" : "ripple-light",  
        shape: "rounded"
    }

    const redoOptions = {
        className: props.disabled || !props.canRedo ? ' table-header-button-disabled ' : 'table-header-button ',
        onClick: props.disabled || !props.canRedo   ? clickDisabled : props.redo, 
        wType: "texted", 
        clickAnimation: props.disabled || !props.canRedo ? "" : "ripple-light" ,
        shape: "rounded"
    }

    return (
        <div className = "region-header">
            <WButton className="region-buttons" wType="texted" onClick = {props.addRegion} clickAnimation = "ripple-light" shape=  "rounded" style = {{marginLeft: "28px"}}>
                <i className="material-icons" style = {{color: "#1ddbdb"}}>add_box</i>
            </WButton>
            <WButton className="region-buttons" wType="texted"  clickAnimation = "ripple-light" shape=  "rounded">
                <i className="material-icons md-24" style = {{color: "white"}}>undo</i>
            </WButton>
            <WButton className="region-buttons" wType="texted" clickAnimation = "ripple-light" shape=  "rounded">
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