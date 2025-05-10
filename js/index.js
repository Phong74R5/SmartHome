// Tải danh sách phòng
function loadRooms() {
    const roomsBox = document.querySelector('.rooms-box');
    roomsBox.innerHTML = ''; // Xóa nội dung cũ trước khi render
    database.ref('rooms').on('value', (snapshot) => {
        const rooms = snapshot.val();
        let totalDevices = 0;
        if (rooms) {
            for (const roomId in rooms) {
                const room = rooms[roomId];
                const deviceCount = Object.keys(room.devices || {}).length;
                totalDevices += deviceCount;
                const roomCard = `
                    <a href="room.html?room=${room.name}&id=${roomId}" class="room-card">
                        <i class="fa-solid ${room.icon || 'fa-bed-front'}"></i>
                        <span>${room.name}</span>
                        <span class="device-count">${deviceCount} thiết bị</span>
                    </a>
                `;
                roomsBox.innerHTML += roomCard;
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
    loadRooms();
});

// Gọi hàm tải phòng khi trang được tải
document.addEventListener('DOMContentLoaded', loadRooms);