// Dark Mode functionality
const darkModeToggle = document.getElementById('darkModeToggle');
const html = document.documentElement;

// Check for saved theme preference or default to light mode
const currentTheme = localStorage.getItem('theme') || 'light';
if (currentTheme === 'dark') {
    html.classList.add('dark');
}

darkModeToggle.addEventListener('click', function() {
    html.classList.toggle('dark');
    
    // Save theme preference
    if (html.classList.contains('dark')) {
        localStorage.setItem('theme', 'dark');
    } else {
        localStorage.setItem('theme', 'light');
    }
});

// API Configuration
const API_BASE_URL = 'http://127.0.0.1:8000';

// Global variables
let users = [];
let filteredUsers = [];

// Utility functions
function showError(message) {
    const errorToast = document.getElementById('errorToast');
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.textContent = message;
    errorToast.classList.remove('hidden');
    setTimeout(() => {
        errorToast.classList.add('hidden');
    }, 5000);
}

function showSuccess(message) {
    const successToast = document.getElementById('successToast');
    const successMessage = document.getElementById('successMessage');
    successMessage.textContent = message;
    successToast.classList.remove('hidden');
    setTimeout(() => {
        successToast.classList.add('hidden');
    }, 3000);
}

async function makeAuthenticatedRequest(url, options = {}) {
    const token = localStorage.getItem('access_token');
    if (!token) {
        window.location.href = 'login.html';
        return null;
    }
    
    const defaultOptions = {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            ...options.headers
        }
    };
    
    const response = await fetch(url, { ...options, ...defaultOptions });
    
    if (response.status === 401) {
        // Token expired
        localStorage.clear();
        window.location.href = 'login.html';
        return null;
    }
    
    return response;
}

