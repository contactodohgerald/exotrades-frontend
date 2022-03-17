import React from 'react'
import { Field } from 'formik'
import {
    Textarea ,
    FormControl,
    FormLabel,
    FormErrorMessage,
} from '@chakra-ui/react'

function ChakraTextarea(props) {
    const {label, name, ...rest } = props 
    return (
        <Field name={name}>
            {
                ({form, field}) => {
                    return <FormControl pt='8' isInvalid={form.errors[name] && form.touched[name]}>
                        <FormLabel htmlFor={name}>{label}</FormLabel>
                        <Textarea placeholder={label} id={name} {...field} {...rest} />
                        <FormErrorMessage>{form.errors[name]}</FormErrorMessage>
                    </FormControl>
                }
            }
        </Field>
    )
}

export default ChakraTextarea
