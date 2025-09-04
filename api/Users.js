// Translations
const translations = {
    fr: {
        // Navigation and Header
        page_title: "Gestion des Utilisateurs",
        welcome: "Bienvenue",
        loading: "Chargement...",
        logout: "Déconnexion",
        
        // Main Content
        loading_users: "Chargement des utilisateurs...",
        users_management: "Gestion des Utilisateurs",
        manage_accounts: "Gérez les comptes et permissions utilisateurs",
        total_users: "Total Utilisateurs",
        active_users: "Utilisateurs Actifs",
        admin_users: "Administrateurs",
        users_list: "Liste des Utilisateurs",
        refresh: "Actualiser",
        new_user: "Nouvel Utilisateur",
        
        // Search and Filter
        search_user: "Rechercher un utilisateur...",
        all_groups: "Tous les groupes",
        administrators: "Administrateurs",
        commercial: "Commercial",
        accountant: "Comptable",
        secretary: "Secrétaire",
        all_statuses: "Tous les statuts",
        active: "Actifs",
        inactive: "Inactifs",
        
        // User Card
        user_id: "ID Utilisateur:",
        additional_groups: "Groupes additionnels:",
        edit: "Modifier",
        activate: "Activer",
        deactivate: "Désactiver",
        delete: "Supprimer",
        
        // Empty State
        no_users: "Aucun utilisateur trouvé",
        create_first_user: "Commencez par créer votre premier utilisateur",
        create_user: "Créer un utilisateur",
        
        // Group Names
        group_admin: "Administrateur",
        group_commercial: "Commercial",
        group_comptable: "Comptable",
        group_secretaire: "Secrétaire",
        
        // Status
        status_active: "Actif",
        status_inactive: "Inactif",
        
        // Modals
        create_new_user: "Créer un nouvel utilisateur",
        username: "Nom d'utilisateur",
        password: "Mot de passe",
        group: "Groupe",
        select_group: "Sélectionner un groupe",
        create: "Créer",
        cancel: "Annuler",
        edit_user: "Modifier l'utilisateur",
        new_password_optional: "Nouveau mot de passe (optionnel)",
        leave_empty_no_change: "Laisser vide pour ne pas changer",
        primary_group: "Groupe principal",
        modify: "Modifier",
        
        // Actions
        activate_user: "Activer l'utilisateur",
        deactivate_user: "Désactiver l'utilisateur",
        delete_user: "Supprimer l'utilisateur",
        confirm_activate: "Êtes-vous sûr de vouloir activer l'utilisateur",
        confirm_deactivate: "Êtes-vous sûr de vouloir désactiver l'utilisateur",
        confirm_delete: "Êtes-vous sûr de vouloir supprimer définitivement l'utilisateur",
        action_irreversible: "Cette action est irréversible.",
        
        // Messages
        error_occurred: "Une erreur s'est produite",
        operation_success: "Opération réussie",
        user_created_success: "créé avec succès",
        user_modified_success: "Utilisateur modifié avec succès",
        user_activated_success: "Utilisateur activé avec succès",
        user_deactivated_success: "Utilisateur désactivé avec succès",
        user_deleted_success: "Utilisateur supprimé avec succès",
        user_not_found: "Utilisateur non trouvé",
        
        // Validation
        all_fields_required: "Tous les champs sont requis",
        username_min_length: "Le nom d'utilisateur doit contenir au moins 3 caractères",
        password_min_length: "Le mot de passe doit contenir au moins 6 caractères",
        
        // Logout
        logout_confirm: "Déconnexion",
        logout_question: "Êtes-vous sûr de vouloir vous déconnecter ?",
        logout_button: "Se déconnecter"
    },
    ar: {
        // Navigation and Header
        page_title: "إدارة المستخدمين",
        welcome: "مرحباً",
        loading: "جاري التحميل...",
        logout: "تسجيل الخروج",
        
        // Main Content
        loading_users: "جاري تحميل المستخدمين...",
        users_management: "إدارة المستخدمين",
        manage_accounts: "إدارة حسابات وصلاحيات المستخدمين",
        total_users: "إجمالي المستخدمين",
        active_users: "المستخدمون النشطون",
        admin_users: "المديرون",
        users_list: "قائمة المستخدمين",
        refresh: "تحديث",
        new_user: "مستخدم جديد",
        
        // Search and Filter
        search_user: "البحث عن مستخدم...",
        all_groups: "جميع المجموعات",
        administrators: "المديرون",
        commercial: "تجاري",
        accountant: "محاسب",
        secretary: "سكرتير",
        all_statuses: "جميع الحالات",
        active: "نشط",
        inactive: "غير نشط",
        
        // User Card
        user_id: "معرف المستخدم:",
        additional_groups: "مجموعات إضافية:",
        edit: "تعديل",
        activate: "تفعيل",
        deactivate: "إلغاء التفعيل",
        delete: "حذف",
        
        // Empty State
        no_users: "لم يتم العثور على مستخدمين",
        create_first_user: "ابدأ بإنشاء المستخدم الأول",
        create_user: "إنشاء مستخدم",
        
        // Group Names
        group_admin: "مدير",
        group_commercial: "تجاري",
        group_comptable: "محاسب",
        group_secretaire: "سكرتير",
        
        // Status
        status_active: "نشط",
        status_inactive: "غير نشط",
        
        // Modals
        create_new_user: "إنشاء مستخدم جديد",
        username: "اسم المستخدم",
        password: "كلمة المرور",
        group: "المجموعة",
        select_group: "اختر مجموعة",
        create: "إنشاء",
        cancel: "إلغاء",
        edit_user: "تعديل المستخدم",
        new_password_optional: "كلمة مرور جديدة (اختياري)",
        leave_empty_no_change: "اتركه فارغاً لعدم التغيير",
        primary_group: "المجموعة الأساسية",
        modify: "تعديل",
        
        // Actions
        activate_user: "تفعيل المستخدم",
        deactivate_user: "إلغاء تفعيل المستخدم",
        delete_user: "حذف المستخدم",
        confirm_activate: "هل أنت متأكد من تفعيل المستخدم",
        confirm_deactivate: "هل أنت متأكد من إلغاء تفعيل المستخدم",
        confirm_delete: "هل أنت متأكد من حذف المستخدم نهائياً",
        action_irreversible: "هذا الإجراء لا يمكن التراجع عنه.",
        
        // Messages
        error_occurred: "حدث خطأ",
        operation_success: "تمت العملية بنجاح",
        user_created_success: "تم إنشاؤه بنجاح",
        user_modified_success: "تم تعديل المستخدم بنجاح",
        user_activated_success: "تم تفعيل المستخدم بنجاح",
        user_deactivated_success: "تم إلغاء تفعيل المستخدم بنجاح",
        user_deleted_success: "تم حذف المستخدم بنجاح",
        user_not_found: "لم يتم العثور على المستخدم",
        
        // Validation
        all_fields_required: "جميع الحقول مطلوبة",
        username_min_length: "يجب أن يحتوي اسم المستخدم على 3 أحرف على الأقل",
        password_min_length: "يجب أن تحتوي كلمة المرور على 6 أحرف على الأقل",
        
        // Logout
        logout_confirm: "تسجيل الخروج",
        logout_question: "هل أنت متأكد من تسجيل الخروج؟",
        logout_button: "تسجيل الخروج"
    }
};

