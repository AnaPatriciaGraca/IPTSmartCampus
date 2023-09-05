import { Box, Button, IconButton, Typography, useTheme } from '@mui/material'
import { tokens } from '../../theme'
import Header from '../../components/Header'
import { events } from '../../data/testData'
import StatBox from '../../components/StatBox'
import TemperatureChart from '../../components/TemperatureChart'
import CurrentClasses from '../../components/CurrentClasses'
import NoiseChart from '../../components/NoiseChart'
//icons
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined'
import EmailIcon from '@mui/icons-material/Email'
import PointOfSaleIcon from '@mui/icons-material/PointOfSale'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import TrafficIcon from '@mui/icons-material/Traffic'
import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat'
import MicOutlinedIcon from '@mui/icons-material/MicOutlined';


const DashboardTest = () => {
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)

  return (
    <Box m='20px'>
      <Box display='flex' justifyContent="space-between" alignItems="center">
        <Header title="DASHBOARD" subtitle="Dados Gerais Tomar"/>
        <Box>
          <Button sx={{
            backgroundColor: colors.blueAccent[700],
            color: colors.grey[100],
            fontSize: '14px',
            fontWeight: 'bold',
            padding: '10px 20px'
          }}>
            <DownloadOutlinedIcon sx={{mr:'10px'}}/>
            Download Reports
          </Button>
        </Box>
      </Box >

      

      {/* GRID AND CHARTS */}
      <Box display='grid' gridTemplateColumns='repeat(12, 1fr)' gridAutoRows='140px' gap='15px'>
        {/* ROW 1 */}
        <Box gridColumn='span 3' backgroundColor={colors.primary[400]} display='flex' alignItems='center' justifyContent='center'>
          <StatBox 
            title='37 ºC' 
            subtitle='Temperatura'
            progress='0.75'
            increase='75%'
            icon={<DeviceThermostatIcon sx={{color: colors.greenAccent[600], fontSize: '26px'}}/>}
          />
        </Box>
      
        <Box gridColumn='span 3' backgroundColor={colors.primary[400]} display='flex' alignItems='center' justifyContent='center'>
          <StatBox 
            title='80 dB' 
            subtitle='Ruído'
            progress='0.5'
            increase='50%'
            icon={<MicOutlinedIcon sx={{color: colors.greenAccent[600], fontSize: '26px'}}/>}
          />
        </Box>

        <Box gridColumn='span 3' backgroundColor={colors.primary[400]} display='flex' alignItems='center' justifyContent='center'>
          <StatBox 
            title='356' 
            subtitle='Afluência'
            progress='0.25'
            increase='25%'
            icon={<PersonAddIcon sx={{color: colors.greenAccent[600], fontSize: '26px'}}/>}
          />
        </Box>

        <Box gridColumn='span 3' backgroundColor={colors.primary[400]} display='flex' alignItems='center' justifyContent='center'>
          <StatBox 
            title='256' 
            subtitle='Estacionamento'
            progress='0.36'
            increase='+36%'
            icon={<TrafficIcon sx={{color: colors.greenAccent[600], fontSize: '26px'}}/>}
          />
        </Box>

        {/* ROW 2 */}
        {/* LINE CHART */}
        <Box gridColumn='span 8' gridRow='span 2' backgroundColor={colors.primary[400]}>
          <Box mt='25px' padding='0 30px' display='flex' justifyContent='space-between' alignItems='center'>
            <Box>
              <Typography variant='h5' fontWeight='600' color={colors.grey[100]}>
                Temperatura
              </Typography>
              <Typography variant='h3' fontWeight='bold' color={colors.greenAccent[500]}>
                 Atual: 26º C
              </Typography>
            </Box>
            <Box>
              <IconButton>
                <DownloadOutlinedIcon sx={{fontSize:'26px', color: colors.greenAccent[500]}}/>
              </IconButton>
            </Box>
          </Box>
          <Box height='250px' mt='-20px'>
            <TemperatureChart isDashboard={true} />
          </Box>
        </Box>

        {/* TRANSACTIONS */}
        <Box gridColumn='span 4' gridRow='span 2' backgroundColor={colors.primary[400]} overflow='auto' >
          <Box display='flex' justifyContent='space-between' alignItems='center' borderBottom={`4px solid ${colors.primary[400]}`} colors={colors.grey[100]} p='15px'>
            <Typography color={colors.grey[100]} variant='h5' fontWeight={600}>
              Calendário
            </Typography>
          </Box>

          {events.map((transaction, i) =>(
            <Box key={`${transaction.id}-${i}`} display='flex' justifyContent='space-between' alignItems='center' borderBottom={`4px solid ${colors.primary[400]}`} p='15px'>
              <Box>
                <Typography color={colors.greenAccent[500]} variant='h5' fontWeight={600}>
                  {transaction.title}
                </Typography>
                <Typography color={colors.grey[100]} variant='h6' fontWeight={600}>
                  {transaction.user}
                </Typography>
              </Box>
              <Box color={colors.grey[100]}>
                {transaction.date}
              </Box>
              <Box backgroundColor={colors.greenAccent[500]} p='5px 10px' borderRadius='4px'>
                {transaction.hour}
              </Box>
            </Box>
          ))}
        </Box>

        {/* ROW 3 */}

        {/* PIE CHART */}
        <Box gridColumn='span 4' gridRow='span 2' backgroundColor={colors.primary[400]}>
            <Typography variant='h5' fontWeight='600' sx={{p: '30px 30px 0 30px'}}>
              Aulas a decorrer
            </Typography>
          <Box height='250px'>
            <CurrentClasses/>
          </Box>
        </Box>

        {/* STREAM CHART */}
        <Box gridColumn='span 8' gridRow='span 2' backgroundColor={colors.primary[400]}>
            <Typography variant='h5' fontWeight='600' sx={{p: '30px 30px 0 30px'}}>
              Ruído
            </Typography>
          <Box height='250px' mt='-20px'>
            <NoiseChart />
          </Box>
        </Box>

        

      </Box>
    </Box>
  )
}

export default DashboardTest