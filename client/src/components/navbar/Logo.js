import React from 'react';
import {WButton} from 'wt-frontend';

const Logo = (props) => {
    return (
        <WButton className='logo' wType = "transparent" onClick = {props.setInactive}>
            The World Data Mapper
        </WButton>
    );
};

export default Logo;