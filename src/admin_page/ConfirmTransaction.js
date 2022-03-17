import { 
    Badge, 
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
    Image
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import axios from "axios";
import { BASE_URL } from '../api_routes';
import API_TOKEN from '../token';
import BreadCrumb from '../components/BreadCrumb';
import PrimaryCard from '../components/PrimaryCard';
import Loader from '../components/Loader';
import { CONFIRM_TRANS_COLUMN } from '../table_columns/confirm_trans';
import { Link } from 'react-router-dom';
import Pagination from 'react-js-pagination';
import { formater } from '../_formater';
import swal from 'sweetalert'
import Moment from 'react-moment';
import { Field, Form, Formik } from 'formik';
import FormikControl from '../components/FormikControl';
import * as Yup from 'yup'
import 'bootstrap/dist/css/bootstrap.min.css'

const validationSchema = Yup.object({
})

function ConfirmTransaction() {
    const [transactions, setTransaction] = useState(null)
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [variable, setVariable] = useState({title: '', description: '', extra: '', submit: ''})
    const [uniqueid, setUniqueid] = useState('')

    const getListOfTransactions = (pageNumber = 1) => {
        axios.get(BASE_URL+`get-list-of-transactions?page=${pageNumber}`, {
            headers: {
                'Authorization': `Bearer ${API_TOKEN}` 
            }
        })
        .then(respond => {
            const trans = respond.data.payload
            setTransaction(trans)
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
        getListOfTransactions()
    }, [])

    const PaginateBody = () => {
        const {current_page, per_page, total } = transactions
        return (
            <Pagination
                activePage={current_page}
                itemsCountPerPage={per_page}
                totalItemsCount={total}
                pageRangeDisplayed={5}
                onChange={(pageNumber) => getListOfTransactions(pageNumber)}
                prevPageText='Prev'
                nextPageText='Next'
                itemClass='page-item'
                linkClass='page-link'
            />
        )
    }

    const initialValue = {
        uniqueIdToProcess: uniqueid,
    }

    const bringoutProofModal = (proof) => {
        setVariable({title: 'Preview Payment Proof', description: <Image src={proof} alt='None' width={'100%'} height={'200px'} />, submit: null})
        onOpen()
    }

    const bringoutConfirmModal = (unique_id) => {
        setVariable({title: 'Confirm Users Payment', description: 'Are you sure you want to confirm this payment? (This mean you have check your wallet and confirmed that the deposit the user claim to have made is true.)', submit: confirmUserPayment})
        setUniqueid(unique_id)
        onOpen()
    }
    const confirmUserPayment = async (values, {resetForm}) => {
        await axios.post(BASE_URL+'confirm-transaction', values, {
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
             getListOfTransactions(transactions.current_page)
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
    
    const bringoutDeclineModal = (unique_id) => {
        setVariable({title: 'Decline Users Payment', description: 'Are you sure you want to decline this payment?', submit: declineUserPayment})
        setUniqueid(unique_id)
        onOpen()
    } 
    const declineUserPayment = async (values, {resetForm}) => {
        await axios.post(BASE_URL+'decline-transaction', values, {
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
             getListOfTransactions(transactions.current_page)
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
    
    const bringoutDeleteModal = (unique_id) => {
        setVariable({title: 'Delete Users Payment', description: 'Are you sure you want to delete this user\'s Payment?', submit: deleteUserPayment})
        setUniqueid(unique_id)
        onOpen()
    }
    const deleteUserPayment = async (values, {resetForm}) => {
        await axios.post(BASE_URL+'delete-transaction', values, {
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
             getListOfTransactions(transactions.current_page)
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

    const links = [
        {
            url: '/admin-dashboard',
            value: 'Dashboard',
        },
        {
            url: '#',
            value: 'Confirm Investment',
        },
    ]
    const { colorMode} = useColorMode()
    const isDark = colorMode === 'dark'
    return transactions === null ? (
            <Loader /> 
        ) : (
        <Stack>
            <BreadCrumb links={links} />
            <PrimaryCard>
                <Box overflow={'scroll'}>
                <Table variant='striped' colorScheme={isDark ? 'gray' : 'facebook'} boxShadow={'lg'}>
                    <TableCaption placement='top'>Confirm Investment</TableCaption>
                    <Thead>
                        <Tr>
                            {CONFIRM_TRANS_COLUMN.map((header_column, index) => <Th key={index}>{header_column.Header}</Th>)}
                        </Tr>
                    </Thead>
                    <Tbody>
                    {
                        transactions.data.length ?
                        transactions.data.map((each_trans, indexs) => (
                            <Tr key={indexs}>
                                <Td>{indexs + 1}</Td>
                                <Td>{each_trans.users === null ? '' : each_trans.users.email}</Td>
                                <Td>{each_trans.plans.plan_name}</Td>
                                <Td>{formater.format(each_trans.amount)}</Td>
                                <Td>
                                    <Badge variant={'outline'} colorScheme={each_trans.received_status === 'pending' ? 'red' : 'green'}>{each_trans.received_status}</Badge>
                                </Td>
                                <Td>{each_trans.system_wallet.wallet_name}</Td>
                                <Td>
                                    <Moment format="DD/MM/YYYY">{each_trans.created_at}</Moment>
                                </Td>
                                <Td>
                                    <Button variant={'outline'} colorScheme={'orange'} onClick={() => bringoutProofModal(`${each_trans.payment_proof }`)}>Proof</Button>
                                </Td>
                                <Td>
                                    <Button variant={'solid'} colorScheme={'red'} onClick={() => bringoutConfirmModal(`${each_trans.unique_id }`)}>Confirm</Button>
                                </Td>
                                <Td>
                                    <Button variant={'outline'} colorScheme={'teal'} onClick={() => bringoutDeclineModal(`${each_trans.unique_id }`)}>Decline</Button>
                                </Td>
                                <Td>
                                    <Link to={'/payment-invoice/'+each_trans.unique_id} >
                                        <Button variant={'solid'} colorScheme={'blue'}>Edit</Button>
                                    </Link>
                                </Td>
                                <Td>
                                    <Button variant={'outline'} colorScheme={'red'} onClick={() => bringoutDeleteModal(`${each_trans.unique_id }`)}>Delete</Button>
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
                        <ModalHeader fontSize='lg' fontWeight='bold'>{variable.title}</ModalHeader>
                        <ModalCloseButton/>
                        <ModalBody>
                        <Box>
                            <Text>{variable.description}</Text>
                            {variable.extra}
                            <Formik initialValues={initialValue} validationSchema={validationSchema} onSubmit={variable.submit}>
                            {
                                formik => {
                                    return <Form>
                                        <Field type='hidden' name='uniqueIdToProcess'  />
                                        <FormikControl hidden={variable.title === 'Preview Payment Proof' ? true : false} control='chakrabutton' type='submit' label='Proceed' disabled={!formik.isValid || formik.isSubmitting}/>
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

export default ConfirmTransaction;
