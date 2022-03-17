import { 
    FormControl, 
    FormErrorMessage, 
    Radio, 
    RadioGroup 
} from '@chakra-ui/react';
import { Field } from 'formik';
import React, { useState } from 'react';

function ChakraRadio(props) {
    const { name, plan_id, ...rest } = props 
    const [value, setValue] = useState(plan_id)
    return (
        <Field name={name}>
            {
                ({form}) => {
                    return <FormControl pt='5'> 
                         <RadioGroup onChange={setValue} value={value} id={name}>
                            <Radio size='lg' value={plan_id} {...rest} colorScheme='green' />
                        </RadioGroup>
                        <FormErrorMessage>{form.errors[name]}</FormErrorMessage>
                    </FormControl>
                }
            }
        </Field>
    )
}

export default ChakraRadio;
