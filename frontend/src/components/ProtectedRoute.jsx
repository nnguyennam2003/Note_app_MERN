import { Navigate, Outlet } from "react-router-dom"

export default function ProtectedRoute() {
    const isLogged = localStorage.getItem('token')
    return isLogged ? <Outlet /> : <Navigate to={'/login'} />
}
