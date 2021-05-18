import React, { useState }  from 'react';
import { WLayout, WLHeader, WLMain, WButton, WSidebar, WCard, WLSide, WInput} from 'wt-frontend';
import LandmarkContents from '../landmark/LandmarkContents';

export function importAll(r) {
    let images = {};
    r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
    return images;
}

const RegionViewerContents = (props) => {
    const images = importAll(require.context('../Pictures/The World', false, /\.(png|jpe?g|svg)$/));

    const clickDisabled = () => { };
    const undoOptions = {
        className: !props.canUndo ? 'region-buttons-disabled' : 'region-buttons',
        onClick: !props.canUndo  ? clickDisabled : props.tpsUndo,
        clickAnimation: !props.canUndo ? "" : "ripple-light",  
        shape: "rounded",
        wType: "texted",
        style: {visibility: !props.canUndo ? "hidden" : "visible"}
    }

    const redoOptions = {
        className: !props.canRedo ? 'region-buttons-disabled' : 'region-buttons',
        onClick: !props.canRedo ? clickDisabled : props.tpsRedo, 
        clickAnimation: !props.canRedo ? "" : "ripple-light" ,
        shape: "rounded",
        wType: "texted",
        style: {visibility: !props.canRedo ? "hidden" : "visible"}
    }

    let landmarks = [];
    let parent;
    let mapdata = props.MapData[0].regions;
    for(let mapelem of mapdata){
        if(mapelem._id === props.getRegion._id){
            landmarks = mapelem.landmarks;
        }
    }
    if(props.activeMap._id === props.getRegion.parentid)
        parent = props.activeMap.name
    for(let mapelem of mapdata){
        if(mapelem._id === props.getRegion.parentid){
            parent = mapelem.name;
        }
    }

    const name = "Region Name: " + props.getRegion.name;
    const capital =  "Regional Capital: " + props.getRegion.capital;
    const leader = "Regional Leader: " + props.getRegion.leader;
    const numOfRegions = "# of Sub Regions: " + props.subregions.length;
    const [editingParent, toggleParentEdit] = useState(false);
    const [landmarkInput, setLandmark]  = useState("");

    let index = -1;
    for(let i = 0; i < props.listSubregions.length; i++){
        if(props.getRegion._id === props.listSubregions[i]._id)
            index = i;
    }
    const nextVisible = index === props.listSubregions.length - 1 ? true : false;
    const prevVisible = index === 0 ? true : false;

    const handleParentEdit = (e) =>{
        // let newParent = e.target.value;
        // let oldParent = parent;
        toggleParentEdit(false);
        // if(newParent !== oldParent){
        //     props.updateRegionParent(props.getRegion._id, newParent);
        //     props.resetActiveRegions();
        // }
    }

    const handlePrevSibling = () =>{
        props.goToPrevSibling(props.listSubregions[index-1]);
    }

    const handleNextSibling = () =>{
        props.goToNextSibling(props.listSubregions[index+1]);
    }

    const handleAddLandmark = () =>{
        if(landmarkInput !== '')
            props.addNewLandmark(landmarkInput, props.getRegion)
    }

    const updateLandmark = (e)=>{
        if(e.type === "keydown"){
            let landmark = e.target.value
            if(landmark !== '')
                props.addNewLandmark(landmark, props.getRegion);
        }
        else{
            const landmarkName = e.target.value;
            setLandmark(landmarkName);
        }
    }


    return (
        <>
            <WLayout wLayout = "lside">
                <WLSide side = "left" style = {{width: "1000px", height: "700px", marginLeft: "40px"}}>
                   <WLHeader>
                    <WButton {...undoOptions}>
                        <i className="material-icons md-24" style = {{color: "white"}}>undo</i>
                    </WButton>
                    <WButton {...redoOptions}>
                        <i className="material-icons md-24" style = {{color: "white"}}>redo</i>
                    </WButton>
                    <WButton className="region-buttons" wType="texted" clickAnimation = "ripple-light" shape=  "rounded" style = {{marginLeft: "500px", visibility: prevVisible ? "hidden" : "visible"}} 
                    onClick = {handlePrevSibling}>
                        <i className="material-icons md-24" style = {{color: "white"}}>arrow_back</i>
                    </WButton>
                    <WButton className="region-buttons" wType="texted" clickAnimation = "ripple-light" shape=  "rounded" style = {{visibility: nextVisible ? "hidden" : "visible"}} onClick = {handleNextSibling}>
                        <i className="material-icons md-24" style = {{color: "white"}}>arrow_forward</i>
                    </WButton>
                </WLHeader>
                <WCard style = {{marginBottom: "50px", height: "400px", width: "500px", backgroundColor: "#32599c"}}>
                {
                    <img src = {images[props.getRegion.name + " Flag.png"]} alt = "Flag Not Found" style = {{paddingTop: "100px"}}/>
                }
                </WCard>
                <div className = "region-info">
                        <div className = "Region Name" style = {{paddingBottom: "40px"}}>{name}</div>
                        <div className = "Region Name" style = {{paddingBottom: "40px"}}>
                            <div className = "Region Name" style = {{display: "inline-block"}}>Parent Region:</div>
                            {
                                editingParent || parent === ' ' ?
                                <div style = {{display: "inline-block"}}>
                                <WInput
                                onBlur={handleParentEdit}
                                onKeyDown={(e) => {if(e.keyCode === 13) handleParentEdit(e)}}
                                autoFocus={true} defaultValue={parent} type='text'
                                />
                                </div>
                                :
                                <div style = {{display: "inline-block"}}>
                                <WButton wType = "transparent" style = {{color: "#1ddbdb", marginLeft:"10px"}} onClick = {props.setShowRegionView}>
                                {
                                    parent
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
                    <WLHeader style = {{marginBottom: "10px"}}>
                        <div className = "region-landmark" style = {{color: "white", fontSize: "25px", display: "inline-block"}}>Region Landmarks:</div>
                        <div className = "add-landmark" style = {{display: "inline-block"}}>
                            <WButton className="region-buttons" wType="texted"  clickAnimation = "ripple-light" shape=  "rounded" onClick = {handleAddLandmark}>
                                    <i className="material-icons md-24"  style = {{color: "#1ddbdb"}}>add_box</i>
                            </WButton>
                            <div className = "add-landmark-input" style = {{display: "inline-block"}}>
                            {
                                <WInput
                                style = {{width: "500px"}}onBlur={updateLandmark}
                                onKeyDown={(e) => {if(e.keyCode === 13) updateLandmark(e)}}
                                autoFocus={true} placeholderText = "Add New Landmark Here" type='text'
                            />
                            }
                            </div>
                        </div>
                    </WLHeader>
                    <WSidebar style = {{width: "800px", height: "750px", backgroundColor: "#20567d"}}>
                        <LandmarkContents landmarks = {landmarks} setShowDeleteLandmark = {props.setShowDeleteLandmark} region = {props.getRegion}
                        updateLandmark = {props.updateLandmark}></LandmarkContents>
                    </WSidebar>
                </WLMain>
            </WLayout>
        </>
    );
};

export default RegionViewerContents;