import React            from 'react';
import { WLayout, WLHeader, WLMain, WLSidebar, WButton, WSidebar} from 'wt-frontend';
import RegionHeader      from './RegionHeader';
import TableContents        from './TableContents';
import TableHeader          from './TableHeader';

const RegionContents = (props) => {
    let activeSubregionName = props.activeSubregion.name !== undefined ? props.activeSubregion.name : "";
    return (
        <>
            <div className = 'table '>
                <RegionHeader activeMapName = {props.activeMap.name} activeSubregionName = {activeSubregionName} addRegion = {props.addRegion}></RegionHeader>
                <TableHeader></TableHeader>
                <WSidebar style = {{height: "700px", overflowX: "hidden", backgroundColor: "#204973"}}>
                    <TableContents activeMap = {props.activeMap} setShowRegionView = {props.setShowRegionView} loadNewSubregion = {props.loadNewSubregion}
                    setShowDeleteRegion = {props.setShowDeleteRegion} activeSubregion = {props.activeSubregion} activeRegions = {props.activeRegions}></TableContents>
                </WSidebar>
            </div>
        </>
    );
};

export default RegionContents;