import React from 'react'
import { Box, Heading, SimpleGrid } from '@chakra-ui/react'
import { FcAddDatabase, FcAdvertising, FcDoughnutChart, FcMultipleDevices, FcPrivacy, FcTimeline } from 'react-icons/fc'
import Feature from './Feature'

function FeatureList({ siteSetting }) {
  return (
    <Box as="section" maxW="5xl" mx="auto" py="12" px={{ base: '6', md: '8' }}>
        <Heading py="8" textAlign={'center'}>Why Choose {siteSetting ? siteSetting.site_name : ''}</Heading>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacingX="10" spacingY={{ base: '8', md: '14' }}>
            <Feature title="Protection & Security" icon={<FcPrivacy />}>
                Stop loss and take profit orders will help secure your investment. The system will automatically execute trades to realise gains.
            </Feature>
            <Feature title="Easy to Use Platform" icon={<FcTimeline />}>
                Our platform was designed in such a way that it's compatible with all devices and easy to navigate.
            </Feature>
            <Feature title="Payments" icon={<FcDoughnutChart />}>
                We payout instantly. All requested payment made are usually processed and paid in the equivalent cryptocurrency invested.
            </Feature>
            <Feature title="24/7 Support" icon={<FcMultipleDevices />}>
                We guarantee you of our expert support both day and night. All you need is to write to us using the email address provided in below.
            </Feature>
            <Feature title="Affiliate" icon={<FcAddDatabase />}>
                We are affiliated with top companies in the forex business and we deal also on Real Estate, Forex trading, Gold Mining. We have a deal with our Investments Insurance partners, best in the market from USA which trades in our Business Enterprise portfolio and in return provides insurance services and elite attorneys for us.
            </Feature>
            <Feature title="Licensed Exchange" icon={<FcAdvertising />}>
                Our customers perform transactions not only in cryptocurrency, but the major world currencies supported by the system.
            </Feature>
        </SimpleGrid>
    </Box>
  )
}

export default FeatureList