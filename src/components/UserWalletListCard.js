import { 
    Box,
    FormLabel,
    Text,
} from '@chakra-ui/react';
import { Field } from 'formik';

function UserWalletListCard({ userWallet }) {
    return (
        <Box boxShadow={'md'} p={'2'}>
            <Text fontWeight={'bold'}>{userWallet.system_wallet.wallet_name} ADDRESS</Text>
            <FormLabel>
                <Field className='radio-style' type='radio' name='user_wallet_unique_id' value={userWallet.unique_id}  />
                {userWallet.wallet_address}
            </FormLabel>
        </Box>
    );
}

export default UserWalletListCard;
