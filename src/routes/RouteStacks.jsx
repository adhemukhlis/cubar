import React from 'react'
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

import Page404 from '../pages/404'
import Login from '../pages/Login'
import Menu from '../pages/Menu'
import MultiPlayer from '../pages/MultiPlayer'
import Room from '../pages/Room'
import LeaderBoard from '../pages/LeaderBoard'
import Simplicity from '../pages/games/simplicity'
const RouteStacks = () => {
	const loggedIn = () => {
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
			<Route
				path={URLS.MULTIPLAYER}
				element={
					<PrivateRoute path={URLS.MULTIPLAYER} allow={[loggedIn]}>
						<MultiPlayer />
					</PrivateRoute>
				}
			/>
			<Route
				path={URLS.ROOM}
				element={
					<PrivateRoute path={URLS.ROOM} allow={[loggedIn]}>
						<Room />
					</PrivateRoute>
				}
			/>
			<Route
				path={URLS.LEADERBOARD}
				element={
					<PrivateRoute path={URLS.LEADERBOARD}>
						<LeaderBoard />
					</PrivateRoute>
				}
			/>
			<Route
				path={URLS.SIMPLICITY}
				element={
					<PrivateRoute path={URLS.SIMPLICITY} allow={[loggedIn]}>
						<Simplicity />
					</PrivateRoute>
				}
			/>

			{/* keep  <Route path="*"> being the last of siblings */}
			<Route path="*" element={<Page404 />} />
		</Routes>
	)
}
export default RouteStacks
