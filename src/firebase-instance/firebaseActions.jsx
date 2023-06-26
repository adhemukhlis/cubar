import { timeRef, firebaseRefUserFind, firebaseRefRoomCode, firebaseRefRoom, firebaseRefPlayerOnRoom, firebaseRefGame } from './firebaseRef'
import configureStore from 'src/store'
import USER_GETTERS from '@/src/store/modules/User/getters'
import navigateTo from '@/src/utils/navigateTo'
const { store } = configureStore()
export const Store_OffLogin = (uid) => {
	firebaseRefUserFind(uid).off()
}

export const Store_SetUserCreateRoom = () => {
	const UID = USER_GETTERS.UID(store.getState())
	const username = USER_GETTERS.username(store.getState())
	const imageProfile = USER_GETTERS.imageProfile(store.getState())
	firebaseRefRoomCode(UID).once('value', (snap) => {
		if (snap.exists()) {
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
			navigateTo('/room/' + snap.val())
		} else {
			console.log('room code tidak tersedia')
		}
	})
}

export const Store_SetUserJoinRoom = (roomcode) => {
	console.log('hehehe')
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
export const Store_SetUserLeaveRoom = (id, master, roomcode) => {
	if (master === 'master') {
		firebaseRefGame.child(roomcode).off()
		firebaseRefGame.child(roomcode).remove()
	} else {
		firebaseRefPlayerOnRoom(roomcode, id).off()
		firebaseRefPlayerOnRoom(roomcode, id).remove()
	}
}
