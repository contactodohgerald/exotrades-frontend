import { 
    Alert,
    Box, 
    Container, 
    Divider, 
    Heading,
    SimpleGrid, 
    Stack, 
    Text,
    useMediaQuery,
    useToast
} from '@chakra-ui/react';
import * as Yup from 'yup'
import { Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import axios from "axios";
import { BASE_URL } from '../api_routes';
import API_TOKEN from '../token';
import BreadCrumb from '../components/BreadCrumb';
import FormikControl from '../components/FormikControl';
import PrimaryCard from '../components/PrimaryCard';
import PlanCards from '../components/PlanCards';
import Loader from '../components/Loader';
import swal from 'sweetalert'
import { useNavigate } from 'react-router-dom';

const initialValue = {
    system_wallet_id: '',
    amount: '',
    plan_unique_id: '',
}
  
const validationSchema = Yup.object({
    system_wallet_id: Yup.string().required('Please Select A Value'),
    amount: Yup.string().required('Required'),
    plan_unique_id: Yup.string().required('Required'),
})

function Invest() {
    const navigate = useNavigate()
    const [systemWallet, setsystemWallet] = useState([])
    const [plans, setPlans] = useState([])

    const onSubmit = (values, {resetForm}) => {
        axios.post(BASE_URL+'create-investment', values, {
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
            bringOutToast(success)
            const data = res.payload.data
            navigate('/payment-invoice/'+data.unique_id, {replace: true})
        })
        .catch(error => {
            const errorMsg = error.message
            bringOutToast(errorMsg, 'error')
            return
        })
    }

    const getListOfPlans = () => {
        axios.get(BASE_URL+'get-list-of-plans', {
            headers: {
                'Authorization': `Bearer ${API_TOKEN}` 
            }
        })
        .then(respond => {
            const plans = respond.data.payload
            setPlans(plans)
        })
        .catch(error => {
            const errorMsg = error.message
            console.log('errorMsg', errorMsg)
        })
    }

    const getListOfSystemWallets = () => {
        axios.get(BASE_URL+'get-list-of-system-wallet', {
            headers: {
                'Authorization': `Bearer ${API_TOKEN}` 
            }
        })
        .then(respond => {
            const wallets = respond.data.payload.data
            setsystemWallet(wallets)
        })
        .catch(error => {
            const errorMsg = error.message
            console.log('errorMsg', errorMsg)
        })
    }
    useEffect(() => {
        getListOfPlans()
        getListOfSystemWallets()
    }, [])

    const toast = useToast()
    const bringOutToast = (msg, status='success') => {
        toast({
            title: msg,
            variant: 'top-accent',
            position: 'top-right',
            status: status,
            isClosable: true,
        })
    }
    const system_wallets =
    systemWallet !== undefined ?
    systemWallet.map(item => (
            {value: item.unique_id, label: item.wallet_name}
        )) : []
    
    const [isNotSmallerScreen] = useMediaQuery('(min-width: 600px)')
    const links = [
        {
            url: '/dashboard',
            value: 'Dashboard',
        },
        {
            url: '/invest',
            value: 'Invest',
        },
    ]
    return plans.length === 0  ? (
                <Loader /> 
            ) : (
        <Stack>
            <BreadCrumb links={links} />
            <PrimaryCard>
                <Container  maxW='container.md'>
                    <Heading textAlign={'center'} as='h4' size='md' mb={'3'}>Select Your Preffered Payment Channel</Heading>
                    <Divider />
                    <Box>
                        <Formik initialValues={initialValue} validationSchema={validationSchema} onSubmit={onSubmit}>
                            {
                                formik => {
                                return <Form>
                                    <FormikControl control='reactselect' label='Select Payment Type' name='system_wallet_id' options={system_wallets} />
                                    <Alert status='success' variant='subtle'>
                                        <Text textAlign={'center'}>Select you Preffered mode of payment, please ensure to update your payment detaills in the edit profile page</Text>
                                    </Alert>
                                    <Heading textAlign={'center'} as='h4' size='md' mt={'5'} mb={'3'}>Select Your Preffered Plan</Heading>
                                    <Divider />
                                    <SimpleGrid columns={isNotSmallerScreen ? 2 : 1} spacing={isNotSmallerScreen ? 5 : null}>
                                        {
                                            plans.length ?
                                            plans.map(plan => (
                                                <PlanCards key={plan.id} plan={plan} />
                                            )) : null
                                        }
                                    </SimpleGrid>
                                    <FormikControl control='chakrainput' type='text' label='Amount' name='amount' />
                                    <FormikControl control='chakrabutton' type='submit' label='Create Payment Slip' disabled={!formik.isValid || formik.isSubmitting}/>
                                </Form>
                                }
                            }
                        </Formik>
                    </Box>
                </Container>
            </PrimaryCard>
        </Stack>
    );
}

export default Invest;
