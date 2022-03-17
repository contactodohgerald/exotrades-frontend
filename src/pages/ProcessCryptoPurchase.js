import { 
  Alert,
  Center,
  Container, 
  Divider, 
  Heading, 
  Image, 
  Stack, 
  Text,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import * as Yup from 'yup'
import { useNavigate, useParams } from 'react-router-dom';
import BreadCrumb from '../components/BreadCrumb';
import PrimaryCard from '../components/PrimaryCard';
import { Form, Formik } from 'formik';
import FormikControl from '../components/FormikControl';
import axios from "axios";
import swal from 'sweetalert'
import { BASE_URL } from '../api_routes';
import API_TOKEN from '../token';
import Loader from '../components/Loader';
import { formater } from '../_formater';

const initialValue = {
  amount: '',
  user_wallet_unique_id: '',
}

const validationSchema = Yup.object({
  amount: Yup.string().required('Required'),
})

function ProcessCryptoPurchase() {
  const params = useParams()
  const [coin, setCoin] = useState(null)
  const [settings, setSiteSettings] = useState(null)
  const navigate = useNavigate()

  const getSingleCoin = (unique_id) => {
      axios.get(BASE_URL+`get-single-coin/${unique_id}`, {
          headers: {
              'Authorization': `Bearer ${API_TOKEN}` 
          }
      })
      .then(respond => {
          const coin = respond.data
          setCoin(coin.payload)
          setSiteSettings(coin.site_details)
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
    getSingleCoin(params.unique_id)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onSubmit = (values, {resetForm}) => {
    axios.post(BASE_URL+`process-purchase/${params.unique_id}`, values, {
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
        const data = res.payload;
        navigate('/crypto-purchase-inovice/'+data.unique_id, {replace: true})
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
  
  const links = [
      {
          url: '/dashboard',
          value: 'Dashboard',
      },
      {
        url: '/crypto-purchase',
        value: 'Market Cap',
      },
      {
          url: '#',
          value: 'Process Crypto Purchase',
      },
  ]

  return !coin ? (
          <Loader />
      ) : (
      <Stack>
          <BreadCrumb links={links} />
          <PrimaryCard>
              <Container textAlign={'center'}  maxW='container.md'>
                  <Center>
                    <Image src={coin.coin_logo} fallbackSrc='https://via.placeholder.com/500' alt={coin.coin_symbol} width={'40px'} height={'40px'} rounded={'full'} />
                  </Center>
                  <Heading>{coin.coin_name}</Heading>
                  <Text mb={'4'} fontSize={'2xl'} >{coin.coin_symbol}</Text>
                  <Divider />
                  <Text fontSize={'2xl'} color={'red'}>Note!</Text>
                  <Text fontSize={'2xl'} mb={'4'}> 1 {coin.coin_symbol} is equal to {formater.format(coin.currrent_price)}</Text>
                  <Divider mb={'4'}  />
                  <Alert status='error' variant='subtle'>
                      <Text textAlign={'center'}>You are about to purchase {coin.coin_name} from {settings ? settings.app_name : ''} at the rate of {formater.format(coin.currrent_price)} Note: No service fee will be charged, {settings ? settings.app_name : ''} will automatically invest the said amount. For further inqueries, please conatct our 24/7 live support or send an email to {settings ? settings.email : ''}</Text>
                  </Alert>
                  <Formik initialValues={initialValue} validationSchema={validationSchema} onSubmit={onSubmit}>
                    {
                        formik => {
                            return <Form>
                                <FormikControl control='chakrainput' type='number' label='Amount' name='amount' />
                                <FormikControl control='chakrabutton' type='submit' label='Procced' disabled={!formik.isValid || formik.isSubmitting}/>
                            </Form>
                        }
                    }
                  </Formik>
              </Container>
          </PrimaryCard>
      </Stack>
  );
}

export default ProcessCryptoPurchase;
