<?php

include 'layout/header.php';
require_once 'config.php';

$authToken = $_SESSION['auth_token'];
$apiURL = BASE_API_URL;
?>

<main class="flex-grow p-6 md:p-10 lg:p-12">
    <h2 class="text-3xl font-bold text-gray-800 mb-6">Manajemen Pengguna</h2>
    <div class="mx-auto bg-white p-8 rounded-xl shadow-lg">
 

        <div class="flex justify-end mb-6">
            <button id="add-user-btn" class="py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300 ease-in-out">
                <i data-lucide="user-plus" class="w-5 h-5 inline-block mr-2"></i> Tambah Pengguna Baru
            </button>
        </div>

        <div id="status-message" class="hidden mb-4 p-4 text-center rounded-lg"></div>

        <div class="overflow-x-auto relative shadow-md sm:rounded-lg">
            <table class="w-full text-sm text-left text-gray-500">
                <thead class="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                        <th scope="col" class="py-3 px-6">Nama</th>
                        <th scope="col" class="py-3 px-6">Email</th>
                        <th scope="col" class="py-3 px-6">Peran</th>
                        <th scope="col" class="py-3 px-6">Status Akun</th>
                        <th scope="col" class="py-3 px-6">Berakhir Pada</th>
                        <th scope="col" class="py-3 px-6">Aksi</th>
                    </tr>
                </thead>
                <tbody id="user-table-body">
                    </tbody>
            </table>
        </div>

        <div class="flex justify-center mt-6" id="pagination-container">
            </div>
    </div>
</main>

<div id="user-modal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center hidden">
    <div class="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
        <div class="flex justify-between items-center border-b pb-3 mb-4">
            <h3 class="text-lg font-semibold text-gray-900" id="modal-title">Tambah Pengguna Baru</h3>
            <button id="close-modal-btn" class="text-gray-400 hover:text-gray-600">&times;</button>
        </div>
        <form id="user-form" class="space-y-4">
            <input type="hidden" id="user-id" name="user_id">
            <div>
                <label for="name" class="block text-sm font-medium text-gray-700">Nama</label>
                <input type="text" id="name" name="name" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
            </div>
            <div>
                <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                <input type="email" id="email" name="email" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
            </div>
            <div>
                <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
                <input type="password" id="password" name="password" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
            </div>
            <div>
                <label for="password_confirmation" class="block text-sm font-medium text-gray-700">Konfirmasi Password</label>
                <input type="password" id="password_confirmation" name="password_confirmation" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
            </div>
            <div>
                <label for="role" class="block text-sm font-medium text-gray-700">Peran</label>
                <select id="role" name="role" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                    </select>
            </div>
            <div>
                <label for="account_status" class="block text-sm font-medium text-gray-700">Status Akun</label>
                <select id="account_status" name="account_status" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                    <option value="active">Aktif</option>
                    <option value="inactive">Tidak Aktif</option>
                    <option value="suspended">Ditangguhkan</option>
                    <option value="banned">Diblokir</option>
                </select>
            </div>
            <div id="expired-at-container" class="hidden">
                <label for="expired_at" class="block text-sm font-medium text-gray-700">Berakhir Pada</label>
                <input type="date" id="expired_at" name="expired_at" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
            </div>
            <div class="mt-6 flex justify-end space-x-2">
                <button type="button" id="cancel-btn" class="py-2 px-4 bg-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-400">Batal</button>
                <button type="submit" id="submit-btn" class="py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700">Simpan</button>
            </div>
        </form>
    </div>
</div>

