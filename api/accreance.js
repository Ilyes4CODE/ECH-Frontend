const BASE_API_URL = 'http://127.0.0.1:8000/gestion';
const BASE_API = 'http://127.0.0.1:8000';
let currentProjectId = null;
let allRevenus = [];
let projectData = null;
let originalBudget = 0;

function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

function showToast(type, message) {
    const toast = document.getElementById(type === 'error' ? 'errorToast' : 'successToast');
    const messageEl = document.getElementById(type === 'error' ? 'errorMessage' : 'successMessage');
    messageEl.textContent = message;
    toast.classList.remove('hidden');
    setTimeout(() => toast.classList.add('hidden'), 5000);
}

function formatNumber(amount) {
    // Convert to number if it's a string
    const numAmount = parseFloat(amount);
    
    // Check if it's a valid number
    if (isNaN(numAmount)) {
        return '0';
    }
    
    // Format the number with commas as thousand separators and dot as decimal separator
    return numAmount.toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    });
}

function formatCurrency(amount) {
    return formatNumber(amount) + ' DZD';
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('fr-FR');
}

function getAuthToken() {
    return localStorage.getItem('access_token');
}

function displayUserInfo() {
    const username = localStorage.getItem('username') || 'Utilisateur';
    const userGroups = localStorage.getItem('user_groups');
    
    let userRole = 'Utilisateur';
    if (userGroups) {
        try {
            const groups = JSON.parse(userGroups);
            if (Array.isArray(groups) && groups.length > 0) {
                userRole = groups[0];
            }
        } catch (error) {
            console.error('Erreur lors du parsing des groupes utilisateur:', error);
        }
    }
    
    document.getElementById('welcomeUser').textContent = `Bienvenue, ${username}`;
    document.getElementById('userRole').textContent = userRole;
}

