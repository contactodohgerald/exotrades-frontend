import { 
  SimpleGrid, 
  Stack, 
  useMediaQuery 
} from '@chakra-ui/react'
import React, { useEffect, useState } from 'react';
import axios from "axios";
import { BASE_URL } from '../api_routes';
import { MdAccountCircle, MdPaid, MdHearing, MdNat, MdSip, MdDynamicFeed, MdAir, MdWater, MdBubbleChart, MdMemory, MdDetails } from 'react-icons/md'
import AdminCard from '../components/AdminCard'
import BreadCrumb from '../components/BreadCrumb'
import API_TOKEN from '../token';
import swal from 'sweetalert'
import Loader from '../components/Loader';
import { formater } from '../_formater';

function Dashboard() {
  const [dashboardData, setDashboardData] = useState(false)
  const getDashboardData = () => {
    axios.get(BASE_URL+'get-admin-dashboard-details', {
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
        return
    })
  }
  useEffect(() => {
    getDashboardData()
  }, [])
  
  const [isNotSmallerScreen] = useMediaQuery('(min-width: 600px)')
  const links = [
      {
          url: '/admin-dashboard',
          value: 'Dashboard',
      },
  ]
  return !dashboardData ? ( <Loader/> ) : (
    <Stack>
      <BreadCrumb links={links} />  
      <SimpleGrid columns={isNotSmallerScreen ? 3 : 1} spacing={isNotSmallerScreen ? 6 : 3}> 
        <AdminCard title='TOTAL USERS' value={dashboardData.total_users.length} icon={MdAccountCircle} color={'purple'} />
        <AdminCard title='TOTAL EARNINGS' value={formater.format(dashboardData.total_earnings)} icon={MdHearing} color={'orange.400'} />
        <AdminCard title='SUPPORT TICKET' value={dashboardData.total_ticket.length} icon={MdNat} color={'green.700'} />
        <AdminCard bg={'red'} text={'white'} title='WITHDRAWAL REQUEST' value={formater.format(dashboardData.total_withdraw)} icon={MdPaid}  />
        <AdminCard bg={'green'} text={'white'} title='SETTLED REQUEST' value={formater.format(dashboardData.confirmed_withdraw)} icon={MdSip}  />
        <AdminCard bg={'blue'} text={'white'} title='UNSETTLED REQUEST' value={formater.format(dashboardData.pending_withdraw)} icon={MdMemory} />
        <AdminCard title='TOTAL INVESTMENT' value={formater.format(dashboardData.total_invest)} icon={MdAir} color={'red.800'} />
        <AdminCard title='CONFIRMED INVESTMENT' value={formater.format(dashboardData.confirm_invest)} icon={MdWater} color={'teal.400'} />
        <AdminCard title='UNCONFIRMED INVESTMENT' value={formater.format(dashboardData.pending_invest)} icon={MdPaid} color={'green.700'} />
        <AdminCard bg={'orange'} text={'white'} title='ALL REFERRAL COMISSION' value={formater.format(dashboardData.all_ref_comission)} icon={MdDynamicFeed}  />
        <AdminCard bg={'purple'} text={'white'} title='CONFIRMED REFERRAL COMISSION' value={formater.format(dashboardData.confrim_ref_comission)} icon={MdBubbleChart}  />
        <AdminCard bg={'red'} text={'white'} title='PENDING REFERRAL COMISSION' value={formater.format(dashboardData.pending_ref_comission)} icon={MdDetails} />
      </SimpleGrid>
    </Stack>
  )
}

export default Dashboard