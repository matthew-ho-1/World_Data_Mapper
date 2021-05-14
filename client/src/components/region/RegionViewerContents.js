import React, { useState }  from 'react';
import { WLayout, WLHeader, WLMain, WButton, WSidebar, WCard, WLSide, WInput} from 'wt-frontend';
import LandmarkContents from '../landmark/LandmarkContents';

const RegionViewerContents = (props) => {
    const name = "Region Name: " + props.getRegion.name;
    const capital =  "Regional Capital: " + props.getRegion.capital;
    const leader = "Regional Leader: " + props.getRegion.leader;
    let landmarks = props.getRegion.landmarks;
    const numOfRegions = "# of Sub Regions: " + props.subregions.length;
    const [editingParent, toggleParentEdit] = useState(false);

    const handleParentEdit = (e) =>{
        let newParent = e.target.value;
        let oldParent = props.activeRegions[props.activeRegions.length - 1].name;
        toggleParentEdit(false);
        props.updateRegionParent(props.getRegion._id, newParent);
        props.setShowRegionView()
    }


    return (
        <>
            <WLayout wLayout = "lside">
                <WLSide side = "left" style = {{width: "1000px", height: "700px", marginLeft: "40px"}}>
                   <WLHeader>
                    <WButton className="region-buttons" wType="texted"  clickAnimation = "ripple-light" shape=  "rounded">
                        <i className="material-icons md-24" style = {{color: "white"}}>undo</i>
                    </WButton>
                    <WButton className="region-buttons" wType="texted" clickAnimation = "ripple-light" shape=  "rounded">
                        <i className="material-icons md-24" style = {{color: "white"}}>redo</i>
                    </WButton>
                </WLHeader>
                <WCard style = {{marginBottom: "50px", height: "400px", width: "500px"}}>
                    Placeholder for Image
                </WCard>
                <div className = "region-info">
                        <div className = "Region Name" style = {{paddingBottom: "40px"}}>{name}</div>
                        <div className = "Region Name" style = {{paddingBottom: "40px"}}>
                            <div className = "Region Name" style = {{display: "inline-block"}}>Parent Region:</div>
                            {
                                editingParent || props.activeRegions[props.activeRegions.length - 1].name === ' ' ?
                                <div style = {{display: "inline-block"}}>
                                <WInput
                                onBlur={handleParentEdit}
                                onKeyDown={(e) => {if(e.keyCode === 13) handleParentEdit(e)}}
                                autoFocus={true} defaultValue={props.activeRegions[props.activeRegions.length - 1].name} type='text'
                                />
                                </div>
                                :
                                <div style = {{display: "inline-block"}}>
                                <WButton wType = "transparent" style = {{color: "#1ddbdb", marginLeft:"10px"}} onClick = {props.setShowRegionView}>
                                {
                                    props.activeRegions[props.activeRegions.length - 1].name
                                }
                                </WButton>
                                </div>
                            }
                            <WButton className="table-entry-buttons" wType="texted" onClick = {() => toggleParentEdit(!editingParent)}>
                                <i className="material-icons md-24">edit</i>
                            </WButton>
                            </div>
                        <div className = "Region Name" style = {{paddingBottom: "40px"}}>{capital}</div>
                        <div className = "Region Name" style = {{paddingBottom: "40px"}}>{leader}</div>
                        <div className = "Region Name">{numOfRegions}</div>
                </div>
                </WLSide>
                <WLMain style = {{width: "921px", marginLeft: "700px"}}>
                    <WLHeader style = {{color: "white", fontSize: "25px"}}>
                        <WButton className="region-buttons" wType="texted"  clickAnimation = "ripple-light" shape=  "rounded">
                            <i className="material-icons md-24"  style = {{color: "#1ddbdb"}}>add_box</i>
                        </WButton>
                        <div className = "region-landmark">Region Landmarks:</div>
                    </WLHeader>
                    <WSidebar style = {{width: "800px", height: "750px", backgroundColor: "#20567d"}}>

                    </WSidebar>
                </WLMain>
            </WLayout>
        </>
    );
};

export default RegionViewerContents;