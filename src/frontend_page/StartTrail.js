import React, { useEffect, useState } from 'react'
import { Box, Button, Center, Container, Heading, Stack, Text, useDisclosure } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import LogoutModal from '../components/LogoutModal'
import Logo from '../components/Logo'

function StartTrail({user, isDark, isNotSmallerScreen}) {
    const [userType, setUserType] = useState(null)

    useEffect(() => {
        const USER_TYPE = JSON.parse(localStorage.getItem("account_type"))
        USER_TYPE ? setUserType(USER_TYPE) : setUserType(null);
    }, [])
  
    const { isOpen, onOpen, onClose } = useDisclosure()
    return (
        <Box as="section" bg={isDark ? 'gray.800' : 'gray.50'}>
            <Center>
                <Logo mt='4' width="90px" height="90px" />
            </Center>
            <Container maxW='container.xl' py={{ base: '16', md: '24' }}>
                <Stack spacing={{ base: '8', md: '10' }}>
                    <Stack spacing={{ base: '4', md: '5' }} align="center">
                        <Heading size={isNotSmallerScreen ? 'xl' : 'lg'}>Let The Experts Do The Trading While You Earn Big</Heading>
                        <Text color="muted" maxW="2xl" textAlign="center" fontSize="xl">
                            Invest Now And Get Unimaginable Returns, Use Modern Progressive Technologies of Bitcoin To Earn Money.
                        </Text>
                    </Stack>
                    <Stack spacing="3" direction={'row'} justify="center">
                        {!user && (
                        <>
                                <Link to='/register'>
                                    <Button variant="solid" colorScheme={'teal'} size="lg">Get Started</Button>
                                </Link>
                                <Link to='/login'>
                                    <Button variant="outline" colorScheme={'orange'} size="lg">Login</Button>
                                </Link>
                        </>
                        )}
                        {user && (
                            <>
                                <Link to='#'>
                                    <Button variant="solid" onClick={onOpen}  colorScheme={'teal'} size="lg">Logout</Button>
                                </Link>
                                <LogoutModal isOpen={isOpen} onClose={onClose}/>
                                <Link to={userType !== 'user' ? '/admin-dashboard' : '/dashboard'}>
                                    <Button variant="outline" colorScheme={'orange'} size="lg">Dashboard</Button>
                                </Link>
                            </>
                        )}
                    </Stack>
                </Stack>
            </Container>
        </Box>
    )
}

export default StartTrail