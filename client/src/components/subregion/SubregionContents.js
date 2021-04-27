import React            from 'react';
import MapList          from './MapList';
import { WLayout, WLHeader, WLMain, WLSide, WButton, WSidebar} from 'wt-frontend';
import FlatEarthPic	    from '../Pictures/flatearth.jpg'

const MapContents = (props) => {
    return (
        <>
            <WLayout wLayout = "header-lside">
                <WLHeader style = {{border: "1px solid", backgroundColor: "#294896"}}>
                    <div className = "map-header-text">
                        <p>My Maps</p>
                    </div>
                </WLHeader>
                <WLSide side = "left" style = {{border: "1px solid", width: "1000px", height: "700px"}}>
                    <WSidebar style = {{backgroundColor: "#226a82"}}>
                        <MapList
                            mapIDs = {props.mapIDs}	activeMap = {props.activeMap}
                            handleSetActive = {props.handleSetActive} key = {props.key}
                            updateMapField = {props.updateMapField} setShowDeleteMap = {props.setShowDeleteMap}
                        />
                    </WSidebar>
                </WLSide>
                <WLMain style = {{border: "1px solid", width: "921px", marginLeft: "727px", height: "700px", backgroundColor: "#334687"}}>
                    <img src = {FlatEarthPic}  alt = "Earth"  style = {{marginLeft: "65px", marginTop: "20px"}}></img>
                        <WButton className="add-map-text" onClick = {props.setShowNameMap} hoverAnimation="text-primary" shape = "pill" style = {{backgroundColor: "#078cf2"}}>
                            Add New Map
                        </WButton>
                </WLMain>
            </WLayout>
        </>
    );
};

export default MapContents;