import React, { useEffect, useState } from 'react';
import { Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../store/firebase';
import { ref, onValue } from 'firebase/database';
import HomePage from '../components/Home';
import Dashboard from '../components/DashBoard/Dashboard';
import LoginPage from '../components/Signin';
import Landing from '../components/Landing/Landing';
import Validate from '../components/validate';
import Admin from '../components/admin/admin';
import Profile from '../components/Profile';
import Website from '../components/Website';
import WAbout from '../components/Website/AboutUs';
import WContact from '../components/Website/ContactUs';
import WFolio from '../components/Website/Folio';
import Shamba from '../components/Shamba/public';
import Folio from '../components/Folio/public'; // Import the Folio component
import { useSelector, useDispatch } from "react-redux";
import { updateDB, updateDBPath, setSelectedApp, setSelectedAppID, setSelectedAppData } from '../store/Actions';

const AppRoutes = () => {
  const [user] = useAuthState(auth);
  const DB1 = useSelector((state) => state.app.DB1);
  const dispatch = useDispatch();  
  const [rfolio, setFolio] = useState(false);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const isEmailSent = queryParams.get('email') === 'sent';

  // useEffect(() => {
  //   const retrieveDomainData = async () => {
  //     const domainKey = domain.replace(/[.#$/\[\]]/g, '_');
      
  //     console.log('domain_check:', `${DB1}/domains/${domainKey}`);
  //     const domainsRef = ref(db, `${DB1}/domains/${domainKey}`);

  //     onValue(domainsRef, (snapshot) => {
  //       if (snapshot.exists()) {
  //         let dbData = snapshot.val();
  //         dispatch(updateDB(dbData.db));
  //         console.log('dbData:', dbData);
  //         // Conditionally set the default view based on dbData.type
  //         if (dbData.type === 'folio') {
  //           console.log('folio:', dbData);
  //           // setDefaultElem ent(<Folio />);
  //           setFolio(true)
  //         }
  //       }
  //     });
  //   };
  //   retrieveDomainData();
  // }, [DB1, domain]);

  useEffect(() => {
    const domain = window.location.hostname;
    console.log('hostname: ', domain);

    // Function to check if the domain is localhost
    const isLocalhost = () => {
      return domain === 'localhost' || domain === '127.0.0.1';
    };

    // Set the default route based on whether the domain is localhost or not
    if (isLocalhost()) {
      setFolio(false);
    } else {
      setFolio(true);
    }
  }, []);

  return (
    <Routes basename={'home'}>
      <Route path="/" element={rfolio ? <Website /> : (user ? <Landing /> : <Landing />)} />
      <Route path="/Website/about" element={rfolio ? <WAbout /> : <WAbout />} />
      <Route path="/Website/contact" element={rfolio ? <WContact /> : <WContact />} />
      <Route path="/Website/folio" element={rfolio ? <WFolio /> : <WFolio />} />
      <Route path="/Website/" element={rfolio ? <Website /> : <Website />} />
      <Route path="/public" element={rfolio ? <Folio /> : <Folio />} />
      <Route path="/home" element={user ? <Landing /> : <Landing />} />
      <Route path="/dashboard" element={user ? <Dashboard /> : <Landing />} />
      <Route path="/shamba" element={user ? <Shamba /> : <Shamba />} />
      <Route path="/dashboard/users" element={user ? <Dashboard /> : <Landing />} />
      <Route path="/signin" element={!user ? <LoginPage /> : <LoginPage />} />
      <Route
        path="/signin"
        element={!user ? <LoginPage isEmailSent={isEmailSent} /> : <LoginPage />}
      />
      <Route path="/landing" element={!user ? <Landing /> : <Landing />} />
      <Route path="/validate" element={!user ? <Validate /> : <Validate />} />
      <Route path="/admin" element={!user ? <LoginPage /> : <Admin />} />
      <Route path="/profile1" element={!user ? <LoginPage /> : <Profile />} />
    </Routes>
  );
};

export default AppRoutes;
