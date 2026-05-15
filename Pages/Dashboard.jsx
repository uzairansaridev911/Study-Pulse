import React, { useState, useRef, useEffect } from 'react';
import { FaHome, FaUser, FaBook, FaChartBar, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { useClerk, useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../Context/UserContext';
import { db } from '../src/Firebase'; // Check karlein path sahi ho
import { doc, getDoc } from 'firebase/firestore';
import loader from '../Components/Loader';


const Dashboard = () => {
  const {signOut} = useClerk();
  const navigate = useNavigate();
  const { user, isLoaded: clerkLoaded } = useUser(); // Clerk se logged-in user ki ID lene ke liye
  const { userData, setUserData } = useContext(UserContext);
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [selectedRange, setSelectedRange] = useState('7days');
  const [loading, setLoading] = useState(true); // Loading state zaroori hai
  
  const [activityData] = useState([
    { day: 'Mon', visits: 45, hours: 3.5 },
    { day: 'Tue', visits: 52, hours: 4.2 },
    { day: 'Wed', visits: 38, hours: 2.8 },
    { day: 'Thu', visits: 65, hours: 5.1 },
    { day: 'Fri', visits: 58, hours: 4.5 },
    { day: 'Sat', visits: 72, hours: 6.2 },
    { day: 'Sun', visits: 48, hours: 3.8 }
  ]);
  
  const maxVisits = Math.max(...activityData.map(d => d.visits));

  const headerRef = useRef(null);
  const statsRef = useRef(null);
  const chartsRef = useRef(null);
  const tableRef = useRef(null);

  const loadUserData = async (userId) => {
  try {
    const docRef = doc(db, "users", userId); 
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setUserData(docSnap.data()); // Context mein user ka apna data set ho jayega
    } else {
      console.log("New User, Data could not be found in Firebase!");
      setUserData({
          firstName: 'Guest',
          lastName: '',
          profileImage: null,
          isGuest: true 
        });
    }
  } catch (error) {
    console.error("Firebase fetch error:", error);
  } finally {
    setLoading(false);
  }
  
};

useEffect(() => {
  if (clerkLoaded && user) {
    loadUserData(user.id); // Sirf is user ka data load hoga
  } else if (clerkLoaded && !user) {
    setLoading(false)
  }
}, [user, clerkLoaded]);




  // Logout Logic
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

  
  useEffect(() => {
    if (loading) return;

    if (headerRef.current) {
      headerRef.current.style.opacity = '0';
      headerRef.current.style.transform = 'translateY(-20px)';
      setTimeout(() => {
        headerRef.current.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        headerRef.current.style.opacity = '1';
        headerRef.current.style.transform = 'translateY(0)';
      }, 100);
    }
    
    if (statsRef.current) {
      const stats = statsRef.current.querySelectorAll('.stat-card');
      stats.forEach((stat, index) => {
        stat.style.opacity = '0';
        stat.style.transform = 'translateY(30px)';
        setTimeout(() => {
          stat.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
          stat.style.opacity = '1';
          stat.style.transform = 'translateY(0)';
        }, 200 + index * 100);
      });
    }
    
    
    if (chartsRef.current) {
      chartsRef.current.style.opacity = '0';
      chartsRef.current.style.transform = 'translateY(30px)';
      setTimeout(() => {
        chartsRef.current.style.transition = 'all 0.7s cubic-bezier(0.4, 0, 0.2, 1)';
        chartsRef.current.style.opacity = '1';
        chartsRef.current.style.transform = 'translateY(0)';
      }, 600);
    }

    if (tableRef.current) {
      tableRef.current.style.opacity = '0';
      tableRef.current.style.transform = 'translateY(30px)';
      setTimeout(() => {
        tableRef.current.style.transition = 'all 0.7s cubic-bezier(0.4, 0, 0.2, 1)';
        tableRef.current.style.opacity = '1';
        tableRef.current.style.transform = 'translateY(0)';
      }, 800);
    }
  }, [loading]);
  
  if (loading) {
      return <loader />;
    }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`bg-linear-to-b from-green-500 to-green-800 text-white w-64 fixed h-full transition-transform duration-300 z-30 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 overflow-y-auto`}>
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
            <a href="#" className="flex items-center space-x-3 bg-green-900 bg-opacity-50 p-3 rounded-lg transition-all duration-200 hover:bg-opacity-70">
              <FaHome className='text-[20px]'/>
              <span className="font-medium">Overview</span>
            </a>
            <a href="#" className="flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 hover:bg-green-900 hover:bg-opacity-50">
              <FaUser className='text-[20px]'/>
              <span className="font-medium">Students</span>
            </a>
            <a href="#" className="flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 hover:bg-green-900 hover:bg-opacity-50">
              <FaBook className='text-[20px]'/>
              <span className="font-medium">Courses</span>
            </a>
            <a href="#" className="flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 hover:bg-green-900 hover:bg-opacity-50">
              <FaChartBar className='text-[20px]'/>
              <span className="font-medium">Analytics</span>
            </a>
            <a href="#" className="flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 hover:bg-green-900 hover:bg-opacity-50">
              <FaCog className='text-[20px]'/>
              <span className="font-medium">Settings</span>
            </a>
            <button onClick={() => setShowLogoutModal(true)} className="w-full flex items-center hover:cursor-pointer space-x-3 p-3 rounded-lg transition-all duration-200 hover:bg-blue-800 hover:bg-opacity-50 text-left">
              <FaSignOutAlt className='text-[20px]'/>
              <span className="font-medium">Logout</span>
            </button>
          </nav>
        </div>
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden" onClick={() => setSidebarOpen(false)}></div>
      )}

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 w-full">
        {/* Header */}
        <header ref={headerRef} className="bg-white shadow-sm sticky top-0 z-10">
          <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
            <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 shrink-0">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 truncate">Welcome, {userData?.firstName + ' ' + userData?.lastName || 'Guest'}</h1>
                <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">Here is your activity today</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-4 shrink-0">
              <button className="relative p-2 rounded-full hover:bg-gray-100 transition-all duration-200">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              
              <div onClick={() => navigate('/Profile')} className="flex items-center space-x-2 sm:space-x-3 p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 transition-all duration-200 cursor-pointer">
                <div className="relative">
                {userData?.profileImage ? (
                  <img className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center" src={userData.profileImage} alt="profile"/>
                  ) : (
                     <div className="w-8 h-8 sm:w-10 sm:h-10 bg-linear-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {(userData?.firstName?.[0] || 'G') + (userData?.lastName?.[0] || 'S')}
                     </div>
                  )}
                  <span className="absolute bottom-0 right-0 block w-2.5 h-2.5 sm:w-3 sm:h-3 bg-emerald-500 border-2 border-white rounded-full">
                    <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-75"></span>
                  </span>
                </div> 
                <div className="hidden md:block">
                  <p className="text-sm font-semibold text-gray-800 leading-none">{userData?.firstName ? `${userData.firstName} ${userData.lastName || ''}` : 'Guest'}</p>
                  <p className="text-xs text-gray-500 mt-1">User</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-3 sm:p-4 lg:p-6">
          <div ref={statsRef} className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-4 lg:mb-6">
            <div className="stat-card bg-linear-to-br from-blue-500 to-blue-600 rounded-xl lg:rounded-2xl p-4 sm:p-5 lg:p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white bg-opacity-30 rounded-lg flex items-center justify-center text-white text-xl font-bold"><FaUser /></div>
                <span className="text-xs bg-white text-blue-600 font-bold bg-opacity-20 px-2 py-0.5 rounded-full">+12%</span>
              </div>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1">5,420</h3>
              <p className="text-blue-100 text-xs sm:text-sm">Total Students</p>
            </div>

            <div className="stat-card bg-linear-to-br from-emerald-500 to-emerald-600 rounded-xl lg:rounded-2xl p-4 sm:p-5 lg:p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white bg-opacity-30 rounded-lg flex items-center justify-center text-white text-xl font-bold"><FaBook /></div>
                <span className="text-xs bg-white text-emerald-600 font-bold bg-opacity-20 px-2 py-0.5 rounded-full">+8%</span>
              </div>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1">142</h3>
              <p className="text-emerald-100 text-xs sm:text-sm">Active Courses</p>
            </div>

            <div className="stat-card bg-linear-to-br from-purple-500 to-purple-600 rounded-xl lg:rounded-2xl p-4 sm:p-5 lg:p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white bg-opacity-30 rounded-lg flex items-center justify-center text-white text-xl font-bold"><FaChartBar /></div>
                <span className="text-xs bg-white text-purple-600 font-bold bg-opacity-20 px-2 py-0.5 rounded-full">+23%</span>
              </div>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1">$84K</h3>
              <p className="text-purple-100 text-xs sm:text-sm">Revenue</p>
            </div>

            <div className="stat-card bg-linear-to-br from-orange-500 to-orange-600 rounded-xl lg:rounded-2xl p-4 sm:p-5 lg:p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white bg-opacity-30 rounded-lg flex items-center justify-center text-white text-xl font-bold"><FaCog /></div>
                <span className="text-xs bg-white text-orange-600 font-bold bg-opacity-20 px-2 py-0.5 rounded-full">94%</span>
              </div>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1">2,845</h3>
              <p className="text-orange-100 text-xs sm:text-sm">Completed</p>
            </div>
          </div>

          <div ref={chartsRef} className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 mb-4 lg:mb-6">
            <div className="lg:col-span-2 bg-white rounded-xl lg:rounded-2xl p-4 sm:p-5 lg:p-6 shadow-lg">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-3">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-800">My Activity</h2>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">Dashboard visits this week</p>
                </div>
                <select value={selectedRange} onChange={(e) => setSelectedRange(e.target.value)} className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto">
                  <option value="7days">Last 7 days</option>
                  <option value="30days">Last 30 days</option>
                </select>
              </div>
              <div className="h-48 sm:h-56 lg:h-64 flex items-end justify-between gap-1 sm:gap-2">
                {activityData.map((data, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center group">
                    <div className="relative w-full">
                      <div className="w-full bg-linear-to-t from-blue-500 to-blue-400 rounded-t-lg transition-all duration-500 hover:from-blue-600 hover:to-blue-500 cursor-pointer" style={{ height: `${(data.visits / maxVisits) * 100}%`, minHeight: '20px' }}>
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                          {data.visits} visits
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500 mt-2">{data.day}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl lg:rounded-2xl p-4 sm:p-5 lg:p-6 shadow-lg">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6">Categories</h2>
              <div className="flex items-center justify-center mb-4 sm:mb-6">
                <div className="relative w-36 h-36 sm:w-40 sm:h-40 lg:w-48 lg:h-48">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="50%" cy="50%" r="35%" fill="none" stroke="#3b82f6" strokeWidth="25%" strokeDasharray="251 251" />
                    <circle cx="50%" cy="50%" r="35%" fill="none" stroke="#10b981" strokeWidth="25%" strokeDasharray="157 251" strokeDashoffset="-251" />
                    <circle cx="50%" cy="50%" r="35%" fill="none" stroke="#8b5cf6" strokeWidth="25%" strokeDasharray="94 251" strokeDashoffset="-408" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-center">
                    <div>
                      <p className="text-xl sm:text-2xl font-bold text-gray-800">142</p>
                      <p className="text-xs text-gray-500">Courses</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <div className="flex items-center space-x-2"><div className="w-3 h-3 bg-blue-500 rounded-full"></div><span className="text-gray-600">Programming</span></div>
                  <span className="font-semibold text-gray-800">50%</span>
                </div>
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <div className="flex items-center space-x-2"><div className="w-3 h-3 bg-emerald-500 rounded-full"></div><span className="text-gray-600">Design</span></div>
                  <span className="font-semibold text-gray-800">31%</span>
                </div>
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <div className="flex items-center space-x-2"><div className="w-3 h-3 bg-purple-500 rounded-full"></div><span className="text-gray-600">Business</span></div>
                  <span className="font-semibold text-gray-800">19%</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

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

export default Dashboard;