import React from 'react';
import {WButton} from 'wt-frontend';

const Logo = (props) => {
    const isActive = props.activeMap === undefined ? true : false
    return (
        isActive ? <div className = 'logo'> The World Data Mapper</div>
        :
        <div className = "left">
             <WButton className='logo' wType = "transparent" onClick = {props.setInactive}>
                The World Data Mapper
            </WButton>
        </div>
    );
};

export default Logo;