import './App.css'
import {Routes, Route} from 'react-router-dom'
import HomePage from './pages/home/HomePage.jsx'
import LoginPage from './pages/auth/login/LoginPage.jsx'
import SignUpPage from './pages/auth/signup/SignUpPage.jsx'
import SideBar from './components/comman/Sidebar.jsx'
import RightPanel from './components/comman/RightPanel.jsx'
import NotificationPage from './pages/notification/NotificationPage.jsx'
import ProfilePage from './pages/profile/ProfilePage.jsx'
import {Toaster} from 'react-hot-toast'
import { useQuery } from '@tanstack/react-query'
import LoadingSpinner from './components/comman/LoadingSpinner.jsx'
import { Navigate } from 'react-router-dom'

function App() {
  const {data: authUser, isLoading} = useQuery({
    // use queryKey to give a unique name to our query and refer to it later
    queryKey: ['authUser'],
    queryFn: async () => {
      try {
        const res = await fetch('/api/auth/me')
        const data = await res.json()
        if(data.error) return null
        if(!res.ok){
          throw new Error(data.error || 'Sommething went wrong')
        }
        console.log('authuser is here: ', data)
        return data
      } catch (error) {
        throw new Error(error)
      }
    },
    retry: false,
  })

  if(isLoading){
    return (
      <div className='h-screen flex justify-center items-center'>
        <LoadingSpinner size='lg' />
      </div>
    )
  }

  return (
    <div className="bg-black text-gray-200 min-h-screen flex justify-center">
      {authUser && <SideBar />}
      <Routes>
        <Route path='/' element={ authUser ? <HomePage /> : <Navigate to='/login' />} />
        <Route path='/login' element={ !authUser ? <LoginPage /> : <Navigate to='/' />}/>
        <Route path='/signup' element={ !authUser ? <SignUpPage /> : <Navigate to='/' />}/>
        <Route path='/notifications' element={ authUser ? <NotificationPage /> : <Navigate to='/login' />}/>
        <Route path='/profile/:username' element={ authUser ? <ProfilePage /> : <Navigate to='/login' />}/>
      </Routes>
      {authUser && <RightPanel />}
      <Toaster />
    </div>
  )
}

export default App