async function fetchRevenus() {
    try {
        let url = `${BASE_API_URL}/api/revenus/project/${currentProjectId}/`;
        const params = new URLSearchParams();
        
        const year = document.getElementById('yearFilter').value;
        const month = document.getElementById('monthFilter').value;
        const day = document.getElementById('dayFilter').value;
        
        if (year) params.append('year', year);
        if (month) params.append('month', month);
        if (day) params.append('day', day);
        
        if (params.toString()) {
            url += '?' + params.toString();
        }

        const response = await fetch(url, {
            headers: {
                'Authorization': 'Bearer ' + getAuthToken(),
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) throw new Error('Erreur lors du chargement');
        
        const data = await response.json();
        if (data.success) {
            allRevenus = data.revenus;
            projectData = data.project;
            
            // Set original budget only once, when first loading
            if (originalBudget === 0 && projectData) {
                originalBudget = parseFloat(projectData.estimated_budget);
            }
            
            updateProjectInfo();
            renderRevenus();
            populateFilters();
            document.getElementById('loadingState').classList.add('hidden');
            document.getElementById('mainContent').classList.remove('hidden');
        } else {
            throw new Error(data.error);
        }
    } catch (error) {
        showToast('error', 'Erreur lors du chargement des revenus');
        document.getElementById('loadingState').classList.add('hidden');
    }
}

function updateProjectInfo() {
    if (!projectData) return;
    
    document.getElementById('projectName').textContent = projectData.name;
    
    const totalRevenus = allRevenus.reduce((sum, revenu) => sum + parseFloat(revenu.montant), 0);
    const currentBudget = parseFloat(projectData.estimated_budget);
    
    // Original budget is the initial budget before any revenus were created
    document.getElementById('initialBudget').textContent = formatCurrency(originalBudget);
    // Current budget is what's remaining after revenus
    document.getElementById('currentBudget').textContent = formatCurrency(currentBudget);
    // Total revenus is the sum of all revenus created
    document.getElementById('totalRevenus').textContent = formatCurrency(totalRevenus);
    document.getElementById('countRevenus').textContent = allRevenus.length;
}

function renderRevenus() {
    const tbody = document.getElementById('revenusList');
    const emptyState = document.getElementById('emptyState');
    const searchTerm = document.getElementById('searchFilter').value.toLowerCase();
    
    let filteredRevenus = allRevenus.filter(revenu => 
        revenu.revenu_code.toLowerCase().includes(searchTerm)
    );
    
    if (filteredRevenus.length === 0) {
        tbody.innerHTML = '';
        emptyState.classList.remove('hidden');
        return;
    }
    
    emptyState.classList.add('hidden');
    
    tbody.innerHTML = filteredRevenus.map(revenu => `
        <tr class="revenu-row hover:bg-gray-50 dark:hover:bg-gray-700">
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900 dark:text-white">${revenu.revenu_code}</div>
                <div class="text-sm text-gray-500 dark:text-gray-400">Créé le ${formatDate(revenu.created_at)}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-bold text-green-600 dark:text-green-400">${formatCurrency(revenu.montant)}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                ${formatDate(revenu.date)}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                ${revenu.created_by || 'N/A'}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
                ${revenu.pdf_file ? 
                    `<a href="${BASE_API}${revenu.pdf_file}" target="_blank" class="text-red-600 hover:text-red-800 dark:text-red-400">
                        <i class="fas fa-file-pdf mr-1"></i>Voir PDF
                    </a>` : 
                    '<span class="text-gray-400">Aucun PDF</span>'
                }
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
                <button onclick="deleteRevenu(${revenu.id})" class="text-red-600 hover:text-red-800 dark:text-red-400 mr-3">
                    <i class="fas fa-trash"></i>
                </button>
                <button onclick="viewRevenuDetail(${revenu.id})" class="text-blue-600 hover:text-blue-800 dark:text-blue-400">
                    <i class="fas fa-eye"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function populateFilters() {
    const yearFilter = document.getElementById('yearFilter');
    const dayFilter = document.getElementById('dayFilter');
    
    const years = [...new Set(allRevenus.map(r => new Date(r.date).getFullYear()))].sort((a, b) => b - a);
    yearFilter.innerHTML = '<option value="">Toutes les années</option>' + 
        years.map(year => `<option value="${year}">${year}</option>`).join('');
    
    dayFilter.innerHTML = '<option value="">Tous les jours</option>';
    for (let i = 1; i <= 31; i++) {
        dayFilter.innerHTML += `<option value="${i}">${i}</option>`;
    }
}

async function createRevenu(formData) {
    try {
        const response = await fetch(`${BASE_API_URL}/api/revenus/create/`, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + getAuthToken()
            },
            body: formData
        });

        const data = await response.json();
        
        if (!response.ok) {
            // Handle specific error cases
            if (response.status === 400) {
                throw new Error(data.error || 'Données invalides');
            } else if (response.status === 500) {
                throw new Error(data.error || 'Erreur serveur interne');
            } else {
                throw new Error('Erreur lors de la création');
            }
        }
        
        if (data.success) {
            showToast('success', 'Revenu créé avec succès');
            document.getElementById('addRevenuModal').classList.add('hidden');
            document.getElementById('addRevenuForm').reset();
            await fetchRevenus();
        } else {
            throw new Error(data.error || 'Erreur inconnue');
        }
    } catch (error) {
        console.error('Error creating revenu:', error);
        showToast('error', error.message);
    }
}

async function deleteRevenu(revenuId) {
    const result = await Swal.fire({
        title: 'Êtes-vous sûr?',
        text: 'Cette action est irréversible!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Oui, supprimer',
        cancelButtonText: 'Annuler'
    });

    if (!result.isConfirmed) return;

    try {
        const response = await fetch(`${BASE_API_URL}/api/revenus/${revenuId}/delete/`, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + getAuthToken(),
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) throw new Error('Erreur lors de la suppression');
        
        const data = await response.json();
        if (data.success) {
            showToast('success', 'Revenu supprimé avec succès');
            await fetchRevenus();
        } else {
            throw new Error(data.error);
        }
    } catch (error) {
        showToast('error', error.message);
    }
}

async function viewRevenuDetail(revenuId) {
    try {
        const response = await fetch(`${BASE_API_URL}/api/revenus/${revenuId}/`, {
            headers: {
                'Authorization': 'Bearer ' + getAuthToken(),
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) throw new Error('Erreur lors du chargement');
        
        const data = await response.json();
        if (data.success) {
            const revenu = data.revenu;
            Swal.fire({
                title: 'Détails du Revenu',
                html: `
                    <div class="text-left space-y-2">
                        <p><strong>Code:</strong> ${revenu.revenu_code}</p>
                        <p><strong>Montant:</strong> ${formatCurrency(revenu.montant)}</p>
                        <p><strong>Date:</strong> ${formatDate(revenu.date)}</p>
                        <p><strong>Créé par:</strong> ${revenu.created_by || 'N/A'}</p>
                        <p><strong>Date de création:</strong> ${formatDate(revenu.created_at)}</p>
                        ${revenu.pdf_file ? `<p><strong>PDF:</strong> <a href="${BASE_API}${revenu.pdf_file}" target="_blank" class="text-blue-600">Télécharger</a></p>` : ''}
                    </div>
                `,
                icon: 'info'
            });
        } else {
            throw new Error(data.error);
        }
    } catch (error) {
        showToast('error', 'Erreur lors du chargement des détails');
    }
}

async function exportToPDF() {
    try {
        const response = await fetch(`${BASE_API_URL}/api/revenus/project/${currentProjectId}/export-pdf/`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + getAuthToken()
            }
        });

        if (!response.ok) throw new Error('Erreur lors de l\'export');

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `revenus_${projectData?.name || 'projet'}_${new Date().toISOString().split('T')[0]}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        showToast('success', 'Export PDF réussi');
    } catch (error) {
        showToast('error', 'Erreur lors de l\'export PDF');
    }
}

function resetFilters() {
    document.getElementById('yearFilter').value = '';
    document.getElementById('monthFilter').value = '';
    document.getElementById('dayFilter').value = '';
    document.getElementById('searchFilter').value = '';
    fetchRevenus(); // Re-fetch data to reset filters
}

function initializeDarkMode() {
    const isDark = localStorage.getItem('darkMode') === 'true';
    if (isDark) {
        document.documentElement.classList.add('dark');
    }
    
    document.getElementById('darkModeToggle').addEventListener('click', () => {
        document.documentElement.classList.toggle('dark');
        localStorage.setItem('darkMode', document.documentElement.classList.contains('dark'));
    });
}

function initializeEventListeners() {
    document.getElementById('backBtn').addEventListener('click', () => {
        window.history.back();
    });

    document.getElementById('addRevenuBtn').addEventListener('click', () => {
        document.getElementById('addRevenuModal').classList.remove('hidden');
        document.getElementById('revenuDate').value = new Date().toISOString().split('T')[0];
    });

    document.getElementById('addFirstRevenuBtn').addEventListener('click', () => {
        document.getElementById('addRevenuModal').classList.remove('hidden');
        document.getElementById('revenuDate').value = new Date().toISOString().split('T')[0];
    });

    document.getElementById('closeAddModal').addEventListener('click', () => {
        document.getElementById('addRevenuModal').classList.add('hidden');
    });

    document.getElementById('cancelAdd').addEventListener('click', () => {
        document.getElementById('addRevenuModal').classList.add('hidden');
    });

    document.getElementById('resetFiltersBtn').addEventListener('click', resetFilters);

    document.getElementById('yearFilter').addEventListener('change', fetchRevenus);
    document.getElementById('monthFilter').addEventListener('change', fetchRevenus);
    document.getElementById('dayFilter').addEventListener('change', fetchRevenus);
    document.getElementById('searchFilter').addEventListener('input', renderRevenus);

    document.getElementById('addRevenuForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const revenuCode = document.getElementById('numAttestation').value.trim();
        const montant = document.getElementById('revenuMontant').value.trim();
        const date = document.getElementById('revenuDate').value.trim();
        
        // Validate form data
        if (!revenuCode || !montant || !date) {
            showToast('error', 'Veuillez remplir tous les champs obligatoires');
            return;
        }
        
        // Validate revenu code format (optional - you can customize this)
        if (revenuCode.length < 3) {
            showToast('error', 'Le numéro d\'attestation doit contenir au moins 3 caractères');
            return;
        }
        
        // Validate montant is a valid number
        const montantNumber = parseFloat(montant);
        if (isNaN(montantNumber) || montantNumber <= 0) {
            showToast('error', 'Le montant doit être un nombre supérieur à 0');
            return;
        }
        
        // Check if we have enough budget
        if (projectData && montantNumber > parseFloat(projectData.estimated_budget)) {
            showToast('error', `Budget insuffisant. Budget disponible: ${formatCurrency(projectData.estimated_budget)}`);
            return;
        }
        
        const formData = new FormData();
        formData.append('project_id', currentProjectId);
        formData.append('revenu_code', revenuCode);
        // Convert to string with proper decimal formatting
        formData.append('montant', montantNumber.toString());
        formData.append('date', date);
        
        const pdfFile = document.getElementById('revenuPDF').files[0];
        if (pdfFile) {
            // Validate PDF file
            if (pdfFile.type !== 'application/pdf') {
                showToast('error', 'Seuls les fichiers PDF sont autorisés');
                return;
            }
            
            // Check file size (5MB limit)
            if (pdfFile.size > 5 * 1024 * 1024) {
                showToast('error', 'Le fichier PDF ne doit pas dépasser 5MB');
                return;
            }
            
            formData.append('pdf_file', pdfFile);
        }

        await createRevenu(formData);
    });

    document.addEventListener('click', (e) => {
        if (e.target === document.getElementById('addRevenuModal')) {
            document.getElementById('addRevenuModal').classList.add('hidden');
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    currentProjectId = getUrlParameter('projectId');
    
    if (!currentProjectId) {
        showToast('error', 'ID du projet manquant');
        return;
    }

    // Display user information
    displayUserInfo();
    
    initializeDarkMode();
    initializeEventListeners();
    fetchRevenus();
});