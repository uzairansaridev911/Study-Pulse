import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClerk, useUser } from '@clerk/clerk-react';
import {
  FaThLarge, FaBell, FaUsers, FaBook, FaChartBar, FaCog,
  FaSignOutAlt, FaHome, FaChevronDown, FaLaptop, FaTerminal,
  FaCode, FaPaintBrush, FaCheck, FaTrash, FaTimes,
  FaUserPlus, FaTrophy, FaFire, FaGraduationCap,
  FaExclamationCircle, FaStar, FaPlayCircle, FaShieldAlt,
  FaCheckDouble, FaInbox, FaUserCheck, FaUserTimes
} from 'react-icons/fa';
import { db } from '../src/Firebase';
import {
  collection, query, where, orderBy, onSnapshot,
  doc, updateDoc, deleteDoc, writeBatch, addDoc,
  serverTimestamp, getDoc
} from 'firebase/firestore';
import { UserContext } from '../Context/UserContext';
import { triggerExit } from './transition';

/* ─────────────────────────────────────────
    NOTIFICATION TYPES CONFIG
───────────────────────────────────────── */
const TYPE_CONFIG = {
  friend_request: {
    icon: <FaUserPlus />,
    color: 'bg-blue-50 text-blue-600',
    border: 'border-l-blue-400',
    dot: 'bg-blue-400',
    label: 'Friend Request',
  },
  course_new: {
    icon: <FaPlayCircle />,
    color: 'bg-green-50 text-green-600',
    border: 'border-l-green-400',
    dot: 'bg-green-400',
    label: 'New Course',
  },
  achievement: {
    icon: <FaTrophy />,
    color: 'bg-amber-50 text-amber-500',
    border: 'border-l-amber-400',
    dot: 'bg-amber-400',
    label: 'Achievement',
  },
  streak: {
    icon: <FaFire />,
    color: 'bg-orange-50 text-orange-500',
    border: 'border-l-orange-400',
    dot: 'bg-orange-400',
    label: 'Streak',
  },
  certificate: {
    icon: <FaGraduationCap />,
    color: 'bg-purple-50 text-purple-600',
    border: 'border-l-purple-400',
    dot: 'bg-purple-400',
    label: 'Certificate',
  },
  quiz_result: {
    icon: <FaStar />,
    color: 'bg-yellow-50 text-yellow-500',
    border: 'border-l-yellow-400',
    dot: 'bg-yellow-400',
    label: 'Quiz Result',
  },
  reminder: {
    icon: <FaExclamationCircle />,
    color: 'bg-red-50 text-red-500',
    border: 'border-l-red-400',
    dot: 'bg-red-400',
    label: 'Reminder',
  },
  security: {
    icon: <FaShieldAlt />,
    color: 'bg-slate-50 text-slate-600',
    border: 'border-l-slate-400',
    dot: 'bg-slate-400',
    label: 'Security',
  },
  system: {
    icon: <FaBell />,
    color: 'bg-gray-50 text-gray-500',
    border: 'border-l-gray-300',
    dot: 'bg-gray-300',
    label: 'System',
  },
};

