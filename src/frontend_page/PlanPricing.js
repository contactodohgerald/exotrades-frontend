import { 
    Box, 
    Heading, 
    SimpleGrid, 
    useColorMode 
} from '@chakra-ui/react'
import { SiMarketo } from 'react-icons/si'
import PricingCard from './PricingCard'
import ActionButton from './ActionButton'
import React from 'react';

function PlanPricing({ plans }) {
    
    const { colorMode} = useColorMode()
    const isDark = colorMode === 'dark'
    return (
        <Box as="section" bg={isDark ? 'gray.800' : 'gray.50'} py="14" px={{ base: '4', md: '8' }}>
            <Heading py="8" textAlign={'center'}>Complete package for every traders</Heading>
             <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={{ base: '8', lg: '0' }} maxW="7xl" mx="auto" justifyItems="center" alignItems="center">
                 {plans.length !== 0 ? plans.map((each_plan, index) => (
                     <PricingCard key={index} transform={index === 1 ? { lg: 'scale(1.05)' } : ''} zIndex={index === 1 ? 1 : ''} label={index === 1 ? true : false} data={each_plan}  icon={SiMarketo} button={<ActionButton> Open An Account</ActionButton>}/>
                 ))  : null}
            </SimpleGrid>
        </Box>
    )
}

export default PlanPricing