import {
	timeRef,
	firebaseRefUserFind,
	firebaseRefRoomCode,
	firebaseRefRoom,
	firebaseRefPlayerOnRoom,
	firebaseRefGame,
	firebaseRefLeaderBoard,
	firebaseRefListInstansi
} from './firebaseRef'
import configureStore from 'src/store'
import USER_GETTERS from '@/src/store/modules/User/getters'
import navigateTo from '@/src/utils/navigateTo'
const { store } = configureStore()
export const Store_OffLogin = (uid) => {
	firebaseRefUserFind(uid).off()
}

export const Store_SetJoinRoom = (roomCode, gameFrom) => {
	const UID = USER_GETTERS.UID(store.getState())
	const username = USER_GETTERS.username(store.getState())
	const imageProfile = USER_GETTERS.imageProfile(store.getState())
	return new Promise((resolve, reject) =>
		firebaseRefRoomCode(UID).once('value', (playerRoomCode) => {
			if (playerRoomCode.exists()) {
				if (playerRoomCode.val() === roomCode) {
					// cek jika player memasuki room miliknya
					console.log('Store_SetJoinRoom')
					firebaseRefRoom(roomCode).update({
						roomcode: roomCode,
						room_master: UID,
						...(gameFrom === undefined ? { game_status: 'waiting' } : {})
					})
					firebaseRefPlayerOnRoom(roomCode, UID).set({
						playing: false,
						username: username,
						user_role: 'master',
						salah: 0,
						benar: 0,
						score: 0,
						uid: UID,
						imageProfile: imageProfile
					})
					resolve('ok')
				} else {
					//cek jika masuk ke room player lain
					firebaseRefRoom(roomCode).once('value', (playerRoomData) => {
						if (playerRoomData.exists()) {
							const { players } = playerRoomData.val()
							joinRoomParticipant({ players, roomCode, UID, username, imageProfile })
								.then((res) => {
									resolve(res)
								})
								.catch((err) => {
									reject(err)
								})
						} else {
							reject({
								statusCode: 404,
								message: `Room ${roomCode} tidak ditemukan`
							})
						}
					})
				}
			} else {
				firebaseRefRoom(roomCode).once('value', (playerRoomData) => {
					if (playerRoomData.exists()) {
						const { players } = playerRoomData.val()
						joinRoomParticipant({ players, roomCode, UID, username, imageProfile })
							.then((res) => {
								resolve(res)
							})
							.catch((err) => {
								reject(err)
							})
					} else {
						reject({
							statusCode: 404,
							message: `Room ${roomCode} tidak ditemukan`
						})
					}
				})
			}
		})
	)
}

const joinRoomParticipant = ({ players, roomCode, UID, username, imageProfile }) =>
	new Promise((resolve, reject) => {
		if (Object.keys(players || {}).length > 0) {
			// cek jika pemilik room sudah create room
			firebaseRefPlayerOnRoom(roomCode, UID).set({
				playing: false,
				username: username,
				user_role: 'participant',
				uid: UID,
				imageProfile: imageProfile,
				salah: 0,
				benar: 0,
				score: 0
			})
			resolve('ok')
		} else {
			reject({
				statusCode: 404,
				message: `Room ${roomCode} belum dibuat`
			})
		}
	})

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
				const { players } = snap.val()
				if (Object.keys(players || {}).length > 0) {
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
export const firebaseListLeaderboardByInstansi = (key, callback) => firebaseRefLeaderBoard.child(key)
// .on('value', (snap) => {
// 	let tmp = []
// 	snap.forEach((data) => {
// 		tmp.push({
// 			...data.val(),
// 			id: data.key
// 		})
// 	})
// 	callback(tmp)
// }
// )
export const firebaseListInstansi = (callback) =>
	firebaseRefListInstansi.on('value', (snap) => {
		let tmp = []
		snap.forEach((data) => {
			tmp.push({
				...data.val(),
				key: data.key
			})
		})
		callback(tmp)
	})
