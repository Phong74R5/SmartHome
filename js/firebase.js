const firebaseConfig = {
    apiKey: "AIzaSyC1c9boUvgQwFNdlLkt2OJbkCnN8Uw-uo8",
    authDomain: "smart-home-aa3ea.firebaseapp.com",
    databaseURL: "https://smart-home-aa3ea-default-rtdb.firebaseio.com",
    projectId: "smart-home-aa3ea",
    storageBucket: "smart-home-aa3ea.firebasestorage.app",
    messagingSenderId: "560919138174",
    appId: "1:560919138174:web:d86ee2f7402f9d65b26d2f"
};

// Khởi tạo Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Hàm cập nhật trạng thái thiết bị
function toggleDevice(roomId, deviceId, status) {
    database.ref(`rooms/${roomId}/devices/${deviceId}`).update({
        status: status
    });
}

// Hàm thêm phòng mới
function addRoom(name, icon) {
    const roomId = database.ref('rooms').push().key;
    database.ref(`rooms/${roomId}`).set({
        name: name,
        icon: icon,
        devices: {}
    });
}

// Hàm thêm thiết bị mới
function addDevice(roomId, name, description, icon) {
    const deviceId = database.ref(`rooms/${roomId}/devices`).push().key;
    database.ref(`rooms/${roomId}/devices/${deviceId}`).set({
        name: name,
        description: description,
        icon: icon,
        status: false
    });
}