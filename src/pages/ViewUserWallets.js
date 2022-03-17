import {  
    Box,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    Text,
    Table, 
    TableCaption, 
    Tbody, 
    Td,
    Th, 
    Thead, 
    Tr,
    useColorMode,
    Stack, 
    Center,
    Button,
    useDisclosure
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import * as Yup from 'yup'
import axios from "axios";
import { BASE_URL } from '../api_routes';
import API_TOKEN from '../token';
import BreadCrumb from '../components/BreadCrumb';
import PrimaryCard from '../components/PrimaryCard';
import Loader from '../components/Loader';
import { Field, Form, Formik } from 'formik';
import FormikControl from '../components/FormikControl';
import swal from 'sweetalert'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Link } from 'react-router-dom';
  
const validationSchema = Yup.object({
})

function ViewUserWallets() {
    const [wallet, setUserWallet] = useState(false)
    const [uniqueid, setUniqueid] = useState('')
    const { isOpen, onOpen, onClose } = useDisclosure()

    const initialValue = {
        uniqueIdToProcess: uniqueid,
    }

    const onSubmit = async (values, {resetForm}) => {
        await axios.post(BASE_URL+'delete-user-wallet', values, {
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
             getUserWalletDetails()
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
            return
        })
    }
    useEffect(() => {
        getUserWalletDetails()
    }, [])

    const bringoutDeleteModal = (unique_id) => {
        setUniqueid(unique_id)
        onOpen()
    }
  
    const links = [
        {
            url: '/dashboard',
            value: 'Dashboard',
        },
        {
            url: '#',
            value: 'Wallet List',
        },
    ]
    const { colorMode} = useColorMode()
    const isDark = colorMode === 'dark'
    return !wallet ? (
            <Loader /> 
        ) : (
        <Stack>
            <BreadCrumb links={links} />
            <PrimaryCard>
                <Box overflow={'scroll'}>
                <Table variant='striped' colorScheme={isDark ? 'gray' : 'facebook'} boxShadow={'lg'}>
                    <TableCaption placement='top'>Wallet List</TableCaption>
                    <Thead>
                        <Tr>
                            <Th>S/N</Th>
                            <Th>Wallet Type</Th>
                            <Th>Wallet Address</Th>
                            <Th>Delete</Th>
                            <Th>Action</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                    {
                        wallet.payload !== undefined ?
                        wallet.payload.map((each_wallet, indexs) => (
                            <Tr key={indexs}>
                                <Td>{indexs + 1}</Td>
                                <Td>{each_wallet.system_wallet.wallet_name}</Td>
                                <Td>{each_wallet.wallet_address}</Td>
                                <Td>
                                    <Button colorScheme={'teal'} onClick={() => bringoutDeleteModal(`${each_wallet.unique_id }`)} variant='outline'>DELETE</Button>
                                </Td>
                                <Td>
                                    <Link to={'/edit-user-wallets/'+each_wallet.unique_id}>
                                        <Button colorScheme={'teal'} variant={'solid'}>EDIT</Button>
                                    </Link>
                                </Td>
                            </Tr>
                        )) :
                        <Box as={'tr'}>
                            <Center><Text p={'5'}>No Data Available at this Moment</Text></Center>
                        </Box>
                    }
                    </Tbody>
                </Table>
                </Box>
            </PrimaryCard>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalOverlay>
                    <ModalContent>
                        <ModalHeader fontSize='lg' fontWeight='bold'>Delete Wallet</ModalHeader>
                        <ModalCloseButton/>
                        <ModalBody>
                        <Box>
                            <Text>Do you really want to delete this wallet ?</Text>
                            <Formik initialValues={initialValue} validationSchema={validationSchema} onSubmit={onSubmit}>
                            {
                                formik => {
                                    return <Form>
                                        <Field type='hidden' name='uniqueIdToProcess'  />
                                        <FormikControl control='chakrabutton' type='submit' label='Delete Wallet' disabled={!formik.isValid || formik.isSubmitting}/>
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
    );
}

export default ViewUserWallets;
