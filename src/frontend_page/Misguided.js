import React from 'react'
import {
    Box,
    Button,
    Flex,
    Heading,
    HStack,
    Icon,
    Image,
    Skeleton,
    Stack,
    Text,
    useColorModeValue,
  } from '@chakra-ui/react'
  import { FaArrowRight } from 'react-icons/fa'
  import { Link } from 'react-router-dom'

function Misguided({isDark, isNotSmallerScreen}) {
  return (
    <Box maxW="7xl" mx="auto" px={{ base: '0', lg: '12' }} py={{ base: '0', lg: '12' }}>
      <Stack direction={isNotSmallerScreen ? 'row' : 'column-reverse'} spacing={isNotSmallerScreen ? '20' : '0'}>
        <Box width={{ lg: 'sm' }} transform={{ base: 'translateY(-50%)', lg: 'none' }}
          bg={{ base: useColorModeValue('red.50', 'gray.700'), lg: 'transparent' }}
          mx={{ base: '6', md: '8', lg: '0' }}
          px={{ base: '6', md: '8', lg: '0' }}
          py={{ base: '6', md: '8', lg: '12' }}
        >
          <Stack spacing={{ base: '8', lg: '10' }}>
            <Stack spacing={{ base: '2', lg: '4' }}>
              <Heading size="lg" color={isDark ? 'red.500' : 'red.300'}>REFERAL COMMISION</Heading>
              <Heading size="lg" fontWeight="bold">1 Level Affiliate Program </Heading>
              <Text>
                In addition to your earnings on your deposit, you are able to share the investment opportunity within your community and earn more from their deposits. The more referral you given to Dacaminvestment, more commission you earn.
              </Text>
              <Text>
                We have only one level referral programs for you, through which you can earn upto 10% referral commission.
              </Text>
            </Stack>
            <HStack spacing="3">
              <Link to='/register'>
                <Button colorScheme={'red'} variant={'outline'} >Become A Member</Button>
              </Link>
              <Icon color={isDark ? 'red.500' : 'red.300'} as={FaArrowRight} />
            </HStack>
          </Stack>
        </Box>
        <Flex flex="1" overflow="hidden">
          <Image src="https://images.unsplash.com/photo-1589156229687-496a31ad1d1f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=772&q=80" alt="Lovely Image" fallback={<Skeleton />}
maxH="450px" minW="300px" objectFit="cover" flex="1" />
        </Flex>
      </Stack>
    </Box>
  )
}

export default Misguided