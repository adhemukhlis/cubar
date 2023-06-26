import { setState } from "react-rest-state";
import {
  timeRef,
  firebaseRefUserFind,
  firebaseRefUser,
  firebaseRefUserDetail,
  firebaseRefGameData,
  firebaseRefGame,
  firebaseRefRoomGameline,
  firebaseRefUserLastPlayed,
  firebaseRefPlayerOnRoom,
  firebaseRefRoom,
  firebaseRefScore,
  firebaseRefFindUserScore,
  firebaseRefRoomCode,
  firebaseRefMaintenance,
  firebaseRespondenDataRef,
  firebaseRespondenDataPushRef,
  firebaseRespondenSectionRef,
  firebaseRefInf,
  firebaseRisetRef,
} from "../firebaseRef/firebaseRef";
import { DataSimplicity, DataOperations, DataUser } from "./data_structure";
import { ConsoleLog } from "../lib/func";
import { getState } from "../global-state/global-state";

export const STORE_MAINTENANCE_STATUS = (func) => {
  firebaseRefMaintenance.on("value", (snap) => {
    func(snap.val());
  });
};
export const Store_UpdateUserToken = (id, token, callback) =>
  firebaseRefUserFind(id).update(
    {
      utoken: token,
    },
    (error) => {
      if (error) {
        
      } else {
        callback();
      }
    }
  );
export const Store_UpdateUserLastPlayed = (id) => firebaseRefUserLastPlayed(id);
export const Store_UpdateUserScoreOnRoom = (id, roomcode, score) =>
  firebaseRefPlayerOnRoom(roomcode, id).update({ score: score });
export const Store_SetUserCreateRoom = () => {
  const userdata = getState("_userdata");
  firebaseRefRoomCode(userdata.uid).once("value", (snap) => {
    if (snap.exists()) {
      firebaseRefRoom(snap.val()).set({
        roomcode: snap.val(),
        playing: false,
      });
      firebaseRefPlayerOnRoom(snap.val(), userdata.uid).set({
        playing: false,
        username: userdata.username,
        uid: userdata.uid,
        imageProfile: userdata.imageProfile,
      });
      // callback(snap.val());
      console.log(snap.val());
    } else {
      ConsoleLog("room code tidak tersedia");
    }
  });
};
export const Store_SetUserLeaveRoom = (id, master, roomcode) => {
  if (master === "master") {
    firebaseRefGame.child(roomcode).off();
    firebaseRefGame.child(roomcode).remove();
  } else {
    firebaseRefPlayerOnRoom(roomcode, id).off();
    firebaseRefPlayerOnRoom(roomcode, id).remove();
  }
};
export const Store_SetUserJoinRoom = (roomcode) =>
  firebaseRefRoom(roomcode).once("value", (snapshot) => {
    const userdata = getState("_userdata");
    if (snapshot.exists()) {
      firebaseRefPlayerOnRoom(roomcode, userdata.uid).set({
        username: userdata.username,
        uid: userdata.uid,
        imageProfile: userdata.imageProfile,
      });
      firebaseRefRoomGameline(roomcode).on("value", (snap) => {
        let gl = [];
        setState({ gameline: [], gameindex: 0, match: [], score: [] });
        snap.forEach((shot) => {
          gl.push(shot.val());
        });
        setState({ gameline: gl, roomcode: roomcode });
      });
    } else {
      ConsoleLog("room tidak ditemukan");
    }
  });
export const Store_GuestData = async (guestdata) => {
  return DataUser(
    guestdata.uid,
    guestdata.username,
    guestdata.imageProfile,
    guestdata.email
  );
};
export const Store_GetBasicUserData = (id, func) =>
  firebaseRefUser.child(id).on("value", (snap) => {
    func(snap.val());
  });
export const Store_GetBasicUserDataOnce = (id, func) =>
  firebaseRefUser.child(id).once("value", (snap) => {
    func(snap.val());
  });
export const Store_GetAllBasicUserData = (func) =>
  firebaseRefUser.on("value", (snap) => {
    let tmp = [];
    snap.forEach((data) => {
      tmp.push(data.val());
    });
    func(tmp);
  });
export const Store_SetBasicUserData = (id, data) =>
  firebaseRefUser.child(id).update(data);
export const Store_UserData = (userdata, callback) =>
  firebaseRefUserFind(userdata.uid).on("value", (snap) => {
    if (snap.exists()) {
      ConsoleLog("sudah terdaftar");
      callback(snap.val(), userdata.utoken, userdata);
    } else {
      ConsoleLog("belum terdaftar");
      const data = DataUser(
        userdata.uid,
        userdata.username,
        userdata.imageProfile,
        userdata.email
      );
      firebaseRefUserFind(userdata.uid).set(data);
      Store_UserData(userdata, callback);
    }
  });
