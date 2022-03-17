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
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import axios from "axios";
import { BASE_URL } from '../api_routes';
import API_TOKEN from '../token';
import BreadCrumb from '../components/BreadCrumb';
import PrimaryCard from '../components/PrimaryCard';
import Loader from '../components/Loader';
import Pagination from 'react-js-pagination';
import swal from 'sweetalert'
import Moment from 'react-moment';
import { Field, Form, Formik } from 'formik';
import FormikControl from '../components/FormikControl';
import * as Yup from 'yup'
import 'bootstrap/dist/css/bootstrap.min.css'

const validationSchema = Yup.object({
    news_tile: Yup.string().required('Required'),
    news_body: Yup.string().required('Required'),
})

function PostNews() {
    const [users, setUsers] = useState(null)
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [uniqueid, setUniqueid] = useState('')

    const getListOfUsers= (pageNumber = 1) => {
        axios.get(BASE_URL+`get-users-list?page=${pageNumber}`, {
            headers: {
                'Authorization': `Bearer ${API_TOKEN}` 
            }
        })
        .then(respond => {
            const user = respond.data.payload
            setUsers(user)
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
        getListOfUsers()
    }, [])

    const initialValue = {
        userId: uniqueid,
        news_tile: '',
        news_body: '',
    }

    const PaginateBody = () => {
        const {current_page, per_page, total} = users
        return (
            <Pagination
                activePage={current_page}
                itemsCountPerPage={per_page}
                totalItemsCount={total}
                pageRangeDisplayed={5}
                onChange={(pageNumber) => getListOfUsers(pageNumber)}
                prevPageText='Prev'
                nextPageText='Next'
                itemClass='page-item'
                linkClass='page-link'
            />
        )
    }

    const bringoutNewsModal = (unique_id) => {
        setUniqueid(unique_id)
        onOpen()
    }
    const onSubmit = async (values, {resetForm}) => {
        await axios.post(BASE_URL+'post-news', values, {
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
 
    const links = [
        {
            url: '/admin-dashboard',
            value: 'Dashboard',
        },
        {
            url: '#',
            value: 'Post News',
        },
    ]
    const { colorMode} = useColorMode()
    const isDark = colorMode === 'dark'
    return users === null ? (
            <Loader /> 
        ) : (
        <Stack>
            <BreadCrumb links={links} />
            <PrimaryCard>
                <Box overflow={'scroll'}>
                <Table variant='striped' colorScheme={isDark ? 'gray' : 'facebook'} boxShadow={'lg'}>
                    <TableCaption placement='top'>Post News</TableCaption>
                    <Thead>
                        <Tr>
                            <Th>S/N</Th>
                            <Th>Name</Th>
                            <Th>Email</Th>
                            <Th>Account Status</Th>
                            <Th>Joined Date</Th>
                            <Th>Post News</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                    {
                        users.data.length ?
                        users.data.map((each_user, indexs) => (
                            <Tr key={indexs}>
                                <Td>{indexs + 1}</Td>
                                <Td>{each_user.name}</Td>
                                <Td>{each_user.email}</Td>
                                <Td>
                                    <Badge variant={'outline'} colorScheme={each_user.status === 'active' ? 'green' : 'red'}>{each_user.status === 'active' ? 'Active' : 'Inactive'}</Badge>
                                </Td>
                                <Td>
                                    <Moment format="DD/MM/YYYY">{each_user.created_at}</Moment>
                                </Td>
                                <Td>
                                    <Button disabled={each_user.status === 'active' ? false : true } variant={'solid'} colorScheme={'blue'} onClick={() => bringoutNewsModal(`${each_user.unique_id }`)}>Post</Button>
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
                        <ModalHeader fontSize='lg' fontWeight='bold'>Post News To User</ModalHeader>
                        <ModalCloseButton/>
                        <ModalBody>
                        <Box>
                            <Formik initialValues={initialValue} validationSchema={validationSchema} onSubmit={onSubmit}>
                            {
                                formik => {
                                    return <Form>
                                        <Field type='hidden' name='userId'  />
                                        <FormikControl control='chakrainput' type='text' label='News Title' name='news_tile' />
                                        <FormikControl control='chakratextarea' type='text' label='News Body' name='news_body' />
                                        <FormikControl control='chakrabutton' type='submit' label='Post' disabled={!formik.isValid || formik.isSubmitting}/>
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

export default PostNews;
