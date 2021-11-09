import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
import { Modal } from '@mui/material';
import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import { Button } from '@mui/material';
import React from 'react';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

export default function DeleteModal({open}) {
    const { store } = useContext(GlobalStoreContext);
    let name = "";
    if (store.currentList) {
        name = store.currentList.name;
    }
    function handleDeleteList(event) {
        store.deleteList(store.listMarkedForDeletion);
        store.unmarkListForDeletion();
    }
    function handleCloseModal(event) {
        store.unmarkListForDeletion();
    }

    if(store.listMarkedForDeletion){
        name = store.idNamePairs.filter((x) => x._id === store.listMarkedForDeletion._id)[0].name;
    }
    return (
        <Modal
        //   onClose={handleCloseModal}
          open={store.listMarkedForDeletion !== null}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Delete the {name} Top 5 List?
            </Typography>
          <Button variant="outlined" onClick={handleDeleteList}>Confirm</Button>
          <Button variant="outlined" onClick={handleCloseModal}>Cancel</Button>
          </Box>
        </Modal>
    );
}