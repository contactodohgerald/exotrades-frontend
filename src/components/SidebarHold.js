import { List, useDisclosure } from '@chakra-ui/react';
import React from 'react';
import {
    FiHome,
    FiTrendingUp,
    FiCompass,
    FiSettings,
    FiUser,
    FiUserCheck,
    FiDivide,
    FiChevronsLeft,
    FiChevronsRight,
    FiDownload,
    FiX,
    FiAirplay,
    FiActivity,
    FiAnchor,
    FiAlertOctagon,
    FiAlertTriangle,
    FiArchive,
  } from 'react-icons/fi';
import Loader from './Loader';
import LogoutModal from './LogoutModal';
import NavItem from './NavItem';

function SidebarHold({ users }) {
    
    const { isOpen, onOpen, onClose } = useDisclosure()
    return users === null ? <Loader/> : users.account_type === 'user' ? (
        <List>
            <NavItem icon={FiHome} url_to={'/dashboard'}>Dashboard</NavItem>
            <NavItem icon={FiUser} url_to={'/profile'}>View Profile</NavItem>
            <NavItem icon={FiUserCheck} url_to={'/edit-profile'}>Edit Profile</NavItem>
            <NavItem icon={FiChevronsRight} url_to={'/invest'}>Make Investment</NavItem>
            <NavItem icon={FiDivide} url_to={'/invest-history'}>Investment History</NavItem>
            <NavItem icon={FiAlertTriangle} url_to={'/create-earning'}>Earnings</NavItem>
            <NavItem icon={FiArchive} url_to={'/earning-history'}>Earnings History</NavItem>
            <NavItem icon={FiAlertOctagon} url_to={'/crypto-purchase'}>Crypto Purchase</NavItem>
            <NavItem icon={FiAnchor} url_to={'/purchased-crypto-history'}>Purchased History</NavItem>
            <NavItem icon={FiChevronsLeft} url_to={'/initate-withdrawal'}>Initaite Withdrawal</NavItem>
            <NavItem icon={FiDownload} url_to={'/withdrawal-history'}>Withdrawal History</NavItem>
            <NavItem icon={FiTrendingUp} url_to={'/my-referrals'}>Referrals</NavItem>
            <NavItem icon={FiCompass} url_to={'/comission-withdraw'}>Referrals Withdraw</NavItem>
            <NavItem icon={FiActivity} url_to={'/wallet-setup'}>Add Wallet</NavItem>
            <NavItem icon={FiAirplay} url_to={'/view-wallets'}>View Wallets</NavItem>
            <NavItem icon={FiX} url_to={'#'} onClick={onOpen}>Logout</NavItem>
            <LogoutModal isOpen={isOpen} onClose={onClose}   />
        </List>
    ) : (
        <List >
            <NavItem icon={FiHome} url_to={'/admin-dashboard'}>Dashboard</NavItem>
            <NavItem icon={FiUser} url_to={'/profile'}>View Profile</NavItem>
            <NavItem icon={FiUserCheck} url_to={'/edit-profile'}>Edit Profile</NavItem>
            <NavItem icon={FiChevronsRight} url_to={'/confirm-transaction'}>Confirm Investment</NavItem>
            <NavItem icon={FiDivide} url_to={'/transaction-history'}>Investment History</NavItem>
            <NavItem icon={FiAlertTriangle} url_to={'/add-interest'}>Add Interest</NavItem>
            <NavItem icon={FiArchive} url_to={'/payouts'}>Payouts</NavItem>
            <NavItem icon={FiAlertOctagon} url_to={'/payouts-history'}>Payout History</NavItem>
            <NavItem icon={FiAirplay} url_to={'/users-account'}>User's Account</NavItem>
           
            <NavItem icon={FiSettings} url_to={'/site-settings'}>Settings</NavItem>

            <NavItem icon={FiCompass} url_to={'/post-news'}>Post News</NavItem>
            <NavItem icon={FiActivity} url_to={'/add-system-wallet'}>Add Wallet</NavItem>
            <NavItem icon={FiAirplay} url_to={'/view-system-wallet'}>View Wallet</NavItem>
            <NavItem icon={FiAnchor} url_to={'/create-plan'}>Add Plan</NavItem>
            <NavItem icon={FiChevronsLeft} url_to={'/view-plan'}>View Plans</NavItem>
            <NavItem icon={FiX} url_to={'#'} onClick={onOpen}>Logout</NavItem>
            <LogoutModal isOpen={isOpen} onClose={onClose}   />
        </List>
    );
}

export default SidebarHold;
