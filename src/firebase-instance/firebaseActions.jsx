
import { timeRef, firebaseRefUserFind, firebaseRefUser, firebaseRefUserDetail, firebaseRefGameData, firebaseRefGame, firebaseRefRoomGameline, firebaseRefUserLastPlayed, firebaseRefPlayerOnRoom, firebaseRefRoom, firebaseRefScore, firebaseRefFindUserScore, firebaseRefRoomCode, firebaseRefMaintenance, firebaseRespondenDataRef, firebaseRespondenDataPushRef, firebaseRespondenSectionRef, firebaseRefInf, firebaseRisetRef, firebaseRefListInstansi, firebaseRefLeaderBoard } from './firebaseRef'
import { DataSimplicity } from './data_structure'
import configureStore from '@/src/store'
import USER_GETTERS from '@/src/store/modules/User/getters'
import navigateTo from '@/src/utils/navigateTo'

const { store, persistor } = configureStore()
