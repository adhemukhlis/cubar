/*
 * Will dynamically create reducers
 * enforcing a unique way to describe reducers
 */
const createReducer = (initialState, handlers) => {
	return (state = initialState, action) => {
		if (action.type in handlers) {
			return handlers[action.type](state, action)
		} else {
			return state
		}
	}
}

export default createReducer
