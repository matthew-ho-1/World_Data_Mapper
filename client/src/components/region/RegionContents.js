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
                <WSidebar style = {{height: "700px", overflowX: "hidden"}}>
                    <TableContents activeMap = {props.activeMap}></TableContents>
                </WSidebar>
            </div>
        </>
    );
};

export default RegionContents;