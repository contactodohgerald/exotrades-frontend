import {  
    Divider,
    Heading,
    Stack, 
    Tab, 
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
} from '@chakra-ui/react';
import React from 'react';
import BasicProfileEdit from '../components/BasicProfileEdit';
import BreadCrumb from '../components/BreadCrumb';
import PasswordEdit from '../components/PasswordEdit';
import PrimaryCard from '../components/PrimaryCard';

function EditProfile() {
    

    const links = [
        {
            url: '/dashboard',
            value: 'Dashboard',
        },
        {
            url: '/edit-profile',
            value: 'Edit Profile',
        },
    ]
    return (
        <Stack>
            <BreadCrumb links={links} />
            <PrimaryCard>
               <Tabs variant={'enclosed'}>
                   <TabList>
                       <Tab>Basic Setting</Tab>
                       <Tab>Password Update</Tab>
                   </TabList>
                   <TabPanels>
                       <TabPanel>
                           <Heading>Basic Setting</Heading>
                           <Divider />
                           <BasicProfileEdit />
                       </TabPanel>
                       <TabPanel>
                           <Heading>Update Password</Heading>
                           <Divider />
                           <PasswordEdit />
                       </TabPanel>
                   </TabPanels>
               </Tabs>
            </PrimaryCard>
        </Stack>
    );
}

export default EditProfile;
