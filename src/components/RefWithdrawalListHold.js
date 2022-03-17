import { 
  Box, 
  Center, 
  Stack, 
  Text,
  Table, 
  TableCaption, 
  Tbody, 
  Td, 
  Th, 
  Thead, 
  Tr, 
  useColorMode, 
  Badge,
  Button,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useDisclosure
} from '@chakra-ui/react';
import React, { useState } from 'react'
import Moment from 'react-moment';
import Pagination from 'react-js-pagination';
import Loader from './Loader';
import { formater } from '../_formater';
import * as Yup from 'yup'
import { Field, Form, Formik } from 'formik';
import FormikControl from '../components/FormikControl';
import swal from 'sweetalert'
import axios from "axios";
import { BASE_URL } from '../api_routes';
import API_TOKEN from '../token';
import PrimaryCard from './PrimaryCard';
import { FaHamburger } from 'react-icons/fa';

const validationSchema = Yup.object({
})

function RefWithdrawalListHold({ refferals, getListOfRefferrals }) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [uniqueid, setUniqueid] = useState('')

  const initialValue = {
    uniqueIdToProcess: uniqueid,
  }

  const onSubmit = async (values, {resetForm}) => {
      await axios.post(BASE_URL+'delete-ref-withdrawal', values, {
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
          getListOfRefferrals(refferals.current_page)
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

  const PaginateBody = () => {
      const {current_page, per_page, total } = refferals
      return (
          <Pagination
          activePage={current_page}
          itemsCountPerPage={per_page}
          totalItemsCount={total}
          pageRangeDisplayed={5}
          onChange={(pageNumber) => getListOfRefferrals(pageNumber)}
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
  const { colorMode} = useColorMode()
  const isDark = colorMode === 'dark'
  return refferals === null ? (
          <Loader /> 
      ) : (
          <Stack>
              <PrimaryCard>
                  <Box overflow={'scroll'}>
                  <Table variant='striped' colorScheme={isDark ? 'gray' : 'facebook'} boxShadow={'lg'}>
                      <TableCaption placement='top'>Withdraw Referral Bonus History</TableCaption>
                      <Thead>
                          <Tr>
                              <Th>S/N</Th>
                              <Th>Amount ($)</Th>
                              <Th>Status</Th>
                              <Th>Wallet Type</Th>
                              <Th>Date</Th>
                              <Th>Action</Th>
                          </Tr>
                      </Thead>
                      <Tbody>
                      {
                          refferals.length !== 0 ?
                          refferals.data.map((each_refferal, indexs) => (
                             <>
                              <Tr key={indexs}>
                                  <Td>{indexs + 1}</Td>
                                  <Td>{formater.format(each_refferal.amount)}</Td>
                                  <Td>
                                      <Badge variant={'outline'} colorScheme={each_refferal.status === 'pending' ? 'red' : 'green'}>{each_refferal.status}</Badge>
                                  </Td>
                                  <Td>{each_refferal.user_wallet.system_wallet.wallet_name}</Td>
                                  <Td>
                                      <Moment format="DD/MM/YYYY">{each_refferal.created_at}</Moment>
                                  </Td>
                                  <Td>
                                    <Button as={IconButton} icon={<FaHamburger />} onClick={() => bringoutDeleteModal(`${each_refferal.unique_id }`)} variant='outline'/>
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
                        <ModalHeader fontSize='lg' fontWeight='bold'>Withdraw Funds</ModalHeader>
                        <ModalCloseButton/>
                        <ModalBody>
                        <Box>
                            <Text>Do you really want to delete this withdraw ?</Text>
                            <Formik initialValues={initialValue} validationSchema={validationSchema} onSubmit={onSubmit}>
                            {
                                formik => {
                                    return <Form>
                                        <Field type='hidden' name='uniqueIdToProcess'  />
                                        <FormikControl control='chakrabutton' type='submit' label='Delete Withdrawal' disabled={!formik.isValid || formik.isSubmitting}/>
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

export default RefWithdrawalListHold