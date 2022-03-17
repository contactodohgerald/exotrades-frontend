import React from 'react';
import { 
  Alert,
  Box,
  Button,
  Center,
  Container, 
  Divider, 
  Heading,
  SimpleGrid,
  Text,
  useColorMode,
  useToast
} from '@chakra-ui/react'
import * as Yup from 'yup'
import { Form, Formik } from 'formik';
import FormikControl from '../components/FormikControl';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import axios from "axios";
import { BASE_URL } from "../api_routes";

const initialValue = {
  token: '',
}

const validationSchema = Yup.object({
  token: Yup.string().required('Required')
})

function VerifyToken() {
  const params = useParams()
  const navigate = useNavigate()
  const onSubmit = (values, {setErrors}) => {
    axios.post(BASE_URL+`verify-reset-password-token/${params.user_id}`, values)
        .then(respond => {
          //return the data from the api on success
          const res = respond.data
          if(res.status === false){
            const error = res.error.message
            setErrors(error)
            return;
          }
          const success = res.success.message
          bringOutToast(success)
          const data = res.payload.data.user
          navigate('/reset-password/'+data.unique_id, {replace: true})
        })
        .catch(error => {
          //return an error message
          const errorMsg = error.message
          bringOutToast(errorMsg)
          return
        })
  }
  //handle token resend
  const resendTokenHandle = () => {
    axios.get(BASE_URL+`resend-reset-token/${params.user_id}`)
    .then(respond => {
        //return the data from the api on success
        const res = respond.data
        if(res.status === false){
          const error = res.error.message
          bringOutToast(error, 'error')
          return;
        }
        const success = res.success.message
        bringOutToast(success)
        return;
      })
      .catch(error => {
        //return an error message
        const errorMsg = error.message
        bringOutToast(errorMsg, 'error')
        return;
      })        
  }
  const { colorMode} = useColorMode()
  const isDark = colorMode === 'dark'
  const toast = useToast()
  const bringOutToast = (msg, status='success') => {
    toast({
        title: msg,
        variant: 'top-accent',
        position: 'top-right',
        status: status,
        isClosable: true,
    })
  }
  return (
    <Container>
      <SimpleGrid
        columns={{ sm: 1, md: 1 }}
        rounded='lg'
        mt='18px'
      >
        <Center>
          <Logo borderRadius="full" width="80px" height="80px" mb='5'  />
        </Center>
        <Box 
          borderTop='3px solid'
          borderTopColor={isDark ? 'red' : 'blue'}
          boxShadow='lg' 
          p='8px 20px' 
          rounded='md'>
            <Heading as='h3' size='lg'>Verify Token</Heading>
            <Divider mt="5" orientation='horizontal' />
            <Alert status='success' variant='subtle'>
                <Text textAlign={'center'}>Head over to your email and provide the token that was sent to you? If you didn't receive the email, we will gladly send you another</Text>
            </Alert>
            <Formik initialValues={initialValue} validationSchema={validationSchema} onSubmit={onSubmit}>
              {
                formik => {
                  return <Form>
                      <FormikControl control='chakrainput' type='number' label='Token' name='token' />
                      <FormikControl control='chakrabutton' type='submit' label='Verify Token' disabled={!formik.isValid || formik.isSubmitting}/>
                      <Button size='md' border='2px' m='5px 0' onClick={resendTokenHandle}>Resend Token</Button>
                  </Form>
                }
              }
            </Formik>
        </Box>
        <Text mt='8' textAlign='center'>Don't have an account? 
          <Link to='/register'> Create One</Link>
        </Text>
      </SimpleGrid>
    </Container>
  );
}

export default VerifyToken;
