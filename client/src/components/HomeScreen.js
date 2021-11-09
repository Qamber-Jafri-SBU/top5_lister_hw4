import React, { useContext, useEffect } from 'react'
import { GlobalStoreContext } from '../store'
import ListCard from './ListCard.js'
import { Fab, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add';
import List from '@mui/material/List';
import DeleteModal from './DeleteModal';
import { createTheme, ThemeProvider } from '@mui/material/styles';

/*
    This React component lists all the top5 lists in the UI.
    
    @author McKilla Gorilla
*/
const HomeScreen = () => {
    const { store } = useContext(GlobalStoreContext);

    useEffect(() => {
        store.loadIdNamePairs();
    }, []);

    function handleCreateNewList() {
        // try{
            store.createNewList();
        // }catch(e){
        //     console.error(e);
        // }
    }

    const theme = createTheme();

    let listCard = "";
    if (store) {
        listCard = 
            <List sx={{ width: '90%', left: '5%', bgcolor: 'background.paper' }}>
            {
                store.idNamePairs.map((pair) => (
                    <ListCard
                        key={pair._id}
                        idNamePair={pair}
                        selected={false}
                    />
                ))
            }
            </List>;
    }
    console.log("store : " + store);
    return (
        <ThemeProvider theme={theme}>
            <div id="top5-list-selector">
                <div id="list-selector-heading">
                <Fab 
                    color="primary" 
                    aria-label="add"
                    id="add-list-button"
                    onClick={handleCreateNewList}
                >
                    <AddIcon />
                </Fab>
                    <Typography variant="h2">Your Lists</Typography>
                </div>
                <div id="list-selector-list">
                    {
                        listCard
                    }
                    <DeleteModal 
                    open={(store.listMarkedForDeletion !== null)}
                    />
                </div>
            </div>
        </ThemeProvider>)
}

export default HomeScreen;