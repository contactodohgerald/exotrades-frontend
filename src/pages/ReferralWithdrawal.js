import {
    Box, 
    Center, 
    Heading, 
    Icon, 
    Stack,
    Text,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    useColorMode,
    Alert,
    Divider
} from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import React, { useState, useEffect } from 'react';
import axios from "axios";
import { BASE_URL } from '../api_routes';
import API_TOKEN from '../token';
import swal from 'sweetalert'
import * as Yup from 'yup'
import { FaCashRegister } from 'react-icons/fa';
import BreadCrumb from '../components/BreadCrumb';
import ChakraButton from '../components/ChakraButton';
import FormikControl from '../components/FormikControl';
import PrimaryCard from '../components/PrimaryCard';
import { Link } from 'react-router-dom';
import UserWalletListCard from '../components/UserWalletListCard';
import Loader from '../components/Loader';
import { formater } from '../_formater';
import RefWithdrawalListHold from '../components/RefWithdrawalListHold';

const initialValue = {
    amount: '',
}
  
const validationSchema = Yup.object({
    amount: Yup.string().required('Required'),
})

function ReferralWithdrawal() {
    const [wallet, setUserWallet] = useState(false)
    const [userData, setUserData] = useState(false)
    const [refferalWithdrawalList, setUpRefferalWithdrawal] = useState(null)
    const { isOpen, onOpen, onClose } = useDisclosure()

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
        })
    }
    const getUserWalletDetails = () => {
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
            swal({
                title: "Error",
                text: errorMsg,
                icon: "error"
            })
        })
    }
    const getListOfRefferralWithdrawal = (pageNumber = 1) => {
        axios.get(BASE_URL+`get-user-ref-withdraws?page=${pageNumber}`, {
            headers: {
                'Authorization': `Bearer ${API_TOKEN}` 
            }
        })
        .then(respond => {console.log('respond', respond)
            const withdraw = respond.data.payload
            setUpRefferalWithdrawal(withdraw)
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
        getUserWalletDetails()
        getListOfRefferralWithdrawal()
    }, [])

    const onSubmit = (values, {resetForm}) => {
        axios.post(BASE_URL+'ref-bonus-withdraw', values, {
            headers: {
                'Authorization': `Bearer ${API_TOKEN}` 
            }
        })
        .then(respond => {
            const res = respond.data
            if(res.status === false){
                const error = res.error.message
                swal({
                    title: "Error",
                    text: error,
                    icon: "error"
                })
                resetForm()
                return;
            }
            onClose()
            const success = res.success.message
            swal({
                title: "Success",
                text: success,
                icon: "success"
            })
            getUsersProfileDetails()
            getListOfRefferralWithdrawal(refferalWithdrawalList.current_page)
        })
        .catch(error => {
            const errorMsg = error.message
            swal({
                title: "Error",
                text: errorMsg,
                icon: "error"
            })
            onClose()
            return
        })
    }

    const links = [
        {
            url: '/dashboard',
            value: 'Dashboard',
        },
        {
            url: '/comission-withdraw',
            value: 'My Referrals',
        },
    ]
  
    const { colorMode} = useColorMode()
    const isDark = colorMode === 'dark'
    return !userData ? (
            <Loader />
        ) : (
        <Stack>
            <BreadCrumb links={links} />
            <PrimaryCard>
                <Center>
                    <Box 
                    width={'3xl'} 
                    height={'200px'} 
                    bg={isDark ? 'orange.400' : 'gray.200'} 
                    pt={10}
                    textAlign={'center'} >
                        <Icon as={FaCashRegister} w={10} h={10} color='white'/>
                        <Text>Referral Comission Balance</Text>
                        <Heading>{formater.format(userData.payload.ref_bonus_balance)}</Heading>
                    </Box>
                </Center>
                <Center>
                    <Box mt={'5'}>
                        <ChakraButton label='Withdraw Funds' onClick={onOpen} />
                        <Modal isOpen={isOpen} onClose={onClose}>
                            <ModalOverlay />
                            <ModalOverlay>
                                <ModalContent>
                                    <ModalHeader fontSize='lg' fontWeight='bold'>Withdraw Funds</ModalHeader>
                                    <ModalCloseButton/>
                                    <ModalBody>
                                    <Box>
                                        <Alert status='success' variant='subtle' mt={'5'}>
                                            <Text>Please naviagte to the <Link to={'/edit-profile'}>settings page</Link>  to set up your wallet address correctly to avoid loss of funds</Text>
                                        </Alert>
                                        <Formik initialValues={initialValue} validationSchema={validationSchema} onSubmit={onSubmit}>
                                        {
                                            formik => {
                                                return <Form>
                                                    <FormikControl control='chakrainput' type='number' label='Amount' name='amount' />
                                                    <Divider mt={'2'}  />
                                                    <Text textAlign={'center'}>Please Select Wallet Type</Text>
                                                    <Divider mb={'2'}  />
                                                    {
                                                        wallet.payload ?
                                                        wallet.payload.map(user_wallet => (
                                                            <UserWalletListCard key={user_wallet.id} userWallet={user_wallet} />
                                                        )) : null
                                                    }
                                                    <FormikControl control='chakrabutton' type='submit' label='Place Withdraw Invoice' disabled={!formik.isValid || formik.isSubmitting}/>
                                                </Form>
                                            }
                                        }
                                        </Formik>
                                    </Box>
                                    </ModalBody>
                                </ModalContent>
                            </ModalOverlay>
                        </Modal>
                    </Box>
                </Center>
                <RefWithdrawalListHold refferals={refferalWithdrawalList} getListOfRefferrals={getListOfRefferralWithdrawal}  />
            </PrimaryCard>
        </Stack>
    );
}

export default ReferralWithdrawal;
