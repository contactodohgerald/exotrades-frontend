import {
  IconButton,
  Avatar,
  Box,
  CloseButton,
  Flex,
  HStack,
  VStack,
  Drawer,
  DrawerContent,
  Text,
  useDisclosure,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  useColorMode,
} from '@chakra-ui/react';
import React, { useEffect, useRef, useState } from 'react';
import {
  FiMenu,
  FiBell,
  FiChevronDown,
} from 'react-icons/fi';
import { Link } from 'react-router-dom';
import CoinMarquee from './CoinMarquee';
import Footer from './Footer';
import Logo from './Logo';
import LogoutModal from './LogoutModal';
import SidebarHold from './SidebarHold';
import axios from "axios";
import { BASE_URL } from '../api_routes';
import API_TOKEN from '../token';
import swal from 'sweetalert'



function DesignTemplate({children}) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [userData, setUserData] = useState(false)
    const [siteSetting, setSiteSetting] = useState(null)
    const { colorMode} = useColorMode()
    const getUsersProfileDetails = () => {
      axios.get(BASE_URL+'get-user-profile', {
          headers: {
              'Authorization': `Bearer ${API_TOKEN}` 
          }
      })
      .then(respond => {
          const users = respond.data
          setUserData(users)
          setSiteSetting(users.site_details)
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
      getUsersProfileDetails()
    }, [])
    const isDark = colorMode === 'dark'
    return (
      <Box minH="100vh" bg={isDark ? 'gray.800' : 'gray.100'}>
        <SidebarContent onClose={() => onClose} display={{ base: 'none', md: 'block' }}  users={userData} />
        <Drawer autoFocus={false} isOpen={isOpen} placement="left" onClose={onClose} returnFocusOnClose={false} onOverlayClick={onClose}size="xs">
          <DrawerContent>
            <SidebarContent users={userData} onClose={onClose}/>
          </DrawerContent>
        </Drawer>
        <MobileNav users={userData} openIs={onOpen} />
        <CoinMarquee />
        <Box ml={{ base: 0, md: 60 }} p="3em 2em">
          {children}
        </Box>
        <Footer siteSetting={siteSetting}/>
      </Box>
    );
}
  
const SidebarContent = ({ users, onClose, ...rest }) => {
    const { colorMode} = useColorMode()
    const isDark = colorMode === 'dark'
    return (
      <Box transition="3s ease" bg={isDark ? 'gray.900' : 'white'} borderRight="1px" borderRightColor={isDark ? 'gray.700' : 'gray.200'} w={{ base: 'full', md: 60 }} pos="fixed" h="1200px" {...rest}>
        <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
            <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
                <Logo borderRadius="lg" width="50px" height="50px" />
            </Text>
          <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
        </Flex>
        <SidebarHold users={users ? users.payload : null}/>
      </Box>
    );
};

const MobileNav = ({ openIs, users, ...rest }) => {
    const { payload } = users
    const { isOpen, onOpen, onClose } = useDisclosure()
    const btnRef = useRef()

    const { colorMode} = useColorMode()
    const isDark = colorMode === 'dark'
    return (
      <Flex ml={{ base: 0, md: 60 }} px={{ base: 4, md: 4 }} height="20" alignItems="center" bg={isDark ? 'gray.900' : 'white'} borderBottomWidth="1px" borderBottomColor={isDark ? 'gray.600' : 'gray.300'} justifyContent={{ base: 'space-between', md: 'flex-end' }}{...rest}>
        <IconButton ref={btnRef} onClick={openIs} display={{ base: 'flex', md: 'none' }} variant="outline" aria-label="open menu" icon={<FiMenu />}/>
        <Text display={{ base: 'flex', md: 'none' }} fontSize="2xl" fontFamily="monospace" fontWeight="bold">
          <Logo borderRadius="lg" width="50px" height="50px" />
        </Text>
        <HStack spacing={{ base: '0', md: '6' }}>
          <IconButton size="lg" variant="ghost" aria-label="open menu" icon={<FiBell />}/>
          <Flex alignItems={'center'}>
            <Menu>
              <MenuButton py={2} transition="all 0.3s" _focus={{ boxShadow: 'none' }}>
                <HStack>
                  <Avatar size={'sm'} src={payload ? payload.avatar : ''}/>
                  <VStack  display={{ base: 'none', md: 'flex' }} alignItems="flex-start" spacing="1px" ml="2">
                    <Text fontSize="sm">{payload ? payload.name : ''}</Text>
                    <Text fontSize="xs" color="gray.600">{payload ? payload.account_type : ''}</Text>
                  </VStack>
                  <Box display={{ base: 'none', md: 'flex' }}>
                    <FiChevronDown />
                  </Box>
                </HStack>
              </MenuButton>
              <MenuList zIndex={'200'} >
                <MenuItem>
                    <Link to='/profile'>Profile</Link>
                </MenuItem>
                <MenuItem>
                    <Link to='/edit-profile'>Settings</Link>
                </MenuItem>
                <MenuDivider />
                <MenuItem onClick={onOpen} >Sign out</MenuItem>
                <LogoutModal isOpen={isOpen} onClose={onClose}/>
              </MenuList>
            </Menu>
          </Flex>
        </HStack>
      </Flex>
    );
};

export default DesignTemplate;
