const urlParams = new URLSearchParams(window.location.search);
const projectId = urlParams.get('id') || window.location.pathname.split('/').pop();

let currentProject = null;

const darkModeToggle = document.getElementById('darkModeToggle');
const html = document.documentElement;

const isDarkMode = localStorage.getItem('darkMode') === 'true';
if (isDarkMode) {
    html.classList.add('dark');
}

darkModeToggle.addEventListener('click', () => {
    html.classList.toggle('dark');
    localStorage.setItem('darkMode', html.classList.contains('dark'));
});

document.getElementById('backBtn').addEventListener('click', () => {
    window.history.back();
});

async function refreshToken() {
    try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) return false;

        const response = await fetch('http://127.0.0.1:8000/accounts/token/refresh/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                refresh: refreshToken
            }),
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('access_token', data.access);
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error refreshing token:', error);
        return false;
    }
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('fr-DZ', {
        style: 'currency',
        currency: 'DZD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
}

function formatDate(dateString) {
    // Check if dateString is valid
    if (!dateString || dateString === null || dateString === undefined) {
        return 'Date non disponible';
    }
    
    const date = new Date(dateString);
    
    // Check if the date is valid
    if (isNaN(date.getTime())) {
        console.warn('Invalid date string:', dateString);
        return 'Date invalide';
    }
    
    return new Intl.DateTimeFormat('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }).format(date);
}
function formatDateTime(dateString) {
    // Check if dateString is valid
    if (!dateString || dateString === null || dateString === undefined) {
        return 'Date non disponible';
    }
    
    const date = new Date(dateString);
    
    // Check if the date is valid
    if (isNaN(date.getTime())) {
        console.warn('Invalid date string:', dateString);
        return 'Date invalide';
    }
    
    return new Intl.DateTimeFormat('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(date);
}


function showError(message) {
    document.getElementById('errorMessage').textContent = message;
    document.getElementById('errorToast').classList.remove('hidden');
    setTimeout(() => {
        document.getElementById('errorToast').classList.add('hidden');
    }, 3000);
}

function showSuccess(message) {
    document.getElementById('successMessage').textContent = message;
    document.getElementById('successToast').classList.remove('hidden');
    setTimeout(() => {
        document.getElementById('successToast').classList.add('hidden');
    }, 3000);
}

async function loadProjectDetails() {
    try {
        const token = localStorage.getItem('access_token');
        if (!token) {
            window.location.href = 'login.html';
            return;
        }

        const response = await fetch(`http://127.0.0.1:8000/gestion/projects/${projectId}/`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            const project = await response.json();
            currentProject = project;
            displayProjectDetails(project);
        } else if (response.status === 401) {
            const refreshed = await refreshToken();
            if (refreshed) {
                await loadProjectDetails();
            } else {
                window.location.href = 'login.html';
            }
        } else {
            throw new Error('Erreur lors du chargement du projet');
        }
    } catch (error) {
        console.error('Error loading project:', error);
        showError('Erreur lors du chargement du projet');
    }
}

function displayProjectDetails(project) {
    document.getElementById('projectName').textContent = project.name;
    document.getElementById('projectDescription').textContent = project.description || 'Aucune description';
    document.getElementById('estimatedBudget').textContent = formatCurrency(project.estimated_budget);
    document.getElementById('totalDepenses').textContent = formatCurrency(project.total_depenses);
    document.getElementById('totalRecus').textContent = formatCurrency(project.total_recus);
    document.getElementById('totalBenefices').textContent = formatCurrency(project.total_benefices);

    document.getElementById('projectOperation').textContent = project.operation || '--';
    document.getElementById('numeroOperation').textContent = project.numero_operation || '--';
    document.getElementById('dateDebut').textContent = project.date_debut ? formatDate(project.date_debut) : '--';
    document.getElementById('periodMonths').textContent = project.period_months ? `${project.period_months} mois` : '--';
    document.getElementById('createdBy').textContent = project.created_by || '--';
    document.getElementById('createdAt').textContent = project.created_at ? formatDateTime(project.created_at) : '--';

    if (project.collaborator_name) {
        document.getElementById('collaboratorInfo').classList.remove('hidden');
        document.getElementById('collaboratorName').textContent = project.collaborator_name;
        document.getElementById('collaboratorBtn').classList.remove('hidden');
    }

    document.getElementById('loadingState').classList.add('hidden');
    document.getElementById('mainContent').classList.remove('hidden');
}

document.getElementById('editProjectBtn').addEventListener('click', () => {
    if (currentProject) {
        document.getElementById('editProjectName').value = currentProject.name;
        document.getElementById('editProjectDescription').value = currentProject.description || '';
        document.getElementById('editEstimatedBudget').value = currentProject.estimated_budget;
        document.getElementById('editCollaboratorName').value = currentProject.collaborator_name || '';
        document.getElementById('editModal').classList.remove('hidden');
    }
});

document.getElementById('closeEditModal').addEventListener('click', () => {
    document.getElementById('editModal').classList.add('hidden');
});

document.getElementById('cancelEdit').addEventListener('click', () => {
    document.getElementById('editModal').classList.add('hidden');
});

document.getElementById('editProjectForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    await updateProject();
});

async function updateProject() {
    try {
        const token = localStorage.getItem('access_token');
        const formData = {
            name: document.getElementById('editProjectName').value,
            description: document.getElementById('editProjectDescription').value,
            estimated_budget: document.getElementById('editEstimatedBudget').value,
            collaborator_name: document.getElementById('editCollaboratorName').value,
        };

        const response = await fetch(`http://127.0.0.1:8000/gestion/projects/${projectId}/update/`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        if (response.ok) {
            const result = await response.json();
            showSuccess('Projet mis à jour avec succès');
            document.getElementById('editModal').classList.add('hidden');
            await loadProjectDetails();
        } else if (response.status === 401) {
            const refreshed = await refreshToken();
            if (refreshed) {
                await updateProject();
            } else {
                window.location.href = 'login.html';
            }
        } else {
            throw new Error('Erreur lors de la mise à jour');
        }
    } catch (error) {
        console.error('Error updating project:', error);
        showError('Erreur lors de la mise à jour du projet');
    }
}

document.getElementById('collaboratorBtn').addEventListener('click', async () => {
    await loadCollaboratorOperations();
    document.getElementById('collaboratorModal').classList.remove('hidden');
});

document.getElementById('closeCollaboratorModal').addEventListener('click', () => {
    document.getElementById('collaboratorModal').classList.add('hidden');
});

async function loadCollaboratorOperations() {
    try {
        const token = localStorage.getItem('access_token');
        const response = await fetch(`http://127.0.0.1:8000/gestion/projects/${projectId}/history/`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            const history = await response.json();
            displayCollaboratorOperations(history);
        } else if (response.status === 401) {
            const refreshed = await refreshToken();
            if (refreshed) {
                await loadCollaboratorOperations();
            } else {
                window.location.href = 'login.html';
            }
        } else {
            throw new Error('Erreur lors du chargement des opérations du collaborateur');
        }
    } catch (error) {
        console.error('Error loading collaborator operations:', error);
        showError('Erreur lors du chargement des opérations du collaborateur');
    }
}

function displayCollaboratorOperations(history) {
    // Add debugging to see what data we're receiving
    console.log('Full history data:', history);
    console.log('History length:', history.length);
    
    // Check each item in detail
    history.forEach((item, index) => {
        console.log(`Item ${index}:`, {
            action: item.action,
            by_colaborator: item.by_colaborator,
             // Check if this exists too
            description: item.description,
            new_values: item.new_values
        });
    });

    // Try multiple possible field names for collaborator flag
    const collaboratorHistory = history.filter(item => {
        const isCollaborator = item.by_colaborator === true || item.is_collaborator === true;
        const isValidAction = item.action === 'depense_added' || item.action === 'recu_added';
        
        console.log(`Filtering item:`, {
            action: item.action,
            by_colaborator: item.by_colaborator,
            is_collaborator: item.is_collaborator,
            isCollaborator,
            isValidAction,
            willInclude: isCollaborator && isValidAction
        });
        
        return isCollaborator && isValidAction;
    });

    console.log('Filtered collaborator history:', collaboratorHistory);
    console.log('Collaborator history length:', collaboratorHistory.length);

    let totalRecus = 0;
    let totalDepenses = 0;

    collaboratorHistory.forEach(item => {
        if (item.action === 'recu_added' && item.new_values && item.new_values.amount) {
            totalRecus += parseFloat(item.new_values.amount);
        } else if (item.action === 'depense_added' && item.new_values && item.new_values.amount) {
            totalDepenses += parseFloat(item.new_values.amount);
        }
    });

    document.getElementById('collaboratorRecus').textContent = formatCurrency(totalRecus);
    document.getElementById('collaboratorDepenses').textContent = formatCurrency(totalDepenses);
    document.getElementById('collaboratorOperations').textContent = collaboratorHistory.length;

    const operationsList = document.getElementById('collaboratorOperationsList');
    const noOperations = document.getElementById('noCollaboratorOperations');

    if (collaboratorHistory.length === 0) {
        operationsList.innerHTML = '';
        noOperations.classList.remove('hidden');
        console.log('No collaborator operations found - showing "no operations" message');
        return;
    }

    console.log('Displaying collaborator operations...');
    noOperations.classList.add('hidden');
    operationsList.innerHTML = collaboratorHistory.map(item => {
        const isRecu = item.action === 'recu_added';
        const amount = item.new_values?.amount || 0;
        const description = item.description || (isRecu ? 'Reçu ajouté' : 'Dépense ajoutée');
        
        // Safe date formatting with fallback
        const formattedDate = item.created_at ? formatDateTime(item.created_at) : 'Date non disponible';
        
        return `
            <div class="bg-white dark:bg-gray-700 rounded-lg p-4 border-l-4 ${isRecu ? 'border-green-500' : 'border-red-500'}">
                <div class="flex items-center justify-between">
                    <div>
                        <div class="flex items-center space-x-2">
                            <i class="fas ${isRecu ? 'fa-arrow-up text-green-500' : 'fa-arrow-down text-red-500'}"></i>
                            <span class="font-medium text-gray-900 dark:text-white">${description}</span>
                        </div>
                        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            ${formattedDate} par ${item.user || 'Collaborateur'}
                        </p>
                    </div>
                    <div class="text-right">
                        <p class="text-lg font-bold ${isRecu ? 'text-green-600' : 'text-red-600'}">
                            ${formatCurrency(amount)}
                        </p>
                    </div>
                </div>
                ${item.new_values?.details ? `
                    <div class="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        <strong>Détails:</strong> ${item.new_values.details}
                    </div>
                ` : ''}
            </div>
        `;
    }).join('');
}
async function loadCollaboratorOperations() {
    try {
        console.log('Loading collaborator operations for project:', projectId);
        const token = localStorage.getItem('access_token');
        const response = await fetch(`http://127.0.0.1:8000/gestion/projects/${projectId}/history/`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            const history = await response.json();
            console.log('Raw API response:', history);
            displayCollaboratorOperations(history);
        } else if (response.status === 401) {
            const refreshed = await refreshToken();
            if (refreshed) {
                await loadCollaboratorOperations();
            } else {
                window.location.href = 'login.html';
            }
        } else {
            console.error('API response not OK:', response.status, response.statusText);
            throw new Error('Erreur lors du chargement des opérations du collaborateur');
        }
    } catch (error) {
        console.error('Error loading collaborator operations:', error);
        showError('Erreur lors du chargement des opérations du collaborateur');
    }
}
document.getElementById('historyBtn').addEventListener('click', async () => {
    await loadProjectHistory();
    document.getElementById('historyModal').classList.remove('hidden');
});

document.getElementById('closeHistoryModal').addEventListener('click', () => {
    document.getElementById('historyModal').classList.add('hidden');
});

async function loadProjectHistory() {
    try {
        const token = localStorage.getItem('access_token');
        const response = await fetch(`http://127.0.0.1:8000/gestion/projects/${projectId}/history/`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            const history = await response.json();
            displayProjectHistory(history);
        } else if (response.status === 401) {
            const refreshed = await refreshToken();
            if (refreshed) {
                await loadProjectHistory();
            } else {
                window.location.href = 'login.html';
            }
        } else {
            throw new Error('Erreur lors du chargement de l\'historique');
        }
    } catch (error) {
        console.error('Error loading history:', error);
        showError('Erreur lors du chargement de l\'historique');
    }
}

function displayProjectHistory(history) {
    const historyList = document.getElementById('historyList');
    const noHistory = document.getElementById('noHistory');

    // Filter to show only non-collaborator operations (by_colaborator is false or undefined)
    const filteredHistory = history.filter(item => 
        (item.action === 'recu_added' || item.action === 'depense_added') && 
        !item.by_colaborator  // Exclude collaborator operations
    );

    if (filteredHistory.length === 0) {
        historyList.innerHTML = '';
        noHistory.classList.remove('hidden');
        return;
    }

    noHistory.classList.add('hidden');
    historyList.innerHTML = filteredHistory.map(item => {
        const isRecu = item.action === 'recu_added';
        const amount = item.new_values?.amount || 0;
        const description = item.description || (isRecu ? 'Reçu ajouté' : 'Dépense ajoutée');
        
        // Safe date formatting with fallback
        const formattedDate = item.created_at ? formatDateTime(item.created_at) : 'Date non disponible';
        
        return `
            <div class="history-item bg-white dark:bg-gray-700 rounded-lg p-4 border-l-4 ${isRecu ? 'border-green-500' : 'border-red-500'} shadow-sm">
                <div class="flex items-center justify-between">
                    <div class="flex-1">
                        <div class="flex items-center space-x-3">
                            <div class="w-10 h-10 rounded-full ${isRecu ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'} flex items-center justify-center">
                                <i class="fas ${isRecu ? 'fa-arrow-up text-green-600' : 'fa-arrow-down text-red-600'}"></i>
                            </div>
                            <div>
                                <h4 class="font-medium text-gray-900 dark:text-white">${description}</h4>
                                <div class="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    <span>
                                        <i class="fas fa-user mr-1"></i>
                                        ${item.user || 'Système'}
                                    </span>
                                    <span>
                                        <i class="fas fa-clock mr-1"></i>
                                        ${formattedDate}
                                    </span>
                                </div>
                            </div>
                        </div>
                        
                        ${item.new_values?.details ? `
                            <div class="mt-3 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded p-2">
                                <strong>Détails:</strong> ${item.new_values.details}
                            </div>
                        ` : ''}
                    </div>
                    <div class="text-right ml-4">
                        <p class="text-xl font-bold ${isRecu ? 'text-green-600' : 'text-red-600'}">
                            ${formatCurrency(amount)}
                        </p>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}
document.addEventListener('DOMContentLoaded', async () => {
    const userInfo = localStorage.getItem('user_info');
    if (userInfo) {
        const user = JSON.parse(userInfo);
        document.getElementById('welcomeUser').textContent = `Bienvenue, ${user.username}`;
        document.getElementById('userRole').textContent = user.role || 'Utilisateur';
    }

    await loadProjectDetails();
});

document.addEventListener('click', (e) => {
    if (e.target.closest('.fixed.inset-0.bg-black.opacity-50')) {
        document.getElementById('editModal').classList.add('hidden');
        document.getElementById('collaboratorModal').classList.add('hidden');
        document.getElementById('historyModal').classList.add('hidden');
    }
});