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
                <RegionHeader activeMapName = {props.activeMap.name} activeSubregionName = {activeSubregionName} addRegion = {props.addRegion}
                 tpsUndo = {props.tpsUndo} tpsRedo = {props.tpsRedo} canUndo = {props.canUndo} canRedo = {props.canRedo}></RegionHeader>
                <TableHeader sort = {props.sort} disabled = {!props.activeMap._id}></TableHeader>
                <WSidebar style = {{height: "700px", overflowX: "hidden", backgroundColor: "#204973"}}>
                    <TableContents activeMap = {props.activeMap} setShowRegionView = {props.setShowRegionView} loadNewSubregion = {props.loadNewSubregion}
                    setShowDeleteRegion = {props.setShowDeleteRegion} activeSubregion = {props.activeSubregion} activeRegions = {props.activeRegions}
                    editRegion = {props.editRegion}></TableContents>
                </WSidebar>
            </div>
        </>
    );
};

export default RegionContents;