// Language functionality
let currentLanguage = localStorage.getItem('language') || 'fr';

function translate(key, variables = {}) {
    let text = translations[currentLanguage][key] || translations.fr[key] || key;
    
    // Replace variables in text
    Object.keys(variables).forEach(varKey => {
        text = text.replace(`{${varKey}}`, variables[varKey]);
    });
    
    return text;
}

function updatePageLanguage() {
    // Update document direction and language
    const html = document.documentElement;
    html.setAttribute('lang', currentLanguage);
    html.setAttribute('dir', currentLanguage === 'ar' ? 'rtl' : 'ltr');
    
    // Update current language display
    document.getElementById('currentLangText').textContent = currentLanguage.toUpperCase();
    
    // Update all translatable elements
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        element.textContent = translate(key);
    });
    
    // Update placeholders
    document.querySelectorAll('[data-translate-placeholder]').forEach(element => {
        const key = element.getAttribute('data-translate-placeholder');
        element.placeholder = translate(key);
    });
    
    // Update select options
    updateSelectOptions();
    
    // Re-render users if loaded
    if (users.length > 0) {
        renderUsers();
    }
}

function updateSelectOptions() {
    // Update filter group options
    const filterGroup = document.getElementById('filterGroup');
    const filterGroupValue = filterGroup.value;
    filterGroup.innerHTML = `
        <option value="">${translate('all_groups')}</option>
        <option value="Admin">${translate('administrators')}</option>
        <option value="Commercial">${translate('commercial')}</option>
        <option value="Comptable">${translate('accountant')}</option>
        <option value="Secrétaire">${translate('secretary')}</option>
    `;
    filterGroup.value = filterGroupValue;
    
    // Update filter status options
    const filterStatus = document.getElementById('filterStatus');
    const filterStatusValue = filterStatus.value;
    filterStatus.innerHTML = `
        <option value="">${translate('all_statuses')}</option>
        <option value="active">${translate('active')}</option>
        <option value="inactive">${translate('inactive')}</option>
    `;
    filterStatus.value = filterStatusValue;
}

function changeLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('language', lang);
    updatePageLanguage();
    hideLanguageDropdown();
}

function setupLanguageToggle() {
    const languageToggle = document.getElementById('languageToggle');
    const languageDropdown = document.getElementById('languageDropdown');
    
    languageToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        languageDropdown.classList.toggle('show');
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', () => {
        hideLanguageDropdown();
    });
}

function hideLanguageDropdown() {
    document.getElementById('languageDropdown').classList.remove('show');
}

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

// API Configuration - Dynamic base URL
const API_BASE_URL = `http://${window.location.hostname}:8000`;

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
        document.getElementById('welcomeUser').textContent = `${translate('welcome')}, ${username}`;
        if (groups) {
            try {
                const groupsArray = JSON.parse(groups);
                const groupName = groupsArray.length > 0 ? groupsArray[0] : 'Utilisateur';
                document.getElementById('userRole').textContent = getGroupDisplayName(groupName);
            } catch (e) {
                document.getElementById('userRole').textContent = 'Utilisateur';
            }
        }
    }
    
    try {
        const response = await makeAuthenticatedRequest(`${API_BASE_URL}/auth/profile/`);
        if (response && response.ok) {
            const data = await response.json();
            document.getElementById('welcomeUser').textContent = `${translate('welcome')}, ${data.username}`;
            document.getElementById('userRole').textContent = getGroupDisplayName(data.group || 'Utilisateur');
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
            showError(translate('error_occurred'));
        }
    } catch (error) {
        console.error('Error loading users:', error);
        document.getElementById('loadingState').classList.add('hidden');
        document.getElementById('mainContent').classList.remove('hidden');
        showError(translate('error_occurred'));
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
    const groupKeys = {
        'Admin': 'group_admin',
        'Commercial': 'group_commercial',
        'Comptable': 'group_comptable',
        'Secrétaire': 'group_secretaire'
    };
    return translate(groupKeys[groupName] || 'group_secretaire');
}

