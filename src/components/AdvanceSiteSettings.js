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
    
})

function AdvanceSiteSettings() {
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

    //const userValue = siteStettings.payload
    const initialValue = {
        capital_withdrawal_access: 'yes',
        automatic_payout_access: '',
        two_factor_access: '',
        account_verification_access: '',
        send_login_alert_mail: '',
        send_welcome_message_mail: '',
        referral_system_access: '',
        send_basic_emails: '',
        automate_money_send: '',
    }

    const onSubmit = (values, {setErrors, resetForm}) => {
        axios.post(BASE_URL+'advance-settings-update', values, {
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

    const [isNotSmallerScreen] = useMediaQuery('(min-width: 600px)')
    return !siteStettings ? (
            <Loader /> 
        ) : (
        <Formik initialValues={initialValue} validationSchema={validationSchema} onSubmit={onSubmit}>
        {
            formik => {
            return <Form>
                <SimpleGrid columns={isNotSmallerScreen ? 2 : 1} spacing={1}>
                    <FormikControl defaultChecked={true} control='chakraswitch' label='Capital Withdrawal Access' name='capital_withdrawal_access' />
                    <FormikControl control='chakraswitch' label='Automatic Payout Access' name='automatic_payout_access' />
                    <FormikControl control='chakraswitch' label='Two Factor Access' name='two_factor_access' />
                    <FormikControl control='chakraswitch' label='Account Verification Access' name='account_verification_access' />
                    <FormikControl control='chakraswitch' label='Send Login Alert Mail' name='send_login_alert_mail' />
                    <FormikControl control='chakraswitch' label='Send Welcome Message Mail' name='send_welcome_message_mail' />
                    <FormikControl control='chakraswitch' label='Referral System Access' name='referral_system_access' />
                    <FormikControl control='chakraswitch' label='Send Basic Emails' name='send_basic_emails' />
                    <FormikControl control='chakraswitch' label='Automate Money Send' name='automate_money_send' />
                </SimpleGrid>
                <FormikControl control='chakrabutton' type='submit' label='Update Settings' disabled={!formik.isValid || formik.isSubmitting}/>
            </Form>
            }
        }
        </Formik>
    );
}

export default AdvanceSiteSettings;
