import React from 'react';

import { WModal, WMHeader, WMMain, WButton } from 'wt-frontend';

const DeleteRegion= (props) => {

    const handleDelete = async () => {
        props.deleteRegion(props.activeid);
        props.setShowDeleteRegion(false);
    }

    return (
        <WModal className="delete-modal" cover="true" visible={props.setShowDeleteRegion}>
            <WMHeader  className="modal-header" onClose={() => props.setShowDeleteRegion()}>
                Delete Region?
			</WMHeader >

            <WMMain>
                <WButton className="modal-button cancel-button" onClick={() => props.setShowDeleteRegion(false)} wType="texted">
                    Cancel
				</WButton>
                <label className="col-spacer">&nbsp;</label>
                <WButton className="modal-button" onClick={handleDelete} clickAnimation="ripple-light" hoverAnimation="darken" shape="rounded" color="danger">
                    Delete
				</WButton>
            </WMMain>

        </WModal >
    );
}

export default DeleteRegion;