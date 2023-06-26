import React, { lazy } from 'react'
import { Route, Routes } from 'react-router-dom'
import PrivateRoute from '@/src/routes/PrivateRoute'
import configureStore from '@/src/store'
import URLS from '@/src/enums/urls'

import { Navigate } from 'react-router-dom'
import { isEmpty } from 'lodash'
import AUTH_GETTERS from '../store/modules/Auth/getters'

// store
const { store } = configureStore()
// pages
const Page404 = lazy(() => import('../pages/404'))
const Login = lazy(() => import('../pages/Login'))
const Menu = lazy(() => import('../pages/Menu'))
// const MultiPlayer = lazy(() => import("../pages/MultiPlayer"));
// const Room = lazy(() => import("../pages/Room"));
// const LeaderBoard = lazy(() => import("../pages/LeaderBoard"));
// const Simplicity = lazy(() => import("../pages/games/simplicity"));


const RouteStacks = () => {
	const loggedIn = () => {
		console.log(AUTH_GETTERS.loginToken(store.getState()))
		return !isEmpty(AUTH_GETTERS.loginToken(store.getState()))
	}
	const loggedOut = () => {
		return isEmpty(AUTH_GETTERS.loginToken(store.getState()))
	}

	return (
		<Routes>
			<Route exact path={URLS.LANDING} element={<Navigate to={URLS.MENU} />} />

			<Route
				path={URLS.LOGIN}
				element={
					<PrivateRoute path={URLS.LOGIN} allow={[loggedOut]} navigateTo={URLS.MENU}>
						<Login />
					</PrivateRoute>
				}
			/>
			<Route
				path={URLS.MENU}
				element={
					<PrivateRoute path={URLS.MENU} allow={[loggedIn]}>
						<Menu />
					</PrivateRoute>
				}
			/>
			{/* <Route
				path={URLS.MULTIPLAYER}
				element={
					<PrivateRoute path={URLS.MULTIPLAYER} allow={[loggedIn]}>
						<MultiPlayer />
					</PrivateRoute>
				}
			/>
			<Route
				path={URLS.MULTIPLAYER}
				element={
					<PrivateRoute path={URLS.MULTIPLAYER} allow={[loggedIn]}>
						<Room />
					</PrivateRoute>
				}
			/>
			<Route
				path={URLS.MULTIPLAYER}
				element={
					<PrivateRoute path={URLS.MULTIPLAYER} allow={[loggedIn]}>
						<LeaderBoard />
					</PrivateRoute>
				}
			/>
			<Route
				path={URLS.MULTIPLAYER}
				element={
					<PrivateRoute path={URLS.MULTIPLAYER} allow={[loggedIn]}>
						<Simplicity />
					</PrivateRoute>
				}
			/> */}

			{/* keep  <Route path="*"> being the last of siblings */}
			<Route path="*" element={<Page404 />} />
		</Routes>
	)
}
export default RouteStacks
