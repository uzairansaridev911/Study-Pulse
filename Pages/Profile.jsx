import React, { useState, useRef, useEffect } from 'react';
import { db } from '../src/Firebase';
import { Link } from 'react-router-dom'
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useContext } from 'react';
import { UserContext } from '../Context/UserContext';
import gsap from 'gsap';
import { useUser, useClerk } from '@clerk/clerk-react';
import { FaHome, FaUser, FaCog, FaEnvelope, FaSignOutAlt, FaBars, FaUserFriends } from 'react-icons/fa';

// ─── Sidebar ────────────────────────────────────────────────────────────────
const Dashsidebar = ({setShowLogoutModal}) => {
  const sidebarRef = useRef(null);
  const textsRef   = useRef([]);
  const tl         = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  
  const menuItems = [
    { icon: <FaHome  className="mr-2" />, name: 'Dashboard', path: '/Dashboard' },
    { icon: <FaUserFriends  className="mr-2" />, name: 'Friends', path: '/Profile'   },
    { icon: <FaEnvelope className="mr-2" />, name: 'Messages', path: '#msg' },
    { icon: <FaCog   className="mr-2" />, name: 'Settings', path: '#setting'  },
    { icon: <FaSignOutAlt className="mr-2" />, name: 'Logout' },
  ];

  useEffect(() => {
    tl.current = gsap.timeline({ paused: true });
    tl.current.to(sidebarRef.current, { width: 240, duration: 0.8, ease: 'power1.out' });
    textsRef.current.forEach((text, i) => {
      tl.current.fromTo(
        text,
        { opacity: 0, x: -10 },
        { opacity: 1, x: 0, duration: 0.7, ease: 'power1.out' },
        i * 0.05 + 0.1
      );
    });
    return () => { if (tl.current) tl.current.kill(); };
  }, []);

  

  useEffect(() => {
    const sidebar    = sidebarRef.current;
    const isHoverable = window.matchMedia('(hover: hover)').matches;
    const onEnter = () => { if (isHoverable && !isOpen) tl.current.play();    };
    const onLeave = () => { if (isHoverable && !isOpen) tl.current.reverse(); };
    sidebar.addEventListener('mouseenter', onEnter);
    sidebar.addEventListener('mouseleave', onLeave);
    return () => {
      sidebar.removeEventListener('mouseenter', onEnter);
      sidebar.removeEventListener('mouseleave', onLeave);
    };
  }, [isOpen]);

  const toggleSidebar = (e) => {
    e.stopPropagation();
    if (isOpen) { tl.current.reverse(); setIsOpen(false); }
    else        { tl.current.play();    setIsOpen(true);  }
  };

  const handleItemClick = (item) => {
  if (item.name === 'Logout') {
    setShowLogoutModal(true); // 👈 modal open
  }
};

  return (
    <div
      ref={sidebarRef}
      className="fixed left-0 top-0 z-50 h-screen w-16 bg-gradient-to-b from-slate-900 to-slate-950 text-slate-200 overflow-hidden shadow-2xl shadow-black/40 group flex-shrink-0"
    >
      {/* Header / toggle */}
      <div
        onClick={toggleSidebar}
        className="flex items-center h-20 px-4 border-b border-slate-800/60 cursor-pointer hover:bg-slate-800/30 transition-colors"
      >
        <div className="text-2xl text-blue-400 ml-1.5"><FaBars /></div>
        <div className={`ml-4 text-xl font-bold tracking-tight transition-opacity duration-300 whitespace-nowrap
          ${isOpen ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
           StudyPulse
        </div>
      </div>

      <ul className="pt-6 space-y-1.5 px-2">
        {menuItems.map((item, idx) => (
          <li
            key={idx}
            className="group/item relative rounded-lg overflow-hidden hover:bg-slate-800/50 transition-colors duration-200"
          >
            {item.name === 'Logout' ? (
  <div
    onClick={() => setShowLogoutModal(true)}
    className="flex items-center px-4 py-3.5 cursor-pointer"
  >
    <span className="text-xl min-w-[28px] flex justify-center">{item.icon}</span>
    <span
      ref={el => (textsRef.current[idx] = el)}
      className="ml-4 text-sm font-medium opacity-0 whitespace-nowrap"
    >
      {item.name}
    </span>
  </div>
) : (
  <Link to={item.path} className="flex items-center px-4 py-3.5">
    <span className="text-xl min-w-[28px] flex justify-center">{item.icon}</span>
    <span
      ref={el => (textsRef.current[idx] = el)}
      className="ml-4 text-sm font-medium opacity-0 whitespace-nowrap"
    >
      {item.name}
    </span>
  </Link>
)}
            <div className="absolute left-0 top-0 h-full w-1 bg-blue-500 scale-y-0 origin-top group-hover/item:scale-y-100 transition-transform duration-300" />
          </li>
        ))}
      </ul>
    </div>
  );
};

// ─── Profile ────────────────────────────────────────────────────────────────
const Profile = () => {
  const {signOut} = useClerk();
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '',
    phone: '', country: '', postalCode: ''
  });

    const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { user, isLoaded: clerkLoaded } = useUser();
  const { setUserData }           = useContext(UserContext);
  const [loading, setLoading]     = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const fileInputRef      = useRef(null);
  const profileSectionRef = useRef(null);
  const formSectionRef    = useRef(null);

 // Profile component ke andar fetchProfile function ko aisay update karein:
useEffect(() => {
    const fetchProfile = async () => {
      if (!clerkLoaded || !user) return;
      try {
        const docRef = doc(db, 'users', user.id); 
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFormData({
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            email: data.email || '',
            phone: data.phone || '',
            country: data.country || '',
            postalCode: data.postalCode || ''
          });
          setProfileImage(data.profileImage || null);
        } else {
          setFormData(prev => ({
            ...prev,
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            email: user.primaryEmailAddress?.emailAddress || ''
          }));
        }
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };
    fetchProfile();
  }, [clerkLoaded, user]);

  // 2. Animation Logic (Yahan brackets ka masla tha)
  useEffect(() => {
    if (profileSectionRef.current) {
      profileSectionRef.current.style.opacity = '0';
      profileSectionRef.current.style.transform = 'translateY(30px)';
      setTimeout(() => {
        profileSectionRef.current.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        profileSectionRef.current.style.opacity = '1';
        profileSectionRef.current.style.transform = 'translateY(0)';
      }, 100);
    }
    if (formSectionRef.current) {
      formSectionRef.current.style.opacity = '0';
      formSectionRef.current.style.transform = 'translateY(30px)';
      setTimeout(() => {
        formSectionRef.current.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        formSectionRef.current.style.opacity = '1';
        formSectionRef.current.style.transform = 'translateY(0)';
      }, 300);
    }
  }, []); // Ye empty dependency array ke sath alag se chalega

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageClick = () => { fileInputRef.current.click(); };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1048576) {
        alert('Image size must be less than 1MB');
        e.target.value = '';
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => { setProfileImage(event.target.result); };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges   = () => { setShowConfirmModal(true); };

  const handleConfirmSave = async () => {
    if (!user) return;
    setLoading(true);
    setShowConfirmModal(false);
    try {
      const newUpdate = { ...formData, profileImage, updatedAt: new Date() };
      await setDoc(doc(db, 'users', user.id), newUpdate);
      setUserData(newUpdate);
      alert('Saved!');
    } catch (error) {
      console.error('Error:', error);
      alert('Save karne mein masla aya!');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      // 1. Properly sign out from Clerk (This kills the session)
      await signOut(); 
      
      // 2. Clear any of your own local data
      localStorage.clear();
      sessionStorage.clear();

      // 3. Redirect to your Home route
      navigate('/');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">

      {/* ── Sidebar ── */}
      <Dashsidebar setShowLogoutModal={setShowLogoutModal}/>

      {/* ── Main content — left padding = sidebar collapsed width (w-16 = 64px) ── */}
      <div className="flex-1 pl-16 overflow-y-auto min-w-0">
        <div className="max-w-4xl mx-auto p-4 sm:p-8 lg:p-12">

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Profile Settings
            </h1>
            <p className="text-gray-500 text-sm sm:text-base">Manage your account information</p>
          </div>

          {/* Card */}
          <div
            ref={profileSectionRef}
            className="bg-white rounded-3xl shadow-lg p-4 sm:p-8 mb-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300"
          >
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8">Personal Details</h2>

            {/* Avatar row */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8 pb-8 border-b border-gray-100">
              <div className="relative flex-shrink-0">
                <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center text-white shadow-xl ring-4 ring-white">
                  {profileImage ? (
                    <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  )}
                </div>
                <button
                  onClick={handleImageClick}
                  className="absolute bottom-1 right-1 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 ring-4 ring-white"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
              </div>
              <div className="text-center sm:text-left">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">Upload Profile Picture</h3>
                <p className="text-xs sm:text-sm text-gray-500 mb-3">JPG, PNG. Max size 1MB</p>
                <div className="flex items-center justify-center sm:justify-start gap-2 text-xs text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Click the pencil icon to update</span>
                </div>
              </div>
            </div>

            {/* Form grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {[
                { label: 'First Name',    name: 'firstName',  type: 'text',  color: 'blue'   },
                { label: 'Last Name',     name: 'lastName',   type: 'text',  color: 'purple' },
                { label: 'Email Address', name: 'email',      type: 'email', color: 'blue'   },
                { label: 'Phone Number',  name: 'phone',      type: 'tel',   color: 'purple' },
                { label: 'Country',       name: 'country',    type: 'text',  color: 'blue'   },
                { label: 'Postal Code',   name: 'postalCode', type: 'text',  color: 'purple' },
              ].map(({ label, name, type, color }) => (
                <div key={name} className="group">
                  <label className={`block text-sm font-bold text-gray-700 mb-2 group-hover:text-${color}-600 transition-colors duration-200`}>
                    {label}
                  </label>
                  <input
                    type={type}
                    name={name}
                    value={formData[name]}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-${color}-500 focus:border-transparent transition-all duration-200 hover:border-${color}-300 text-sm sm:text-base`}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Save */}
          <div className="flex justify-end">
            <button
              onClick={handleSaveChanges}
              disabled={loading}
              className="px-8 sm:px-10 py-3 sm:py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-xl hover:from-blue-600 hover:to-purple-700 active:scale-95 transition-all duration-300 shadow-lg hover:shadow-2xl hover:-translate-y-1 text-sm sm:text-base"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>

          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
        </div>
      </div>

      {/* ── Confirm Modal ── */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[60] p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 sm:p-8">
            <div className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full mx-auto mb-6 ring-8 ring-blue-50">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 text-center mb-3">Confirm Changes</h3>
            <p className="text-gray-600 text-center mb-6 sm:mb-8 text-sm sm:text-base">
              Do you want to make changes to your profile? This will update your personal information.
            </p>
            <div className="flex gap-3 sm:gap-4">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 px-4 sm:px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSave}
                className="flex-1 px-4 sm:px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-xl hover:from-blue-600 hover:to-purple-700 active:scale-95 transition-all duration-200 shadow-lg text-sm sm:text-base"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Logout Modal */}
           {showLogoutModal && (
             <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
               <div className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm" onClick={() => setShowLogoutModal(false)}></div>
               <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-sm w-full relative z-10 shadow-2xl">
                 <div className="text-center">
                   <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                     <FaSignOutAlt size={24} />
                   </div>
                   <h3 className="text-xl font-bold text-gray-900 mb-2">Logout?</h3>
                   <p className="text-gray-500 mb-6">Do you really want to logout?</p>
                   <div className="flex space-x-3">
                     <button onClick={() => setShowLogoutModal(false)} className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200">Stay</button>
                     <button onClick={handleLogout} className="flex-1 px-4 py-2 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700">Logout</button>
                   </div>
                 </div>
               </div>
             </div>
           )}
    </div>
  );
};

export default Profile;