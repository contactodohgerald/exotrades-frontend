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
    useDisclosure,
    IconButton
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import axios from "axios";
import { BASE_URL } from '../api_routes';
import API_TOKEN from '../token';
import BreadCrumb from '../components/BreadCrumb';
import PrimaryCard from '../components/PrimaryCard';
import Loader from '../components/Loader';
import Pagination from 'react-js-pagination';
import { formater } from '../_formater';
import swal from 'sweetalert'
import { Field, Form, Formik } from 'formik';
import FormikControl from '../components/FormikControl';
import * as Yup from 'yup'
import 'bootstrap/dist/css/bootstrap.min.css'
import { FiPlus } from 'react-icons/fi';

const validationSchema = Yup.object({
})

function AddInterest() {
    const [transactions, setTransaction] = useState(null)
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [uniqueid, setUniqueid] = useState('')
    const [interest, setInterest] = useState(0)
    const [day_counter, setDayCounter] = useState(0)

    const getListOfTransactions = (pageNumber = 1) => {
        axios.get(BASE_URL+`get-transactions-history?page=${pageNumber}`, {
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

    const initialValue = {
        uniqueId: uniqueid,
        intrest: interest,
        day_counter: day_counter,
    }

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

    const bringoutUnConfirmModal = (unique_id, interest, day_counter) => {
        setUniqueid(unique_id)
        setInterest(interest)
        setDayCounter(day_counter)
        onOpen()
    }

    const onSubmit = async (values, {resetForm}) => {
        await axios.post(BASE_URL+'manually-add-interest', values, {
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
            value: 'Add Interest',
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
                    <TableCaption placement='top'>Investment History</TableCaption>
                    <Thead>
                        <Tr>
                            <Th>S/N</Th>
                            <Th>Email</Th>
                            <Th>Plan</Th>
                            <Th>Amount ($)</Th>
                            <Th>Interest ($)</Th>
                            <Th>Day Counter</Th>
                            <Th>Status</Th>
                            <Th>Payment Option</Th>
                            <Th>Interest Add</Th>
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
                                <Td>{formater.format(each_trans.intrest_growth)}</Td>
                                <Td>{each_trans.day_counter}</Td>
                                <Td>
                                    <Badge variant={'outline'} colorScheme={each_trans.received_status === 'pending' ? 'red' : 'green'}>{each_trans.received_status}</Badge>
                                </Td>
                                <Td>{each_trans.system_wallet.wallet_name}</Td>
                                <Td>
                                    <IconButton variant={'solid'} colorScheme={'teal'} onClick={() => bringoutUnConfirmModal(`${each_trans.unique_id }`, `${each_trans.intrest_growth }`, `${each_trans.day_counter }`)} icon={<FiPlus/>} fontSize={'lg'} />
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
                        <ModalHeader fontSize='lg' fontWeight='bold'>Add Deposite Interest</ModalHeader>
                        <ModalCloseButton/>
                        <ModalBody>
                        <Box>
                            <Formik initialValues={initialValue} validationSchema={validationSchema} onSubmit={onSubmit}>
                            {
                                formik => {
                                    return <Form>
                                        <Field type='hidden' name='uniqueId'  />
                                        <FormikControl control='chakrainput' type='number' label='Interest ($)' name='intrest' />
                                        <FormikControl control='chakrainput' type='number' label='Day Counter' name='day_counter' />
                                        <FormikControl control='chakrabutton' type='submit' label='Add Interest' disabled={!formik.isValid || formik.isSubmitting}/>
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

export default AddInterest;
