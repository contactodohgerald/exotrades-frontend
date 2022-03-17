import { 
    SimpleGrid,
    useMediaQuery
 } from '@chakra-ui/react';
 import * as Yup from 'yup'
 import { Form, Formik } from 'formik';
 import React, { useEffect, useState } from 'react';
 import axios from "axios";
 import { BASE_URL } from '../api_routes';
import Loader from './Loader';
import API_TOKEN from '../token';
import swal from 'sweetalert'
import FormikControl from './FormikControl';
  
const validationSchema = Yup.object({
    site_name: Yup.string().required('Required'),
    site_email: Yup.string().email('Invalid Email Format').required('Required!'),
    site_phone: Yup.string().required('Required'),
    site_domain: Yup.string().required('Required'),
})

function BasicSiteSettings() {
    const [siteStettings, setSiteStettings] = useState(false)

    const getSiteSettingsDetails = () => {
        axios.get(BASE_URL+'get-settings', {
            headers: {
                'Authorization': `Bearer ${API_TOKEN}` 
            }
        })
        .then(respond => {
            const users = respond.data
            setSiteStettings(users)
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
        getSiteSettingsDetails()
    }, [])

    const onSubmit = (values, {setErrors, resetForm}) => {
        axios.post(BASE_URL+'basic-settings-update', values, {
            headers: {
                'Authorization': `Bearer ${API_TOKEN}` 
            }
        })
        .then(respond => {
            const res = respond.data
            if(res.status === false){
                const error = res.error.message
                setErrors(error)
                return;
            }
            const success = res.success.message
            swal({
                title: "Success",
                text: success,
                icon: "success"
            })
            getSiteSettingsDetails()
            resetForm()
            return
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

    const userValue = siteStettings.payload
    const initialValue = {
        site_name: siteStettings ? userValue.site_name : '',
        site_email: siteStettings ? userValue.site_email : '',
        site_phone: siteStettings ? userValue.site_phone : '',
        site_domain: siteStettings ? userValue.site_domain : '',
        site_address: siteStettings ? userValue.site_address : '',
        ref_bonus: siteStettings ? userValue.ref_bonus : '',
        withdrawal_penalty: siteStettings ? userValue.withdrawal_penalty : '',
        verification_token_length: siteStettings ? userValue.verification_token_length : '',
        max_amount_to_withdraw: siteStettings ? userValue.max_amount_to_withdraw : '',
        min_wallet_withdrawal: siteStettings ? userValue.min_wallet_withdrawal : '',
        min_amount_to_transfer: siteStettings ? userValue.min_amount_to_transfer : '',
        max_amount_to_transfer: siteStettings ? userValue.max_amount_to_transfer : '',
        purchase_coin_percent: siteStettings ? userValue.purchase_coin_percent : '',
        purchase_coin_duration: siteStettings ? userValue.purchase_coin_duration : '',
        return_coins_limit: siteStettings ? userValue.return_coins_limit : '',
    }
    
    const [isNotSmallerScreen] = useMediaQuery('(min-width: 600px)')
    return !siteStettings ? (
            <Loader /> 
        ) : (
        <Formik initialValues={initialValue} validationSchema={validationSchema} onSubmit={onSubmit}>
        {
            formik => {
            return <Form>
                <SimpleGrid columns={isNotSmallerScreen ? 2 : 1} spacing={1}>
                    <FormikControl control='chakrainput' type='text' label='Site Name' name='site_name' />
                    <FormikControl control='chakrainput' type='email' label='Site Email' name='site_email' />
                    <FormikControl control='chakrainput' type='text' label='Site Phone Number' name='site_phone' />
                    <FormikControl control='chakrainput' type='url' label='Site Domain' name='site_domain' />
                    <FormikControl control='chakrainput' type='number' label='Referral Bonus (%)' name='ref_bonus' />
                    <FormikControl control='chakrainput' type='number' label='Withdrawal Penalty' name='withdrawal_penalty' />
                    <FormikControl control='chakrainput' type='number' label='Verification Token Length' name='verification_token_length' />
                    <FormikControl control='chakrainput' type='number' label='Maxmium Amount To Withdraw' name='max_amount_to_withdraw' />
                    <FormikControl control='chakrainput' type='number' label='Min Wallet Withdrawal' name='min_wallet_withdrawal' />
                    <FormikControl control='chakrainput' type='number' label='Service Charge (%)' name='min_amount_to_transfer' />
                    <FormikControl control='chakrainput' type='number' label='Max Amount To Transfer' name='max_amount_to_transfer' />
                    <FormikControl control='chakrainput' type='number' label='Purchase Coin (%)' name='purchase_coin_percent' />
                    <FormikControl control='chakrainput' type='number' label='Purchase Coin (Days)' name='purchase_coin_duration' />
                    <FormikControl control='chakrainput' type='text' label='Total Coins Returned' name='return_coins_limit' />
                </SimpleGrid>
                <FormikControl control='chakrainput' type='text' label='Site Address' name='site_address' />
                <FormikControl control='chakrabutton' type='submit' label='Update Settings' disabled={!formik.isValid || formik.isSubmitting}/>
            </Form>
            }
        }
        </Formik>
    );
}

export default BasicSiteSettings;
