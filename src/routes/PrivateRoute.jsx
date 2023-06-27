import { Navigate, useLocation } from 'react-router-dom'
import URLS from '@/src/enums/urls'

const PrivateRoute = ({ children, path, navigateTo = URLS.LOGIN, allow = [] }) => {
	const location = useLocation()
	const allowBoolExec = location.pathname === path ? allow.map((func) => func()) : [true]
	return !allowBoolExec.includes(false) ? children : <Navigate to={navigateTo} />
}

export default PrivateRoute
