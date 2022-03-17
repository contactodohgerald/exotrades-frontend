import React from 'react';
import { connect } from 'react-redux';
import { 
  Box,
  Center,
  Container, 
  Divider, 
  Heading,
  SimpleGrid,
  Text,
  useColorMode
} from '@chakra-ui/react'
import * as Yup from 'yup'
import { withFormik } from 'formik';
import FormikControl from '../components/FormikControl';
import { Link } from 'react-router-dom';
import { loginUsers } from '../redux'

import Logo from '../components/Logo';

function LoginPage(props) {
  const { colorMode} = useColorMode()
  const isDark = colorMode === 'dark'
  const {
    isSubmitting,
    handleSubmit,
  } = props
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
            <Heading as='h3' size='lg'>Login</Heading>
            <Divider mt="5" orientation='horizontal' />
            <form onSubmit={handleSubmit}>
              <FormikControl control='chakrainput' type='email' label='Email' name='email' />
              <FormikControl control='chakrainput' type='password' label='Password' name='password' />
              <FormikControl control='chakracheckbox' label='Remember Me' name='remember_me' />
              <FormikControl control='chakrabutton' type='submit' label='Login' disabled={isSubmitting} />
              <Text textAlign='right'>
                <Link to='/confirm-email'>Forgot Password? </Link>
              </Text>
            </form>
        </Box>
        <Text mt='8' textAlign='center'>Don't have an account? 
          <Link to='/register'> Create One</Link>
        </Text>
      </SimpleGrid>
    </Container>
  );
}

const EnhancedLoginForm = withFormik({
  mapPropsToValues: () => ({
    email: '',
    password: '',
  }),

  validationSchema: Yup.object().shape({
    email: Yup.string().email('Invalid Email Format').required('Required!'),
    password: Yup.string().required('Required'),
  }),

  handleSubmit(values, { props, setSubmitting }) {
    props.dispatch(loginUsers(values));
    setSubmitting(false);
  },
})(LoginPage)

const loginController = connect()(EnhancedLoginForm);

export default loginController;