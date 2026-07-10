import React, { useState } from 'react'
import Login from '../components/Login'
import Register from '../components/Register'

function Authentication( switchForm ) {

  const[isLogin, setIsLogin] = useState(true)
  return (
    <div className="h-full flex flex-col justify-center items-center py-14">{isLogin ? <Login switchForm={() => {
      setIsLogin(false)
    }}  />  :  <Register switchForm={() => {
      setIsLogin(true)
    }} /> }</div>
  );
}

export default Authentication
