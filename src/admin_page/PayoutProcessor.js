import { useParams } from 'react-router-dom'
import React, { useEffect, useState } from 'react';
import axios from "axios";
import { BASE_URL } from '../api_routes';
import API_TOKEN from '../token';
import swal from 'sweetalert'
import BreadCrumb from '../components/BreadCrumb';
import PrimaryCard from '../components/PrimaryCard';
import Loader from '../components/Loader';
import { 
    Alert, 
    Box, 
    Button, 
    Divider, 
    Heading, 
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    Stack, 
    useToast, 
    Text,
    useDisclosure
} from '@chakra-ui/react';
import * as Yup from 'yup'
import AccountBalanceCard from '../components/AccountBalanceCard';
import { Field, Form, Formik } from 'formik';
import FormikControl from '../components/FormikControl';
import { formater } from '../_formater';

const validationSchema = Yup.object({
})


function PayoutProcessor() {
    const params = useParams()
    const [withdrawal, setWithdrawal] = useState(false)
    const toast = useToast()
    const [copySuccess, setCopySuccess] = useState('');
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [variable, setVariable] = useState({title: '', description: '', extra: '', submit: '', label: ''})
    const [uniqueid, setUniqueid] = useState('')

    const getSingleWithdrawal = () => {
        axios.get(BASE_URL+`get-single-withdrawal/${params.unique_id}`, {
            headers: {
                'Authorization': `Bearer ${API_TOKEN}` 
            }
        })
        .then(respond => {
            const withdraw = respond.data.payload
            setWithdrawal(withdraw)
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
        getSingleWithdrawal()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
   
    const initialValue = {
        uniqueIdToProcess: uniqueid,
        message: '',
    }

    const bringoutWalletUpdateModal = (unique_id) => {
        setVariable({title: 'Wallet Update Notifier?', extra:<FormikControl control='chakratextarea' type='text' label='Compose Mail/Message' name='message' />, description:<Alert status='success' variant='subtle'>Send {withdrawal.users ? withdrawal.users.name : 'None'} an email for their {withdrawal.user_wallet.system_wallet.wallet_name} WALLET address update, to enable payment! </Alert> , submit: sendUserWalletUpdateMail, label: 'Send Mail'})
        setUniqueid(unique_id)
        onOpen()
    }
    const sendUserWalletUpdateMail = async (values, {resetForm}) => {
        await axios.post(BASE_URL+'send-wallet-update-mail', values, {
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
             return
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

    const bringoutConfirmModal = (unique_id) => {
        setVariable({title: 'Has User been Paid?', description: `By confirming this payment request, it means you have sent ${formater.format(withdrawal.amount)} worth of ${withdrawal.user_wallet.system_wallet.wallet_name} to this user's ${withdrawal.user_wallet.system_wallet.wallet_name} WALLET .`, submit: confirmPayment, label: 'Confirm Payment'})
        setUniqueid(unique_id)
        onOpen()
    }
    const confirmPayment = async (values, {resetForm}) => {
        await axios.post(BASE_URL+'confirm-withdrawal', values, {
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
             getSingleWithdrawal()
             onClose()
             return
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

    const handleLinkCopy = async copyMe => {
        try {
            await navigator.clipboard.writeText(copyMe);
            setCopySuccess('Copied!');
            console.log(copySuccess);
            toast({
                title: 'Wallet Address Copied To Clipboard!',
                variant: 'top-accent',
                position: 'top-right',
                isClosable: true,
              })
        } catch (err) {
            setCopySuccess('Failed to copy!');
        }
    };
    const links = [
        {
            url: '/admin-dashboard',
            value: 'Dashboard',
        },
        {
            url: '/payouts',
            value: 'Payouts',
        }, 
        {
            url: '#',
            value: 'Payout Processor',
        },
    ]
    return !withdrawal ? (
        <Loader />
    ) : (
        <Stack>
            <BreadCrumb links={links} />
            <PrimaryCard>
                <AccountBalanceCard user={withdrawal ? withdrawal.users : null} />
                <Box textAlign={'center'} >
                    <Alert mt={'10'} status='success' variant='subtle' >Transfer / Send {formater.format(withdrawal.amount)} worth of {withdrawal.user_wallet.system_wallet.wallet_name} to the {withdrawal.user_wallet.system_wallet.wallet_name} Wallet Address below</Alert>
                </Box>
                <Divider py={'1'} mt={'5'}/>
                <Box textAlign={'center'}>
                    <Heading >{withdrawal.user_wallet.system_wallet.wallet_name} WALLET:</Heading>
                    <Heading mt={'5'} fontSize={'lg'}>{withdrawal.user_wallet.wallet_address} </Heading>
                    <Button mt={'3'} variant={'outline'} colorScheme={'teal'} onClick={() => handleLinkCopy(`${withdrawal.user_wallet.wallet_address}`)}>Copy Wallet Addrss</Button>
                </Box>
                <Box mt={'5'} textAlign={'center'}>
                    <Alert mb={'5'} status='error' variant='subtle' >Note! Before confirming this withdrawal, ensure you have made payment to the walllet addess provided above. </Alert>
                    <Button variant={'solid'} colorScheme={'red'} onClick={() => bringoutWalletUpdateModal(`${withdrawal.unique_id }`)}>Notify User To Update Their Wallet Address</Button>
                    <Button variant={'solid'} colorScheme={'blue'} onClick={() => bringoutConfirmModal(`${withdrawal.unique_id }`)}>Confirm Payment</Button>
                </Box>
            </PrimaryCard>
            <Modal isOpen={isOpen} onClose={onClose}> 
                <ModalOverlay />
                <ModalOverlay>
                    <ModalContent>
                        <ModalHeader fontSize='lg' fontWeight='bold'>{variable.title}</ModalHeader>
                        <ModalCloseButton/>
                        <ModalBody>
                        <Box>
                            <Text>{variable.description}</Text>
                            <Formik initialValues={initialValue} validationSchema={validationSchema} onSubmit={variable.submit}>
                            {
                                formik => {
                                    return <Form>
                                        <Field type='hidden' name='uniqueIdToProcess'  />
                                        {variable.extra}
                                        <FormikControl hidden={variable.title === 'Preview Payment Proof' ? true : false} control='chakrabutton' type='submit' label={variable.label} disabled={!formik.isValid || formik.isSubmitting}/>
                                    </Form>
                                }
                            }
                            </Formik>
                        </Box>
                        </ModalBody>
                    </ModalContent>
                </ModalOverlay>
            </Modal>
        </Stack>
    )
}

export default PayoutProcessor