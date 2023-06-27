import React, { useState, useEffect } from 'react'
import { LoginContainer, HeadLogo, ButtonLoginContainer } from '@/src/styles/styles'
import { Cubar } from '@/src/styles/icon'
import Button3d from '@/src/components/3d-button/3d-button'
import { useDispatch } from 'react-redux'
import AUTH_ACTIONS from '@/src/store/modules/Auth/actions'
import ACTION_TYPES from '@/src/store/types/action-types'
import { useGoogleLogin } from '@react-oauth/google'
import axios from 'axios'
const ViewLogin = () => {
	const dispatch = useDispatch()
	const [loading, setLoading] = useState(false)
	const getUser = async (utoken) =>
		await axios.request({
			method: 'get',
			url: 'https://www.googleapis.com/oauth2/v2/userinfo',
			params: {
				oauth_token: utoken
			}
		})
	const appAuth = async (utoken) => {
		const { data: resUserData } = await getUser(utoken)
		const userdata = {
			uid: resUserData.id,
			username: resUserData.given_name,
			email: resUserData.email,
			imageProfile: resUserData.picture,
			utoken
		}
		dispatch(AUTH_ACTIONS[ACTION_TYPES.AUTH_LOGIN]({ userData: userdata }))
	}
	const login = useGoogleLogin({
		onSuccess: (tokenResponse) => {
			const utoken = tokenResponse.access_token
			appAuth(utoken).finally(() => {
				setLoading(false)
			})
		},
		onError: () => {
			console.log('Login Failed')
			setLoading(false)
		},
		scope: 'profile'
	})

	useEffect(() => {}, [])
	return (
		<div style={LoginContainer}>
			<Cubar style={HeadLogo} />
			<div style={ButtonLoginContainer}>
				<Button3d
					style={StyleButtonLogin}
					onClick={() => {
						login()
						setLoading(true)
					}}
					disabled={false}
					loading={loading}>
					Login with Google
				</Button3d>
			</div>
		</div>
	)
}
const StyleButtonLogin = {
	backgroundColor: '#2185D0',
	color: '#f5f5f5'
}
export default ViewLogin
