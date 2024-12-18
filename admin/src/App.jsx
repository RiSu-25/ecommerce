// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import { Routes, Route } from 'react-router-dom'
import Add from './pages/Add'
import List from './pages/List'
import Orders from './pages/Orders'
import Login from './components/Login'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// eslint-disable-next-line react-refresh/only-export-components
export const backendUrl = import.meta.env.VITE_BACKEND_URL
export const currency = '$'

const App = () => {
  
  const [ token,setToken ] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : '');


  useEffect(()=>{
    localStorage.setItem('token',token)
  },[token])

  return (
    <div className='bg-gray-50 min-h-screen'>
      <ToastContainer />
      { token === ""
      ? <Login setToken={setToken} /> 
      : <>
        <Navbar setToken={setToken} />
        <hr />
        <div className='flex w-full'>
          <Sidebar />
          <div className='w-[70%] ml-[max(95w,25px)] my-8 text-gray-600 text-base'>
            <Routes>
              <Route path='/add' element={<Add />} />
              <Route path='/list' element={<List />} />
              <Route path='/orders' element={<Orders />} />
            </Routes>
          </div>
        </div>
      </>
      }
      
    </div>
  )
}

export default App