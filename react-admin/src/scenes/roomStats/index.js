import { Box, Button, useTheme, Typography } from '@mui/material'
import { useEffect, useState } from 'react' 
import { tokens } from '../../theme'
import Header from '../../components/Header'
import StatBox from '../../components/StatBox'
import FreeRoomData from '../../data/FreeRoomData'
import UsedRoomData from '../../data/UsedRoomData'
import EventCalendar from '../../components/EventCalendar'
import { fetchRoomsData } from '../../data/getData'
import ConfirmationDialog from '../../components/ConfirmationDialog'
import { fetchClassesDataByDay } from '../../data/getData'
//icons
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined'
import ScienceOutlinedIcon from '@mui/icons-material/ScienceOutlined'
import ContactsOutlinedIcon from '@mui/icons-material/ContactsOutlined'
import DesignServicesOutlinedIcon from '@mui/icons-material/DesignServicesOutlined'
import { useNavigate } from 'react-router-dom'

const RoomStats = () => {
    const theme = useTheme()
    const colors = tokens(theme.palette.mode)
    const navigate = useNavigate()
    const [rooms, setRooms] = useState([])
    const [classes, setClasses] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [isConfirmationOpen, setIsConfirmationOpen] = useState(false)
    const [occupiedRooms, setOccupiedRooms] = useState('')
    const [occupiedRoomsPer, setOccupiedRoomsPer] = useState(0)
    const [occupiedLab, setOccupiedLab] = useState('')
    const [occupiedLabPer, setOccupiedLabPer] = useState(0)
    const [occupiedClass, setOccupiedClass] = useState('')
    const [occupiedClassPer, setOccupiedClassPer] = useState(0)
    const [occupiedOther, setOccupiedOther] = useState('')
    const [occupiedOtherPer, setOccupiedOtherPer] = useState(0)

    //navigation to the other page
    const handleButtonClick = () => {
        navigate('/reservasSalas') 
    }

    const d = new Date()
    let day = d.getDay()

    useEffect(() => {
        async function fetchData() {
        try {
            const dataRooms = await fetchRoomsData()  // Call the function from getData.js
            setRooms(dataRooms) 
            setIsLoading(false) 
            const classesData = await fetchClassesDataByDay(day)
            setClasses(classesData)
        } catch (error) {
            console.error('Error fetching data:', error) 
            throw error 
        }
        }

        fetchData() 
    }, []) 

    useEffect(() => {
        calcTotalRoomsOccupied() 
    }, [rooms]) 

    const handleCloseDialog = () => {
        setIsConfirmationOpen(false) 
            
    }  

    //total of occupied rooms
    const calcTotalRoomsOccupied = () => {
        let countTotalOccupied = 0
        let countTotalSalaAula = 0
        let countTotalLabs = 0
        let countTotalOther = 0 
        let countSalaAula = 0
        let countLabs = 0
        let countOther = 0 
        for (const room of rooms) {
            if (String(room['function.']).toLocaleLowerCase().includes('sala de aula')) {
                countTotalSalaAula++
                if(room.isOccupied){
                    countSalaAula++
                }
                room['function.'] = 'sala de aula'
            } else if (String(room['function.']).toLocaleLowerCase().includes('laboratório')) {
                countTotalLabs++
                if(room.isOccupied){
                    countLabs++
                }
                room['function.'] = "laboratório"
            } else {
                countTotalOther++
                if(room.isOccupied){
                   countOther++ 
                }
                room['function.'] = 'outro'
            }
            
        }
        countTotalOccupied = countSalaAula + countLabs + countOther
        setOccupiedRooms(countTotalOccupied)
        setOccupiedRoomsPer(countTotalOccupied/rooms.length)
        setOccupiedClass(countSalaAula)
        setOccupiedClassPer(countSalaAula/rooms.length)
        setOccupiedLab(countLabs)
        setOccupiedLabPer(countLabs/rooms.length)
        setOccupiedOther(countOther)
        setOccupiedOtherPer(countOther/rooms.length)
    }
    
      //pop-up enquanto os dados carregam
      if (isLoading) {
        return <ConfirmationDialog
                isOpen={isConfirmationOpen}
                onClose={handleCloseDialog}
                phrase="Aguarde enquanto os dados são carregados"
                /> 
    }
    

    return (
        <Box m='20px'>
            <Box display='flex' justifyContent="space-between" alignItems="center">
                <Header title="Estatísticas das Salas" subtitle="Dados gerais das salas do campus de Tomar"/>
                
            </Box >

            {/* Grid and CHARTS */}
            <Box display='grid' gridTemplateColumns='repeat(12, 1fr)' gridAutoRows='140px' gap='15px'>

                {/* ROW 1 */}
                <Box gridColumn='span 3' backgroundColor={colors.primary[400]} display='flex' alignItems='center' justifyContent='center'>
                    <StatBox 
                        title={`Ocupação: ${occupiedRooms}`}
                        subtitle='Total das Salas'
                        progress={occupiedRoomsPer}
                        increase={Math.floor(occupiedRoomsPer * 100)+'%'}
                        icon={<SchoolOutlinedIcon sx={{color: colors.greenAccent[600], fontSize: '26px'}}/>}
                    />
                </Box>
                <Box gridColumn='span 3' backgroundColor={colors.primary[400]} display='flex' alignItems='center' justifyContent='center'>
                    <StatBox 
                        title={`Ocupação: ${occupiedLab}`}
                        subtitle='Total das Salas Técnicas'
                        progress={occupiedLabPer}
                        increase={Math.floor(occupiedLabPer * 100)+'%'}
                        icon={<ScienceOutlinedIcon sx={{color: colors.greenAccent[600], fontSize: '26px'}}/>}
                    />
                </Box>
                <Box gridColumn='span 3' backgroundColor={colors.primary[400]} display='flex' alignItems='center' justifyContent='center'>
                    <StatBox 
                        title={`Ocupação: ${occupiedClass}`}
                        subtitle='Total das Salas Teóricas'
                        progress={occupiedClassPer}
                        increase={Math.floor(occupiedClassPer * 100)+'%'}
                        icon={<ContactsOutlinedIcon sx={{color: colors.greenAccent[600], fontSize: '26px'}}/>}
                    />
                </Box>

                <Box gridColumn='span 3' backgroundColor={colors.primary[400]} display='flex' alignItems='center' justifyContent='center'>
                    <StatBox 
                        title={`Ocupação: ${occupiedOther}`} 
                        subtitle='Total das Outras Salas'
                        progress={occupiedOtherPer}
                        increase={Math.floor(occupiedOtherPer * 100)+'%'}
                        icon={<DesignServicesOutlinedIcon sx={{color: colors.greenAccent[600], fontSize: '26px'}}/>}
                    />
                </Box>


                {/* ROW 2 */}
                <Box gridColumn='span 3' gridRow='span 2' backgroundColor={colors.primary[400]}>
                    <Box mt='80px' padding='0 30px' display='flex' flexDirection='column' alignItems='center'>
                        <Box mb='30px'>
                        <Typography variant='h5' fontWeight='600' color={colors.grey[100]}>
                            Pesquisar ou reservar salas
                        </Typography>
                        </Box>
                        <Box display="flex" justifyContent="center" flexGrow={1}>
                        <Button
                            variant='contained'
                            onClick={handleButtonClick}
                            sx={{
                            backgroundColor: colors.greenAccent[500],
                            width: '100%', 
                            height: '100px', 
                            fontSize: '1rem', 
                            }}
                        >
                            Reservar sala
                        </Button>
                        </Box>
                    </Box>
                </Box>


                {/* Button that redirects to 'reservar salas' */}
                <Box gridColumn='span 9' gridRow='span 2' backgroundColor={colors.primary[400]}>
                    <Box mt='25px' padding='0 30px' display='flex' justifyContent='space-between' alignItems='center'>
                        <Box>
                        <Typography variant='h3' fontWeight='bold' color={colors.grey[100]}>
                            Salas Livres
                        </Typography>
                        </Box>
                    </Box>
                    <Box height='250px' mt='-20px'>
                        <FreeRoomData data={rooms} classes={classes}/>
                    </Box>
                </Box>

                {/* ROW 3 */}
                {/* Salas ocupadas por bloco - Barchart */}
                <Box gridColumn='span 8' gridRow='span 2' backgroundColor={colors.primary[400]}>
                    <Box mt='25px' padding='0 30px' display='flex' flexDirection='column'>
                        <Box mb="10px">
                        <Typography variant='h5' fontWeight='600' color={colors.grey[100]}>
                            Localização das Salas Ocupadas
                        </Typography>
                        <Typography variant='h3' fontWeight='bold' color={colors.greenAccent[500]}>
                            Salas Ocupadas por bloco
                        </Typography>
                        </Box>
                    </Box>
                    <UsedRoomData rooms={rooms} classes={classes}/>

                </Box>

                <EventCalendar />

            </Box>
        </Box>
    )
}

export default RoomStats
