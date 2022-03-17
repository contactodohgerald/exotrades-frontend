import { 
    Box,
    Grid,
    GridItem,
    Text,
    useColorMode,
} from '@chakra-ui/react';
import { Field } from 'formik';

function PlanCards({ plan }) {
    const { colorMode} = useColorMode()
    const isDark = colorMode === 'dark'
    return (
        <Box p={4} bg={isDark ? 'gray.800' : 'white'} boxShadow={'2xl'} textAlign={'center'} mt={'4'}>
            <Text fontWeight={'bold'} fontSize={'2xl'}>{plan.plan_name}</Text>
            <Field className='radio-style' type='radio' name='plan_unique_id' value={plan.unique_id}  />
            <Grid>
                <GridItem>
                    <Text m={'2'}>Min Amount : (USD) {plan.min_amount}</Text>
                </GridItem>
                 <GridItem>
                    <Text m={'2'}>Max Amount : (USD) {plan.max_amount}</Text>
                </GridItem>
                <GridItem>
                    <Text m={'2'}>Percentage Interest : {plan.plan_percentage} (%)</Text>
                </GridItem>
                <GridItem>
                    <Text m={'2'}>Interest Duration : {plan.intrest_duration} (Days)</Text>
                </GridItem> 
                <GridItem>
                    <Text m={'2'}>Payment Intervals : {plan.payment_interval}</Text>
                </GridItem>
            </Grid>
        </Box>
    );
}

export default PlanCards;
