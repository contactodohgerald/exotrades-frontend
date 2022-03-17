import { Box, Stack, StackDivider, Text, useColorMode } from '@chakra-ui/react'
import * as React from 'react'

import Logo from './Logo'
import { SocialMediaLinks } from './SocialMediaLinks'

function Footer({ siteSetting }) {
    const { colorMode } = useColorMode()
    const isDark = colorMode === 'dark'
    return (
        <Box 
            ml={{ base: 0, md: 60 }}
            px={{ base: 4, md: 4 }}
            position='relative' 
            bottom='0' 
            w={{ base: 'full', md: '84%' }} 
            py="12"
            bg={isDark ? 'gray.900' : 'gray.300'}
            >
            <Stack divider={<StackDivider />}  textAlign={'center'}>
                <Stack direction={'column'} alignItems="center">
                    <Logo borderRadius="lg" width="50px" height="50px">
                        <Text textAlign={'center'}>
                            Copyright &copy; 2017 - {new Date().getFullYear()} . All Rights Reserved By {siteSetting ? siteSetting.site_name : ''}
                        </Text>
                    </Logo>
                    <SocialMediaLinks />
                </Stack>
            </Stack>
        </Box>
    )
}

export default Footer;