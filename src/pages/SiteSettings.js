import { 
    Divider,
    Heading,
    Stack, 
    Tab, 
    TabList, 
    TabPanel, 
    TabPanels, 
    Tabs 
} from '@chakra-ui/react';
import React from 'react';
import AdvanceSiteSettings from '../components/AdvanceSiteSettings';
import BasicSiteSettings from '../components/BasicSiteSettings';
import BreadCrumb from '../components/BreadCrumb';
import PrimaryCard from '../components/PrimaryCard';

function SiteSettings() {
    const links = [
        {
            url: '/dashboard',
            value: 'Dashboard',
        },
        {
            url: '/site-settings',
            value: 'Settings',
        },
    ]
    return (
        <Stack>
            <BreadCrumb links={links} />
            <PrimaryCard>
                 <Tabs variant={'enclosed'}>
                    <TabList>
                        <Tab>Basic Site Settings</Tab>
                        <Tab>Advance Site Settings</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <Heading size='md'>Basic Site Settings</Heading>
                            <Divider />
                            <BasicSiteSettings />
                        </TabPanel>
                        <TabPanel>
                            <Heading size='md'>Advance Site Settings</Heading>
                            <Divider />
                            <AdvanceSiteSettings />
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </PrimaryCard>
        </Stack>
    );
}

export default SiteSettings;
