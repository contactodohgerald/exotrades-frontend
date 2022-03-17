import { 
    Box,
    Divider,
    Flex, 
    Heading, 
    Icon, 
    Spacer, 
    Stack,
    Text,
    useColorMode,
    useMediaQuery,
    useToast,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { FaCashRegister, FaTiktok } from 'react-icons/fa';
import BreadCrumb from '../components/BreadCrumb';
import ChakraButton from '../components/ChakraButton';
import PrimaryCard from '../components/PrimaryCard';
import Loader from '../components/Loader';
import axios from "axios";
import { BASE_URL } from '../api_routes';
import API_TOKEN from '../token';
import swal from 'sweetalert'
import { formater } from '../_formater';
import RefferalListHold from '../components/RefferalListHold';

function MyReferrals() {
    const [userData, setUserData] = useState(false)
    const [refferalList, setUpRefferal] = useState(null)

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
            swal({
                title: "Error",
                text: errorMsg,
                icon: "error"
            })
            return
        })
    }

    const getListOfRefferrals = (pageNumber = 1) => {
        axios.get(BASE_URL+`get-refferals-list?page=${pageNumber}`, {
            headers: {
                'Authorization': `Bearer ${API_TOKEN}` 
            }
        })
        .then(respond => {
            const refferal = respond.data.payload
            setUpRefferal(refferal)
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
        getListOfRefferrals()
    }, [])

    const links = [
        {
            url: '/dashboard',
            value: 'Dashboard',
        },
        {
            url: '/my-referrals',
            value: 'My Referrals',
        },
    ]
    return !userData ? (
        <Loader />
    ) : (
        <Stack>
            <BreadCrumb links={links} />
            <PrimaryCard>
                <TotalReferralCount users={userData} refferals={refferalList}  />
                <Divider />
                <ReferralLinkCopy users={userData}  />
                <Divider />
                <RefferalListHold refferals={refferalList} getListOfRefferrals={getListOfRefferrals}  />
            </PrimaryCard>
        </Stack>
    );
}

function TotalReferralCount({ users, refferals }) {
    const [isNotSmallerScreen] = useMediaQuery('(min-width: 600px)') 
    const { payload } = users
    return (
        <Flex flexDirection={isNotSmallerScreen ? 'row' : 'column'}>
            <Box 
            boxShadow={isNotSmallerScreen ? 'lg' : 'md'}
            textAlign={'center'}
            width={'full'}
            height={'150px'}
            p={'5'}
            m={isNotSmallerScreen ? '5' : null}
            >
                <Icon as={FaTiktok} w={10} h={10} />
                <Text>Total Referrals</Text>
                <Heading>{refferals !== null ? refferals.total : 0}</Heading>
            </Box>
            <Spacer/>
            <Box 
            boxShadow={isNotSmallerScreen ? 'lg' : 'md'}
            textAlign={'center'}
            width={'full'}
            height={'150px'}
            p={'5'}
            m={isNotSmallerScreen ? '5' : null}
            >
                <Icon as={FaCashRegister} w={10} h={10} />
                <Text>Bonus</Text>
                <Heading>{formater.format(payload.ref_bonus_balance)}</Heading>
            </Box>                    
        </Flex>
    )
}

function ReferralLinkCopy({ users }) {
    const { payload, site_details } = users
    const {referral_id} = payload
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
        <Box p={5}>
            <Heading mt={'1em'} size='lg' color={isDark ? 'white' : 'blue.600'}>{site_details.site_domain ? site_details.site_domain : 'none' }?ref={referral_id ? referral_id : 'none'}</Heading>
            <Box width={200}>
                <ChakraButton onClick={() => handleLinkCopy(site_details.site_domain+'?ref='+referral_id)} label='Copy Referral Link' />
            </Box>
        </Box>
    )
}

export default MyReferrals;
