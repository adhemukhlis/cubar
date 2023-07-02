import firebase from '@firebase/app'
import '@firebase/database'
import '@firebase/storage'
const config = {
	apiKey: 'AIzaSyA_Opf83HriQCLBL7TeB939SUoTKE1Jv0A',
	authDomain: 'brem-br3m.firebaseapp.com',
	databaseURL: 'https://brem-br3m.firebaseio.com',
	projectId: 'brem-br3m',
	storageBucket: 'brem-br3m.appspot.com',
	messagingSenderId: '111396317998'
}
firebase.initializeApp(config)
export const rootRefStore = firebase.storage().ref('images')
export const rootRef = firebase.database().ref()
export const firebaseTimestamp = firebase.database.ServerValue.TIMESTAMP
// update used
export const firebaseRefUserToken = (key) => rootRef.child('accounts').child(key).child('utoken')
export const firebaseRefUserAccount = (key) => rootRef.child('accounts').child(key)
export const firebaseRefUserDevices = (key) => rootRef.child('userDevices').child(key)
// update used

export const timeRef = firebase.database.ServerValue.TIMESTAMP
export const firebaseRef = rootRef.child('games_props')
export const firebaseRisetRef = rootRef.child('riset')
export const firebaseRespondenDataRef = (uid) => firebaseRisetRef.child('dataresponden').child(uid)
export const firebaseRespondenDataPushRef = firebaseRisetRef.child('dataresponden')
export const firebaseRespondenSectionRef = (uid, section) => firebaseRisetRef.child(section).child(uid)
export const firebaseRefGameline = rootRef.child('gameline')
export const firebaseRefInf = rootRef.child('information')
export const firebaseRefGame = rootRef.child('game')
export const firebaseRefSystem = rootRef.child('system')
export const firebaseRefMaintenance = firebaseRefSystem.child('maintenance')
export const firebaseRefVersion = firebaseRefSystem.child('currentVersion')
export const firebaseRefUser = rootRef.child('playerBasicData')
export const firebaseRefUserDetail = (id) => rootRef.child('playerSupportData').child(id)
export const firebaseRefScore = rootRef.child('playerScoreData')
export const firebaseRefListInstansi = rootRef.child('list_instansi')
export const firebaseRefLeaderBoard = rootRef.child('leaderboard')
export const firebaseRefFindUserScore = (id) => firebaseRefScore.child(id)
export const firebaseRefUserFind = (key) => firebaseRefUser.child(key)

export const firebaseRefUserLastPlayed = (key) => firebaseRefUser.child(key).update({ lastPlayed: timeRef })
export const firebaseRefRoom = (roomcode) => firebaseRefGame.child(roomcode)
export const firebaseRefRoomGameline = (roomcode) => firebaseRefRoom(roomcode).child('gameline')
export const firebaseRefPlayerOnRoom = (roomcode, uid) => firebaseRefRoom(roomcode).child('players').child(uid)
export const firebaseRefPlayers = (roomcode) => firebaseRefRoom(roomcode).child('players')
export const firebaseRefUserRoom = (key) => firebaseRefUserFind(key).child('roomcode')
export const firebaseRefGameData = (game) => firebaseRef.child(game)
export const firebaseRefPlayerSupportData = (id) => rootRef.child('playerSupportData').child(id)
export const firebaseRefRoomCode = (id) => firebaseRefPlayerSupportData(id).child('roomcode')
