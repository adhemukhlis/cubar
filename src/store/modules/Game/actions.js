import ApiService from '@/src/services/apiService'
import ACTION_TYPES from '@/src/store/types/action-types'
import REDUCER_TYPES from '@/src/store/types/reducer-types'
import GETTERS from './getters'

/**
 * berisi perintah untuk integrasi ke backend rest api
 */

export default {
	[ACTION_TYPES.GAME_SIMPLICITY_SOAL]() {
		return async (dispatch, state) => {
			const simplicity_last_update = GETTERS.SIMPLICITY_SOAL_LAST_UPDATE(state())
			const data_last_update = await ApiService.request({
				method: 'GET',
				url: `games_prop/simplicity/updated_at.json`
			})
			if (data_last_update.data !== simplicity_last_update) {
				const { data } = await ApiService.request({
					method: 'GET',
					url: `games_prop/simplicity/items.json`
				})
				dispatch({
					type: REDUCER_TYPES.GAME_SIMPLICITY_SOAL,
					updated_at: data_last_update.data,
					items: Object.keys(data || {}).map((key) => ({ id: key, ...data[key] }))
				})
			}
			return true
		}
	}
}