// Get group CSS class
function getGroupClass(groupName) {
    const groupClasses = {
        'Admin': 'group-admin',
        'Commercial': 'group-commercial',
        'Comptable': 'group-comptable',
        'Secrétaire': 'group-secretary'
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
    const statusText = translate(user.is_active ? 'status_active' : 'status_inactive');
    const statusIcon = user.is_active ? 'fas fa-check-circle' : 'fas fa-times-circle';
    
    const isRTL = currentLanguage === 'ar';
    
    card.innerHTML = `
        <div class="flex items-center justify-between mb-4">
            <div class="flex items-center space-x-3 ${isRTL ? 'rtl:space-x-reverse' : ''}">
                <div class="w-12 h-12 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700">
                    <img src="${user.profile_picture || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjQiIGN5PSIyNCIgcj0iMjQiIGZpbGw9IiNGM0Y0RjYiLz4KPHBhdGggZD0iTTI0IDI0QzI3LjMxMzcgMjQgMzAgMjEuMzEzNyAzMCAxOEMzMCAxNC42ODYzIDI3LjMxMzcgMTIgMjQgMTJDMjAuNjg2MyAxMiAxOCAxNC42ODYzIDE4IDE4QzE4IDIxLjMxMzcgMjAuNjg2MyAyNCAyNCAyNFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTEyIDM4QzEyIDMxLjM3MjYgMTcuMzcyNiAyNiAyNCAyNkMzMC42Mjc0IDI2IDM2IDMxLjM3MjYgMzYgMzhIMTJaIiBmaWxsPSIjOUNBM0FGIi8+Cjwvc3ZnPgo='}" alt="${user.username}" 
                        class="w-full h-full object-cover" 
                        onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjQiIGN5PSIyNCIgcj0iMjQiIGZpbGw9IiNGM0Y0RjYiLz4KPHBhdGggZD0iTTI0IDI0QzI3LjMxMzcgMjQgMzAgMjEuMzEzNyAzMCAxOEMzMCAxNC42ODYzIDI3LjMxMzcgMTIgMjQgMTJDMjAuNjg2MyAxMiAxOCAxNC42ODYzIDE4IDE4QzE4IDIxLjMxMzcgMjAuNjg2MyAyNCAyNCAyNFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTEyIDM4QzEyIDMxLjM3MjYgMTcuMzcyNiAyNiAyNCAyNkMzMC42Mjc0IDI2IDM2IDMxLjM3MjYgMzYgMzhIMTJaIiBmaWxsPSIjOUNBM0FGIi8+Cjwvc3ZnPgo='">
                </div>
                <div>
                    <h3 class="text-gray-900 dark:text-white text-lg font-bold">${user.username}</h3>
                    <span class="group-badge ${groupClass}">
                        <i class="fas fa-user-tag ${isRTL ? 'ml-1' : 'mr-1'}"></i>${groupDisplayName}
                    </span>
                </div>
            </div>
            <span class="group-badge ${statusClass}">
                <i class="${statusIcon} ${isRTL ? 'ml-1' : 'mr-1'}"></i>${statusText}
            </span>
        </div>
        
        <div class="space-y-3">
            <div class="flex items-center justify-between text-sm">
                <span class="text-gray-500 dark:text-gray-400">
                    <i class="fas fa-id-badge ${isRTL ? 'ml-1' : 'mr-1'}"></i>${translate('user_id')}
                </span>
                <span class="text-gray-900 dark:text-white font-medium">#${user.id}</span>
            </div>
            
            ${user.groups.length > 1 ? `
            <div class="text-sm">
                <span class="text-gray-500 dark:text-gray-400">
                    <i class="fas fa-users ${isRTL ? 'ml-1' : 'mr-1'}"></i>${translate('additional_groups')}
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
            <div class="flex space-x-2 ${isRTL ? 'rtl:space-x-reverse' : ''}">
                <button onclick="editUser(${user.id})" 
                    class="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded-lg transition-colors text-sm">
                    <i class="fas fa-edit ${isRTL ? 'ml-1' : 'mr-1'}"></i>${translate('edit')}
                </button>
                <button onclick="toggleUserStatus(${user.id}, ${!user.is_active})" 
                    class="flex-1 ${user.is_active ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-500 hover:bg-green-600'} text-white py-2 px-3 rounded-lg transition-colors text-sm">
                    <i class="fas ${user.is_active ? 'fa-pause' : 'fa-play'} ${isRTL ? 'ml-1' : 'mr-1'}"></i>
                    ${translate(user.is_active ? 'deactivate' : 'activate')}
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
        title: translate('create_new_user'),
        html: `
            <div class="space-y-4">
                <div>
                    <label class="block text-left text-sm font-medium mb-2">${translate('username')}</label>
                    <input id="swal-username" class="swal2-input" placeholder="${translate('username')}" type="text">
                </div>
                <div>
                    <label class="block text-left text-sm font-medium mb-2">${translate('password')}</label>
                    <input id="swal-password" class="swal2-input" placeholder="${translate('password')}" type="password">
                </div>
                <div>
                    <label class="block text-left text-sm font-medium mb-2">${translate('group')}</label>
                    <select id="swal-group" class="swal2-select">
                        <option value="">${translate('select_group')}</option>
                        <option value="Admin">${translate('group_admin')}</option>
                        <option value="Commercial">${translate('group_commercial')}</option>
                        <option value="Comptable">${translate('group_comptable')}</option>
                        <option value="Secrétaire">${translate('group_secretaire')}</option>
                    </select>
                </div>
            </div>
        `,
        customClass: isDark ? 'dark-theme' : '',
        showCancelButton: true,
        confirmButtonText: translate('create'),
        cancelButtonText: translate('cancel'),
        confirmButtonColor: '#8b5cf6',
        preConfirm: () => {
            const username = document.getElementById('swal-username').value;
            const password = document.getElementById('swal-password').value;
            const group = document.getElementById('swal-group').value;
            
            if (!username || !password || !group) {
                Swal.showValidationMessage(translate('all_fields_required'));
                return false;
            }
            
            if (username.length < 3) {
                Swal.showValidationMessage(translate('username_min_length'));
                return false;
            }
            
            if (password.length < 6) {
                Swal.showValidationMessage(translate('password_min_length'));
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
                showSuccess(`${formValues.username} ${translate('user_created_success')}`);
                await loadUsers(); // Reload users list
            } else {
                const errorData = await response.json();
                showError(errorData.detail || translate('error_occurred'));
            }
        } catch (error) {
            console.error('Error creating user:', error);
            showError(translate('error_occurred'));
        }
    }
}