// Authentication check
function checkAuthentication() {
    const token = localStorage.getItem('access_token');
    if (!token) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// Navigation
function goBack() {
    window.location.href = "dashboard.html";
}

// Load user profile
async function loadUserProfile() {
    const username = localStorage.getItem('username');
    const groups = localStorage.getItem('user_groups');
    
    if (username) {
        document.getElementById('welcomeUser').textContent = `Bienvenue, ${username}`;
        if (groups) {
            try {
                const groupsArray = JSON.parse(groups);
                document.getElementById('userRole').textContent = groupsArray.length > 0 ? groupsArray[0] : 'Utilisateur';
            } catch (e) {
                document.getElementById('userRole').textContent = 'Utilisateur';
            }
        }
    }
    
    try {
        const response = await makeAuthenticatedRequest(`${API_BASE_URL}/auth/profile/`);
        if (response && response.ok) {
            const data = await response.json();
            document.getElementById('welcomeUser').textContent = `Bienvenue, ${data.username}`;
            document.getElementById('userRole').textContent = data.group || 'Utilisateur';
        }
    } catch (error) {
        console.log('Could not load profile:', error.message);
    }
}

// Load users
async function loadUsers() {
    try {
        const response = await makeAuthenticatedRequest(`${API_BASE_URL}/auth/list_users/`);
        if (response && response.ok) {
            users = await response.json();
            filteredUsers = [...users];
            
            updateStats();
            renderUsers();
            
            // Hide loading state and show main content
            document.getElementById('loadingState').classList.add('hidden');
            document.getElementById('mainContent').classList.remove('hidden');
        } else {
            document.getElementById('loadingState').classList.add('hidden');
            document.getElementById('mainContent').classList.remove('hidden');
            showError('Erreur lors du chargement des utilisateurs');
        }
    } catch (error) {
        console.error('Error loading users:', error);
        document.getElementById('loadingState').classList.add('hidden');
        document.getElementById('mainContent').classList.remove('hidden');
        showError('Erreur lors du chargement des utilisateurs');
    }
}

// Update statistics
function updateStats() {
    const totalUsers = users.length;
    const activeUsers = users.filter(user => user.is_active).length;
    const adminUsers = users.filter(user => user.groups.includes('Admin')).length;
    
    document.getElementById('totalUsers').textContent = totalUsers;
    document.getElementById('activeUsers').textContent = activeUsers;
    document.getElementById('adminUsers').textContent = adminUsers;
}

// Get group display name
function getGroupDisplayName(groupName) {
    const groupDisplayNames = {
        'Admin': 'Administrateur',
        'Commercial': 'Commercial',
        'Comptable': 'Comptable',
        'Secrétaire': 'Secrétaire'
    };
    return groupDisplayNames[groupName] || groupName;
}

// Get group CSS class
function getGroupClass(groupName) {
    const groupClasses = {
        'Admin': 'group-admin',
        'Commercial': 'group-commercial',
        'Comptable': 'group-comptable',
        'Secrétaire': 'group-secrétaire'
    };
    return groupClasses[groupName] || 'group-viewer';
}

// Render users
function renderUsers() {
    const usersList = document.getElementById('usersList');
    const emptyState = document.getElementById('emptyState');
    
    if (filteredUsers.length === 0) {
        usersList.innerHTML = '';
        emptyState.classList.remove('hidden');
        return;
    }
    
    emptyState.classList.add('hidden');
    usersList.innerHTML = '';
    
    filteredUsers.forEach((user, index) => {
        const userCard = createUserCard(user, index);
        usersList.appendChild(userCard);
    });
}

// Create user card
function createUserCard(user, index) {
    const card = document.createElement('div');
    card.className = 'user-card bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 transition-all duration-300 shadow-sm hover:shadow-lg fade-in';
    card.style.animationDelay = `${index * 0.1}s`;
    
    const primaryGroup = user.groups.length > 0 ? user.groups[0] : 'Secrétaire';
    const groupClass = getGroupClass(primaryGroup);
    const groupDisplayName = getGroupDisplayName(primaryGroup);
    const statusClass = user.is_active ? 'status-active' : 'status-inactive';
    const statusText = user.is_active ? 'Actif' : 'Inactif';
    const statusIcon = user.is_active ? 'fas fa-check-circle' : 'fas fa-times-circle';
    
    card.innerHTML = `
        <div class="flex items-center justify-between mb-4">
            <div class="flex items-center space-x-3">
                <div class="w-12 h-12 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700">
                    <img src="${user.profile_picture || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjQiIGN5PSIyNCIgcj0iMjQiIGZpbGw9IiNGM0Y0RjYiLz4KPHBhdGggZD0iTTI0IDI0QzI3LjMxMzcgMjQgMzAgMjEuMzEzNyAzMCAxOEMzMCAxNC42ODYzIDI3LjMxMzcgMTIgMjQgMTJDMjAuNjg2MyAxMiAxOCAxNC42ODYzIDE4IDE4QzE4IDIxLjMxMzcgMjAuNjg2MyAyNCAyNCAyNFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTEyIDM4QzEyIDMxLjM3MjYgMTcuMzcyNiAyNiAyNCAyNkMzMC42Mjc0IDI2IDM2IDMxLjM3MjYgMzYgMzhIMTJaIiBmaWxsPSIjOUNBM0FGIi8+Cjwvc3ZnPgo='}" alt="${user.username}" 
                        class="w-full h-full object-cover" 
                        onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjQiIGN5PSIyNCIgcj0iMjQiIGZpbGw9IiNGM0Y0RjYiLz4KPHBhdGggZD0iTTI0IDI0QzI3LjMxMzcgMjQgMzAgMjEuMzEzNyAzMCAxOEMzMCAxNC42ODYzIDI3LjMxMzcgMTIgMjQgMTJDMjAuNjg2MyAxMiAxOCAxNC42ODYzIDE4IDE4QzE4IDIxLjMxMzcgMjAuNjg2MyAyNCAyNCAyNFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTEyIDM4QzEyIDMxLjM3MjYgMTcuMzcyNiAyNiAyNCAyNkMzMC42Mjc0IDI2IDM2IDMxLjM3MjYgMzYgMzhIMTJaIiBmaWxsPSIjOUNBM0FGIi8+Cjwvc3ZnPgo='">
                </div>
                <div>
                    <h3 class="text-gray-900 dark:text-white text-lg font-bold">${user.username}</h3>
                    <span class="group-badge ${groupClass}">
                        <i class="fas fa-user-tag mr-1"></i>${groupDisplayName}
                    </span>
                </div>
            </div>
            <span class="group-badge ${statusClass}">
                <i class="${statusIcon} mr-1"></i>${statusText}
            </span>
        </div>
        
        <div class="space-y-3">
            <div class="flex items-center justify-between text-sm">
                <span class="text-gray-500 dark:text-gray-400">
                    <i class="fas fa-id-badge mr-1"></i>ID Utilisateur:
                </span>
                <span class="text-gray-900 dark:text-white font-medium">#${user.id}</span>
            </div>
            
            ${user.groups.length > 1 ? `
            <div class="text-sm">
                <span class="text-gray-500 dark:text-gray-400">
                    <i class="fas fa-users mr-1"></i>Groupes additionnels:
                </span>
                <div class="mt-1 flex flex-wrap gap-1">
                    ${user.groups.slice(1).map(group => 
                        `<span class="group-badge ${getGroupClass(group)}">${getGroupDisplayName(group)}</span>`
                    ).join('')}
                </div>
            </div>
            ` : ''}
        </div>
        
        <div class="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div class="flex space-x-2">
                <button onclick="editUser(${user.id})" 
                    class="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded-lg transition-colors text-sm">
                    <i class="fas fa-edit mr-1"></i>Modifier
                </button>
                <button onclick="toggleUserStatus(${user.id}, ${!user.is_active})" 
                    class="flex-1 ${user.is_active ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-500 hover:bg-green-600'} text-white py-2 px-3 rounded-lg transition-colors text-sm">
                    <i class="fas ${user.is_active ? 'fa-pause' : 'fa-play'} mr-1"></i>
                    ${user.is_active ? 'Désactiver' : 'Activer'}
                </button>
                <button onclick="deleteUser(${user.id})" 
                    class="bg-red-500 hover:bg-red-600 text-white py-2 px-3 rounded-lg transition-colors text-sm">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `;
    
    return card;
}

// Create user with SweetAlert
async function createUser() {
    const isDark = html.classList.contains('dark');
    
    const { value: formValues } = await Swal.fire({
        title: 'Créer un nouvel utilisateur',
        html: `
            <div class="space-y-4">
                <div>
                    <label class="block text-left text-sm font-medium mb-2">Nom d'utilisateur</label>
                    <input id="swal-username" class="swal2-input" placeholder="Nom d'utilisateur" type="text">
                </div>
                <div>
                    <label class="block text-left text-sm font-medium mb-2">Mot de passe</label>
                    <input id="swal-password" class="swal2-input" placeholder="Mot de passe" type="password">
                </div>
                <div>
                    <label class="block text-left text-sm font-medium mb-2">Groupe</label>
                    <select id="swal-group" class="swal2-select">
                        <option value="">Sélectionner un groupe</option>
                        <option value="Admin">Administrateur</option>
                        <option value="Commercial">Commercial</option>
                        <option value="Comptable">Comptable</option>
                        <option value="Secrétaire">Secrétaire</option>
                    </select>
                </div>
            </div>
        `,
        customClass: isDark ? 'dark-theme' : '',
        showCancelButton: true,
        confirmButtonText: 'Créer',
        cancelButtonText: 'Annuler',
        confirmButtonColor: '#8b5cf6',
        preConfirm: () => {
            const username = document.getElementById('swal-username').value;
            const password = document.getElementById('swal-password').value;
            const group = document.getElementById('swal-group').value;
            
            if (!username || !password || !group) {
                Swal.showValidationMessage('Tous les champs sont requis');
                return false;
            }
            
            if (username.length < 3) {
                Swal.showValidationMessage('Le nom d\'utilisateur doit contenir au moins 3 caractères');
                return false;
            }
            
            if (password.length < 6) {
                Swal.showValidationMessage('Le mot de passe doit contenir au moins 6 caractères');
                return false;
            }
            
            return { username, password, group };
        }
    });
    
    if (formValues) {
        try {
            const response = await makeAuthenticatedRequest(`${API_BASE_URL}/auth/create_user/`, {
                method: 'POST',
                body: JSON.stringify({
                    username: formValues.username,
                    password: formValues.password,
                    group: formValues.group
                })
            });
            
            if (response && response.ok) {
                const newUser = await response.json();
                showSuccess(`Utilisateur ${formValues.username} créé avec succès`);
                await loadUsers(); // Reload users list
            } else {
                const errorData = await response.json();
                showError(errorData.detail || 'Erreur lors de la création de l\'utilisateur');
            }
        } catch (error) {
            console.error('Error creating user:', error);
            showError('Erreur lors de la création de l\'utilisateur');
        }
    }
}

// Edit user
async function editUser(userId) {
    const user = users.find(u => u.id === userId);
    if (!user) {
        showError('Utilisateur non trouvé');
        return;
    }
    
    const isDark = html.classList.contains('dark');
    const primaryGroup = user.groups.length > 0 ? user.groups[0] : 'Secrétaire';
    
    const { value: formValues } = await Swal.fire({
        title: 'Modifier l\'utilisateur',
        html: `
            <div class="space-y-4">
                <div>
                    <label class="block text-left text-sm font-medium mb-2">Nom d'utilisateur</label>
                    <input id="swal-username" class="swal2-input" value="${user.username}" type="text" readonly>
                </div>
                <div>
                    <label class="block text-left text-sm font-medium mb-2">Nouveau mot de passe (optionnel)</label>
                    <input id="swal-password" class="swal2-input" placeholder="Laisser vide pour ne pas changer" type="password">
                </div>
                <div>
                    <label class="block text-left text-sm font-medium mb-2">Groupe principal</label>
                    <select id="swal-group" class="swal2-select">
                        <option value="Admin" ${primaryGroup === 'Admin' ? 'selected' : ''}>Administrateur</option>
                        <option value="Commercial" ${primaryGroup === 'Commercial' ? 'selected' : ''}>Commercial</option>
                        <option value="Comptable" ${primaryGroup === 'Comptable' ? 'selected' : ''}>Comptable</option>
                        <option value="Secrétaire" ${primaryGroup === 'Secrétaire' ? 'selected' : ''}>Secrétaire</option>
                    </select>
                </div>
            </div>
        `,
        customClass: isDark ? 'dark-theme' : '',
        showCancelButton: true,
        confirmButtonText: 'Modifier',
        cancelButtonText: 'Annuler',
        confirmButtonColor: '#3b82f6',
        preConfirm: () => {
            const password = document.getElementById('swal-password').value;
            const group = document.getElementById('swal-group').value;
            
            if (password && password.length < 6) {
                Swal.showValidationMessage('Le mot de passe doit contenir au moins 6 caractères');
                return false;
            }
            
            return { password, group };
        }
    });
    
    if (formValues) {
        try {
            const updateData = { groups: formValues.group };
            if (formValues.password) {
                updateData.password = formValues.password;
            }
            
            const response = await makeAuthenticatedRequest(`${API_BASE_URL}/auth/update_user/${userId}/`, {
                method: 'PUT',
                body: JSON.stringify(updateData)
            });
            
            if (response && response.ok) {
                showSuccess(`Utilisateur modifié avec succès`);
                await loadUsers(); // Reload users list
            } else {
                const errorData = await response.json();
                showError(errorData.detail || 'Erreur lors de la modification de l\'utilisateur');
            }
        } catch (error) {
            console.error('Error updating user:', error);
            showError('Erreur lors de la modification de l\'utilisateur');
        }
    }
}

// Toggle user status
async function toggleUserStatus(userId, newStatus) {
    const user = users.find(u => u.id === userId);
    if (!user) {
        showError('Utilisateur non trouvé');
        return;
    }
    
    const action = newStatus ? 'activer' : 'désactiver';
    const isDark = html.classList.contains('dark');
    
    const result = await Swal.fire({
        title: `${action.charAt(0).toUpperCase() + action.slice(1)} l'utilisateur`,
        text: `Êtes-vous sûr de vouloir ${action} l'utilisateur "${user.username}" ?`,
        icon: 'question',
        customClass: isDark ? 'dark-theme' : '',
        showCancelButton: true,
        confirmButtonText: action.charAt(0).toUpperCase() + action.slice(1),
        cancelButtonText: 'Annuler',
        confirmButtonColor: newStatus ? '#10b981' : '#f59e0b'
    });
    
    if (result.isConfirmed) {
        try {
            const response = await makeAuthenticatedRequest(`${API_BASE_URL}/auth/toggle_user_status/${userId}/`, {
                method: 'POST',
                body: JSON.stringify({ is_active: newStatus })
            });
            
            if (response && response.ok) {
                showSuccess(`Utilisateur ${newStatus ? 'activé' : 'désactivé'} avec succès`);
                await loadUsers(); // Reload users list
            } else {
                const errorData = await response.json();
                showError(errorData.detail || `Erreur lors de la ${action} de l'utilisateur`);
            }
        } catch (error) {
            console.error('Error toggling user status:', error);
            showError(`Erreur lors de la ${action} de l'utilisateur`);
        }
    }
}

// Delete user
async function deleteUser(userId) {
    const user = users.find(u => u.id === userId);
    if (!user) {
        showError('Utilisateur non trouvé');
        return;
    }
    
    const isDark = html.classList.contains('dark');
    
    const result = await Swal.fire({
        title: 'Supprimer l\'utilisateur',
        text: `Êtes-vous sûr de vouloir supprimer définitivement l'utilisateur "${user.username}" ? Cette action est irréversible.`,
        icon: 'warning',
        customClass: isDark ? 'dark-theme' : '',
        showCancelButton: true,
        confirmButtonText: 'Supprimer',
        cancelButtonText: 'Annuler',
        confirmButtonColor: '#ef4444',
        dangerMode: true
    });
    
    if (result.isConfirmed) {
        try {
            const response = await makeAuthenticatedRequest(`${API_BASE_URL}/auth/delete_user/${userId}/`, {
                method: 'DELETE'
            });
            
            if (response && response.ok) {
                showSuccess('Utilisateur supprimé avec succès');
                await loadUsers(); // Reload users list
            } else {
                const errorData = await response.json();
                showError(errorData.detail || 'Erreur lors de la suppression de l\'utilisateur');
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            showError('Erreur lors de la suppression de l\'utilisateur');
        }
    }
}

// Search and filter functionality
function setupSearchAndFilter() {
    const searchInput = document.getElementById('searchUsers');
    const groupFilter = document.getElementById('filterGroup');
    const statusFilter = document.getElementById('filterStatus');
    
    function applyFilters() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        const selectedGroup = groupFilter.value;
        const selectedStatus = statusFilter.value;
        
        filteredUsers = users.filter(user => {
            // Search filter
            const matchesSearch = !searchTerm || 
                user.username.toLowerCase().includes(searchTerm) ||
                user.id.toString().includes(searchTerm);
            
            // Group filter
            const matchesGroup = !selectedGroup || user.groups.includes(selectedGroup);
            
            // Status filter
            const matchesStatus = !selectedStatus || 
                (selectedStatus === 'active' && user.is_active) ||
                (selectedStatus === 'inactive' && !user.is_active);
            
            return matchesSearch && matchesGroup && matchesStatus;
        });
        
        renderUsers();
    }
    
    // Add event listeners
    searchInput.addEventListener('input', applyFilters);
    groupFilter.addEventListener('change', applyFilters);
    statusFilter.addEventListener('change', applyFilters);
}

// Logout functionality
function setupLogout() {
    const logoutBtn = document.getElementById('logoutBtn');
    logoutBtn.addEventListener('click', async () => {
        const isDark = html.classList.contains('dark');
        
        const result = await Swal.fire({
            title: 'Déconnexion',
            text: 'Êtes-vous sûr de vouloir vous déconnecter ?',
            icon: 'question',
            customClass: isDark ? 'dark-theme' : '',
            showCancelButton: true,
            confirmButtonText: 'Se déconnecter',
            cancelButtonText: 'Annuler',
            confirmButtonColor: '#ef4444'
        });
        
        if (result.isConfirmed) {
            localStorage.clear();
            window.location.href = 'login.html';
        }
    });
}

// Initialize page
async function initializePage() {
    // Check authentication first
    if (!checkAuthentication()) {
        return;
    }
    
    // Load user profile
    await loadUserProfile();
    
    // Setup event listeners
    setupSearchAndFilter();
    setupLogout();
    
    // Setup button click handlers
    document.getElementById('createUserBtn').addEventListener('click', createUser);
    document.getElementById('refreshUsersBtn').addEventListener('click', async () => {
        document.getElementById('refreshUsersBtn').innerHTML = '<i class="fas fa-sync-alt fa-spin mr-2"></i>Actualisation...';
        await loadUsers();
        document.getElementById('refreshUsersBtn').innerHTML = '<i class="fas fa-sync-alt mr-2"></i>Actualiser';
    });
    
    // Load users data
    await loadUsers();
}

// Start the application when DOM is loaded
document.addEventListener('DOMContentLoaded', initializePage);