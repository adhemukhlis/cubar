import createReducer from '@/src/store/createReducer'
import REDUCER_TYPES from '@/src/store/types/reducer-types'
import objectMerge from '@/src/store/utils/objectMerge'

const initialState = {}

export default createReducer(initialState, {
	[REDUCER_TYPES.USER_USER_DATA](state, { type, ...payload }) {
		return objectMerge(state, 'user_data', payload)
	}
})
