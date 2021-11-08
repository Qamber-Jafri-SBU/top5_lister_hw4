import { useContext, useState } from 'react';
import AuthContext from '../auth';
import { GlobalStoreContext } from '../store'
import { Modal } from '@mui/material';
import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import { Button } from '@mui/material';
import React from 'react';
import { Alert } from '@mui/material';
import { useCallback } from 'react';

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

export default function ErrorModal({open}) {
    const { auth } = useContext(AuthContext);


    function handleClose(event) {
      event.stopPropagation();
      auth.closeModal();
    }

    return (
        <Modal
          onClose={handleClose}
          open={open}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Error
            </Typography>
            <Alert severity="error">{auth.errorMessage}</Alert>
          <Button variant="outlined" onClick={handleClose}>Close</Button>
          </Box>
        </Modal>
    );
}