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
import Pagination from 'react-js-pagination';
import { formater } from '../_formater';
import Moment from 'react-moment';
import { Field, Form, Formik } from 'formik';
import FormikControl from '../components/FormikControl';
import swal from 'sweetalert'
import 'bootstrap/dist/css/bootstrap.min.css'
  
const validationSchema = Yup.object({
})

function EarningsHistory() {
    const [earnings, setEarnings] = useState(null)
    const [uniqueid, setUniqueid] = useState('')
    const { isOpen, onOpen, onClose } = useDisclosure()

    const initialValue = {
        deleteTransId: uniqueid,
    }

    const getListOfEarnings = (pageNumber = 1) => {
        axios.get(BASE_URL+`earnings-history?page=${pageNumber}`, {
            headers: {
                'Authorization': `Bearer ${API_TOKEN}` 
            }
        })
        .then(respond => {
            const earning = respond.data.payload
            setEarnings(earning)
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
        getListOfEarnings()
    }, [])

    const PaginateBody = () => {
        const {current_page, per_page, total } = earnings
        return (
            <Pagination
                activePage={current_page}
                itemsCountPerPage={per_page}
                totalItemsCount={total}
                pageRangeDisplayed={5}
                onChange={(pageNumber) => getListOfEarnings(pageNumber)}
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

    const onSubmit = async (values, {resetForm}) => {
        await axios.post(BASE_URL+'delete-earning', values, {
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
             getListOfEarnings(earnings.current_page)
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
            url: '/dashboard',
            value: 'Dashboard',
        },
        {
            url: '#',
            value: 'View Earnings',
        },
    ]
    const { colorMode} = useColorMode()
    const isDark = colorMode === 'dark'
    return earnings === null ? (
            <Loader /> 
        ) : (
        <Stack>
            <BreadCrumb links={links} />
            <PrimaryCard>
                <Box overflowX={'scroll'}>
                <Table variant='striped' colorScheme={isDark ? 'gray' : 'facebook'} boxShadow={'lg'}>
                    <TableCaption placement='top'>Earnings History</TableCaption>
                    <Thead>
                        <Tr>
                            <Th>S/N</Th>
                            <Th>Plan Name</Th>
                            <Th>Amount ($)</Th>
                            <Th>Type</Th>
                            <Th>Status</Th>
                            <Th>Date</Th>
                            <Th>Action</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                    {
                        earnings.data.length !== 0 ?
                        earnings.data.map((each_earning, indexs) => (
                           <>
                            <Tr key={indexs}>
                                <Td>{indexs + 1}</Td>
                                <Td>{each_earning.transactions.plans.plan_name}</Td>
                                <Td>{formater.format(each_earning.amount)}</Td>
                                <Td>{each_earning.earning_type === 'interest_payout' ? 'Interest' : 'Capital'}</Td>
                                <Td>
                                    <Badge variant={'outline'} colorScheme={each_earning.status === 'pending' ? 'red' : 'green'}>{each_earning.status}</Badge>
                                </Td>
                                <Td>
                                    <Moment format="DD/MM/YYYY">{each_earning.created_at}</Moment>
                                </Td>
                                <Td>
                                    <Button colorScheme={'red'} onClick={() => bringoutDeleteModal(`${each_earning.unique_id }`)} variant='solid'>Delete</Button>
                                </Td>
                            </Tr>
                           </>
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
                        <ModalHeader fontSize='lg' fontWeight='bold'>Delete Earning</ModalHeader>
                        <ModalCloseButton/>
                        <ModalBody>
                        <Box>
                            <Text>Do you really want to delete this earning ?</Text>
                            <Formik initialValues={initialValue} validationSchema={validationSchema} onSubmit={onSubmit}>
                            {
                                formik => {
                                    return <Form>
                                        <Field type='hidden' name='deleteTransId'  />
                                        <FormikControl control='chakrabutton' type='submit' label='Delete Earning' disabled={!formik.isValid || formik.isSubmitting}/>
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

export default EarningsHistory;
