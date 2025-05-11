function loadRooms() {
    const roomsBox = document.getElementById('roomsBox');
    const totalDeviceCountEl = document.querySelector('header .device-count');
    const roomsRef = database.ref(`rooms`);
    const roomCards = {}; // Lưu cache phòng để tính tổng thiết bị

    function updateTotalDeviceCount() {
        let totalDevices = 0;
        Object.values(roomCards).forEach(room => {
            totalDevices += Object.keys(room.devices || {}).length;
        });
        totalDeviceCountEl.textContent = `${totalDevices} thiết bị`;
    }

    // Khi có phòng mới
    roomsRef.on('child_added', (snapshot) => {
        const roomId = snapshot.key;
        const room = snapshot.val();
        roomCards[roomId] = room;

        const deviceCount = Object.keys(room.devices || {}).length;
        const roomCard = document.createElement('div');
        roomCard.id = `room-${roomId}`;
        roomCard.className = `room-card`;
        roomCard.innerHTML = `
            <a href="room.html?room=${room.name}&id=${roomId}">
            <i class="fa-solid ${room.icon || 'fa-bed-front'}"></i>
            <span>${room.name}</span>
            <span class="device-count">${deviceCount} thiết bị</span>
            </a>
            <label class="remove-button">
            <i class="fas fa-trash-alt"></i>
            <button style="display:none" type="button" onclick=removeRoom("${roomId}")></button>
            </label>
        `;
        roomsBox.appendChild(roomCard);

        updateTotalDeviceCount();
    });

    // Khi phòng bị thay đổi (ví dụ thay đổi thiết bị)
    roomsRef.on('child_changed', (snapshot) => {
        const roomId = snapshot.key;
        const room = snapshot.val();
        roomCards[roomId] = room;

        const roomCard = document.getElementById(`room-${roomId}`);
        if (room && roomCard) {
            const deviceCount = Object.keys(room.devices || {}).length;
            const countDeviceSpan = roomCard.querySelector(`.device-count`);
            if (countDeviceSpan) {
                countDeviceSpan.textContent = `${deviceCount} thiết bị`;
            }
        }

        updateTotalDeviceCount();
    });

    roomsRef.on('child_removed', (snapshot) => {
        const roomId = snapshot.key;
        delete roomCards[roomId];

        const roomCard = document.getElementById(`room-${roomId}`);
        if (roomCard) {
            roomCard.remove();
        }
        
        updateTotalDeviceCount();
    });


}

// Xử lý modal thêm phòng
function openAddRoomModal() {
    document.getElementById('addRoomModal').style.display = 'block';
}

function closeAddRoomModal() {
    document.getElementById('addRoomModal').style.display = 'none';
    document.getElementById('addRoomForm').reset();
}

// Xử lý form thêm phòng
document.getElementById('addRoomForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const roomName = document.getElementById('roomName').value;
    const roomIcon = document.querySelector('input[name="roomIcon"]:checked').value;
    addRoom(roomName, roomIcon);
    closeAddRoomModal();
});

// Gọi hàm tải phòng khi trang được tải
document.addEventListener('DOMContentLoaded', loadRooms);