import {useEffect} from 'react'
import AppRoutes from './routes/AppRoutes'
import './App.css'
import { anonymousLogin } from './firebase/auth'


function App() {
  useEffect(() => {
    anonymousLogin();
  },[]);

  return (
    <div className='min-h-screen bg-gray-100'>
        
        <AppRoutes/>
    </div>
  )
}

export default App
