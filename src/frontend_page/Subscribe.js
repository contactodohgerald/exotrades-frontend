import React from 'react'
import {
    Box,
    Stack,
    Text,
} from '@chakra-ui/react'
import SubscribeForm from './SubscribeForm'


function Subscribe({ isDark, siteSetting }) {
  return (
    <Box p={'5'}>
        <Stack maxW="md" mx="auto" py={{ base: '12', md: '16' }} spacing={{ base: '6', md: '10' }}   p={'5'}>
            <Stack spacing="3" textAlign="center">
              <Text color={isDark ? 'blue.200' : 'blue.500'} fontWeight="bold" fontSize={'2xl'} textTransform="uppercase" transform="scale(1.2)" >Subscribe to {siteSetting ? siteSetting.site_name : ''} </Text>
              <Text fontSize="lg">
                <Box as="span" whiteSpace="nowrap" fontWeight="bold">To Get Exclusive Benefits</Box>
              </Text>
            </Stack>
            <SubscribeForm isDark={isDark} />
          </Stack>
  </Box>
  )
}

export default Subscribe