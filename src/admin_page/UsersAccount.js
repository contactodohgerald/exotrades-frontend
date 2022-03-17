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
import { Link } from 'react-router-dom';

const validationSchema = Yup.object({
})

function UsersAccount() {
    const [users, setUsers] = useState(null)
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [variable, setVariable] = useState({title: '', description: '', extra: '', submit: '', label: ''})
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
        uniqueIdToProcess: uniqueid,
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

    const processRequest = async (url, values, resetForm) => {
        await axios.post(BASE_URL+url, values, {
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
            getListOfUsers(users.current_page)
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

    //block user account
    const bringoutBlockAccountModal = (unique_id) => {
        setVariable({title: 'Block User Account', description: 'Are you sure you want to block this user? (This mean the user will not be able to log in to their account.)', submit: blockUserAccount, label: 'Block User'})
        setUniqueid(unique_id)
        onOpen()
    }
    const blockUserAccount = (values, {resetForm}) => {
        processRequest('block-user-account', values, resetForm)
    }

    //unblock user account
    const bringoutUnblockAccountModal = (unique_id) => {
        setVariable({title: 'Unblock User Account', description: 'Are you sure you want to unblock this user? (This means that this user will now have the ability to log in to their account.)', submit: unBlockUserAccount, label: 'Unblock User'})
        setUniqueid(unique_id)
        onOpen()
    }
    const unBlockUserAccount = async (values, {resetForm}) => {
        processRequest('unblock-user-account', values, resetForm)
    }

    //activate user account
    const bringoutActivateAccountModal = (unique_id) => {
        setVariable({title: 'Activate User Account', description: 'Are you sure you want to activate this user? (This means that this user will now have the ability to log in to their account)', submit: activateUserAccount, label: 'Activate User'})
        setUniqueid(unique_id)
        onOpen()
    }
    const activateUserAccount = async (values, {resetForm}) => {
        processRequest('activate-user-account', values, resetForm)
    }

    //delete user account
    const bringoutDeleteAccountModal = (unique_id) => {
        setVariable({title: 'Delete User Account', description: 'Are you sure you want to delete this user?', submit: deleteUserAccount, label: 'Delete User'})
        setUniqueid(unique_id)
        onOpen()
    }
    const deleteUserAccount = async (values, {resetForm}) => {
        processRequest('delete-user-account', values, resetForm)
    }
 
    const links = [
        {
            url: '/admin-dashboard',
            value: 'Dashboard',
        },
        {
            url: '#',
            value: 'Payouts',
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
                    <TableCaption placement='top'>Payouts</TableCaption>
                    <Thead>
                        <Tr>
                            <Th>S/N</Th>
                            <Th>Email</Th>
                            <Th>View User Account</Th>
                            <Th>Account Status</Th>
                            <Th>Block User</Th>
                            <Th>Activate User</Th>
                            <Th>Joined Date</Th>
                            <Th>Delete User</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                    {
                        users.data.length ?
                        users.data.map((each_user, indexs) => (
                            <Tr key={indexs}>
                                <Td>{indexs + 1}</Td>
                                <Td>{each_user.email}</Td>
                                <Td>
                                    <Link to={'/view-profile/'+each_user.unique_id }>
                                        <Button variant={'solid'} colorScheme={'teal'}>View</Button>
                                    </Link>
                                </Td>
                                <Td>
                                    <Badge variant={'outline'} colorScheme={each_user.status === 'active' ? 'green' : 'red'}>{each_user.status === 'active' ? 'Active' : 'Inactive'}</Badge>
                                </Td>
                                <Td>
                                    <Button variant={'solid'} colorScheme={each_user.status === 'active' ? 'orange' : 'blue'} onClick={each_user.status === 'active' ? () => bringoutBlockAccountModal(`${each_user.unique_id }`) : () => bringoutUnblockAccountModal(`${each_user.unique_id }`)}>{each_user.status === 'active' ? 'Block' : 'Unblock'}</Button>
                                </Td>
                                <Td>
                                    <Button variant={'outline'} colorScheme={'blue'} onClick={() => bringoutActivateAccountModal(`${each_user.unique_id }`)} disabled={each_user.email_verified_at === null ? false : true}>Activate</Button>
                                </Td>
                                <Td>
                                    <Moment format="DD/MM/YYYY">{each_user.created_at}</Moment>
                                </Td>
                                <Td>
                                    <Button variant={'solid'} colorScheme={'red'} onClick={() => bringoutDeleteAccountModal(`${each_user.unique_id }`)}>Delete</Button>
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
                            <Formik initialValues={initialValue} validationSchema={validationSchema} onSubmit={variable.submit}>
                            {
                                formik => {
                                    return <Form>
                                        <Field type='hidden' name='uniqueIdToProcess'  />
                                        {variable.extra}
                                        <FormikControl control='chakrabutton' type='submit' label={variable.label} disabled={!formik.isValid || formik.isSubmitting}/>
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

export default UsersAccount;
