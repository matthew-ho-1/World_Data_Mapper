import React            from 'react';
import { WLayout, WLHeader, WLMain, WLSidebar, WButton, WSidebar} from 'wt-frontend';
import RegionHeader      from './RegionHeader';
import TableContents        from './TableContents';
import TableHeader          from './TableHeader';

const RegionContents = (props) => {
    return (
        <>
            <div className = 'table '>
                <RegionHeader activeMapName = {props.activeMap.name} addRegion = {props.addRegion}></RegionHeader>
                <TableHeader></TableHeader>
                <WSidebar style = {{height: "700px", overflowX: "hidden", backgroundColor: "#204973"}}>
                    <TableContents activeMap = {props.activeMap} setShowRegionView = {props.setShowRegionView} loadNewSubregion = {props.loadNewSubregion}></TableContents>
                </WSidebar>
            </div>
        </>
    );
};

export default RegionContents;