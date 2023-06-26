import { get } from 'lodash'
const AUTH_GETTERS = {
	loginToken: (state) => get(state, 'Auth.login.utoken', '')
}
export default AUTH_GETTERS
