import {
	timeRef,
	firebaseRefUserFind,
	firebaseRefRoomCode,
	firebaseRefRoom,
	firebaseRefPlayerOnRoom,
	firebaseRefGame
} from './firebaseRef'
import configureStore from 'src/store'
import USER_GETTERS from '@/src/store/modules/User/getters'
import navigateTo from '@/src/utils/navigateTo'
const { store } = configureStore()
export const Store_OffLogin = (uid) => {
	firebaseRefUserFind(uid).off()
}

export const Store_SetJoinRoom = (roomCode) => {
	console.log(roomCode)
	const UID = USER_GETTERS.UID(store.getState())
	const username = USER_GETTERS.username(store.getState())
	const imageProfile = USER_GETTERS.imageProfile(store.getState())
	return new Promise((resolve, reject) =>
		firebaseRefRoomCode(UID).once('value', (snap) => {
			console.log(snap.val())
			if (snap.exists()) {
				console.log(snap.val() === roomCode)

				if (snap.val() === roomCode) {
					// cek jika player memasuki room miliknya
					firebaseRefRoom(snap.val()).set({
						roomcode: snap.val(),
						playing: false,
						room_master: UID
					})
					firebaseRefPlayerOnRoom(snap.val(), UID).set({
						playing: false,
						username: username,
						user_role: 'master',
						uid: UID,
						imageProfile: imageProfile
					})
					resolve('ok')
				} else {
					//cek jika masuk ke room player lain
					firebaseRefRoom(roomCode).once('value', (snap) => {
						if (snap.exists()) {
							const { player } = snap.val()
							if (Object.keys(player || {}).length > 0) {
								// cek jika pemilik room sudah create room
								firebaseRefPlayerOnRoom(roomCode, UID).set({
									username: username,
									user_role: 'participant',
									uid: UID,
									imageProfile: imageProfile
								})
								resolve('ok')
							} else {
								reject({
									statusCode: 404,
									message: `Room ${roomCode} belum dibuat`
								})
							}
						} else {
							reject({
								statusCode: 404,
								message: `Room ${roomCode} tidak ditemukan`
							})
						}
					})
				}
			} else {
				reject({
					statusCode: 404,
					message: `Room ${roomCode} tidak ditemukan`
				})
			}
		})
	)
}

export const Store_SetUserCreateRoom = () => {
	const UID = USER_GETTERS.UID(store.getState())
	return new Promise((resolve, reject) =>
		firebaseRefRoomCode(UID).once('value', (snap) => {
			if (snap.exists()) {
				resolve('ok')
				navigateTo('/room/' + snap.val())
			} else {
				reject({
					statusCode: 404,
					message: `Player Belum Memiliki Room!`
				})
			}
		})
	)
}

export const Store_SetUserJoinRoom = (roomcode) => {
	const UID = USER_GETTERS.UID(store.getState())
	const username = USER_GETTERS.username(store.getState())
	const imageProfile = USER_GETTERS.imageProfile(store.getState())
	return new Promise((resolve, reject) =>
		firebaseRefRoom(roomcode).once('value', (snap) => {
			if (snap.exists()) {
				const { player } = snap.val()
				if (Object.keys(player || {}).length > 0) {
					firebaseRefPlayerOnRoom(roomcode, UID).set({
						username: username,
						user_role: 'participant',
						uid: UID,
						imageProfile: imageProfile
					})
					// firebaseRefRoomGameline(roomcode).on('value', (snap) => {
					// 	let gl = []
					// 	setState({ gameline: [], gameindex: 0, match: [], score: [] })
					// 	snap.forEach((shot) => {
					// 		gl.push(shot.val())
					// 	})
					// 	setState({ gameline: gl, roomcode: roomcode })
					// })
					navigateTo('/room/' + roomcode)
					resolve('ok')
				} else {
					reject({
						statusCode: 404,
						message: `Room ${roomcode} belum dibuat`
					})
				}
			} else {
				reject({
					statusCode: 404,
					message: `Room ${roomcode} tidak ditemukan`
				})
			}
		})
	)
}
export const Store_SetUserLeaveRoom = async (id, master, roomcode) =>
	await new Promise((resolve, reject) => {
		if (master === 'master') {
			firebaseRefGame.child(roomcode).off()
			firebaseRefGame.child(roomcode).remove()
			resolve('ok')
		} else {
			firebaseRefPlayerOnRoom(roomcode, id).off()
			firebaseRefPlayerOnRoom(roomcode, id).remove()
			resolve('ok')
		}
	})
