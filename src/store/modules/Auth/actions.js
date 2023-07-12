import ApiService from '@/src/services/apiService'
import ACTION_TYPES from '@/src/store/types/action-types'
import REDUCER_TYPES from '@/src/store/types/reducer-types'
import { get, isEqual } from 'lodash'
import { firebaseRefUserToken } from '@/src/firebase-instance/firebaseRef'
import URLS from '@/src/enums/urls'
import AUTH_GETTERS from './getters'
import navigateTo from '@/src/utils/navigateTo'
import { googleLogout } from '@react-oauth/google'

/**
 * berisi perintah untuk integrasi ke backend rest api
 */
export default {
	[ACTION_TYPES.AUTH_LOGIN]({ userData }) {
		const { uid, utoken, username, email, imageProfile } = userData
		return async (dispatch, state) => {
			dispatch({
				type: REDUCER_TYPES.AUTH_LOGIN,
				isLoading: true
			})
			return new Promise((resolve, reject) => {
				return ApiService.request({
					method: 'get',
					url: `accounts/${uid}.json`
				}).then((res) => {
					const _status = get(res, 'status', 500)
					const _name = get(res, 'data.name')
					const _email = get(res, 'data.email', '')
					const _imageProfile = get(res, 'data.imageProfile', '')
					const userDataAuth = {
						email,
						name: username,
						imageProfile,
						uid
					}
					const userDataResponse = {
						email: _email,
						name: _name,
						imageProfile: _imageProfile,
						uid
					}
					const isUserDataEqual = isEqual(userDataAuth, userDataResponse)
					if (_status === 200) {
						ApiService.request({
							method: 'patch',
							url: `accounts/${uid}.json`,
							data: {
								utoken,
								...(!isUserDataEqual ? userDataAuth : {})
							}
						})
							.then(() => {
								firebaseRefUserToken(uid).on('value', (tokenSnapshoot) => {
									if (tokenSnapshoot.val() !== utoken) {
										firebaseRefUserToken(uid).off()
										dispatch({
											type: REDUCER_TYPES.AUTH_LOGIN
										})
										dispatch({
											type: REDUCER_TYPES.USER_USER_DATA
										})
										navigateTo(URLS.LOGIN)
									}
								})
								dispatch({
									type: REDUCER_TYPES.USER_USER_DATA,
									uid: uid,
									username: username,
									email: email,
									imageProfile: imageProfile
								})
								dispatch({
									type: REDUCER_TYPES.AUTH_LOGIN,
									utoken,
									uid
								})
								navigateTo(URLS.MENU)
								resolve({ status: 200 })
							})
							.finally(() => {
								dispatch({
									type: REDUCER_TYPES.AUTH_LOGIN,
									isLoading: false
								})
							})
					}
				})
			})
		}
	},
	[ACTION_TYPES.AUTH_CHECK]() {
		return async (dispatch, state) => {
			const uid = AUTH_GETTERS.uid(state())
			const utoken = AUTH_GETTERS.loginToken(state())
			dispatch({
				type: REDUCER_TYPES.AUTH_LOGIN,
				isLoading: true
			})
			return ![uid !== '', utoken !== ''].includes(false)
				? new Promise((resolve, reject) => {
						return ApiService.request({
							method: 'get',
							url: `accounts/${uid}.json`
						})
							.then((res) => {
								const _status = get(res, 'status', 500)
								const _utoken = get(res, 'data.utoken', '')
								if (_status === 200) {
									if (utoken === _utoken) {
										firebaseRefUserToken(uid).on('value', (tokenSnapshoot) => {
											if (tokenSnapshoot.val() !== utoken) {
												firebaseRefUserToken(uid).off()
												dispatch({
													type: REDUCER_TYPES.AUTH_LOGIN
												})
												dispatch({
													type: REDUCER_TYPES.USER_USER_DATA
												})
												navigateTo(URLS.LOGIN)
											}
										})
										dispatch({
											type: REDUCER_TYPES.USER_USER_DATA,
											uid: res.data.uid,
											username: res.data.name,
											email: res.data.email,
											imageProfile: res.data.imageProfile
										})
										resolve({ status: 200 })
									} else {
										firebaseRefUserToken(uid).off()
										dispatch({
											type: REDUCER_TYPES.AUTH_LOGIN
										})
										dispatch({
											type: REDUCER_TYPES.USER_USER_DATA
										})
										resolve({ status: 403 })
									}
								}
							})
							.finally(() => {
								dispatch({
									type: REDUCER_TYPES.AUTH_LOGIN,
									isLoading: false
								})
							})
				  })
				: { status: 404 }
		}
	},
	[ACTION_TYPES.AUTH_LOGOUT]() {
		return async (dispatch, state) => {
			googleLogout()
			const uid = AUTH_GETTERS.uid(state())
			ApiService.request({
				method: 'patch',
				url: `accounts/${uid}.json`,
				data: {
					utoken: ''
				}
			})
			dispatch({
				type: REDUCER_TYPES.AUTH_LOGIN
			})
			dispatch({
				type: REDUCER_TYPES.USER_USER_DATA
			})
			return true
		}
	}
}
