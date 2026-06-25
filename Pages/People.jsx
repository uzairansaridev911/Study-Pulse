import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClerk, useUser } from '@clerk/clerk-react';
import {
  FaThLarge, FaUsers, FaSearch, FaUserPlus, FaUserCheck,
  FaSignOutAlt, FaHome, FaBook, FaChartBar, FaCog,
  FaChevronDown, FaLaptop, FaTerminal, FaCode, FaPaintBrush,
  FaFilter, FaTimes, FaRegFrown
} from 'react-icons/fa';
import { db, messaging } from '../src/Firebase';
import {
  collection, getDocs, doc, getDoc,
  setDoc, deleteDoc, onSnapshot, serverTimestamp
} from 'firebase/firestore';
import { UserContext } from '../Context/UserContext';
import { triggerExit } from './transition';

/* ─────────────────────────────────────────────
   PRESENCE SYSTEM
   Each user writes their UID to:
   presence/{uid} = { online: true, lastSeen: serverTimestamp() }
   on mount and clears on unmount.
   We listen to presence/{uid} for each card.
───────────────────────────────────────────── */

const usePresence = (currentUserId) => {
  const presenceRef = useRef(null);

  useEffect(() => {
    if (!currentUserId) return;

    const ref = doc(db, 'presence', currentUserId);
    presenceRef.current = ref;

    // Mark online
    setDoc(ref, { online: true, lastSeen: serverTimestamp() });

    // Mark offline on tab close / navigate away
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        setDoc(ref, { online: false, lastSeen: serverTimestamp() });
      } else {
        setDoc(ref, { online: true, lastSeen: serverTimestamp() });
      }
    };

    const handleBeforeUnload = () => {
      setDoc(ref, { online: false, lastSeen: serverTimestamp() });
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      setDoc(ref, { online: false, lastSeen: serverTimestamp() });
    };
  }, [currentUserId]);
};

/* Single user's online status listener */
const useUserOnline = (uid) => {
  const [online, setOnline] = useState(false);

  useEffect(() => {
    if (!uid) return;
    const ref = doc(db, 'presence', uid);
    const unsub = onSnapshot(ref, (snap) => {
      setOnline(snap.exists() ? snap.data().online === true : false);
    });
    return unsub;
  }, [uid]);

  return online;
};

/* ─────────────────────────────────────────────
   ONLINE DOT
───────────────────────────────────────────── */
const OnlineDot = ({ uid }) => {
  const online = useUserOnline(uid);
  if (!online) return null;
  return (
    <span className="absolute bottom-0.5 right-0.5 flex h-3.5 w-3.5">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
      <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white" />
    </span>
  );
};

/* ─────────────────────────────────────────────
   AVATAR
───────────────────────────────────────────── */
const Avatar = ({ user, size = 'md' }) => {
  const sizeMap = { sm: 'w-10 h-10 text-sm', md: 'w-16 h-16 text-xl', lg: 'w-20 h-20 text-2xl' };
  const initials = ((user?.firstName?.[0] || '') + (user?.lastName?.[0] || '')).toUpperCase() || '?';

  const gradients = [
    'from-emerald-400 to-green-600',
    'from-teal-400 to-emerald-600',
    'from-green-400 to-teal-600',
    'from-lime-400 to-green-600',
    'from-cyan-400 to-teal-600',
  ];
  const grad = gradients[(initials.charCodeAt(0) || 0) % gradients.length];

  return (
    <div className={`relative inline-flex ${sizeMap[size]}`}>
      {user?.profileImage ? (
        <img
          src={user.profileImage}
          alt={initials}
          className={`${sizeMap[size]} rounded-full object-cover ring-2 ring-white shadow-md`}
        />
      ) : (
        <div className={`${sizeMap[size]} rounded-full bg-gradient-to-br ${grad} flex items-center justify-center font-bold text-white ring-2 ring-white shadow-md`}>
          {initials}
        </div>
      )}
      <OnlineDot uid={user?.uid} />
    </div>
  );
};

