// Biến tham chiếu đến listener để quản lý
let roomsRefListener = null;

// Tải danh sách phòng
function loadRooms() {
    const roomsBox = document.querySelector('.rooms-box');
    // Tháo gỡ listener cũ nếu có
    if (roomsRefListener) {
        database.ref('rooms').off('value', roomsRefListener);
    }

    // Xóa nội dung cũ
    roomsBox.innerHTML = '';

    // Gắn listener mới
    roomsRefListener = database.ref('rooms').on('value', (snapshot) => {
        const rooms = snapshot.val();
        let totalDevices = 0;
        roomsBox.innerHTML = ''; // Đảm bảo xóa nội dung trước khi render

        if (rooms) {
            for (const roomId in rooms) {
                const room = rooms[roomId];
                const deviceCount = Object.keys(room.devices || {}).length;
                totalDevices += deviceCount;

                const roomCard = document.createElement('a');
                roomCard.href = `room.html?room=${room.name}&id=${roomId}`;
                roomCard.className = 'room-card';
                roomCard.innerHTML = `
                    <i class="fa-solid ${room.icon || 'fa-bed-front'}"></i>
                    <span>${room.name}</span>
                    <span class="device-count">${deviceCount} thiết bị</span>
                `;
                roomsBox.appendChild(roomCard);
            }
        }
        document.querySelector('.all-devices .device-count').textContent = `${totalDevices} thiết bị`;
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