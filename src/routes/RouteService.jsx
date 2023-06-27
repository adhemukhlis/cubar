import { HashRouter as Router } from 'react-router-dom'
import Pages from '@/src/routes/RouteStacks'

const RouteService = () => {
	return (
		<Router>
			<Pages />
		</Router>
	)
}

export default RouteService
