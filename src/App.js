import React, { useEffect, useState } from "react";
import { Provider } from "react-redux";
import store from './redux/store'
import {Routes, Route, Navigate } from "react-router-dom";
import DesignTemplate from "./components/DesignTemplate";
import ModeToggle from "./components/ModeToggle";
import SimpleCookiePreference from "./components/SimpleCookiePreference";
import ConfirmEmail from "./pages/ConfirmEmail";
import EditProfile from "./pages/EditProfile";
import ErrorPage from "./pages/ErrorPage";
import HomePage from "./pages/HomePage";
import IndexPage from "./frontend_page/IndexPage";
import InitiateWithdrawal from "./pages/InitiateWithdrawal";
import Invest from "./pages/Invest";
import InvestmentHistory from "./pages/InvestmentHistory";
import LoginPage from "./pages/LoginPage";
import MyReferrals from "./pages/MyReferrals";
import PaymentInvoice from "./pages/PaymentInvoice";
import Profile from "./pages/Profile";
import ReferralWithdrawal from "./pages/ReferralWithdrawal";
import RegisterPage from './pages/RegisterPage'
import ResetPassword from "./pages/ResetPassword";
import SiteSettings from "./pages/SiteSettings";
import VerifyToken from "./pages/VerifyToken";
import WithdrawalHistory from "./pages/WithdrawalHistory";
import VerifyNewAccount from "./pages/VerifyNewAccount";
import AdminAccessPage from "./pages/AdminAccessPage";
import API_TOKEN from "./token";
import CryptoPurchase from "./pages/CryptoPurchase";
import ProcessCryptoPurchase from "./pages/ProcessCryptoPurchase";
import CryptoPurchaseInvoice from "./pages/CryptoPurchaseInvoice";
import PurchasedCryptoHistory from "./pages/PurchasedCryptoHistory";
import WalletSetup from "./pages/WalletSetup";
import ViewUserWallets from "./pages/ViewUserWallets";
import EditUserWallet from "./pages/EditUserWallet";
import Earnings from "./pages/Earnings";
import EarningsHistory from "./pages/EarningsHistory";
import Dashboard from "./admin_page/Dashboard";
import ConfirmTransaction from "./admin_page/ConfirmTransaction";
import TransactionHistory from "./admin_page/TransactionHistory";
import AddInterest from "./admin_page/AddInterest";
import Payout from "./admin_page/Payout";
import PayoutHistory from "./admin_page/PayoutHistory";
import PayoutProcessor from "./admin_page/PayoutProcessor";
import UsersAccount from "./admin_page/UsersAccount";
import ViewUserProfile from "./admin_page/ViewUserProfile";
import CreatePlan from "./admin_page/CreatePlan";
import ViewPlans from "./admin_page/ViewPlans";
import EditPlan from "./admin_page/EditPlan";
import CreateSystemWallet from "./admin_page/CreateSystemWallet";
import ViewSystemWallet from "./admin_page/ViewSystemWallet";
import EditSystemWallet from "./admin_page/EditSystemWallet";
import PostNews from "./admin_page/PostNews";

