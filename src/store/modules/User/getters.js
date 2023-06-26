import { get } from 'lodash'
const USER_GETTERS = {
	UID: (state) => get(state, 'User.user_data.uid', ''),
	username: (state) => get(state, 'User.user_data.username', ''),
	imageProfile: (state) => get(state, 'User.user_data.imageProfile', '')
}
export default USER_GETTERS
