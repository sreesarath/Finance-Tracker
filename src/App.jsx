import { useState } from 'react'

import './App.css'
import { Route, Routes } from 'react-router-dom'

import LandingPage from './Pages/LandingPage'
import Navbar from './Components/Header'
import Terms from './Pages/Terms'
import Footer from './Components/Footer'
import LoginPage from './Pages/LoginPage'
import RegistePage from './Pages/RegistePage'
import { ToastContainer } from 'react-toastify'
import Dashboard from './Pages/Dashboard'
import ProtectedRoute from './Components/ProtectedRoute'
import Analytics from './Pages/Analytics'
import Budget from './Pages/Budget'
import PageNotFound from './Pages/PageNotFound'
import SetGoal from './Pages/SetGoal'
import Settings from './Pages/Settings'






function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <Routes>
      <Route path={'/'} element={<LandingPage/>}></Route>
      <Route path={'/*'} element={<PageNotFound/>}></Route>
      <Route path='/header' element={<Navbar/>}></Route>
      <Route path='/terms' element={<Terms/>}></Route>
      <Route path='/goal' element={<SetGoal/>}></Route>
      <Route path='/footer' element={<Footer/>}></Route>
      <Route path='/settings' element={<Settings/>}></Route>
      <Route path='/login' element={<LoginPage/>}></Route>
      <Route path='/register' element={<RegistePage/>}></Route>
      <Route path='/analytics' element={<Analytics/>}></Route>
      <Route path='/budget' element={<Budget/>}></Route>
      <Route path='/dashboard' element={<ProtectedRoute><Dashboard/></ProtectedRoute>}></Route>
      
      


     </Routes>
     <ToastContainer/>
    </>
  )
}

export default App
