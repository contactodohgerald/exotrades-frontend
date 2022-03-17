import React from 'react'
import {
  Box,
    ButtonGroup,
    Container,
    IconButton,
    Stack,
    Text,
  } from '@chakra-ui/react'
  import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa'
  import Logo from '../components/Logo'
  

function Footer({isDark, siteSetting}) {
  return (
    <Box bg={isDark ? 'gray.900' : 'gray.300'}>
       <Container maxW='container.xl' as="footer" role="contentinfo" py={{ base: '12', md: '16' }}>
        <Stack spacing={{ base: '4', md: '5' }}>
          <Stack justify="space-between" direction="row" align="center">
            <Logo width='60px' />
            <ButtonGroup variant="ghost">
              <IconButton as="a" href="#" aria-label="LinkedIn" icon={<FaLinkedin fontSize="1.25rem" />}/>
              <IconButton as="a" href="#" aria-label="GitHub" icon={<FaGithub fontSize="1.25rem" />} />
              <IconButton  as="a" href="#" aria-label="Twitter" icon={<FaTwitter fontSize="1.25rem" />}/>
            </ButtonGroup>
          </Stack>
          <Text fontSize="sm" color="subtle">
            Copyright &copy; 2017 - {new Date().getFullYear()} . All Rights Reserved By {siteSetting ? siteSetting.site_name : ''}
          </Text>
        </Stack>
      </Container>
    </Box>
  )
}

export default Footer