// Edit user
async function editUser(userId) {
    const user = users.find(u => u.id === userId);
    if (!user) {
        showError(translate('user_not_found'));
        return;
    }
    
    const isDark = html.classList.contains('dark');
    const primaryGroup = user.groups.length > 0 ? user.groups[0] : 'Secrétaire';
    
    const { value: formValues } = await Swal.fire({
        title: translate('edit_user'),
        html: `
            <div class="space-y-4">
                <div>
                    <label class="block text-left text-sm font-medium mb-2">${translate('username')}</label>
                    <input id="swal-username" class="swal2-input" value="${user.username}" type="text" readonly>
                </div>
                <div>
                    <label class="block text-left text-sm font-medium mb-2">${translate('new_password_optional')}</label>
                    <input id="swal-password" class="swal2-input" placeholder="${translate('leave_empty_no_change')}" type="password">
                </div>
                <div>
                    <label class="block text-left text-sm font-medium mb-2">${translate('primary_group')}</label>
                    <select id="swal-group" class="swal2-select">
                        <option value="Admin" ${primaryGroup === 'Admin' ? 'selected' : ''}>${translate('group_admin')}</option>
                        <option value="Commercial" ${primaryGroup === 'Commercial' ? 'selected' : ''}>${translate('group_commercial')}</option>
                        <option value="Comptable" ${primaryGroup === 'Comptable' ? 'selected' : ''}>${translate('group_comptable')}</option>
                        <option value="Secrétaire" ${primaryGroup === 'Secrétaire' ? 'selected' : ''}>${translate('group_secretaire')}</option>
                    </select>
                </div>
            </div>
        `,
        customClass: isDark ? 'dark-theme' : '',
        showCancelButton: true,
        confirmButtonText: translate('modify'),
        cancelButtonText: translate('cancel'),
        confirmButtonColor: '#3b82f6',
        preConfirm: () => {
            const password = document.getElementById('swal-password').value;
            const group = document.getElementById('swal-group').value;
            
            if (password && password.length < 6) {
                Swal.showValidationMessage(translate('password_min_length'));
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
                showSuccess(translate('user_modified_success'));
                await loadUsers(); // Reload users list
            } else {
                const errorData = await response.json();
                showError(errorData.detail || translate('error_occurred'));
            }
        } catch (error) {
            console.error('Error updating user:', error);
            showError(translate('error_occurred'));
        }
    }
}

// Toggle user status
async function toggleUserStatus(userId, newStatus) {
    const user = users.find(u => u.id === userId);
    if (!user) {
        showError(translate('user_not_found'));
        return;
    }
    
    const action = newStatus ? 'activate_user' : 'deactivate_user';
    const confirmMessage = newStatus ? 'confirm_activate' : 'confirm_deactivate';
    const isDark = html.classList.contains('dark');
    
    const result = await Swal.fire({
        title: translate(action),
        text: `${translate(confirmMessage)} "${user.username}"?`,
        icon: 'question',
        customClass: isDark ? 'dark-theme' : '',
        showCancelButton: true,
        confirmButtonText: translate(newStatus ? 'activate' : 'deactivate'),
        cancelButtonText: translate('cancel'),
        confirmButtonColor: newStatus ? '#10b981' : '#f59e0b'
    });
    
    if (result.isConfirmed) {
        try {
            const response = await makeAuthenticatedRequest(`${API_BASE_URL}/auth/toggle_user_status/${userId}/`, {
                method: 'POST',
                body: JSON.stringify({ is_active: newStatus })
            });
            
            if (response && response.ok) {
                showSuccess(translate(newStatus ? 'user_activated_success' : 'user_deactivated_success'));
                await loadUsers(); // Reload users list
            } else {
                const errorData = await response.json();
                showError(errorData.detail || translate('error_occurred'));
            }
        } catch (error) {
            console.error('Error toggling user status:', error);
            showError(translate('error_occurred'));
        }
    }
}

// Delete user
async function deleteUser(userId) {
    const user = users.find(u => u.id === userId);
    if (!user) {
        showError(translate('user_not_found'));
        return;
    }
    
    const isDark = html.classList.contains('dark');
    
    const result = await Swal.fire({
        title: translate('delete_user'),
        text: `${translate('confirm_delete')} "${user.username}"? ${translate('action_irreversible')}`,
        icon: 'warning',
        customClass: isDark ? 'dark-theme' : '',
        showCancelButton: true,
        confirmButtonText: translate('delete'),
        cancelButtonText: translate('cancel'),
        confirmButtonColor: '#ef4444',
        dangerMode: true
    });
    
    if (result.isConfirmed) {
        try {
            const response = await makeAuthenticatedRequest(`${API_BASE_URL}/auth/delete_user/${userId}/`, {
                method: 'DELETE'
            });
            
            if (response && response.ok) {
                showSuccess(translate('user_deleted_success'));
                await loadUsers(); // Reload users list
            } else {
                const errorData = await response.json();
                showError(errorData.detail || translate('error_occurred'));
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            showError(translate('error_occurred'));
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
            title: translate('logout_confirm'),
            text: translate('logout_question'),
            icon: 'question',
            customClass: isDark ? 'dark-theme' : '',
            showCancelButton: true,
            confirmButtonText: translate('logout_button'),
            cancelButtonText: translate('cancel'),
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
    
    // Initialize language
    updatePageLanguage();
    
    // Setup language toggle
    setupLanguageToggle();
    
    // Load user profile
    await loadUserProfile();
    
    // Setup event listeners
    setupSearchAndFilter();
    setupLogout();
    
    // Setup button click handlers
    document.getElementById('createUserBtn').addEventListener('click', createUser);
    document.getElementById('refreshUsersBtn').addEventListener('click', async () => {
        const refreshBtn = document.getElementById('refreshUsersBtn');
        const originalHTML = refreshBtn.innerHTML;
        refreshBtn.innerHTML = `<i class="fas fa-sync-alt fa-spin ${currentLanguage === 'ar' ? 'ml-2' : 'mr-2'}"></i>${translate('loading')}...`;
        await loadUsers();
        refreshBtn.innerHTML = originalHTML;
    });
    
    // Load users data
    await loadUsers();
}

// Start the application when DOM is loaded
document.addEventListener('DOMContentLoaded', initializePage);