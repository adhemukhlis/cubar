import { get } from 'lodash'
const GAME_GETTERS = {
	SIMPLICITY_SOAL_LAST_UPDATE: (state) => get(state, 'Game.soal.simplicity.updated_at', ''),
	SIMPLICITY_SOAL: (state) => get(state, 'Game.soal.simplicity.items', [])
}
export default GAME_GETTERS
