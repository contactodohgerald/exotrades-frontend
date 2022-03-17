import React from 'react';
import { Field } from 'formik'
import {
    Checkbox,
    FormControl,
    FormErrorMessage,
} from '@chakra-ui/react'

function ChakraCheckBox(props) {
    const { label, name, ...rest } = props 
    return (
        <Field name={name}>
            {
                ({form}) => {
                    return <FormControl pt='5'>
                        <Checkbox id={name} size='md' {...rest} colorScheme='green'>
                            {label}
                        </Checkbox>
                        <FormErrorMessage>{form.errors[name]}</FormErrorMessage>
                    </FormControl>
                }
            }
        </Field>
    )
}

export default ChakraCheckBox;
