export const DataSimplicity = ( q, r, fn ) => {
	return { q: q, r: r, fn: fn }
}
export const DataOperations = ( a, b, o, r ) => {
	return { a: a, b: b, o: o, r: r }
}
export const DataUser = ( uid, username, imageProfile, email ) => {
	return { uid: uid, username: username, imageProfile: imageProfile, email: email }
}