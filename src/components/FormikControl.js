import React from 'react'
import ChakraButton from './ChakraButton';
import ChakraCheckBox from './ChakraCheckBox';
import ChakraInput from './ChakraInput';
import ChakraRadio from './ChakraRadio';
import ChakraSelect from './ChakraSelect';
import ChakraSwitch from './ChakraSwitch';
import ChakraTextarea from './ChakraTextarea';
import ReactSelect from './ReactSelect';

function FormikControl(props) {
    const { control, ...rest } = props
    switch(control){
        case 'chakrabutton': 
            return <ChakraButton {...rest} />
        case 'chakraswitch': 
            return <ChakraSwitch {...rest} />
        case 'chakraselect': 
            return <ChakraSelect {...rest} />
        case 'chakraradio': 
            return <ChakraRadio {...rest} />
        case 'chakracheckbox': 
            return <ChakraCheckBox {...rest} />
        case 'reactselect': 
             return <ReactSelect {...rest} />
        case 'chakrainput': 
            return <ChakraInput {...rest} />
        case 'chakratextarea': 
            return <ChakraTextarea {...rest} />
        default: return null
    }
}

export default FormikControl
