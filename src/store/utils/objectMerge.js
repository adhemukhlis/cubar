import set from 'lodash/fp/set'
import merge from 'lodash/fp/merge'

const objectMerge = (state, name, value) => set(name, Object.keys(value).length < 1 ? {} : merge(value, state[name]), state)

export default objectMerge
