import React from 'react'
import { Navigate } from 'react-router-dom'

const ProtectedRoute=({children})=>{
    const token=sessionStorage.getItem("token")
    console.log("TOKEN:", sessionStorage.getItem("token"))
    if (!token) {
        return <Navigate to={'/login'}/>
        
    }
    return children
}
export default ProtectedRoute