<script>
    const API_URL = '<?php echo $apiURL; ?>';
    const AUTH_TOKEN = '<?php echo $authToken; ?>';

    const statusMessage = document.getElementById('status-message');
    const userTableBody = document.getElementById('user-table-body');
    const paginationContainer = document.getElementById('pagination-container');
    const addUserBtn = document.getElementById('add-user-btn');
    const userModal = document.getElementById('user-modal');
    const closeBtn = document.getElementById('close-modal-btn');
    const cancelBtn = document.getElementById('cancel-btn');
    const userForm = document.getElementById('user-form');
    const modalTitle = document.getElementById('modal-title');
    const userIdInput = document.getElementById('user-id');
    const passwordInput = document.getElementById('password');
    const passwordConfirmInput = document.getElementById('password_confirmation');
    const expiredAtContainer = document.getElementById('expired-at-container');
    const roleSelect = document.getElementById('role');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const accountStatusSelect = document.getElementById('account_status');
    const expiredAtInput = document.getElementById('expired_at');

    let statusTimeoutId = null;

    /**
     * Menampilkan pesan status di UI yang akan hilang secara otomatis.
     * @param {string} message - Pesan yang akan ditampilkan.
     * @param {string} type - Tipe pesan ('success', 'error', 'info').
     * @param {number} duration - Durasi dalam milidetik pesan akan ditampilkan. Default 5000 (5 detik).
     */
    function showStatus(message, type, duration = 5000) {
        clearTimeout(statusTimeoutId);
        
        statusMessage.innerHTML = message;
        statusMessage.className = 'mb-4 p-4 text-center rounded-lg';
        statusMessage.classList.remove('hidden');

        if (type === 'success') {
            statusMessage.classList.add('bg-green-100', 'text-green-700');
        } else if (type === 'error') {
            statusMessage.classList.add('bg-red-100', 'text-red-700');
        } else if (type === 'info') {
            statusMessage.classList.add('bg-blue-100', 'text-blue-700');
        }


        if (type !== 'info') {
            statusTimeoutId = setTimeout(() => {
                statusMessage.classList.add('hidden');
            }, duration);
        }
    }

    /**
     * Mengambil data pengguna dari API dan mengisi tabel.
     * @param {number} page - Halaman yang akan diambil.
     */
    async function fetchUsers(page = 1) {
        showStatus('Memuat data pengguna...', 'info');
        try {
            const response = await fetch(`${API_URL}/users?page=${page}`, {
                headers: { 'Authorization': `Bearer ${AUTH_TOKEN}` }
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Gagal memuat data pengguna.');
            }

            renderUserTable(data.data);
            renderPagination(data);
            showStatus('Data pengguna berhasil dimuat.', 'success');
        } catch (error) {
            console.error('Kesalahan:', error);
            showStatus(`Gagal memuat data: ${error.message}`, 'error');
        }
    }

    /**
     * Merender data pengguna ke dalam tabel HTML.
     * @param {Array} users - Array objek pengguna.
     */
    function renderUserTable(users) {
        userTableBody.innerHTML = '';
        if (users.length === 0) {
            userTableBody.innerHTML = '<tr><td colspan="6" class="py-4 text-center text-gray-500">Tidak ada pengguna yang ditemukan.</td></tr>';
            return;
        }

        users.forEach(user => {
            const row = `
                <tr class="bg-white border-b hover:bg-gray-50">
                    <td class="py-4 px-6 font-medium text-gray-900">${user.name}</td>
                    <td class="py-4 px-6">${user.email}</td>
                    <td class="py-4 px-6 capitalize">${user.role}</td>
                    <td class="py-4 px-6 capitalize">${user.account_status}</td>
                    <td class="py-4 px-6">${user.expired_at ? new Date(user.expired_at).toLocaleDateString() : 'N/A'}</td>
                    <td class="py-4 px-6 space-x-2">
                        <button onclick="editUser('${user.id}')" class="font-medium text-blue-600 hover:underline">Edit</button>
                        <button onclick="deleteUser('${user.id}')" class="font-medium text-red-600 hover:underline">Hapus</button>
                    </td>
                </tr>
            `;
            userTableBody.insertAdjacentHTML('beforeend', row);
        });
    }

    /**
     * Merender navigasi pagination.
     * @param {object} data - Objek data pagination dari API.
     */
    function renderPagination(data) {
        paginationContainer.innerHTML = '';
        if (data.last_page > 1) {
            data.links.forEach(link => {
                const button = document.createElement('button');
                button.innerHTML = link.label.replace('&laquo; Previous', 'Sebelumnya').replace('Next &raquo;', 'Berikutnya');
                button.disabled = !link.url;
                button.className = `py-2 px-3 mx-1 rounded-lg ${link.active ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`;
                if (link.url) {
                    button.onclick = () => fetchUsers(new URL(link.url).searchParams.get('page'));
                }
                paginationContainer.appendChild(button);
            });
        }
    }

    /**
     * Membuka modal form.
     */
    function openModal() {
        userModal.classList.remove('hidden');
    }

    /**
     * Menutup modal form.
     */
    function closeModal() {
        userModal.classList.add('hidden');
        userForm.reset();
        statusMessage.classList.add('hidden');
    }

    /**
     * Mengambil daftar peran yang tersedia dari API dan mengisi dropdown.
     * @param {string|null} selectedRole - Peran yang akan dipilih secara default.
     */
    async function fetchAndPopulateRoles(selectedRole = null) {
        try {
            const response = await fetch(`${API_URL}/user-roles`, {
                headers: { 'Authorization': `Bearer ${AUTH_TOKEN}` }
            });
            const roles = await response.json();

            if (!response.ok) {
                throw new Error(roles.message || 'Gagal memuat peran pengguna.');
            }
            
            roleSelect.innerHTML = '';
            roles.forEach(role => {
                const option = document.createElement('option');
                option.value = role;
                option.textContent = role.charAt(0).toUpperCase() + role.slice(1);
                if (selectedRole && role === selectedRole) {
                    option.selected = true;
                }
                roleSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Kesalahan:', error);
            showStatus(`Gagal memuat peran: ${error.message}`, 'error');
        }
    }

    addUserBtn.addEventListener('click', () => {
        modalTitle.textContent = 'Tambah Pengguna Baru';
        userIdInput.value = '';
        passwordInput.required = true;
        passwordConfirmInput.required = true;
        passwordInput.value = '';
        passwordConfirmInput.value = '';
        expiredAtContainer.classList.add('hidden');
        userForm.reset();
        fetchAndPopulateRoles();
        openModal();
    });

    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);

    userForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const userId = userIdInput.value;
        const method = userId ? 'PUT' : 'POST';
        const url = userId ? `${API_URL}/users/${userId}` : `${API_URL}/users`;

        const data = {
            name: nameInput.value,
            email: emailInput.value,
            role: roleSelect.value,
            account_status: accountStatusSelect.value,
            password: passwordInput.value,
            password_confirmation: passwordConfirmInput.value,
            expired_at: expiredAtInput.value || null
        };
        
        if (userId && !passwordInput.value) {
            delete data.password;
            delete data.password_confirmation;
        }

        showStatus('Sedang menyimpan...', 'info');

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${AUTH_TOKEN}`
                },
                body: JSON.stringify(data)
            });

            const responseData = await response.json();

            if (!response.ok) {
                let errorMessage = responseData.message || 'Terjadi kesalahan tidak terduga.';
                if (responseData.errors) {
                    errorMessage += '<br>' + Object.values(responseData.errors).flat().join('<br>');
                }
                throw new Error(errorMessage);
            }

            closeModal();
            fetchUsers();
            showStatus(responseData.message, 'success');
        } catch (error) {
            console.error('Kesalahan:', error);
            showStatus(`Gagal menyimpan: ${error.message}`, 'error');
        }
    });

    /**
     * Memuat data pengguna yang akan diedit ke dalam form.
     * @param {string} userId - ID pengguna yang akan diedit.
     */
    window.editUser = async (userId) => {
        showStatus('Memuat data pengguna...', 'info');
        try {
            const response = await fetch(`${API_URL}/users/${userId}`, {
                headers: { 'Authorization': `Bearer ${AUTH_TOKEN}` }
            });
            const user = await response.json();

            if (!response.ok) {
                throw new Error(user.message || 'Gagal memuat data pengguna untuk diedit.');
            }

            modalTitle.textContent = 'Edit Pengguna';
            userIdInput.value = user.id;
            nameInput.value = user.name;
            emailInput.value = user.email;
            accountStatusSelect.value = user.account_status;
            passwordInput.required = false;
            passwordConfirmInput.required = false;
            
            await fetchAndPopulateRoles(user.role);

            if (user.role === 'admin' || user.role === 'user') {
                expiredAtContainer.classList.remove('hidden');
                expiredAtInput.value = user.expired_at ? new Date(user.expired_at).toISOString().split('T')[0] : '';
            } else {
                expiredAtContainer.classList.add('hidden');
                expiredAtInput.value = '';
            }
            
            openModal();
            showStatus('Data pengguna siap untuk diedit.', 'success');
        } catch (error) {
            console.error('Kesalahan:', error);
            showStatus(`Gagal mengedit pengguna: ${error.message}`, 'error');
        }
    };

    /**
     * Menghapus pengguna dari database.
     * @param {string} userId - ID pengguna yang akan dihapus.
     */
    window.deleteUser = async (userId) => {
        if (!confirm('Apakah Anda yakin ingin menghapus pengguna ini?')) {
            return;
        }

        showStatus('Menghapus pengguna...', 'info');
        try {
            const response = await fetch(`${API_URL}/users/${userId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${AUTH_TOKEN}` }
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Gagal menghapus pengguna.');
            }
            
            fetchUsers();
            showStatus('Pengguna berhasil dihapus.', 'success');
        } catch (error) {
            console.error('Kesalahan:', error);
            showStatus(`Gagal menghapus: ${error.message}`, 'error');
        }
    };

    roleSelect.addEventListener('change', () => {
        const selectedRole = roleSelect.value;
        if (selectedRole === 'admin' || selectedRole === 'user') {
            expiredAtContainer.classList.remove('hidden');
        } else {
            expiredAtContainer.classList.add('hidden');
            expiredAtInput.value = '';
        }
    });

    fetchUsers();
</script>

<?php
include 'layout/footer.php';
?>