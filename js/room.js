// Lấy thông tin phòng từ URL
const urlParams = new URLSearchParams(window.location.search);
const roomName = urlParams.get('room');
const roomId = urlParams.get('id');
document.querySelector('header h1').textContent = roomName;
document.querySelector('title').textContent = roomName;

// Tải danh sách thiết bị
function loadDevices() {
    const devicesBox = document.getElementById('devicesBox');
    const devicesRef = database.ref(`rooms/${roomId}/devices`);

    // Lắng nghe thiết bị mới được thêm
    devicesRef.on('child_added', (snapshot) => {
        const deviceId = snapshot.key;
        const device = snapshot.val();
        const deviceCard = document.createElement('div');
        deviceCard.className = 'device';
        deviceCard.id = `device-${deviceId}`; // Thêm ID để dễ cập nhật
        deviceCard.innerHTML = `
            <i class="fa-solid ${device.icon || 'fa-tv'}"></i>
            <h3>${device.name}</h3>
            <p>${device.description}</p>
            <label class="switch">
                <input type="checkbox" data-id="${deviceId}" ${device.status ? 'checked' : ''} 
                       onchange="toggleDevice('${roomId}', this.dataset.id, this.checked)">
                <span class="slider"></span>
            </label>
            <label class="remove-button">
                <i class="fas fa-trash-alt"></i>
                <button style="display:none" type="button" onclick=removeDevice("${roomId}","${deviceId}")></button>
            </label>
        `;
        devicesBox.appendChild(deviceCard);
    });

    //thay đổi trạng thái của thiết bị
    devicesRef.on('child_changed', (snapshot) => {
        const deviceId = snapshot.key;
        const device = snapshot.val();
        const deviceCard = document.getElementById(`device-${deviceId}`);
        if (deviceCard) {
            const checkbox = deviceCard.querySelector(`input[data-id="${deviceId}"]`);
            if (checkbox) {
                checkbox.checked = device.status; // Chỉ cập nhật trạng thái công tắc
            }
        }
    });

    devicesRef.on('child_removed', (snapshot) => {
        const deviceId = snapshot.key;

        const deviceCard = document.getElementById(`device-${deviceId}`);
        if (deviceCard) {
            deviceCard.remove();
        }
        
    });
}

// Xử lý modal thêm thiết bị
function openAddDeviceModal() {
    document.getElementById('addDeviceModal').style.display = 'block';
}

function closeAddDeviceModal() {
    document.getElementById('addDeviceModal').style.display = 'none';
    document.getElementById('addDeviceForm').reset();
}

// Xử lý form thêm thiết bị
document.getElementById('addDeviceForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const deviceName = document.getElementById('deviceName').value;
    const deviceDescription = document.getElementById('deviceDescription').value;
    const deviceIcon = document.querySelector('input[name="deviceIcon"]:checked').value;
    addDevice(roomId, deviceName, deviceDescription, deviceIcon);
    closeAddDeviceModal();
});

// Gọi hàm tải thiết bị khi trang được tải
document.addEventListener('DOMContentLoaded', loadDevices);