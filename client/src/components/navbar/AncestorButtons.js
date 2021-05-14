import React from 'react';
import {WButton} from 'wt-frontend';

const AncestorButtons= (props) => {
    let index = props.index
    let arrow = "=>"

    const handleMoveToParent = () =>{
        props.goToParent(props.activeRegions[index]);
        props.toggleRegionView(false);
    }

    return (
        <div className = "ancestor-buttons" style = {{display: "inline-block"}}>
        {   
            index < 0 ? <div></div> :
            <div className = "ancestor-buttons" style = {{display: "inline-block"}}>
                <WButton wType = "transparent" clickAnimation = "ripple-light" shape=  "rounded" onClick = {handleMoveToParent}>
                {
                    props.activeRegions[index].name
                }
                </WButton>
                {
                    index === props.activeRegions.length - 2? <div></div> :
                    <div style = {{display: "inline-block"}}>{arrow}</div>
                }
            </div>
        }
        </div>
    );
};

export default AncestorButtons;