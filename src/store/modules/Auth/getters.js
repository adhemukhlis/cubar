import { get } from 'lodash'
const AUTH_GETTERS = {
	loginToken: (state) => get(state, 'Auth.login.utoken', ''),
	uid: (state) => get(state, 'Auth.login.uid', '')
}
export default AUTH_GETTERS
