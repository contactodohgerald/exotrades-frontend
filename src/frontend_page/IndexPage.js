import { 
  Box,
  Container, 
  SimpleGrid,
  useColorMode,
  useMediaQuery,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import PlanPricing from './PlanPricing';
import API_TOKEN from '../token';
import Misguided from './Misguided';
import Stat from './Stat ';
import FeatureList from './FeatureList';
import Footer from './Footer';
import StartTrail from './StartTrail';
import Subscribe from './Subscribe';
import axios from "axios";
import swal from 'sweetalert'
import { BASE_URL } from '../api_routes';
import CoinMarquee from '../components/CoinMarquee';


const stats = [
  { label: 'Total Users', value: '71,887' },
  { label: 'Total Deposit', value: '$1,001,23+' },
  { label: 'Total Withdraw', value: '$1,000,20+' },
]

function IndexPage() {
  const [user, setUser] = useState(null)
  const [siteSetting, setSiteSetting] = useState(null)
  const [plans, setPlans] = useState([])

  const getListOfPlans = () => {
      axios.get(BASE_URL+'list-of-plans')
      .then(respond => {
          const plans = respond.data
          setPlans(plans.payload)
          setSiteSetting(plans.site_details)
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
    API_TOKEN ? setUser(true) : setUser(false);
    getListOfPlans()
  }, [])

  const [isNotSmallerScreen] = useMediaQuery('(min-width: 600px)')
  const { colorMode} = useColorMode()
  const isDark = colorMode === 'dark'
  return (
    <Box w={'full'} h={'auto'}>
        <CoinMarquee />
      
        <StartTrail user={user} isDark={isDark} isNotSmallerScreen={isNotSmallerScreen} />
        <FeatureList siteSetting={siteSetting} />
        <PlanPricing plans={plans} />
        <Misguided isDark={isDark} isNotSmallerScreen={isNotSmallerScreen} />
        <Box as="section" py={{ base: '4', md: '8' }} bg={isDark ? 'gray.800' : 'gray.50'} >
          <Container maxW='container.xl'>
            <SimpleGrid columns={isNotSmallerScreen ? 3 : 1} spacing={isNotSmallerScreen ? '1' : '1'}>
              {stats.map(({ label, value }) => (
                <Stat key={label} label={label} value={value} />
              ))}
            </SimpleGrid>
          </Container>
        </Box>
        <Subscribe isDark={isDark} isNotSmallerScreen={isNotSmallerScreen} siteSetting={siteSetting} />
        <Footer isDark={isDark} siteSetting={siteSetting} />
    </Box>
    );
  }

export default IndexPage;
