import React            from 'react';
import { WLayout, WLHeader, WLMain, WLSidebar, WButton, WSidebar} from 'wt-frontend';
import SubregionHeader      from './SubregionHeader';
import TableContents        from './TableContents';
import TableHeader          from './TableHeader';

const SubregionContents = (props) => {
    return (
        <>
            <div className = 'table '>
                <SubregionHeader activeRegionName = {props.activeSubregion.name} addSubregion = {props.addSubregion}></SubregionHeader>
                <TableHeader></TableHeader>
                <WSidebar style = {{height: "700px", overflowX: "hidden", backgroundColor: "#204973"}}>
                    <TableContents activeSubregion = {props.activeSubregion} setShowRegionView = {props.setShowRegionView} loadNewSubregion = {props.loadNewSubregion}></TableContents>
                </WSidebar>
            </div>
        </>
    );
};

export default SubregionContents;