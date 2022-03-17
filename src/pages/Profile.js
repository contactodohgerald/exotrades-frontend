import { 
    Box,
    Center,
    Divider,
    Heading, 
    Image, 
    Stack, 
    Text,
    useToast,
    useColorMode,
    Grid,
    GridItem,
    useMediaQuery
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import BreadCrumb from '../components/BreadCrumb';
import ChakraButton from '../components/ChakraButton';
import PrimaryCard from '../components/PrimaryCard';
import Loader from '../components/Loader';
import axios from "axios";
import { BASE_URL } from '../api_routes';
import API_TOKEN from '../token';


function Profile() {
    const [userData, setUserData] = useState(false)
    const [userWallet, setUserWallet] = useState(false)
    const [error, setError] = useState(false)

    const getUsersProfileDetails = () => {
        axios.get(BASE_URL+'get-user-profile', {
            headers: {
                'Authorization': `Bearer ${API_TOKEN}` 
            }
        })
        .then(respond => {
            const users = respond.data
            setUserData(users)
        })
        .catch(error => {
            const errorMsg = error.message
            setError(errorMsg)
        })
    }
    const getUsersWalletDetails = () => {
        axios.get(BASE_URL+'get-list-of-user-wallet', {
            headers: {
                'Authorization': `Bearer ${API_TOKEN}` 
            }
        })
        .then(respond => {
            const wallets = respond.data
            setUserWallet(wallets)
        })
        .catch(error => {
            const errorMsg = error.message
            setError(errorMsg)
        })
    }

    useEffect(() => {
        getUsersProfileDetails()
        getUsersWalletDetails()
    }, [])

    const links = [
        {
            url: '/dashboard',
            value: 'Dashboard',
        },
        {
            url: '/profile',
            value: 'Profile',
        },
    ]
    return !userData ? (
            <Loader />
        ) : error ? (
            <h2>{error}</h2>
        ): (
            <Stack>
                <BreadCrumb links={links} />
                <PrimaryCard>
                    <ProfileImageHold users={userData}  />
                </PrimaryCard>
                <PrimaryCard>
                    <ProfileDataHold users={userData} wallet={userWallet}  />
                </PrimaryCard>
            </Stack>          
        )
}

function ProfileImageHold(props) {
    const { users } = props
    const { payload, site_details } = users
    const {referral_id, avatar, name} = payload
    const toast = useToast()
    const { colorMode} = useColorMode()
    const isDark = colorMode === 'dark'
    const [copySuccess, setCopySuccess] = useState('');
    const handleLinkCopy = async copyMe => {
        try {
            await navigator.clipboard.writeText(copyMe);
            setCopySuccess('Copied!');
            console.log(copySuccess);
            toast({
                title: 'Link Copied To Clipboard!',
                variant: 'top-accent',
                position: 'top-right',
                isClosable: true,
              })
        } catch (err) {
            setCopySuccess('Failed to copy!');
        }
    };
    return (
        <>
        <Box p={10}>
            <Center>
                <Image src={avatar} fallbackSrc='https://via.placeholder.com/500' alt={name} width={'200px'} height={'200px'} rounded={'full'} border={'2px'} />
            </Center>
            <Heading mt={'1em'} size='lg' color={isDark ? 'white' : 'blue.600'}>{site_details.site_domain ? site_details.site_domain : 'none' }?ref={referral_id ? referral_id : 'none'}</Heading>
            <Box width={200}>
                <ChakraButton onClick={() => handleLinkCopy(site_details.site_domain+'?ref='+referral_id)} label='Copy Referral Link' />
            </Box>
        </Box>
        </>
    )
}

function ProfileDataHold(props) {
    const { users, wallet } = props
    const { payload } = users
    const {name, gender, phone, account_type, address, email } = payload
    const { colorMode} = useColorMode()
    const isDark = colorMode === 'dark'
    const [isNotSmallerScreen] = useMediaQuery('(min-width: 600px)')
    return (
        <>
        <Box p={2}>
            <Text textAlign={'center'} fontSize={'2xl'} fontWeight={'bold'} color={isDark ? 'white' : 'blue.600'}>Personal Information</Text>
            <Divider/>
            <Grid
            templateRows='repeat(4, 1fr)'
            templateColumns='repeat(5, 1fr)'
            gap={2}
            >
                <GridItem colSpan={2} p={'3'}>
                    <Text fontWeight={'bold'} fontSize={isNotSmallerScreen ? '2xl' : '1xl'}>FullName <span position={'left'}>:</span></Text>
                </GridItem>
                <GridItem colSpan={3} p={'3'}>
                    <Text fontSize={isNotSmallerScreen ? '2xl' : '1xl'}>{name ? name : 'none'}</Text>
                </GridItem>
                <GridItem colSpan={2} p={'3'}>
                    <Text fontWeight={'bold'} fontSize={isNotSmallerScreen ? '2xl' : '1xl'}>Email <span position={'left'}>:</span></Text>
                </GridItem>
                <GridItem colSpan={3} p={'3'}>
                    <Text fontSize={isNotSmallerScreen ? '2xl' : '1xl'}>{email ? email : 'none'}</Text>
                </GridItem>
                <GridItem colSpan={2} p={'3'}>
                    <Text fontWeight={'bold'} fontSize={isNotSmallerScreen ? '2xl' : '1xl'}>Account Type <span position={'left'}>:</span></Text>
                </GridItem>
                <GridItem colSpan={3} p={'3'}>
                    <Text fontSize={isNotSmallerScreen ? '2xl' : '1xl'}>{account_type ? account_type : 'none'}</Text>
                </GridItem>
                <GridItem colSpan={2} p={'3'}>
                    <Text fontWeight={'bold'} fontSize={isNotSmallerScreen ? '2xl' : '1xl'}>Phone Number <span position={'left'}>:</span></Text>
                </GridItem>
                <GridItem colSpan={3} p={'3'}>
                    <Text fontSize={isNotSmallerScreen ? '2xl' : '1xl'}>{phone ? phone : "none"}</Text>
                </GridItem>
                <GridItem colSpan={2} p={'3'}>
                    <Text fontWeight={'bold'} fontSize={isNotSmallerScreen ? '2xl' : '1xl'}>Gender <span position={'left'}>:</span></Text>
                </GridItem>
                <GridItem colSpan={3} p={'3'}>
                    <Text fontSize={isNotSmallerScreen ? '2xl' : '1xl'}>{gender ? gender : 'none'}</Text>
                </GridItem>
                <GridItem colSpan={2} p={'3'}>
                    <Text fontWeight={'bold'} fontSize={isNotSmallerScreen ? '2xl' : '1xl'}>Address <span position={'left'}>:</span></Text>
                </GridItem>
                <GridItem colSpan={3} p={'3'}>
                    <Text fontSize={isNotSmallerScreen ? '2xl' : '1xl'}>{address ? address : 'none'}</Text>
                </GridItem>

            </Grid>
        </Box>
        <Box p={2}>
            <Text textAlign={'center'} fontSize={'2xl'} fontWeight={'bold'} color={isDark ? 'white' : 'blue.600'}>Account Information</Text>
            <Divider/>
            <Grid
            templateRows='repeat(4, 1fr)'
            templateColumns='repeat(5, 1fr)'
            gap={2}
            >
                {
                    wallet.payload !== undefined ?
                    wallet.payload.map((loadpay, ke) => {
                        return (
                            <>
                            <GridItem colSpan={2} p={'3'} key={ke}>
                                <Text fontWeight={'bold'} fontSize={isNotSmallerScreen ? '2xl' : '1xl'}>
                                    <span position={'left'}>{loadpay.system_wallet.wallet_name} WALLET:</span>
                                </Text>
                            </GridItem>
                            <GridItem colSpan={3} p={'3'}>
                                <Text fontSize={isNotSmallerScreen ? '2xl' : '1xl'}>{loadpay.wallet_address}</Text>
                            </GridItem>
                            </>
                        )
                    }) :
                    null
                }
            </Grid>
        </Box>
        </>
    )
}

export default Profile
