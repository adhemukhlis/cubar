/*
 * combines all th existing reducers
 */
import Auth from './modules/Auth/reducers'
import User from './modules/User/reducers'

export default {
	Auth,
	User
}
