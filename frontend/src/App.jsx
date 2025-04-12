import './App.css'
import {Routes, Route} from 'react-router-dom'
import HomePage from './pages/home/HomePage.jsx'
import LoginPage from './pages/auth/login/LoginPage.jsx'
import SignUpPage from './pages/auth/signup/SignUpPage.jsx'
import SideBar from './components/comman/Sidebar.jsx'
import RightPanel from './components/comman/RightPanel.jsx'
import NotificationPage from './pages/notification/NotificationPage.jsx'
import ProfilePage from './pages/profile/ProfilePage.jsx'

function App() {

  return (
    <div className="bg-black text-gray-200 min-h-screen flex justify-center">
      <SideBar />
      <Routes>
        <Route path='/' element={<HomePage />}/>
        <Route path='/login' element={<LoginPage />}/>
        <Route path='/signup' element={<SignUpPage />}/>
        <Route path='/notifications' element={<NotificationPage />}/>
        <Route path='/notifications' element={<NotificationPage />}/>
        <Route path='/profile/:username' element={<ProfilePage />}/>
      </Routes>
      <RightPanel />
    </div>
  )
}

export default App