const App = () => {
  const [loggedIn, setLoggedIn] = useState(null)

  useEffect(() => {
    API_TOKEN ? setLoggedIn(true) : setLoggedIn(false);
  }, [])

  return (
    <Provider store={store}>
      <SimpleCookiePreference />
      <ModeToggle />
        {loggedIn !== null && 
          <Routes>
            <Route path="/" element={<IndexPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/page-not-found" element={<ErrorPage />} />
            <Route path="/verify-account/:user_id" element={<VerifyNewAccount />} />
            <Route path="/confirm-email" element={<ConfirmEmail />} />
            <Route path="/verify-token/:user_id" element={<VerifyToken />} />
            <Route path="/reset-password/:user_id" element={<ResetPassword />} />
            <Route path="/admin-access" element={<AdminAccessPage />} />

            {!loggedIn && (
              <>
                <Route path="/login" element={<LoginPage />} />
              </>
            )}

            {loggedIn && (
              <>
                <Route path="/dashboard" element={<DesignTemplate><HomePage/></DesignTemplate>}/>
                <Route path="/profile" element={<DesignTemplate><Profile/></DesignTemplate>} />
                <Route path="/edit-profile" element={<DesignTemplate><EditProfile/></DesignTemplate>} />
                <Route path="/invest" element={<DesignTemplate><Invest/></DesignTemplate>} />
                <Route path="/payment-invoice/:unique_id" element={<DesignTemplate><PaymentInvoice/></DesignTemplate>} />
                <Route path="/invest-history" element={<DesignTemplate><InvestmentHistory/></DesignTemplate>} />
                <Route path="/create-earning" element={<DesignTemplate><Earnings/></DesignTemplate>} />
                <Route path="/earning-history" element={<DesignTemplate><EarningsHistory/></DesignTemplate>} />
                <Route path="/crypto-purchase" element={<DesignTemplate><CryptoPurchase/></DesignTemplate>} />
                <Route path="/process-crypto-purchase/:unique_id" element={<DesignTemplate><ProcessCryptoPurchase/></DesignTemplate>} />
                <Route path="/crypto-purchase-inovice/:unique_id" element={<DesignTemplate><CryptoPurchaseInvoice/></DesignTemplate>} />
                <Route path="/purchased-crypto-history" element={<DesignTemplate><PurchasedCryptoHistory/></DesignTemplate>} />
                <Route path="/initate-withdrawal" element={<DesignTemplate><InitiateWithdrawal/></DesignTemplate>} />
                <Route path="/withdrawal-history" element={<DesignTemplate><WithdrawalHistory/></DesignTemplate>} />
                <Route path="/my-referrals" element={<DesignTemplate><MyReferrals/></DesignTemplate>} />
                <Route path="/comission-withdraw" element={<DesignTemplate><ReferralWithdrawal/></DesignTemplate>} />
                <Route path="/wallet-setup" element={<DesignTemplate><WalletSetup/></DesignTemplate>} />
                <Route path="/view-wallets" element={<DesignTemplate><ViewUserWallets/></DesignTemplate>} />
                <Route path="/edit-user-wallets/:unique_id" element={<DesignTemplate><EditUserWallet/></DesignTemplate>} />
                <Route path="/site-settings" element={<DesignTemplate><SiteSettings/></DesignTemplate>} />

                <Route path="/admin-dashboard" element={<DesignTemplate><Dashboard/></DesignTemplate>} /> 
                <Route path="/confirm-transaction" element={<DesignTemplate><ConfirmTransaction/></DesignTemplate>} /> 
                <Route path="/transaction-history" element={<DesignTemplate><TransactionHistory/></DesignTemplate>} /> 
                <Route path="/add-interest" element={<DesignTemplate><AddInterest/></DesignTemplate>} /> 
                <Route path="/payouts" element={<DesignTemplate><Payout/></DesignTemplate>} /> 
                <Route path="/payout-processor/:unique_id" element={<DesignTemplate><PayoutProcessor/></DesignTemplate>} /> 
                <Route path="/payouts-history" element={<DesignTemplate><PayoutHistory/></DesignTemplate>} /> 
                <Route path="/users-account" element={<DesignTemplate><UsersAccount/></DesignTemplate>} /> 
                <Route path="/view-profile/:unique_id" element={<DesignTemplate><ViewUserProfile/></DesignTemplate>} /> 
                <Route path="/post-news" element={<DesignTemplate><PostNews/></DesignTemplate>} /> 
                <Route path="/create-plan" element={<DesignTemplate><CreatePlan/></DesignTemplate>} /> 
                <Route path="/view-plan" element={<DesignTemplate><ViewPlans/></DesignTemplate>} /> 
                <Route path="/edit-plan/:unique_id" element={<DesignTemplate><EditPlan/></DesignTemplate>} /> 
                <Route path="/add-system-wallet" element={<DesignTemplate><CreateSystemWallet/></DesignTemplate>} /> 
                <Route path="/view-system-wallet" element={<DesignTemplate><ViewSystemWallet/></DesignTemplate>} /> 
                <Route path="/edit-wallets/:unique_id" element={<DesignTemplate><EditSystemWallet/></DesignTemplate>} />
              </>
            )} 
            <Route path='*' element={<Navigate to={loggedIn ? "/dashboard" : "/login"} />} />
          </Routes>
        }
    </Provider>
  );
}

export default App;
