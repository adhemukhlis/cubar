const randValue = (max, min, prev, callback) => {
	const num = Math.floor(min + Math.random() * (max - min))
	if (num === prev) {
		randValue(max, min, prev, callback)
	} else {
		callback(num)
	}
}

export default randValue
