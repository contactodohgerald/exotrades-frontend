import React from 'react';
import { 
  Box,
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
    password: '',
    password_confirmation: ''
}

const validationSchema = Yup.object({
    password: Yup.string().required('Required!'),
    password_confirmation: Yup.string()
        .oneOf([Yup.ref('password'), ''], 'Passwords Must Match')
        .required('Required!'),
})

function ResetPassword() {
  const params = useParams()
  const navigate = useNavigate()
  const onSubmit = (values, {setErrors}) => {
    axios.post(BASE_URL+`reset-password/${params.user_id}`, values)
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
      navigate('/login', {replace: true})
    })
    .catch(error => {
      //return an error message
      const errorMsg = error.message
      bringOutToast(errorMsg, 'error')
      return
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
            <Heading as='h3' size='lg'>Reset Password</Heading>
            <Divider mt="5" orientation='horizontal' />
            <Formik initialValues={initialValue} validationSchema={validationSchema} onSubmit={onSubmit}>
              {
                formik => {
                  return <Form>
                      <FormikControl control='chakrainput' type='password' label='New Password' name='password' />
                      <FormikControl control='chakrainput' type='password' label='Confirm Password' name='password_confirmation' />
                      <FormikControl control='chakrabutton' type='submit' label='Password Reset' disabled={!formik.isValid || formik.isSubmitting}/>
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

export default ResetPassword;
