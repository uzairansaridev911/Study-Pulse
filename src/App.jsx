import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from '../Pages/Home'
import Login from '../Pages/Login'
import Signup from '../Pages/Signup'
import Forgotten from '../Pages/Forgotten'
import About from '../Pages/About'
import Services from '../Pages/Services'
import Contact from '../Pages/Contact'
import LearnMore from '../Pages/lm'
import Dashboard from '../Pages/Dashboard'
import Profile from '../Pages/Profile'
import OTPVerification from '../Pages/OTPVerification'
import ChangePassword from '../Pages/ChangePass'
import Courses from '../Pages/Courses'
import Settings from '../Pages/Settings'
import { Link, useLocation } from 'react-router-dom'
import LocomotiveScroll from 'locomotive-scroll';
import Thanks from '../Pages/Thanks';
import People from '../Pages/People';
import Notifications from '../Pages/Notifications';
import { UserProvider } from '../Context/UserContext'
import { useEffect } from 'react';
import { messaging, db } from './Firebase'; // Sahi path check kar lena
import { getToken, onMessage } from 'firebase/messaging';
import { doc, updateDoc } from 'firebase/firestore';
import { useUser } from '@clerk/clerk-react';

const locomotiveScroll = new LocomotiveScroll();
const App = () => {

  const location = useLocation();
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser();

 useEffect(() => {
    if (!clerkLoaded || !clerkUser) return;

    const requestNotificationPermission = async () => {
      try {
        // 1. Browser permission check
        const permission = await Notification.requestPermission();
        
        if (permission === 'granted') {
          console.log('Notification permission granted.');
          
          // 2. Register Service Worker
          const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
          console.log('Service Worker registration checked:', registration);
          
          // 🔥 FIX: Wait completely until the service worker is active
          // Agar worker installing ya waiting stage mein hai, toh pehle uske ready hone ka wait karo
          if (!registration.active) {
            console.log('Waiting for Service Worker to become active...');
            await new Promise((resolve) => {
              const worker = registration.installing || registration.waiting;
              if (worker) {
                worker.addEventListener('statechange', (e) => {
                  if (e.target.state === 'activated') {
                    console.log('Service Worker manually activated!');
                    resolve();
                  }
                });
              } else {
                // Background ready fallback
                navigator.serviceWorker.ready.then(() => resolve());
              }
            });
          }

          // 3. Securely fetch token now that the worker is 100% active
          const token = await getToken(messaging, { 
            vapidKey: 'BPCjZRSt5hiBucxA0l_O2PokgbbyF1g52BNKG3ZpLfNP7tOe5-Nco1aAgn-u4xs-LeRBoNL6HcTrSCCMBoGeYZc',
            serviceWorkerRegistration: registration 
          });

          if (token) {
            console.log('FCM Token generated successfully:', token);
            await updateDoc(doc(db, 'users', clerkUser.id), {
              fcmToken: token
            });
            // The service worker will now rely purely on FCM background messages.
          } else {
            console.log('No registration token available.');
          }
        }
      } catch (error) {
        console.error('An error occurred while retrieving token:', error);
      }
    };

    requestNotificationPermission();

    // Foreground Message Handler: FORCE SOUND TRIGGER
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log('Message received in foreground: ', payload);

      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
          const audioCtx = new AudioContext();
          
          fetch('/notification.mp3')
            .then(response => response.arrayBuffer())
            .then(arrayBuffer => audioCtx.decodeAudioData(arrayBuffer))
            .then(audioBuffer => {
              const soundSource = audioCtx.createBufferSource();
              soundSource.buffer = audioBuffer;
              soundSource.connect(audioCtx.destination);
              soundSource.start();
              console.log("🔊 Web Audio API: Force played successfully!");
            })
            .catch(ae => {
              console.log("Regular fetch play failed, falling back to standard element...", ae);
              const fallbackAudio = new Audio('/notification.mp3');
              fallbackAudio.play().catch(err => console.log("Standard audio blocked:", err));
            });
        }
      } catch (e) {
        console.error("Audio Context initialization failed:", e);
      }

      if (Notification.permission === 'granted') {
        new Notification(payload.notification?.title || 'Study Pulse Alert', {
          body: payload.notification?.body || '',
          icon: payload.notification?.image || '/logo192.png'
        });
      }
    });

    return () => unsubscribe();
  }, [clerkLoaded, clerkUser]);
  return (
    <div>
      <UserProvider>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/Login' element={<Login />} />
          <Route path='/Signup' element={<Signup />} />
          <Route path='/ForgottenPassword' element={<Forgotten />} />
          <Route path='/About' element={<About />} />
          <Route path='/Services' element={<Services />} />
          <Route path='/Contact' element={<Contact />} />
          <Route path='/Learnmore' element={<LearnMore />} />
          <Route path='/otp' element={<OTPVerification />} />
          <Route path='/Dashboard' element={<Dashboard />} />
          <Route path='/Profile' element={<Profile />} />
          <Route path='/Thanks' element={<Thanks />} />
          <Route path='/Change_Password' element={<ChangePassword />} />
          <Route path='/Courses' element={<Courses />} />
          <Route path='/Settings' element={<Settings />} />
          <Route path='/People' element={<People />} />
          <Route path='/Notifications' element={<Notifications/>}/>

          <Route
            path='*'
            element = {
              <div style={{ padding: 24, fontFamily: 'system-ui, sans-serif' }}>
                <h2 style={{ fontSize: 20, fontWeight: 700 }}>Route not found</h2>
                <p style={{ marginTop: 8 }}>
                  Current path: <code>{location?.pathname}</code>
                </p>
                <p style={{ marginTop: 12 }}>
                  Try: <Link to="/otp">/otp</Link> or <Link to="/Login">/Login</Link>
                </p>
              </div>
            }
          />
        </Routes>
      </UserProvider>
    </div>
  )
}

export default App;