export const Store_OnlyOneLogin = (uid, utoken, logout) =>
  firebaseRefUserFind(uid).on("value", (snap) => {
    if (snap.val().utoken !== utoken) {
      logout();
    }
  });
export const Store_OffLogin = (uid) => {
  firebaseRefUserFind(uid).off();
};
export const Store_GetGameData = (game_name, callback) =>
  firebaseRefGameData(game_name).once("value", (snap) => {
    let data = [];
    if (game_name === "simplicity") {
      snap.forEach((shot) => {
        data.push(DataSimplicity(shot.val().q, shot.val().r, shot.val().fn));
      });
    } else if (game_name === "operations") {
      snap.forEach((shot) => {
        data.push(
          DataOperations(shot.val().a, shot.val().b, shot.val().o, shot.val().r)
        );
      });
    }
    setState({ [game_name]: data });
    // callback( data );
  });
export const Store_SetUserScore = (id, cat, val) =>
  firebaseRefFindUserScore(id).update({ [cat]: val });
export const Store_GetUserScore = (id, callback) =>
  firebaseRefFindUserScore(id).on("value", (snap) => {
    callback(snap.val());
  });
export const Store_GetAllUserScore = (callback) =>
  firebaseRefScore.on("value", (snap) => {
    let tmp = [];
    snap.forEach((data) => {
      tmp.push({
        ...data.val(),
        uid: data.key,
      });
    });
    callback(tmp);
  });
export const Store_GetUserRoomcode = (id, callback) =>
  firebaseRefUserDetail(id)
    .child("roomcode")
    .on("value", (snap) => {
      if (snap.exists()) {
        console.log("roomcode ada");
        callback(snap.val());
      }
    });
export const Store_SetUserRoomcode = (id, roomcode) =>
  firebaseRefUserDetail(id).update({ roomcode: roomcode });
export const Store_DelRoomGameline = (roomcode) =>
  firebaseRefRoomGameline(roomcode).remove();
export const Store_UpdateRoom = (roomcode, gameline) =>
  firebaseRefRoom(roomcode).update({ gameline: gameline });
export const Store_SetRespondenData = (
  uid,
  nama,
  email,
  umur,
  gender,
  pendidikan
) =>
  firebaseRespondenDataRef(uid).set({
    uid: uid,
    nama: nama,
    email: email,
    umur: umur,
    gender: gender,
    pendidikan: pendidikan,
    timestamp: timeRef,
  });
export var respondenPushKey = firebaseRespondenDataPushRef.push();
export const Store_PushRespondenData = (
  key,
  nama,
  umur,
  gender,
  sekolah,
  kelas,
  func
) => {
  firebaseRespondenDataRef(key).set({
    uid: key,
    nama: nama,
    email: "",
    umur: umur,
    gender: gender,
    pendidikan: "",
    sekolah: sekolah,
    kelas: kelas,
    timestamp: timeRef,
  });
  func(key);
};
export const Store_SetRespondenSectionData = (section, uid, data) =>
  firebaseRespondenSectionRef(uid, section).set(data);
