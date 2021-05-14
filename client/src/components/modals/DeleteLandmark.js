import React from 'react';

import { WModal, WMHeader, WMMain, WButton } from 'wt-frontend';

const DeleteLandmark = (props) => {

    const handleDelete = async () => {
        props.deleteLandmark();
        props.setShowDeleteLandmark(false);
    }

    return (
        <WModal className="delete-modal" cover="true" visible={props.setShowDeleteLandmark}>
            <WMHeader  className="modal-header" onClose={() => props.setShowDeleteLandmark()}>
                Delete Landmark?
			</WMHeader >

            <WMMain>
                <WButton className="modal-button cancel-button" onClick={() => props.setShowDeleteLandmark()} wType="texted">
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

export default DeleteLandmark;