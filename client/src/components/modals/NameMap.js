import React, { useState } 	from 'react';
import { ADD_MAP} 			from '../../cache/mutations';
import { useMutation }    	from '@apollo/client';
import { GET_DB_MAPS } 		from '../../cache/queries';

import { WModal, WMHeader, WMMain, WMFooter, WButton, WInput } from 'wt-frontend';

const NameMap = (props) => {
	const [input, setInput] = useState({ name: ''});
	const [loading, toggleLoading] = useState(false);
	const [AddMap] = useMutation(ADD_MAP);

	const updateInput = (e) => {
		const name = e.target.value;
		setInput(name);
	}

	const handleNameMap = async (e) => {
		let map = {
			_id: '',
			name: input,
			owner: props.user._id,
			subregions: [],
			sortRule: 'name',
			sortDirection: 1
		}
		const { data } = await AddMap({ variables: {map: map}, refetchQueries: [{ query: GET_DB_MAPS }] });
		if(data){
			props.loadMap(data.addMap);
			props.setShowNameMap(false);
		}
	};


	return (
		<WModal className="login-modal" cover="true" visible={props.setShowNameMap} style = {{backgroundColor: "#25557a"}}>
			<WMHeader  className="modal-header" onClose={() => props.setShowNameMap(false)} style = {{fontWeight: "bold"}}>
				Name Your Map
			</WMHeader >
			{
				loading ? <div />
					: <WMMain className="main-login-modal">
						<WInput className="modal-input" onBlur={updateInput} name='Map Name' labelAnimation="up" barAnimation="solid" labelText="Map Name" wType="outlined" inputType='text' />
					</WMMain >
			}
			<WMFooter>
				<WButton className="modal-button" onClick={handleNameMap} span clickAnimation="ripple-light" hoverAnimation="darken" shape="rounded" style = {{backgroundColor: "#078cf2"}}>
					Submit
				</WButton>
			</WMFooter>
		</WModal >
	);
}

export default NameMap;