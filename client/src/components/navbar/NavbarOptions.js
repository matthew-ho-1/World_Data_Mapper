import React                                from 'react';
import { LOGOUT }                           from '../../cache/mutations';
import { useMutation, useApolloClient }     from '@apollo/client';
import { WButton, WNavItem }                from 'wt-frontend';

const LoggedIn = (props) => {
    const client = useApolloClient();
	const [Logout] = useMutation(LOGOUT);

    const handleLogout = async (e) => {
        Logout();
        const { data } = await props.fetchUser();
        if (data) {
            let reset = await client.resetStore();
            if (reset) props.setActiveMap({});
        }
    };

    return (
        <>
        <WNavItem hoverAnimation="lighten">
            <WButton className="navbar-options" onClick = {props.setShowUpdate} wType="texted" hoverAnimation="text-primary">
                {props.getUser}
            </WButton>
        </WNavItem >
        <WNavItem hoverAnimation="lighten">
            <WButton className="navbar-options" onClick={handleLogout} wType="texted" hoverAnimation="text-primary">
                Logout
            </WButton>
        </WNavItem >
        </>
    );
};

const LoggedOut = (props) => {
    return (
        <>
           <WNavItem hoverAnimation="lighten">
                <WButton className="navbar-options" onClick={props.setShowCreate} wType="texted" hoverAnimation="text-primary"> 
                    Create Account
                </WButton>
            </WNavItem>
            <WNavItem hoverAnimation="lighten">
                <WButton className="navbar-options" onClick={props.setShowLogin} wType="texted" hoverAnimation="text-primary">
                    Login
                </WButton>
            </WNavItem>
        </>
    );
};


const NavbarOptions = (props) => {
    return (
        <>
            {
                props.auth === false ? <LoggedOut setShowLogin={props.setShowLogin} setShowCreate={props.setShowCreate} history = {props.history} />
                : <LoggedIn fetchUser={props.fetchUser} setActiveMap={props.setActiveMap} logout={props.logout} getUser = {props.getUser} setShowUpdate = {props.setShowUpdate}/>
            }
        </>

    );
};

export default NavbarOptions;