/* ─────────────────────────────────────────
    TIME AGO HELPER
───────────────────────────────────────── */
const timeAgo = (ts) => {
  if (!ts) return '';
  const date = ts.toDate ? ts.toDate() : new Date(ts);
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

/* ─────────────────────────────────────────
    NOTIFICATION CARD
───────────────────────────────────────── */
const NotificationCard = ({ notif, onMarkRead, onDelete, onAcceptFriend, onRejectFriend, currentUserId, idx }) => {
  const cfg = TYPE_CONFIG[notif.type] || TYPE_CONFIG.system;
  const [removing, setRemoving] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const handleDelete = async () => {
    setRemoving(true);
    setTimeout(() => onDelete(notif.id), 320);
  };

  const handleFriendAction = async (actionFn) => {
    setActionLoading(true);
    setRemoving(true);
    try {
      setTimeout(async () => {
        await actionFn(notif);
      }, 320);
    } catch (err) {
      console.error(err);
      setRemoving(false);
      setActionLoading(false);
    }
  };

  return (
    <div
      className={`
        group relative bg-white rounded-2xl border border-gray-100
        border-l-4 ${cfg.border}
        shadow-sm hover:shadow-md
        transition-all duration-300
        ${!notif.read ? 'ring-1 ring-inset ring-green-100' : ''}
        ${removing ? 'opacity-0 scale-95 -translate-x-4' : 'opacity-100 scale-100 translate-x-0'}
        overflow-hidden
      `}
      style={{ transitionDelay: removing ? '0ms' : `${idx * 40}ms` }}
    >
      {/* Unread glow strip */}
      {!notif.read && (
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-green-400 via-emerald-300 to-transparent" />
      )}

      <div className="flex items-start gap-4 p-4 sm:p-5">
        {/* Profile Image for Friend Request / Standard Icon badge for others */}
        {notif.type === 'friend_request' && notif.fromImage ? (
          <img 
            src={notif.fromImage} 
            alt={notif.fromName || 'User'} 
            className="w-11 h-11 rounded-xl object-cover ring-2 ring-gray-100 flex-shrink-0 shadow-sm"
          />
        ) : (
          <div className={`w-11 h-11 rounded-xl ${cfg.color} flex items-center justify-center text-base flex-shrink-0 shadow-sm`}>
            {cfg.icon}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              {/* Type tag + unread dot */}
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${cfg.color}`}>
                  {cfg.label}
                </span>
                {!notif.read && (
                  <span className={`w-2 h-2 rounded-full ${cfg.dot} animate-pulse flex-shrink-0`} />
                )}
              </div>
              {/* Title */}
              <p className={`text-sm leading-snug ${notif.read ? 'text-gray-600 font-medium' : 'text-gray-900 font-semibold'}`}>
                {notif.title}
              </p>
              {/* Body */}
              {notif.body && (
                <p className="text-xs text-gray-400 mt-1 leading-relaxed line-clamp-2">
                  {notif.body}
                </p>
              )}
            </div>

            {/* Timestamp + actions */}
            <div className="flex flex-col items-end gap-2 flex-shrink-0">
              <span className="text-[11px] text-gray-400 whitespace-nowrap">{timeAgo(notif.createdAt)}</span>
              {/* Action buttons — appear on hover */}
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                {!notif.read && (
                  <button
                    onClick={() => onMarkRead(notif.id)}
                    title="Mark as read"
                    className="w-7 h-7 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 flex items-center justify-center text-xs transition-all"
                  >
                    <FaCheck />
                  </button>
                )}
                <button
                  onClick={handleDelete}
                  title="Delete"
                  className="w-7 h-7 rounded-lg bg-red-50 text-red-400 hover:bg-red-100 flex items-center justify-center text-xs transition-all"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons specific for Friend Requests */}
          {notif.type === 'friend_request' ? (
            <div className="flex items-center gap-2 mt-3">
              <button
                disabled={actionLoading}
                onClick={() => handleFriendAction(onAcceptFriend)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-green-700 text-white rounded-xl text-xs font-semibold hover:bg-green-800 transition-all shadow-sm active:scale-95 disabled:opacity-50"
              >
                <FaUserCheck /> Accept
              </button>
              <button
                disabled={actionLoading}
                onClick={() => handleFriendAction(onRejectFriend)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 border border-gray-200 text-gray-600 rounded-xl text-xs font-semibold hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all active:scale-95 disabled:opacity-50"
              >
                <FaUserTimes /> Ignore
              </button>
            </div>
          ) : (
            /* Action route redirect link for normal notifications */
            notif.actionLabel && notif.actionRoute && (
              <a
                href={notif.actionRoute}
                className="inline-flex items-center gap-1.5 mt-2.5 text-xs font-semibold text-green-700 hover:text-green-800 hover:underline transition-colors"
              >
                {notif.actionLabel} →
              </a>
            )
          )}
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────
    SKELETON CARD
───────────────────────────────────────── */
const SkeletonCard = () => (
  <div className="bg-white rounded-2xl border border-gray-100 border-l-4 border-l-gray-200 shadow-sm p-4 sm:p-5 animate-pulse flex gap-4">
    <div className="w-11 h-11 rounded-xl bg-gray-100 flex-shrink-0" />
    <div className="flex-1 space-y-2">
      <div className="h-3 bg-gray-100 rounded w-20" />
      <div className="h-4 bg-gray-200 rounded w-3/4" />
      <div className="h-3 bg-gray-100 rounded w-1/2" />
    </div>
    <div className="h-3 bg-gray-100 rounded w-10 flex-shrink-0" />
  </div>
);

/* ─────────────────────────────────────────
    EMPTY STATE
───────────────────────────────────────── */
const EmptyState = ({ filtered }) => (
  <div className="flex flex-col items-center justify-center py-24 text-center">
    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center mb-5 shadow-inner">
      <FaInbox className="text-3xl text-green-400" />
    </div>
    <h3 className="text-lg font-bold text-gray-700 mb-1">
      {filtered ? 'No notifications here' : 'You\'re all caught up!'}
    </h3>
    <p className="text-sm text-gray-400 max-w-xs">
      {filtered ? 'Try a different filter to see more.' : 'New notifications will appear here as they arrive.'}
    </p>
  </div>
);

/* ─────────────────────────────────────────
    FILTER TABS
───────────────────────────────────────── */
const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'unread', label: 'Unread' },
  { key: 'friend_request', label: 'Friends' },
  { key: 'course_new', label: 'Courses' },
  { key: 'achievement', label: 'Achievements' },
  { key: 'reminder', label: 'Reminders' },
];

/* ─────────────────────────────────────────
    SEED DEMO NOTIFICATIONS (dev helper)
───────────────────────────────────────── */
const DEMO_NOTIFICATIONS = [
  {
    type: 'friend_request',
    title: 'Sara Ahmed sent you a friend request',
    body: 'You and Sara have 3 mutual courses in common.',
    from: 'demo_sara_id',
    fromName: 'Sara Ahmed',
    fromImage: '',
    read: false,
  },
  {
    type: 'course_new',
    title: 'New course added: Next.js 14 Mastery',
    body: 'A brand-new full-stack course just dropped in the IT section.',
    actionLabel: 'Enroll now',
    actionRoute: '/Courses',
    read: false,
  },
  {
    type: 'achievement',
    title: 'Achievement unlocked: Fast Learner 🏆',
    body: 'You completed 3 lessons in a single day. Keep it up!',
    read: false,
  },
  {
    type: 'streak',
    title: '🔥 7-day streak! You\'re on fire!',
    body: 'You\'ve studied every day this week. Amazing consistency.',
    read: true,
  },
  {
    type: 'quiz_result',
    title: 'Quiz result: React Fundamentals',
    body: 'You scored 88% — Great work! Review the 2 incorrect answers.',
    actionLabel: 'See results',
    actionRoute: '/Courses',
    read: true,
  },
];

/* ─────────────────────────────────────────
    MAIN PAGE
───────────────────────────────────────── */
const Notifications = () => {
  const navigate = useNavigate();
  const { signOut } = useClerk();
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser();
  const { userData, setUserData } = useContext(UserContext);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCoursesOpen, setIsCoursesOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  /* Load current user */
  useEffect(() => {
    if (!clerkLoaded || !clerkUser || userData) return;
    const load = async () => {
      const snap = await getDoc(doc(db, 'users', clerkUser.id));
      if (snap.exists()) setUserData(snap.data());
    };
    load();
  }, [clerkLoaded, clerkUser]);

  /* Real-time notifications listener */
  useEffect(() => {
    if (!clerkLoaded || !clerkUser) return;

    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', clerkUser.id),
      orderBy('createdAt', 'desc')
    );

    const unsub = onSnapshot(q, (snap) => {
      const notifs = snap.docs.map(d => ({ id: d.id, ...d.data() }));

      if (notifs.length === 0) {
        seedDemoNotifications(clerkUser.id);
      } else {
        setNotifications(notifs);
        setLoading(false);
      }
    });

    return unsub;
  }, [clerkLoaded, clerkUser]);

  const seedDemoNotifications = async (userId) => {
    try {
      const batch = writeBatch(db);
      DEMO_NOTIFICATIONS.forEach((n) => {
        const ref = doc(collection(db, 'notifications'));
        batch.set(ref, { ...n, userId, createdAt: serverTimestamp() });
      });
      await batch.commit();
    } catch (e) {
      console.error('Seed error:', e);
      setLoading(false);
    }
  };

  const markRead = async (id) => {
    await updateDoc(doc(db, 'notifications', id), { read: true });
  };

  const markAllRead = async () => {
    const batch = writeBatch(db);
    notifications.filter(n => !n.read).forEach(n => {
      batch.update(doc(db, 'notifications', n.id), { read: true });
    });
    await batch.commit();
  };

  const deleteNotif = async (id) => {
    await deleteDoc(doc(db, 'notifications', id));
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  /* ─────────────────────────────────────────
      FRIEND REQUEST ACTIONS HANDLERS
  ───────────────────────────────────────── */
  const acceptFriendRequest = async (notif) => {
    if (!clerkUser?.id) return;
    const myUid = clerkUser.id;
    const peerUid = notif.from; // Request bhejne wale ki id

    try {
      const batch = writeBatch(db);

      // 1. Dono taraf friends sub-collection/collection mein relation bnao
      const myFriendRef = doc(db, 'friends', `${myUid}_${peerUid}`);
      const peerFriendRef = doc(db, 'friends', `${peerUid}_${myUid}`);
      batch.set(myFriendRef, { friendId: peerUid, since: serverTimestamp() });
      batch.set(peerFriendRef, { friendId: myUid, since: serverTimestamp() });

      // 2. Pending request records ko delete karo (taake double action na ho sake)
      batch.delete(doc(db, 'friendRequests', `${peerUid}_${myUid}`));
      batch.delete(doc(db, 'friendRequests', `${myUid}_${peerUid}`));

      // 3. Is notification card ko delete karo
      batch.delete(doc(db, 'notifications', notif.id));

      await batch.commit();
    } catch (err) {
      console.error("Error accepting friend request: ", err);
    }
  };

  const rejectFriendRequest = async (notif) => {
    if (!clerkUser?.id) return;
    try {
      const batch = writeBatch(db);
      // Request collection se hataya aur notification clean kar di
      batch.delete(doc(db, 'friendRequests', `${notif.from}_${clerkUser.id}`));
      batch.delete(doc(db, 'notifications', notif.id));
      await batch.commit();
    } catch (err) {
      console.error("Error rejecting friend request: ", err);
    }
  };

  const clearAll = async () => {
    const batch = writeBatch(db);
    notifications.forEach(n => batch.delete(doc(db, 'notifications', n.id)));
    await batch.commit();
    setNotifications([]);
    setShowClearConfirm(false);
  };

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

  /* Filtered list */
  const filtered = notifications.filter(n => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'unread') return !n.read;
    return n.type === activeFilter;
  });

  const unreadCount = notifications.filter(n => !n.read).length;
  const myInitials = ((userData?.firstName?.[0] || '') + (userData?.lastName?.[0] || '')).toUpperCase() || 'U';

  /* Group by date */
  const groupByDate = (notifs) => {
    const groups = {};
    notifs.forEach(n => {
      if (!n.createdAt) { (groups['Recent'] = groups['Recent'] || []).push(n); return; }
      const date = n.createdAt.toDate ? n.createdAt.toDate() : new Date(n.createdAt);
      const today = new Date();
      const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);
      let label;
      if (date.toDateString() === today.toDateString()) label = 'Today';
      else if (date.toDateString() === yesterday.toDateString()) label = 'Yesterday';
      else label = date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
      (groups[label] = groups[label] || []).push(n);
    });
    return groups;
  };

  const grouped = groupByDate(filtered);

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* ── SIDEBAR ───────────────────────────── */}
      <div className={`bg-gradient-to-b from-green-700 to-green-950 text-white w-64 fixed h-full transition-transform duration-300 z-30 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 overflow-y-auto`}>
        <div className="p-4 lg:p-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl lg:text-2xl font-bold">Study Pulse</h2>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
              <FaTimes />
            </button>
          </div>
          <nav className="space-y-1">
            <a onClick={goToDashboard} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-green-900 cursor-pointer transition-all">
              <FaThLarge className="text-[18px]" /><span className="font-medium">Dashboard</span>
            </a>
            <a href="#" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-green-900 transition-all">
              <FaHome className="text-[18px]" /><span className="font-medium">Overview</span>
            </a>
            <a onClick={() => navigate('/People')} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-green-900 cursor-pointer transition-all">
              <FaUsers className="text-[18px]" /><span className="font-medium">People</span>
            </a>
            <a onClick={() => navigate('/Notifications')} className="flex items-center space-x-3 p-3 rounded-lg bg-green-900 cursor-pointer transition-all">
              <FaBell className="text-[18px]" />
              <span className="font-medium">Notifications</span>
              {unreadCount > 0 && (
                <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </a>
            <div className="bg-green-950 rounded-lg mt-2 space-y-1">
              <a href="#" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-green-900 transition-all">
                <FaChartBar className="text-[18px]" /><span className="font-medium">All Courses</span>
              </a>
              <div className="flex flex-col">
                <a onClick={() => setIsCoursesOpen(!isCoursesOpen)} className="flex items-center justify-between p-3 rounded-lg cursor-pointer hover:bg-green-900 transition-all">
                  <div className="flex items-center space-x-3"><FaLaptop className="text-[18px]" /><span className="font-medium">IT Courses</span></div>
                  <FaChevronDown className={`text-xs transition-transform duration-300 ${isCoursesOpen ? 'rotate-180' : ''}`} />
                </a>
                <div className={`overflow-hidden transition-all duration-300 ${isCoursesOpen ? 'max-h-32 opacity-100 py-1' : 'max-h-0 opacity-0'}`}>
                  <a href="#" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-green-900 text-sm"><FaTerminal className="text-green-400" /><span>Web Development</span></a>
                  <a href="#" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-green-900 text-sm"><FaCode className="text-green-400" /><span>App Development</span></a>
                </div>
              </div>
              <a href="#" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-green-900 transition-all">
                <FaBook className="text-[18px]" /><span className="font-medium">Languages</span>
              </a>
              <a href="#" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-green-900 transition-all">
                <FaPaintBrush className="text-[18px]" /><span className="font-medium">Design</span>
              </a>
              <a onClick={() => navigate('/Settings')} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-green-900 cursor-pointer transition-all">
                <FaCog className="text-[18px]" /><span className="font-medium">Settings</span>
              </a>
              <button onClick={() => setShowLogoutModal(true)} className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-green-900 transition-all text-left">
                <FaSignOutAlt className="text-[18px]" /><span className="font-medium">Logout</span>
              </button>
            </div>
          </nav>
        </div>
      </div>

      {sidebarOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* ── MAIN ─────────────────────────────── */}
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
                <div className="flex items-center gap-2">
                  <h1 className="text-lg sm:text-xl font-bold text-gray-800">Notifications</h1>
                  {unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-400 hidden sm:block">Stay updated with your activity</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-green-700 hover:text-green-800 bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded-lg border border-green-200 transition-all"
                >
                  <FaCheckDouble className="text-xs" /> Mark all read
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={() => setShowClearConfirm(true)}
                  className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg border border-red-200 transition-all"
                >
                  <FaTrash className="text-xs" /> Clear all
                </button>
              )}
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

          {/* Filter tabs */}
          <div className="px-4 sm:px-6 pb-0 border-t border-gray-50">
            <div className="flex gap-1 overflow-x-auto scrollbar-hide -mx-1 px-1">
              {FILTERS.map(f => {
                const count = f.key === 'all' ? notifications.length
                  : f.key === 'unread' ? unreadCount
                  : notifications.filter(n => n.type === f.key).length;
                return (
                  <button
                    key={f.key}
                    onClick={() => setActiveFilter(f.key)}
                    className={`
                      flex items-center gap-1.5 px-3 py-2.5 text-xs font-semibold whitespace-nowrap border-b-2 transition-all duration-200
                      ${activeFilter === f.key
                        ? 'border-green-600 text-green-700'
                        : 'border-transparent text-gray-400 hover:text-gray-600 hover:border-gray-200'}
                    `}
                  >
                    {f.label}
                    {count > 0 && (
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center ${activeFilter === f.key ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </header>

        {/* ── CONTENT ──────────────────────────── */}
        <div className="p-4 sm:p-6 lg:p-8 max-w-3xl">

          {/* Mobile action buttons */}
          {(unreadCount > 0 || notifications.length > 0) && (
            <div className="flex gap-2 mb-4 sm:hidden">
              {unreadCount > 0 && (
                <button onClick={markAllRead} className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold text-green-700 bg-green-50 border border-green-200 px-3 py-2 rounded-xl transition-all">
                  <FaCheckDouble /> Mark all read
                </button>
              )}
              {notifications.length > 0 && (
                <button onClick={() => setShowClearConfirm(true)} className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold text-red-500 bg-red-50 border border-red-200 px-3 py-2 rounded-xl transition-all">
                  <FaTrash /> Clear all
                </button>
              )}
            </div>
          )}

          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState filtered={activeFilter !== 'all'} />
          ) : (
            <div className="space-y-6">
              {Object.entries(grouped).map(([dateLabel, notifs]) => (
                <div key={dateLabel}>
                  {/* Date group label */}
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">
                      {dateLabel}
                    </span>
                    <div className="flex-1 h-px bg-gray-100" />
                    <span className="text-[10px] text-gray-300 font-medium">{notifs.length}</span>
                  </div>
                  {/* Cards */}
                  <div className="space-y-2.5">
                    {notifs.map((n, idx) => (
                      <NotificationCard
                        key={n.id}
                        notif={n}
                        onMarkRead={markRead}
                        onDelete={deleteNotif}
                        onAcceptFriend={acceptFriendRequest}
                        onRejectFriend={rejectFriendRequest}
                        currentUserId={clerkUser?.id}
                        idx={idx}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── CLEAR ALL CONFIRM MODAL ─────────── */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowClearConfirm(false)} />
          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-sm w-full relative z-10 shadow-2xl">
            <div className="text-center">
              <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FaTrash className="text-red-500 text-xl" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Clear all notifications?</h3>
              <p className="text-sm text-gray-500 mb-6">This will permanently delete all {notifications.length} notifications. This cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => setShowClearConfirm(false)} className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all">Cancel</button>
                <button onClick={clearAll} className="flex-1 px-4 py-2.5 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 transition-all">Clear all</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── LOGOUT MODAL ─────────────────────── */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowLogoutModal(false)} />
          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-sm w-full relative z-10 shadow-2xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaSignOutAlt size={22} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Logout?</h3>
              <p className="text-gray-500 mb-6">Are you sure you want to sign out?</p>
              <div className="flex gap-3">
                <button onClick={() => setShowLogoutModal(false)} className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200">Stay</button>
                <button onClick={handleLogout} className="flex-1 px-4 py-2.5 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700">Logout</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;