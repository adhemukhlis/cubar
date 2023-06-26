import React, { Fragment, useEffect, useState } from 'react'
import RouteService from '@/src/routes/RouteService'
import { useDispatch } from 'react-redux'
import AUTH_ACTIONS from 'src/store/modules/Auth/actions'
import ACTION_TYPES from 'src/store/types/action-types'
import Loader from 'src/components/Loader'
const LoaderIndicator = () => {
	return (
		<div style={{ height: '100vh' }}>
			<Loader />
		</div>
	)
}
const App = () => {
	const [loading, setLoading] = useState(true)
	const dispatch = useDispatch()
	const authCheck = () => dispatch(AUTH_ACTIONS[ACTION_TYPES.AUTH_CHECK]())
	useEffect(() => {
		authCheck()
			.then((res) => {
				console.log(res)
			})
			.finally(() => {
				setLoading(false)
			})
	}, [])
	return <Fragment>{loading ? <LoaderIndicator /> : <RouteService />}</Fragment>
}
export default App
