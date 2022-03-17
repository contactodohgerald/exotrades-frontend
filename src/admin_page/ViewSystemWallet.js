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
    useDisclosure,
    Badge
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
import Pagination from 'react-js-pagination';
import 'bootstrap/dist/css/bootstrap.min.css'
import { Link } from 'react-router-dom';
import Moment from 'react-moment';
  
const validationSchema = Yup.object({
})

function ViewSystemWallet() {
    const [wallet, setSystemWallet] = useState(false)
    const [uniqueid, setUniqueid] = useState('')
    const { isOpen, onOpen, onClose } = useDisclosure()

    const initialValue = {
        uniqueIdToProcess: uniqueid,
    }

    const onSubmit = async (values, {resetForm}) => {
        await axios.post(BASE_URL+'delete-system-wallet', values, {
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
             getSystemWalletDetails()
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

    const getSystemWalletDetails = (pageNumber = 1) => {
        axios.get(BASE_URL+`get-all-system-wallet?page=${pageNumber}`, {
            headers: {
                'Authorization': `Bearer ${API_TOKEN}` 
            }
        })
        .then(respond => {
            const wallet = respond.data.payload
            setSystemWallet(wallet)
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
        getSystemWalletDetails()
    }, [])

    const PaginateBody = () => {
        const {current_page, per_page, total } = wallet
        return (
            <Pagination
                activePage={current_page}
                itemsCountPerPage={per_page}
                totalItemsCount={total}
                pageRangeDisplayed={5}
                onChange={(pageNumber) => getSystemWalletDetails(pageNumber)}
                prevPageText='Prev'
                nextPageText='Next'
                itemClass='page-item'
                linkClass='page-link'
            />
        )
    }

    const bringoutDeleteModal = (unique_id) => {
        setUniqueid(unique_id)
        onOpen()
    }

    const links = [
        {
            url: '/admin-dashboard',
            value: 'Dashboard',
        },
        {
            url: '#',
            value: 'System Wallet List',
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
                            <Th>Wallet Name</Th>
                            <Th>Wallet Address</Th>
                            <Th>Admin Status</Th>
                            <Th>Edit</Th>
                            <Th>Date</Th>
                            <Th>Delete</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                    {
                        wallet.data !== undefined ?
                        wallet.data.map((each_wallet, indexs) => (
                            <Tr key={indexs}>
                                <Td>{indexs + 1}</Td>
                                <Td>{each_wallet.wallet_name}</Td>
                                <Td>{each_wallet.wallet_address}</Td>
                                <Td>
                                    <Badge variant={'outline'} colorScheme={each_wallet.admin_only === 'yes' ? 'red' : 'orange'}>{each_wallet.admin_only === 'yes' ? 'Yes' : 'No'}</Badge>
                                </Td>
                                <Td>
                                    <Link to={'/edit-wallets/'+each_wallet.unique_id}>
                                        <Button colorScheme={'teal'} variant={'solid'}>EDIT</Button>
                                    </Link>
                                </Td>
                                <Td>
                                    <Moment format="DD/MM/YYYY">{each_wallet.created_at}</Moment>
                                </Td>
                                <Td>
                                    <Button colorScheme={'red'} onClick={() => bringoutDeleteModal(`${each_wallet.unique_id }`)} variant='outline'>DELETE</Button>
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
                <Center mt={'5'}>
                    { PaginateBody() }
                </Center>
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

export default ViewSystemWallet;