/* ─────────────────────────────────────────────
   FRIEND REQUEST BUTTON
───────────────────────────────────────────── */
const FriendBtn = ({ targetUid, currentUid }) => {
  const [status, setStatus] = useState('none'); // none | sent | friends
  const { userData, setUserData } = useContext(UserContext);

  useEffect(() => {
    if (!currentUid || !targetUid) return;
    const checkStatus = async () => {
      const sentRef = doc(db, 'friendRequests', `${currentUid}_${targetUid}`);
      const friendRef = doc(db, 'friends', `${currentUid}_${targetUid}`);
      const [sentSnap, friendSnap] = await Promise.all([getDoc(sentRef), getDoc(friendRef)]);
      if (friendSnap.exists()) setStatus('friends');
      else if (sentSnap.exists()) setStatus('sent');
      else setStatus('none');
    };
    checkStatus();
  }, [currentUid, targetUid]);

 const sendRequest = async () => {
    if (!currentUid || !targetUid) return;
    
    try {
      // 1. Friend Request Registry
      const ref = doc(db, 'friendRequests', `${currentUid}_${targetUid}`);
      await setDoc(ref, { from: currentUid, to: targetUid, createdAt: serverTimestamp() });
      
      // 2. Notification Model for UI Lists (Yeh write operation hi notification trigger karega)
      const notifRef = doc(db, 'notifications', `${currentUid}_req_${targetUid}`);
      const notificationPayload = {
        userId: targetUid,              
        from: currentUid,            
        fromName: `${userData?.firstName || 'Someone'} ${userData?.lastName || ''}`, 
        fromImage: userData?.profileImage || '',                  
        type: 'friend_request',       
        title: `${userData?.firstName || 'Someone'} sent you a friend request`, 
        body: 'wants to connect with you on Study Pulse.',
        read: false,             
        createdAt: serverTimestamp()  
      };
      await setDoc(notifRef, notificationPayload);
      
      console.log("Notification entry added to Firestore successfully!");

      // 3. Trigger Free Vercel Push Notification Backend
      fetch('/api/sendPush', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetUserId: targetUid,
          title: notificationPayload.title,
          body: notificationPayload.body,
          data: {
            type: 'friend_request',
            fromUserId: currentUid
          }
        })
      }).catch(err => console.error("Failed to trigger Vercel push API", err));

      setStatus('sent');
    } catch (err) {
      console.error("Failed to execute friend request flow:", err);
    }
  };

  const cancelRequest = async () => {
    const ref = doc(db, 'friendRequests', `${currentUid}_${targetUid}`);
    await deleteDoc(ref);
    setStatus('none');
  };

  if (status === 'friends') {
    return (
      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-semibold border border-emerald-200">
        <FaUserCheck className="text-xs" /> Friends
      </div>
    );
  }

  if (status === 'sent') {
    return (
      <button
        onClick={cancelRequest}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-lg text-xs font-semibold border border-amber-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all duration-200 group"
        title="Cancel request"
      >
        <FaUserCheck className="text-xs group-hover:hidden" />
        <FaTimes className="text-xs hidden group-hover:block" />
        <span className="group-hover:hidden">Requested</span>
        <span className="hidden group-hover:inline">Cancel</span>
      </button>
    );
  }

  return (
    <button
      onClick={sendRequest}
      className="flex items-center gap-1.5 px-3 py-1.5 bg-green-700 text-white rounded-lg text-xs font-semibold hover:bg-green-800 active:scale-95 transition-all duration-200 shadow-sm shadow-green-200"
    >
      <FaUserPlus className="text-xs" /> Add friend
    </button>
  );
};

