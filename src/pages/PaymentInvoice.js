import { 
    Alert,
    Container, 
    Divider, 
    Heading, 
    Input, 
    Stack, 
    Text,
    useToast
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import BreadCrumb from '../components/BreadCrumb';
import ChakraButton from '../components/ChakraButton';
import PrimaryCard from '../components/PrimaryCard';
import UploadPaymentProof from '../components/UploadPaymentProof';
import axios from "axios";
import { BASE_URL } from '../api_routes';
import API_TOKEN from '../token';
import Loader from '../components/Loader';
import { formater } from '../_formater';

function PaymentInvoice() {
    const params = useParams()
    const [transaction, setTransaction] = useState(null)

    const getTransaction = () => {
        axios.get(BASE_URL+`get-single-transactions/${params.unique_id}`, {
            headers: {
                'Authorization': `Bearer ${API_TOKEN}` 
            }
        })
        .then(respond => {
            const transaction = respond.data.payload.data
            setTransaction(transaction)
        })
        .catch(error => {
            const errorMsg = error.message
            console.log('errorMsg', errorMsg)
        })
    }
    
    const links = [
        {
            url: '/dashboard',
            value: 'Dashboard',
        },
        {
            url: '/invest',
            value: 'Invest',
        },
        {
            url: '/payment-invoice',
            value: 'Payment Invoice',
        },
    ]
    useEffect(() => {
        getTransaction()
    })
  
    const toast = useToast()
    const [copySuccess, setCopySuccess] = useState('');
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
    return !transaction ? (
            <Loader />
        ) : (
        <Stack>
            <BreadCrumb links={links} />
            <PrimaryCard>
                <Container textAlign={'center'}  maxW='container.md'>
                    <Text mb={'4'} fontWeight={'semibold'} fontSize={'2xl'} >Deposit Invoice - {transaction.unique_id}</Text>
                    <Divider />
                    <Heading>Amount : {formater.format(transaction.amount)}</Heading>
                    <Divider />
                    <Text m={'1em 0'}  fontWeight={'bold'} fontSize={'1xl'}>==== PAY TO OUR WALLETS ====</Text>
                    <Text mb={'4'} fontWeight={'semibold'} fontSize={'2xl'}>{transaction.system_wallet.wallet_name} Wallet To Pay To:</Text>
                    <Input type={'text'} value={transaction.system_wallet.wallet_address} readOnly />
                    <ChakraButton onClick={() => handleLinkCopy(`${transaction.system_wallet.wallet_address}`)} label='Copy Wallet Addrss' />
                    <Alert status='error' variant='subtle'>
                        <Text fontSize={'2xl'} textAlign={'center'}>Do not make payment to anyone or any {transaction.system_wallet.wallet_name} wallet address that isn't the one provided above on your dashboard.</Text>
                    </Alert>
                    <Text m={'1em 0'}  fontWeight={'bold'} fontSize={'1xl'}>==== How to pay with {transaction.system_wallet.wallet_name} ====</Text>
                    <Text textAlign={'left'}>Get a Wallet: First you'll need a {transaction.system_wallet.wallet_name} wallet - an app that lets you receive, hold, and spend {transaction.system_wallet.wallet_name}.</Text>
                    <Text textAlign={'left'}>Make a payment: Making a blockchain payment is fast, convenient, and extremely secure. </Text>
                    <Text mb={'5'} fontWeight={'semibold'} textAlign={'center'}>Our payment system is automated it takes only 2 confirmation for your deposit to appear on your dashboard In cases if network problem or other related issues, Our team of experts will review and credit you accordingly</Text> 
                    <Divider />
                    <Text m={'1em 0'}  fontWeight={'bold'} fontSize={'1xl'}>==== Upload Payment Proof ====</Text>
                    <UploadPaymentProof trans_id={transaction.unique_id} />
                    <Divider />
                    Status:
                    <Text  fontWeight={'bold'} fontSize={'3xl'}>{transaction.received_status}</Text>
                    <Divider />
                </Container>
            </PrimaryCard>
        </Stack>
    );
}

export default PaymentInvoice;
