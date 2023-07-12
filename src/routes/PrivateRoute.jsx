import { Navigate, useLocation } from 'react-router-dom'
import URLS from '@/src/enums/urls'

const PrivateRoute = ({ children, path, navigateTo = URLS.LOGIN, allow = [] }) => {
	const location = useLocation()
	const firstPath = path.split('/')[1]
	const currentFirstPath = location.pathname.split('/')[1]
	const allowBoolExec = currentFirstPath === firstPath ? allow.map((func) => func()) : [true]
	return !allowBoolExec.includes(false) ? children : <Navigate to={navigateTo} />
}

export default PrivateRoute
