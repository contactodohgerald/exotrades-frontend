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
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import axios from "axios";
import { BASE_URL } from "../api_routes";

const initialValue = {
  referred_id: '',
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
}

const validationSchema = Yup.object({
  email: Yup.string().email('Invalid Email Format').required('Required!'),
  name: Yup.string().required('Required!'),
  password: Yup.string().required('Required!'),
  password_confirmation: Yup.string()
      .oneOf([Yup.ref('password'), ''], 'Passwords Must Match')
      .required('Required!'),
})

function RegisterPage() {
  const navigate = useNavigate()
  const onSubmit = (values, {setErrors}) => {
    axios.post(BASE_URL+'register', values)
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
      const data = res.payload.user
      navigate('/verify-account/'+data.unique_id, {replace: true})
    })
    .catch(error => {
      //return an error message
      const errorMsg = error.message
      bringOutToast(errorMsg, 'error')
      return;
    })
  }

  const toast = useToast()
  const { colorMode} = useColorMode()
  const isDark = colorMode === 'dark'
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
    <Container maxW='container.sm'>
      <SimpleGrid
        columns={{ sm: 1, md: 1 }}
        rounded='lg'
        mt='18px'
      >
        <Center>
          <Logo borderRadius="full" width="80px" height="80px" mb='5' />
        </Center>
        <Box 
          borderTop='3px solid'
          borderTopColor={isDark ? 'red' : 'blue'}
          boxShadow='lg' 
          p='8px 20px' 
          rounded='md'>
            <Heading as='h3' size='lg'>Register</Heading>
            <Divider mt="5" orientation='horizontal' />
            <Formik initialValues={initialValue} validationSchema={validationSchema} onSubmit={onSubmit} >
              {
                formik => {
                  return <Form>
                      <FormikControl control='chakrainput' type='text' label='Referral Code (Optional)' name='referred_id' />
                      <FormikControl control='chakrainput' type='text' label='Full Name' name='name' />
                      <FormikControl control='chakrainput' type='email' label='Email' name='email' />
                      <FormikControl control='chakrainput' type='password' label='Password' name='password' />
                      <FormikControl control='chakrainput' type='password' label='Confirm Password' name='password_confirmation' />
                      <FormikControl control='chakrabutton' type='submit' label='Register' disabled={!formik.isValid || formik.isSubmitting}/>
                  </Form>
                }
              }
            </Formik>
        </Box>
        <Text mt='8' textAlign='center'>Already have an account? 
          <Link to='/login'> Login</Link>
        </Text>
      </SimpleGrid>
    </Container>
  );
}

export default RegisterPage