/* ─────────────────────────────────────────────
   PERSON CARD
───────────────────────────────────────────── */
const PersonCard = ({ person, currentUid, navigate, idx }) => {
  const online = useUserOnline(person.uid);

  return (
    <div
      className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col"
      style={{ animationDelay: `${idx * 60}ms` }}
    >
      {/* Top banner */}
      <div className="h-16 bg-gradient-to-r from-green-700 via-emerald-600 to-teal-600 relative">
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 80%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '24px 24px' }}
        />
        {/* online pill */}
        {/* {online && (
          <span className="absolute top-2 right-2 flex items-center gap-1 bg-white/20 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 bg-emerald-300 rounded-full animate-pulse" />
            Online
          </span>
        )} */}
      </div>

      {/* Avatar overlap */}
      <div className="flex justify-center -mt-8 mb-3">
        <Avatar user={person} size="md" />
      </div>

      {/* Info */}
      <div className="px-4 pb-4 flex flex-col flex-1 items-center text-center">
        <h3 className="font-bold text-gray-900 text-[18] leading-tight">
          {person.firstName} {person.lastName}
        </h3>
        <p className="text-xs text-gray-400 mt-2 truncate w-full">{person.email || 'study-pulse member'}</p>

        {/* Badges */}
        <div className="flex flex-wrap justify-center gap-1.5 mt-2.5 mb-3">
          {person.role && (
            <span className="text-[10px] font-semibold px-2 py-0.5 bg-green-50 text-green-700 rounded-full border border-green-100">
              {person.role}
            </span>
          )}
          {person.enrolledCourses?.length > 0 && (
            <span className="text-[10px] font-semibold px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full border border-blue-100">
              {person.enrolledCourses.length} course{person.enrolledCourses.length > 1 ? 's' : ''}
            </span>
          )}
          {/* <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${online ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-gray-50 text-gray-400 border-gray-100'}`}>
            {online ? '🟢 Active now' : '⚫ Offline'}
          </span> */}
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gray-50 mb-3" />

        {/* Action buttons */}
        <div className="flex gap-2 w-full">
          <FriendBtn targetUid={person.uid} currentUid={currentUid} />
          <button
            onClick={() => navigate(`/Profile/${person.uid}`)}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 border border-gray-200 text-gray-600 rounded-lg text-xs font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
          >
            View profile
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   SKELETON CARD
───────────────────────────────────────────── */
const SkeletonCard = () => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-pulse">
    <div className="h-16 bg-gray-200" />
    <div className="flex justify-center -mt-8 mb-3">
      <div className="w-16 h-16 rounded-full bg-gray-200 ring-2 ring-white" />
    </div>
    <div className="px-4 pb-4 flex flex-col items-center gap-2">
      <div className="h-4 bg-gray-200 rounded w-28" />
      <div className="h-3 bg-gray-100 rounded w-36" />
      <div className="flex gap-1.5 mt-1">
        <div className="h-4 bg-gray-100 rounded-full w-14" />
        <div className="h-4 bg-gray-100 rounded-full w-16" />
      </div>
      <div className="w-full h-px bg-gray-50 mt-1" />
      <div className="flex gap-2 w-full mt-1">
        <div className="h-7 bg-gray-100 rounded-lg w-24" />
        <div className="h-7 bg-gray-100 rounded-lg flex-1" />
      </div>
    </div>
  </div>
);

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
const People = () => {
  const navigate = useNavigate();
  const { signOut } = useClerk();
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser();
const { userData, setUserData } = useContext(UserContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCoursesOpen, setIsCoursesOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all'); // all | online | offline

  // Mark current user as online
  // usePresence(clerkUser?.id);

  // Load current user's data from Firestore
  useEffect(() => {
    if (!clerkLoaded || !clerkUser) return;
    const loadMe = async () => {
      if (!userData) {
        const snap = await getDoc(doc(db, 'users', clerkUser.id));
        if (snap.exists()) setUserData(snap.data());
      }
    };
    loadMe();
  }, [clerkLoaded, clerkUser]);

  // Load all users from Firestore
  useEffect(() => {
    const loadPeople = async () => {
      try {
        const snap = await getDocs(collection(db, 'users'));
        const all = [];
        snap.forEach(d => {
          if (d.id !== clerkUser?.id) {
            all.push({ uid: d.id, ...d.data() });
          }
        });
        setPeople(all);
      } catch (e) {
        console.error('Failed to load users:', e);
      } finally {
        setLoading(false);
      }
    };
    if (clerkLoaded && clerkUser) loadPeople();
  }, [clerkLoaded, clerkUser]);

  const handleLogout = async () => {
    await signOut();
    localStorage.clear();
    sessionStorage.clear();
    navigate('/');
  };

  const goToDashboard = async () => {
    await triggerExit();
    navigate('/Dashboard');
  };

  // Filter logic (online filter uses presence — we pass through and OnlineDot handles it)
  const filtered = people.filter(p => {
    const name = `${p.firstName} ${p.lastName}`.toLowerCase();
    return name.includes(search.toLowerCase());
  });

  const myInitials = ((userData?.firstName?.[0] || '') + (userData?.lastName?.[0] || '')).toUpperCase() || 'U';

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* ── SIDEBAR ─────────────────────────────── */}
      <div className={`bg-gradient-to-b from-green-700 to-green-950 text-white w-64 fixed h-full transition-transform duration-300 z-30 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 overflow-y-auto`}>
        <div className="p-4 lg:p-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl lg:text-2xl font-bold">Study Pulse</h2>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <nav className="space-y-2">
            <a onClick={goToDashboard} className="flex hover:bg-green-900 hover:cursor-pointer items-center space-x-3 p-3 rounded-lg transition-all duration-200">
              <FaThLarge className="text-[18px]" /><span className="font-medium">Dashboard</span>
            </a>
            <a href="#" className="flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 hover:bg-green-900">
              <FaHome className="text-[18px]" /><span className="font-medium">Overview</span>
            </a>
            <a onClick={() => navigate('/People')} className="flex items-center space-x-3 p-3 rounded-lg bg-green-900 cursor-pointer transition-all duration-200">
              <FaUsers className="text-[18px]" /><span className="font-medium">People</span>
            </a>
            <div className="bg-green-950 w-full mt-2 rounded-lg space-y-1">
              <a href="#" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-green-900 transition-all duration-200">
                <FaChartBar className="text-[18px]" /><span className="font-medium">All Courses</span>
              </a>
              <div className="flex flex-col">
                <a onClick={() => setIsCoursesOpen(!isCoursesOpen)} className="flex items-center justify-between p-3 rounded-lg cursor-pointer hover:bg-green-900 transition-all duration-200">
                  <div className="flex items-center space-x-3"><FaLaptop className="text-[18px]" /><span className="font-medium">IT Courses</span></div>
                  <FaChevronDown className={`text-xs transition-transform duration-300 ${isCoursesOpen ? 'rotate-180' : ''}`} />
                </a>
                <div className={`overflow-hidden transition-all duration-300 ${isCoursesOpen ? 'max-h-32 opacity-100 py-1' : 'max-h-0 opacity-0'}`}>
                  <a href="#" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-green-900 text-sm"><FaTerminal className="text-green-400" /><span>Web Development</span></a>
                  <a href="#" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-green-900 text-sm"><FaCode className="text-green-400" /><span>App Development</span></a>
                </div>
              </div>
              <a href="#" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-green-900 transition-all duration-200">
                <FaBook className="text-[18px]" /><span className="font-medium">Languages</span>
              </a>
              <a href="#" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-green-900 transition-all duration-200">
                <FaPaintBrush className="text-[18px]" /><span className="font-medium">Design</span>
              </a>
              <a onClick={() => navigate('/Settings')} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-green-900 transition-all duration-200 cursor-pointer">
                <FaCog className="text-[18px]" /><span className="font-medium">Settings</span>
              </a>
              <button onClick={() => setShowLogoutModal(true)} className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-green-900 transition-all duration-200 text-left">
                <FaSignOutAlt className="text-[18px]" /><span className="font-medium">Logout</span>
              </button>
            </div>
          </nav>
        </div>
      </div>

      {sidebarOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* ── MAIN ─────────────────────────────────── */}
      <div className="flex-1 lg:ml-64 w-full">

        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-10">
          <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 rounded-lg hover:bg-gray-100">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-gray-800">People</h1>
                <p className="text-xs text-gray-400 hidden sm:block">Connect with fellow learners on Study Pulse</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 shrink-0">
              <div onClick={() => navigate('/Profile')} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 cursor-pointer transition-all">
                <div className="relative">
                  {userData?.profileImage ? (
                    <img className="w-9 h-9 rounded-full object-cover" src={userData.profileImage} alt="profile" />
                  ) : (
                    <div className="w-9 h-9 bg-gradient-to-br from-green-500 to-emerald-700 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {myInitials}
                    </div>
                  )}
                  <span className="absolute bottom-0 right-0 block w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full">
                    <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-75" />
                  </span>
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-semibold text-gray-800 leading-none">{userData?.firstName || 'User'}</p>
                  <p className="text-xs text-gray-400 mt-0.5">Online</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* ── CONTENT ────────────────────────────── */}
        <div className="p-4 sm:p-6 lg:p-8">

          {/* Search & filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            {/* Search */}
            <div className="relative flex-1">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type="text"
                placeholder="Search people by name..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent shadow-sm"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <FaTimes className="text-sm" />
                </button>
              )}
            </div>

            {/* Filter chips */}
            <div className="flex gap-2 flex-wrap">
              {[['all', 'All members'], ['online', 'Online'], ['offline', 'Offline']].map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all duration-200 ${filter === key ? 'bg-green-700 text-white border-green-700 shadow-sm' : 'bg-white text-gray-500 border-gray-200 hover:border-green-300 hover:text-green-700'}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Stats bar */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <FaUsers className="text-green-600" />
              <span><strong className="text-gray-800">{filtered.length}</strong> {filtered.length === 1 ? 'person' : 'people'} found</span>
            </div>
            {search && (
              <span className="text-xs bg-green-50 text-green-700 px-2.5 py-1 rounded-full font-medium border border-green-100">
                Searching: "{search}"
              </span>
            )}
          </div>

          {/* Cards grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
              <FaRegFrown className="text-gray-300 text-7xl mb-4" />
              <p className="text-gray-500 text-lg font-semibold">No people found</p>
              <p className="text-gray-400 text-sm mt-1">Try a different search term</p>
            </div>
          ) : (
            <PeopleGrid people={filtered} currentUid={clerkUser?.id} navigate={navigate} filter={filter} />
          )}
        </div>
      </div>

      {/* Logout modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm" onClick={() => setShowLogoutModal(false)} />
          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-sm w-full relative z-10 shadow-2xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaSignOutAlt size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Logout?</h3>
              <p className="text-gray-500 mb-6">Are you sure you want to sign out?</p>
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

/* ─────────────────────────────────────────────
   PEOPLE GRID — separated so we can filter by
   online status AFTER presence resolves
───────────────────────────────────────────── */
const PeopleGrid = ({ people, currentUid, navigate, filter }) => {
  // For the online/offline filter, each card self-reports via useUserOnline.
  // We wrap in a FilteredCard that conditionally renders.
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {people.map((person, idx) => (
        <FilterableCard
          key={person.uid}
          person={person}
          currentUid={currentUid}
          navigate={navigate}
          filter={filter}
          idx={idx}
        />
      ))}
    </div>
  );
};

const FilterableCard = ({ person, currentUid, navigate, filter, idx }) => {
  const online = useUserOnline(person.uid);
  if (filter === 'online' && !online) return null;
  if (filter === 'offline' && online) return null;
  return <PersonCard person={person} currentUid={currentUid} navigate={navigate} idx={idx} />;
};

export default People;
