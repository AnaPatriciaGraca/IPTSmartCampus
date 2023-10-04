import { Box, Typography, MenuItem, Select, TextField, Button, Grid, InputLabel } from '@mui/material'
import { useEffect, useState } from 'react'
import { tokens } from '../theme'
import { useTheme } from '@mui/material'
import { fetchRoomsData } from '../data/getData' // Import the function
import SearchResult from './SearchResult'
import ConfirmationDialog from './ConfirmationDialog'

const Rooms = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode)
    const [rooms, setRooms] = useState([]);
    const [isLoading, setIsLoading] = useState(true)
    const [searchName, setSearchName] = useState('')
    const [searchFunction, setSearchFunction] = useState('')
    const [searchProjector, setSearchProjector] = useState('')
    const [searchMaxCapacity, setSearchMaxCapacity] = useState('')
    const [searchIsOccupied, setSearchIsOccupied] = useState('')
    const [filteredRooms, setFilteredRooms] = useState([])
    const [isConfirmationOpen, setIsConfirmationOpen] = useState(false)

    //Get the data from the API
    useEffect(() => {
        async function fetchData() {
        try {
            const data = await fetchRoomsData() // Call the function from getData.js
            setRooms(data)
            setIsLoading(false)
        } catch (error) {
            console.error('Error fetching data:', error)
            throw error
        }
        }

        fetchData();
    }, []);

    const handleCloseDialog = () => {
        setIsConfirmationOpen(false);
            
    }; 

    //pop-up enquanto os dados carregam
    if (isLoading) {
        return <ConfirmationDialog
                isOpen={isConfirmationOpen}
                onClose={handleCloseDialog}
                phrase="Aguarde enquanto os dados são carregados"
                />;
    }
    //is room occiped or not
    const mapIsOccupied = (value) => {
        return value === 1 ? 'Não disponível' : 'Disponível'
    }

    const roomNameOptions = Array.from(new Set(rooms.filter((room) => room.name && room.name.length > 0).map((room) => room.name)))
    const roomFunctionOptions = Array.from(new Set(rooms.filter((room) => room.function && room.function.length > 0).map((room) => room.function)))
    const roomProjectorOptions = [0, 1, 2]

    //handle search - ignores the fields that aren't filled
    const handleSearch = () => {
        const filtered = rooms.filter((room) => {
            const isNameMatch = !searchName || String(room.name).toLowerCase().includes(searchName.toLowerCase())
            const isFunctionMatch = !searchFunction || String(room.function).toLowerCase().includes(searchFunction.toLowerCase())
            //equal or higher relative to the value searched
            const isProjectorMatch =
                searchProjector === '' || searchProjector === undefined
                    ? true // If searchProjector is empty or undefined, don't filter based on projector
                    : room.projector >= parseInt(searchProjector); // Parse searchProjector to integer and filter
            //equal or higher relative to the value searched
            const isMaxCapacityMatch =
                searchMaxCapacity === '' || searchMaxCapacity === undefined
                    ? true // If searchMaxCapacity is empty or undefined, don't filter based on maxCapacity
                    : room.maxCapacity >= parseInt(searchMaxCapacity); // Parse searchMaxCapacity to integer and filter
            //deal with no value search
            const isOccupancyMatch =
                searchIsOccupied === '' || searchIsOccupied === undefined ? true : room.isOccupied === parseInt(searchIsOccupied) // Parse searchIsOccupied to integer
            return isNameMatch && isFunctionMatch && isProjectorMatch && isMaxCapacityMatch && isOccupancyMatch
        });
    
        setFilteredRooms(filtered)
    };
    
    
    

    return (
        <Box p={3}>
                <Box mb={2}>
                    <Grid container spacing={2}>
                        {/* Field for name of room */}
                    <Grid item xs={6}>
                    <InputLabel htmlFor="search-name">Nome da Sala</InputLabel>
                        <Select
                            fullWidth
                            variant="outlined"
                            label="Name"
                            value={searchName}
                            onChange={(e) => setSearchName(e.target.value)}
                            inputProps={{
                                name: 'name',
                                id: 'name-select',
                            }}
                        >
                            <MenuItem value="">None</MenuItem> 
                            {roomNameOptions.map((name) => (
                                <MenuItem key={name} value={name}>
                                    {name}
                            </MenuItem>
                            ))}
                        </Select>
                    </Grid>
                    {/* Field for function fo the room */}
                    <Grid item xs={6}>
                        <InputLabel htmlFor="search-function">Função da Sala</InputLabel>
                        <Select
                            fullWidth
                            variant="outlined"
                            label="Function"
                            value={searchFunction}
                            onChange={(e) => setSearchFunction(e.target.value)}
                            inputProps={{
                                name: 'function',
                                id: 'function-select',
                            }}
                        >
                            <MenuItem value="">None</MenuItem> {/* Add an empty option */}
                            {roomFunctionOptions.map((roomFunction) => (
                                <MenuItem key={roomFunction} value={roomFunction}>
                                    {roomFunction}
                            </MenuItem>
                            ))}
                        </Select>
                    </Grid>
                    {/* Filter for quantity of projectors */}
                    <Grid item xs={6}>
                        <InputLabel htmlFor="search-projectors">Quantidade de Projetores</InputLabel>
                        <Select
                            fullWidth
                            variant="outlined"
                            label="Projector"
                            value={searchProjector}
                            onChange={(e) => setSearchProjector(e.target.value)}
                            inputProps={{
                                name: 'projector',
                                id: 'projector-select',
                            }}
                        >
                            <MenuItem value="">None</MenuItem> {/* Add an empty option */}
                            {roomProjectorOptions.map((projector) => (
                                <MenuItem key={projector} value={projector}>
                                    {projector}
                            </MenuItem>
                            ))}
                        </Select>
                    </Grid>
                    {/* Filter for max Capacity of room */}
                    <Grid item xs={6}>
                        <InputLabel htmlFor="search-function">Capacidade da Sala</InputLabel>
                        <TextField
                        fullWidth
                        // options={roomMaxCapacityOptions}
                        variant="outlined"
                        label=""
                        value={searchMaxCapacity}
                        onChange={(e) => setSearchMaxCapacity(e.target.value)}
                        />
                    </Grid>
                    {/* Field for occupied room */}
                    <Grid item xs={6}>
                        <InputLabel htmlFor="search-function">Disponibilidade</InputLabel>
                        <Select
                        fullWidth
                        variant="outlined"
                        label=""
                        value={searchIsOccupied}
                        onChange={(e) => setSearchIsOccupied(e.target.value)}
                        >
                        <MenuItem value="">All</MenuItem>
                        <MenuItem value={1}>{mapIsOccupied(1)}</MenuItem>
                        <MenuItem value={0}>{mapIsOccupied(0)}</MenuItem>
                        </Select>
                    </Grid>
                    {/* Search button */}
                    <Grid item xs={6} mt="20px">
                        <Button sx={{
                            color: colors.blueAccent[900],
                            background: colors.greenAccent[400],
                            height: '50px',
                            fontWeight: 'bold'
                        }}
                        fullWidth
                        variant="contained"
                        onClick={handleSearch}
                        >
                            Pesquisar
                        </Button>
                    </Grid>
                    </Grid>
                </Box>
                <Box mt={2}>
                    {/* Results from search */}
                    <SearchResult data={filteredRooms}/>
                </Box>
            </Box>
        )
}

export default Rooms