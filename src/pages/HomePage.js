import { 
  Box,
  Heading,
  SimpleGrid, 
  Stack, 
  useMediaQuery 
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import AccountBalanceCard from '../components/AccountBalanceCard';
import ActionPerformerCard from '../components/ActionPerformerCard';
import HomeSummaryCard from '../components/HomeSummaryCard';
import { FiArrowDown, FiArrowUp } from 'react-icons/fi'
import swal from 'sweetalert'
import axios from "axios";
import { BASE_URL } from '../api_routes';
import API_TOKEN from '../token';
import Loader from '../components/Loader';


function HomePage() {
  const [userData, setUserData] = useState(false)
  const [dashboardData, setDashboardData] = useState(false)

  const getUsersProfileDetails = () => {
    axios.get(BASE_URL+'get-user-profile', {
        headers: {
            'Authorization': `Bearer ${API_TOKEN}` 
        }
    })
    .then(respond => {
        const users = respond.data
        setUserData(users)
    })
    .catch(error => {
        const errorMsg = error.message
        swal({
          title: "Error",
          text: errorMsg,
          icon: "error"
      })
    })
  }
  const getDashboardDetails = () => {
    axios.get(BASE_URL+'get-dashboard-details', {
        headers: {
            'Authorization': `Bearer ${API_TOKEN}` 
        }
    })
    .then(respond => {
        const data = respond.data.payload
        setDashboardData(data)
    })
    .catch(error => {
        const errorMsg = error.message
        swal({
          title: "Error",
          text: errorMsg,
          icon: "error"
      })
    })
  }
  useEffect(() => {
    getUsersProfileDetails()
    getDashboardDetails()
  }, [])
  
  const [isNotSmallerScreen] = useMediaQuery('(min-width: 600px)')

  return !userData ? (
    <Loader />
    ) : (
    <Stack>
      <Heading mb={'5'} color={'orange.400'} fontSize={'lg'} textAlign={'left'}>Welcome Back - {userData.payload.name}</Heading>
      <SimpleGrid columns={isNotSmallerScreen ? 3 : 1} spacing={isNotSmallerScreen ? 6 : 3}> 
        <HomeSummaryCard title='Deposit' url='/invest-history' percent={85} amount={dashboardData.invest ? dashboardData.invest.amount : 0} total={dashboardData ? dashboardData.user_total_invest : 0} />
        <HomeSummaryCard title='Earnings' url='/earning-history' percent={10} amount={dashboardData.earnings ? dashboardData.earnings.amount : 0} total={dashboardData ? dashboardData.user_total_earnings : 0} />
        <HomeSummaryCard title='Withdrawals' url='/withdrawal-history' percent={54} amount={dashboardData.withdraw ? dashboardData.withdraw.amount : 0} total={dashboardData ? dashboardData.user_total_withdraw : 0} />
      </SimpleGrid>
      <AccountBalanceCard user={userData ? userData.payload : null} />
      <Box>
        
      </Box>
      <SimpleGrid columns={isNotSmallerScreen ? 2 : 1} spacing={isNotSmallerScreen ? null : 2}>
        <ActionPerformerCard title='INVEST' url='/invest' icon={<FiArrowUp/>} bg='linear(to-r, purple.900, purple)' />
        <ActionPerformerCard title='INITIATE WITHDRAW' url='/initate-withdrawal' icon={<FiArrowDown/>} bg='linear(to-r, grey, black)' />
      </SimpleGrid>
    </Stack>
  );
}

export default HomePage;
