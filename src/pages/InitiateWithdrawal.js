import {
    Alert,
    Box,
    Center,
    Stack,
    Text,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    Divider,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import * as Yup from 'yup'
import BreadCrumb from '../components/BreadCrumb';
import ChakraButton from '../components/ChakraButton';
import PrimaryCard from '../components/PrimaryCard';
import { Form, Formik } from 'formik';
import FormikControl from '../components/FormikControl';
import { Link } from 'react-router-dom';
import axios from "axios";
import { BASE_URL } from '../api_routes';
import API_TOKEN from '../token';
import swal from 'sweetalert'
import UserWalletListCard from '../components/UserWalletListCard';
import Loader from '../components/Loader';
import AccountBalanceCard from '../components/AccountBalanceCard';

const initialValue = {
    amount: '',
    user_wallet_unique_id: '',
}
  
const validationSchema = Yup.object({
    amount: Yup.string().required('Required'),
    user_wallet_unique_id: Yup.string().required('Required'),
})

function InitiateWithdrawal() {
    const [wallet, setUserWallet] = useState(false)
    const [userData, setUserData] = useState(false)
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
    useEffect(() => {
        getUsersProfileDetails()
        getUserWalletDetails()
    }, [])

    const onSubmit = (values, {resetForm}) => {
        axios.post(BASE_URL+'create-withdrawal-request', values, {
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
            const success = res.success.message
            swal({
                title: "Success",
                text: success,
                icon: "success"
            })
            onClose()
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
            url: '/initate-withdrawal',
            value: 'Intiate Withdrawal',
        },
    ]
    return !userData ? (
            <Loader />
        ) : (
        <Stack>
            <BreadCrumb links={links} />
            <PrimaryCard>
                <AccountBalanceCard user={userData ? userData.payload : null} />
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
            </PrimaryCard>
        </Stack>
    );
}

export default InitiateWithdrawal;