export const Store_CheckRespondenDataExist = (uid, callback) => {
  firebaseRespondenDataRef(uid).once("value", (snap) => {
    ConsoleLog("responden exist " + snap.exists());
    callback(snap.exists());
  });
};
export const Store_GetSystemInfo = () => {
  firebaseRefInf.on("value", (snap) => {
    let _info = [];
    snap.forEach((shot) => {
      _info.push(shot.val());
    });
    setState({ _info });
  });
};
export const checkResponden = (actiondelete) => {
  firebaseRisetRef
    .child("dataresponden")
    .orderByChild("sekolah")
    .equalTo("sdn 4 kalibagor")
    .once("value", (snap) => {
      snap.forEach((data) => {
        firebaseRisetRef
          .child("section1")
          .child(data.key)
          .once("value", (snap) => {
            if (snap.exists()) {
              console.log("datares @" + data.key + " ada di section1");
            } else {
              console.log("datares @" + data.key + " belum di section1");
            }
          });
        firebaseRisetRef
          .child("section2")
          .child(data.key)
          .once("value", (snap) => {
            if (snap.exists()) {
              console.log("datares @" + data.key + " ada di section2");
            } else {
              console.log("datares @" + data.key + " belum di section2");
            }
          });
        firebaseRisetRef
          .child("section3")
          .child(data.key)
          .once("value", (snap) => {
            if (snap.exists()) {
              console.log("datares @" + data.key + " ada di section3");
            } else {
              console.log("datares @" + data.key + " belum di section3");
            }
          });
        firebaseRisetRef
          .child("section4")
          .child(data.key)
          .once("value", (snap) => {
            if (snap.exists()) {
              console.log("datares @" + data.key + " ada di section4");
            } else {
              console.log("datares @" + data.key + " belum di section4");
            }
          });
        firebaseRisetRef
          .child("section5")
          .child(data.key)
          .once("value", (snap) => {
            if (snap.exists()) {
              console.log("datares @" + data.key + " ada di section5");
            } else {
              console.log("datares @" + data.key + " belum di section5");
            }
          });
      });
    });
  firebaseRisetRef.child("section1").once("value", (snap) => {
    let numnotexist = [];
    snap.forEach((data) => {
      const key = data.key.substring(0, 1);
      if (key === "-") {
        firebaseRisetRef
          .child("dataresponden")
          .child(data.key)
          .once("value", (snap) => {
            if (snap.exists()) {
              console.log("dari section1 @" + data.key + " ada di datares");
            } else {
              console.log("dari section1 @" + data.key + " belum di datares");
              numnotexist.push(data.key);
              if (actiondelete) {
                firebaseRisetRef.child("section1").child(data.key).remove();
              }
            }
          });
      }
    });
    console.log("key section1 yang tidak di temukan di datares");
    console.log(numnotexist);
  });
  firebaseRisetRef.child("section2").once("value", (snap) => {
    let numnotexist = [];
    snap.forEach((data) => {
      const key = data.key.substring(0, 1);
      if (key === "-") {
        firebaseRisetRef
          .child("dataresponden")
          .child(data.key)
          .once("value", (snap) => {
            if (snap.exists()) {
              console.log("dari section2 @" + data.key + " ada di datares");
            } else {
              console.log("dari section2 @" + data.key + " belum di datares");
              numnotexist.push(data.key);
              if (actiondelete) {
                firebaseRisetRef.child("section2").child(data.key).remove();
              }
            }
          });
      }
    });
    console.log("key section2 yang tidak di temukan di datares");
    console.log(numnotexist);
  });
  firebaseRisetRef.child("section3").once("value", (snap) => {
    let numnotexist = [];
    snap.forEach((data) => {
      const key = data.key.substring(0, 1);
      if (key === "-") {
        firebaseRisetRef
          .child("dataresponden")
          .child(data.key)
          .once("value", (snap) => {
            if (snap.exists()) {
              console.log("dari section3 @" + data.key + " ada di datares");
            } else {
              console.log("dari section3 @" + data.key + " belum di datares");
              numnotexist.push(data.key);
              if (actiondelete) {
                firebaseRisetRef.child("section3").child(data.key).remove();
              }
            }
          });
      }
    });
    console.log("key section3 yang tidak di temukan di datares");
    console.log(numnotexist);
  });
  firebaseRisetRef.child("section4").once("value", (snap) => {
    let numnotexist = [];
    snap.forEach((data) => {
      const key = data.key.substring(0, 1);
      if (key === "-") {
        firebaseRisetRef
          .child("dataresponden")
          .child(data.key)
          .once("value", (snap) => {
            if (snap.exists()) {
              console.log("dari section4 @" + data.key + " ada di datares");
            } else {
              console.log("dari section4 @" + data.key + " belum di datares");
              numnotexist.push(data.key);
              if (actiondelete) {
                firebaseRisetRef.child("section4").child(data.key).remove();
              }
            }
          });
      }
    });
    console.log("key section4 yang tidak di temukan di datares");
    console.log(numnotexist);
  });
  firebaseRisetRef.child("section5").once("value", (snap) => {
    let numnotexist = [];
    snap.forEach((data) => {
      const key = data.key.substring(0, 1);
      if (key === "-") {
        firebaseRisetRef
          .child("dataresponden")
          .child(data.key)
          .once("value", (snap) => {
            if (snap.exists()) {
              console.log("dari section5 @" + data.key + " ada di datares");
            } else {
              console.log("dari section5 @" + data.key + " belum di datares");
              numnotexist.push(data.key);
              if (actiondelete) {
                firebaseRisetRef.child("section5").child(data.key).remove();
              }
            }
          });
      }
    });
    console.log("key section5 yang tidak di temukan di datares");
    console.log(numnotexist);
  });
};
