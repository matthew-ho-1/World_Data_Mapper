import React, { useState } 	from 'react';
import { REGISTER }			from '../../cache/mutations';
import { useMutation }    	from '@apollo/client';
import { WModal, WMHeader, WMMain, WMFooter, WButton, WInput, WRow, WCol } from 'wt-frontend';
import { useHistory }		from 'react-router-dom';

const CreateAccount = (props) => {
	const [input, setInput] = useState({ email: '', password: '', firstName: '', lastName: '' });
	const [loading, toggleLoading] = useState(false);
	const [showErr, displayErrorMsg] = useState(false);
	const errorMsg = "Email already exists";
	const [Register] = useMutation(REGISTER);
	
	const updateInput = (e) => {
		const { name, value, email } = e.target;
		const updated = { ...input, [name]: value};
		setInput(updated);
	};

	const handleCreateAccount = async (e) => {
		for (let field in input) {
			if (!input[field]) {
				alert('All fields must be filled out to register');
				return;
			}
		}
		const { loading, error, data } = await Register({ variables: { ...input } });
		if (loading) { toggleLoading(true) };
		if (error) { return `Error: ${error.message}` };
		if(data.register.email === "already exists"){
			displayErrorMsg(true);
			return;
		}
		if (data) {
			toggleLoading(false);
			props.fetchUser();
			props.setShowCreate(false);
		};
	};

	return (
		<WModal className="signup-modal"  cover="true" visible={props.setShowCreate} style = {{backgroundColor: "#25557a"}}>
			<WMHeader  className="modal-header" onClose={() => props.setShowCreate(false)} style = {{fontWeight: "bold"}}>
				Create Account
			</WMHeader>

			{
				loading ? <div />
					: <WMMain>
							<WRow className="modal-col-gap signup-modal">
								<WCol size="6">
									<WInput 
										className="" onBlur={updateInput} name="firstName" labelAnimation="up" 
										barAnimation="solid" labelText="First Name" wType="outlined" inputType="text" 
									/>
								</WCol>
								<WCol size="6">
									<WInput 
										className="" onBlur={updateInput} name="lastName" labelAnimation="up" 
										barAnimation="solid" labelText="Last Name" wType="outlined" inputType="text" 
									/>
								</WCol>
							</WRow>

							<div className="modal-spacer">&nbsp;</div>
							<WInput 
								className="modal-input" onBlur={updateInput} name="email" labelAnimation="up" 
								barAnimation="solid" labelText="Email Address" wType="outlined" inputType="text" 
							/>
							<div className="modal-spacer">&nbsp;</div>
							<WInput 
								className="modal-input" onBlur={updateInput} name="password" labelAnimation="up" 
								barAnimation="solid" labelText="Password" wType="outlined" inputType="password" 
							/>
							{
								showErr ? <div className='modal-error'>
									{errorMsg}
								</div>
									: <div className='modal-error'>&nbsp;</div>
							}
					</WMMain>
			}
			<WMFooter>
				<WButton className="modal-button" onClick={handleCreateAccount} span clickAnimation="ripple-light" hoverAnimation="darken" shape="rounded" style = {{backgroundColor: "#078cf2"}}>
					Submit
				</WButton>
			</WMFooter>
			
		</WModal>
	);
}

export default CreateAccount;
