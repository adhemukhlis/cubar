/*
 * combines all th existing reducers
 */
import Auth from './modules/Auth/reducers'
import User from './modules/User/reducers'
import Game from './modules/Game/reducers'

export default {
	Auth,
	User,
	Game
}
