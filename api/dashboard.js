const API_BASE_URL = 'http://127.0.0.1:8000/gestion/';

const token = localStorage.getItem('access_token');
const username = localStorage.getItem('username');
const userGroups = JSON.parse(localStorage.getItem('user_groups') || '[]');
let currentFormData = {};
let currentStep = 1;

const apiHeaders = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
};

function showError(message) {
    const errorToast = document.getElementById('errorToast');
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.textContent = message;
    errorToast.classList.remove('hidden');
    setTimeout(() => {
        errorToast.classList.add('hidden');
    }, 5000);
}
function createModalHTML(title, content, showBack = false) {
    return `
        <div id="customModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 opacity-0 transition-opacity duration-300">
            <div id="modalContent" class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4 transform scale-95 transition-transform duration-300 max-h-[90vh] overflow-y-auto">
                <div class="p-6">
                    <div class="flex justify-between items-center mb-6">
                        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">${title}</h2>
                        <button id="closeModal" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                            <i class="fas fa-times text-xl"></i>
                        </button>
                    </div>
                    
                    <div id="modalBody" class="space-y-4 max-h-[60vh] overflow-y-auto">
                        ${content}
                    </div>
                    
                    <div class="flex justify-between mt-6 space-x-3">
                        ${showBack ? '<button id="backBtn" class="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"><i class="fas fa-arrow-left mr-2"></i>Retour</button>' : ''}
                        <div class="flex space-x-3 ${showBack ? '' : 'ml-auto'}">
                            <button id="cancelBtn" class="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors duration-200">Annuler</button>
                            <button id="nextBtn" class="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors duration-200">
                                <span id="nextBtnText">Suivant</span>
                                <i class="fas fa-arrow-right ml-2"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}
function showModal(html) {
    document.body.insertAdjacentHTML('beforeend', html);
    const modal = document.getElementById('customModal');
    const modalContent = document.getElementById('modalContent');
    
    // Trigger animation
    setTimeout(() => {
        modal.classList.remove('opacity-0');
        modal.classList.add('opacity-100');
        modalContent.classList.remove('scale-95');
        modalContent.classList.add('scale-100');
    }, 10);
    
    // Add event listeners
    document.getElementById('closeModal').addEventListener('click', closeModal);
    document.getElementById('cancelBtn').addEventListener('click', closeModal);
}
function closeModal() {
    const modal = document.getElementById('customModal');
    const modalContent = document.getElementById('modalContent');
    
    modal.classList.remove('opacity-100');
    modal.classList.add('opacity-0');
    modalContent.classList.remove('scale-100');
    modalContent.classList.add('scale-95');
    
    setTimeout(() => {
        modal.remove();
    }, 300);
    
    // Reset form data
    currentFormData = {};
    currentStep = 1;
}

// Animate content change
function animateContentChange(newContent) {
    const modalBody = document.getElementById('modalBody');
    
    // Slide out current content
    modalBody.style.transform = 'translateX(-100%)';
    modalBody.style.opacity = '0';
    
    setTimeout(() => {
        modalBody.innerHTML = newContent;
        modalBody.style.transform = 'translateX(100%)';
        
        setTimeout(() => {
            modalBody.style.transform = 'translateX(0)';
            modalBody.style.opacity = '1';
        }, 50);
    }, 300);
}
function showSuccess(message) {
    const successToast = document.getElementById('successToast');
    const successMessage = document.getElementById('successMessage');
    successMessage.textContent = message;
    successToast.classList.remove('hidden');
    setTimeout(() => {
        successToast.classList.add('hidden');
    }, 5000);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function formatNumber(number) {
    return new Intl.NumberFormat('fr-FR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(number);
}

async function fetchCaisseStatus() {
    try {
        const response = await fetch(`${API_BASE_URL}caisse/status/`, {
            headers: apiHeaders
        });
        const data = await response.json();
        
        if (response.ok) {
            document.getElementById('cashAmount').textContent = formatNumber(data.total_amount);
            document.getElementById('lastUpdate').textContent = formatDate(data.updated_at);
        } else {
            showError('Erreur lors du chargement du statut de la caisse');
        }
    } catch (error) {
        showError('Erreur de connexion');
    }
}

async function fetchProjects() {
    try {
        const response = await fetch(`${API_BASE_URL}projects/`, {
            headers: apiHeaders
        });
        const data = await response.json();
        
        if (response.ok) {
            displayProjects(data);
            updateProjectStats(data);
        } else {
            showError('Erreur lors du chargement des projets');
        }
    } catch (error) {
        showError('Erreur de connexion');
    }
}

function displayProjects(projects) {
    const projectsList = document.getElementById('projectsList');
    
    if (projects.length === 0) {
        projectsList.innerHTML = `
            <div class="col-span-full text-center py-12">
                <i class="fas fa-project-diagram text-gray-300 dark:text-gray-600 text-6xl mb-4"></i>
                <p class="text-gray-500 dark:text-gray-400 text-lg">Aucun projet trouvé</p>
            </div>
        `;
        return;
    }
    
    projectsList.innerHTML = projects.map(project => `
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 project-card theme-transition">
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">${project.name}</h3>
                <span class="status-badge status-active">Actif</span>
            </div>
            
            <p class="text-gray-600 dark:text-gray-400 text-sm mb-4">${project.description.substring(0, 100)}${project.description.length > 100 ? '...' : ''}</p>
            
            <div class="grid grid-cols-2 gap-4 mb-4">
                <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                    <p class="text-xs text-gray-500 dark:text-gray-400">Budget Estimé</p>
                    <p class="text-sm font-medium text-gray-900 dark:text-white">${formatNumber(project.estimated_budget)} DZD</p>
                </div>
                <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                    <p class="text-xs text-gray-500 dark:text-gray-400">Durée</p>
                    <p class="text-sm font-medium text-gray-900 dark:text-white">${project.period_months} mois</p>
                </div>
            </div>
            
            <div class="grid grid-cols-3 gap-2 mb-4">
                <div class="text-center">
                    <p class="text-xs text-gray-500 dark:text-gray-400">Dépenses</p>
                    <p class="text-sm font-medium text-red-600 dark:text-red-400">${formatNumber(project.total_depenses)}</p>
                </div>
                <div class="text-center">
                    <p class="text-xs text-gray-500 dark:text-gray-400">Reçus</p>
                    <p class="text-sm font-medium text-green-600 dark:text-green-400">${formatNumber(project.total_recus)}</p>
                </div>
                <div class="text-center">
                    <p class="text-xs text-gray-500 dark:text-gray-400">Sold</p>
                    <p class="text-sm font-medium text-blue-600 dark:text-blue-400">${formatNumber(project.total_benefices)}</p>
                </div>
            </div>
            <div class="mb-4">
                    <p class="text-xs text-gray-500 dark:text-gray-400">Cree Par : </p>
                    <p class="text-sm font-medium text-gray-900 dark:text-white">${project.created_by}</p>
                </div>
            ${project.collaborator_name ? `
                <div class="mb-4">
                    <p class="text-xs text-gray-500 dark:text-gray-400">Collaborateur</p>
                    <p class="text-sm font-medium text-gray-900 dark:text-white">${project.collaborator_name}</p>
                </div>
            ` : ''}
            
            <div class="flex items-center justify-between">
                <p class="text-xs text-gray-500 dark:text-gray-400">Créé le ${formatDate(project.created_at)}</p>
                <button onclick="viewProjectDetails(${project.id})" class="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded text-sm transition-colors">
                    <i class="fas fa-eye mr-1"></i>Voir détails
                </button>
            </div>
        </div>
    `).join('');
}

function updateProjectStats(projects) {
    const activeProjects = projects.filter(p => p.total_benefices >= 0).length;
    const totalSpent = projects.reduce((sum, p) => sum + parseFloat(p.total_depenses), 0);
    
    document.getElementById('activeProjectsCount').textContent = activeProjects;
    document.getElementById('totalSpent').textContent = formatNumber(totalSpent) + ' DZD';
    document.getElementById('totalProjects').textContent = projects.length;
}

function viewProjectDetails(projectId) {
    window.location.href = `project_details.html?id=${projectId}`;
}

async function fetchCaisseHistory() {
    try {
        const endpoint = validateApiEndpoint('caisse/operations/');
        const headers = getApiHeaders();
        
        console.log('Fetching caisse history from:', endpoint);
        console.log('Using headers:', headers);
        
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: headers
        });
        
        console.log('Response status:', response.status);
        console.log('Response statusText:', response.statusText);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error response:', errorText);
            
            if (response.status === 401) {
                throw new Error('Session expirée');
            } else if (response.status === 404) {
                throw new Error('Endpoint non trouvé');
            } else if (response.status === 500) {
                throw new Error('Erreur serveur');
            } else {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
        }
        
        const data = await response.json();
        console.log('Received data:', data);
        
        // Validate data structure
        if (!Array.isArray(data)) {
            throw new Error('Format de données invalide');
        }
        
        const lastTwo = data.slice(0, 2);
        // Store in memory instead of localStorage for this session
        window.lastOperations = lastTwo;
        displayLastOperations(lastTwo);
        
    } catch (error) {
        console.error('Error in fetchCaisseHistory:', error);
        
        if (error.message === 'Session expirée') {
            showError('Session expirée. Veuillez vous reconnecter.');
            localStorage.clear();
            window.location.href = 'login.html';
        } else if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
            showError('Erreur de connexion. Vérifiez votre réseau.');
        } else {
            showError(`Erreur lors du chargement de l'historique: ${error.message}`);
        }
        
        // Display empty state
        displayLastOperations([]);
    }
}

function createHistoryPopup() {
    // Create popup container
    const popup = document.createElement('div');
    popup.id = 'history-popup';
    popup.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    
    // Create popup content
    const popupContent = document.createElement('div');
    popupContent.className = 'bg-white dark:bg-gray-800 rounded-lg shadow-xl w-11/12 max-w-4xl max-h-[90vh] overflow-hidden';
    
    // Create header
    const header = document.createElement('div');
    header.className = 'flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700';
    header.innerHTML = `
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Historique des Opérations</h2>
        <button id="close-popup" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
        </button>
    `;
    
    // Create content area
    const content = document.createElement('div');
    content.className = 'p-6 overflow-y-auto max-h-[60vh]';
    content.id = 'popup-content';
    
    // Create footer
    const footer = document.createElement('div');
    footer.className = 'flex justify-end gap-4 p-6 border-t border-gray-200 dark:border-gray-700';
    footer.innerHTML = `
        <button id="close-popup-btn" class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors">
            Fermer
        </button>
        <button id="view-all-btn" class="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
            Voir tout
        </button>
    `;
    
    // Assemble popup
    popupContent.appendChild(header);
    popupContent.appendChild(content);
    popupContent.appendChild(footer);
    popup.appendChild(popupContent);
    
    // Define close function
    function closePopup() {
        popup.remove();
    }
    
    // Return popup and closePopup function
    return { popup, closePopup };
}


function renderOperations(operations) {
    if (operations.length === 0) {
        return `
            <div class="text-center py-8">
                <svg class="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <p class="text-gray-500 dark:text-gray-400">Aucune opération récente</p>
            </div>
        `;
    }
    
    return operations.map(op => `
        <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border-l-4 ${op.operation_type === 'encaissement' ? 'border-green-400' : 'border-red-400'} mb-4">
            <div class="flex items-start justify-between mb-3">
                <div class="flex items-center space-x-3">
                    <div class="w-8 h-8 rounded-full ${op.operation_type === 'encaissement' ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'} flex items-center justify-center">
                        <svg class="w-4 h-4 ${op.operation_type === 'encaissement' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${op.operation_type === 'encaissement' ? 'M19 14l-7 7m0 0l-7-7m7 7V3' : 'M5 10l7-7m0 0l7 7m-7-7v18'}"></path>
                        </svg>
                    </div>
                    <div>
                        <h4 class="font-medium ${op.operation_type === 'encaissement' ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'}">${op.operation_type === 'encaissement' ? 'Encaissement' : 'Décaissement'}</h4>
                        <p class="text-sm text-gray-600 dark:text-gray-300">${op.description || 'Aucune description'}</p>
                    </div>
                </div>
                <div class="text-right">
                    <p class="font-bold text-lg ${op.operation_type === 'encaissement' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}">${formatNumber(op.amount)} DZD</p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">${formatDate(op.created_at)}</p>
                </div>
            </div>
            
            <!-- Additional Information -->
            <div class="border-t border-gray-200 dark:border-gray-600 pt-3 mt-3">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                        <p class="text-gray-500 dark:text-gray-400">Créé par:</p>
                        <p class="font-medium text-gray-900 dark:text-white">${op.user || 'Non spécifié'}</p>
                    </div>
                    <div>
                        <p class="text-gray-500 dark:text-gray-400">Preuve:</p>
                        ${op.preuve_file ? `
                            <div class="flex items-center space-x-2">
                                <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                <a href="${op.preuve_file}" target="_blank" class="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                                    Voir la preuve
                                </a>
                            </div>
                        ` : `
                            <div class="flex items-center space-x-2">
                                <svg class="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                                <span class="text-gray-500 dark:text-gray-400">Aucune preuve</span>
                            </div>
                        `}
                    </div>
                    ${op.mode_paiement ? `
                        <div>
                            <p class="text-gray-500 dark:text-gray-400">Mode de paiement:</p>
                            <p class="font-medium text-gray-900 dark:text-white">${op.mode_paiement}</p>
                        </div>
                    ` : ''}
                    ${op.project_name ? `
                        <div>
                            <p class="text-gray-500 dark:text-gray-400">Projet:</p>
                            <p class="font-medium text-gray-900 dark:text-white">${op.project_name}</p>
                        </div>
                    ` : ''}
                </div>
            </div>
        </div>
    `).join('');
}

function getApiHeaders() {
    const token = localStorage.getItem('access_token');
    
    if (!token) {
        throw new Error('No access token found');
    }
    
    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    };
}
async function testApiConnectivity() {
    try {
        const response = await fetch(`${API_BASE_URL}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            }
        });
        
        console.log('API connectivity test - Status:', response.status);
        return response.ok;
    } catch (error) {
        console.error('API connectivity test failed:', error);
        return false;
    }
}
function debugApiCall() {
    console.log('API_BASE_URL:', API_BASE_URL);
    console.log('Token:', localStorage.getItem('access_token'));
    console.log('Username:', localStorage.getItem('username'));
    console.log('Headers:', apiHeaders);
    
    // Test the specific endpoint
    fetch(`${API_BASE_URL}caisse/operations/`, {
        headers: apiHeaders
    })
    .then(response => {
        console.log('Debug response status:', response.status);
        console.log('Debug response headers:', [...response.headers.entries()]);
        return response.text();
    })
    .then(text => {
        console.log('Debug response text:', text);
        try {
            const json = JSON.parse(text);
            console.log('Debug parsed JSON:', json);
        } catch (e) {
            console.error('Failed to parse JSON:', e);
        }
    })
    .catch(error => {
        console.error('Debug fetch error:', error);
    });
}
function displayLastOperations(operations) {
    const historyContainer = document.getElementById('historyContainer');
    
    // Check if the element exists before trying to modify it
    if (!historyContainer) {
        console.error('historyContainer element not found in DOM');
        console.log('Available elements with IDs:', Array.from(document.querySelectorAll('[id]')).map(el => el.id));
        return;
    }
    
    if (operations.length === 0) {
        historyContainer.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M9 11H5a2 2 0 0 0-2 2v3c0 1.1.9 2 2 2h5m-5-6V9a2 2 0 0 1 2-2h3"/>
                        <path d="M15 13h4a2 2 0 0 1 2 2v3c0 1.1-.9 2-2 2h-4m4-7V9a2 2 0 0 0-2-2h-3"/>
                        <path d="M3 3l18 18"/>
                    </svg>
                </div>
                <p class="empty-text">Aucune opération récente</p>
            </div>
        `;
        return;
    }
    
    try {
        historyContainer.innerHTML = operations.map(op => `
            <div class="operation-item">
                <div class="operation-header">
                    <div class="operation-type">
                        <span class="type-icon">
                            ${op.operation_type === 'encaissement' ? '↗' : '↙'}
                        </span>
                        <span class="type-text">
                            ${op.operation_type === 'encaissement' ? 'Encaissement' : 'Décaissement'}
                        </span>
                    </div>
                    <div class="operation-amount">
                        ${formatNumber ? formatNumber(op.amount) : op.amount} DZD
                    </div>
                </div>
                <div class="operation-description">
                    ${op.description || 'Aucune description'}
                </div>
                <div class="operation-date">
                    ${formatDate ? formatDate(op.created_at) : op.created_at}
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error rendering operations:', error);
        historyContainer.innerHTML = `
            <div class="error-state">
                <p>Erreur lors de l'affichage des opérations</p>
            </div>
        `;
    }
}

function showUpdateCaisseModal() {
    currentStep = 1;
    currentFormData = {};
    
    const content = `
        <div class="space-y-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Type d'opération</label>
                <select id="operationType" class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
                    <option value="">Choisir le type</option>
                    <option value="encaissement">Encaissement</option>
                    <option value="decaissement">Décaissement</option>
                </select>
            </div>
            
            <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Projet</label>
                <select id="projectSelect" class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
                    <option value="">Choisir un projet</option>
                </select>
            </div>
            
            <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Montant</label>
                <input type="number" id="amount" step="0.01" placeholder="Montant en DZD" class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date</label>
                <input type="date" id="date" step="0.01" placeholder="La Date" class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
                <textarea id="description" placeholder="Description de l'opération" class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none" rows="3"></textarea>
            </div>
            
            <div id="dynamicFields"></div>
        </div>
    `;
    
    const modalHTML = createModalHTML('Opération de Caisse - Étape 1/3', content);
    showModal(modalHTML);
    
    // Load projects and setup event listeners
    loadProjectsForOperation();
    
    document.getElementById('operationType').addEventListener('change', function() {
        showOperationFields(this.value);
    });
    
    document.getElementById('nextBtn').addEventListener('click', validateAndProceedStep1);
}
function validateAndProceedStep1() {
    const operationType = document.getElementById('operationType').value;
    const projectId = document.getElementById('projectSelect').value;
    const amount = document.getElementById('amount').value;
    const description = document.getElementById('description').value;
    const date = document.getElementById('date').value;
    
    if (!operationType || !amount || !projectId ) {
        showValidationError('Veuillez remplir tous les champs obligatoires');
        return;
    }
    
    // Validate dynamic fields
    if (operationType === 'encaissement') {
        const incomeSource = document.getElementById('incomeSource')?.value;
        if (!incomeSource) {
            showValidationError('Veuillez sélectionner la source');
            return;
        }
        
        if (incomeSource === 'personnelle' && !document.getElementById('bankName')?.value) {
            showValidationError('Veuillez sélectionner la banque');
            return;
        }
        
        if (incomeSource === 'dette' && !document.getElementById('nomCrediteur')?.value) {
            showValidationError('Veuillez saisir le nom du créditeur');
            return;
        }
    } else if (operationType === 'decaissement') {
        const modePaiement = document.getElementById('modePaiement')?.value;
        if (!modePaiement) {
            showValidationError('Veuillez sélectionner le mode de paiement');
            return;
        }
        
        if (modePaiement === 'virement') {
            if (!document.getElementById('nomFournisseur')?.value || !document.getElementById('banque')?.value) {
                showValidationError('Veuillez remplir tous les champs du virement');
                return;
            }
        } else if (modePaiement === 'cheque') {
            if (!document.getElementById('nomFournisseur')?.value || !document.getElementById('numeroCheque')?.value) {
                showValidationError('Veuillez remplir tous les champs du chèque');
                return;
            }
        }
    }
    
    // Store form data with proper structure
    currentFormData = {
        operationType,
        projectId,
        date,
        amount: parseFloat(amount),
        description,
        dynamicData: {} // Add this nested object
    };
    
    // Collect additional fields based on operation type
    if (operationType === 'encaissement') {
        currentFormData.dynamicData.incomeSource = document.getElementById('incomeSource').value;
        if (currentFormData.dynamicData.incomeSource === 'personnelle') {
            currentFormData.dynamicData.bankName = document.getElementById('bankName').value;
        } else if (currentFormData.dynamicData.incomeSource === 'dette') {
            currentFormData.dynamicData.nomCrediteur = document.getElementById('nomCrediteur').value;
        }
    } else if (operationType === 'decaissement') {
        currentFormData.dynamicData.modePaiement = document.getElementById('modePaiement').value;
        if (currentFormData.dynamicData.modePaiement === 'virement') {
            currentFormData.dynamicData.nomFournisseur = document.getElementById('nomFournisseur').value;
            currentFormData.dynamicData.banque = document.getElementById('banque').value;
        } else if (currentFormData.dynamicData.modePaiement === 'cheque') {
            currentFormData.dynamicData.nomFournisseur = document.getElementById('nomFournisseur').value;
            currentFormData.dynamicData.numeroCheque = document.getElementById('numeroCheque').value;
        } else if (currentFormData.dynamicData.modePaiement === 'espece') {
            // For cash payments, you might still need the supplier name
            const nomFournisseur = document.getElementById('nomFournisseur')?.value;
            if (nomFournisseur) {
                currentFormData.dynamicData.nomFournisseur = nomFournisseur;
            }
        }
    }
    
    showUpdateCaisseModalStep2();
}

function showUpdateCaisseModalStep2() {
    currentStep = 2;
    
    const content = `
        <div class="space-y-4">
            <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h3 class="font-medium text-gray-900 dark:text-white mb-2">Récapitulatif</h3>
                <div class="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                    <p><span class="font-medium">Type:</span> ${currentFormData.operationType}</p>
                    <p><span class="font-medium">Montant:</span> ${formatNumber(currentFormData.amount)} DZD</p>
                    <p><span class="font-medium">Description:</span> ${currentFormData.description}</p>
                </div>
            </div>
            
            <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Preuve (optionnel)</label>
                <input type="file" id="preuveFile" accept=".pdf,.jpg,.jpeg,.png" class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100">
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Formats acceptés: PDF, JPG, JPEG, PNG</p>
            </div>
            
            <div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <div class="flex items-center">
                    <svg class="w-5 h-5 text-blue-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
                    </svg>
                    <p class="text-sm text-blue-700 dark:text-blue-300">Vérifiez bien les informations avant de confirmer l'opération.</p>
                </div>
            </div>
        </div>
    `;
    
    // Update modal title
    document.querySelector('#customModal h2').textContent = 'Opération de Caisse - Étape 2/3';
    document.getElementById('nextBtnText').textContent = 'Confirmer';
    const modalHTML = createModalHTML('Opération de Caisse - Étape 2/3', content, true);
    // Update button text
    document.getElementById('nextBtnText').textContent = 'Confirmer';
    
    
    // Animate content change
    animateContentChange(content);
    const backBtn = document.getElementById('backBtn');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            showUpdateCaisseModal();
        });
    }
    // Update next button event
    document.getElementById('nextBtn').removeEventListener('click', validateAndProceedStep1);
    document.getElementById('nextBtn').addEventListener('click', () => {
        submitCaisseOperation(currentFormData);
        closeModal();
    });
}

function showUpdateCaisseModalPage2(formData) {
    Swal.fire({
        title: 'Opération de Caisse - Page 2/2',
        html: `
            <div class="space-y-6">
                <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <h3 class="font-medium text-gray-900 dark:text-white mb-2">Récapitulatif</h3>
                    <div class="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                        <p><span class="font-medium">Type:</span> ${formData.operationType}</p>
                        <p><span class="font-medium">Montant:</span> ${formatNumber(formData.amount)} DZD</p>
                        <p><span class="font-medium">Description:</span> ${formData.description}</p>
                    </div>
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Preuve (optionnel)</label>
                    <input type="file" id="preuveFile" accept=".pdf,.jpg,.jpeg,.png" class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100">
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Formats acceptés: PDF, JPG, JPEG, PNG</p>
                </div>
                
                <div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <div class="flex items-center">
                        <svg class="w-5 h-5 text-blue-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
                        </svg>
                        <p class="text-sm text-blue-700 dark:text-blue-300">Vérifiez bien les informations avant de confirmer l'opération.</p>
                    </div>
                </div>
            </div>
        `,
        showCancelButton: true,
        showDenyButton: true,
        confirmButtonText: 'Confirmer',
        denyButtonText: '← Retour',
        cancelButtonText: 'Annuler',
        confirmButtonColor: '#f97316',
        denyButtonColor: '#6b7280',
        width: '500px',
        preConfirm: () => {
            return formData;
        }
    }).then((result) => {
        if (result.isConfirmed) {
            submitCaisseOperation(result.value);
        } else if (result.isDenied) {
            showUpdateCaisseModal();
        }
    });
}

async function loadProjectsForOperation() {
    try {
        const response = await fetch(`${API_BASE_URL}projects/`, {
            headers: apiHeaders
        });
        const projects = await response.json();
        
        const projectSelect = document.getElementById('projectSelect');
        projectSelect.innerHTML = '<option value="">Choisir un projet</option>';
        
        projects.forEach(project => {
            const option = document.createElement('option');
            option.value = project.id;
            option.textContent = project.name;
            option.dataset.collaborator = project.collaborator_name || '';
            projectSelect.appendChild(option);
        });
    } catch (error) {
        showError('Erreur lors du chargement des projets');
    }
}

function showOperationFields(operationType) {
    const dynamicFields = document.getElementById('dynamicFields');
    
    // Clear previous fields completely
    dynamicFields.innerHTML = '';
    
    if (operationType === 'encaissement') {
        dynamicFields.innerHTML = `
            <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Source</label>
                <select id="incomeSource" class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
                    <option value="">Choisir la source</option>
                    <option value="personnelle">ECH SAHARA</option>
                    <option value="collaborator">Collaborateur</option>
                    <option value="dette">Dette</option>
                </select>
            </div>
            <div id="sourceFields"></div>
        `;
        
        document.getElementById('incomeSource').addEventListener('change', function() {
            showSourceFields(this.value);
        });
    } else if (operationType === 'decaissement') {
        dynamicFields.innerHTML = `
            <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Mode de paiement</label>
                <select id="modePaiement" class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
                    <option value="">Choisir le mode</option>
                    <option value="virement">Virement</option>
                    <option value="espece">Espèce</option>
                    <option value="cheque">Chèque</option>
                </select>
            </div>
            <div id="paymentFields"></div>
        `;
        
        document.getElementById('modePaiement').addEventListener('change', function() {
            showPaymentFields(this.value);
        });
    }
}

function showSourceFields(source) {
    const sourceFields = document.getElementById('sourceFields');
    
    // Clear previous fields completely
    sourceFields.innerHTML = '';
    
    if (source === 'personnelle') {
        sourceFields.innerHTML = `
            <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Banque</label>
                <select id="bankName" class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
                    <option value="">Choisir la banque</option>
                    <option value="BEA">BEA</option>
                    <option value="BDL">BDL</option>
                    <option value="Albaraka Bank">Albaraka Bank</option>
                    <option value="AGB">AGB</option>
                    <option value="Alsalam Bank">Alsalam Bank</option>
                </select>
            </div>
        `;
    } else if (source === 'collaborator') {
        const projectSelect = document.getElementById('projectSelect');
        const selectedProject = projectSelect.options[projectSelect.selectedIndex];
        
        if (selectedProject && selectedProject.dataset.collaborator) {
            sourceFields.innerHTML = `
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Collaborateur</label>
                    <input type="text" value="${selectedProject.dataset.collaborator}" readonly class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white bg-gray-100 dark:bg-gray-600">
                </div>
            `;
        } else {
            sourceFields.innerHTML = `
                <div class="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                    <p class="text-red-600 dark:text-red-400 text-sm">Ce projet n'a pas de collaborateur assigné</p>
                </div>
            `;
        }
    } else if (source === 'dette') {
        sourceFields.innerHTML = `
            <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nom du créditeur</label>
                <input type="text" id="nomCrediteur" placeholder="Nom du créditeur" class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
            </div>
        `;
    }
}

function showHistoryPopup() {
    fetchCaisseHistory().then(() => {
        const operations = window.lastOperations || [];
        
        // Create popup
        const { popup, closePopup } = createHistoryPopup();
        
        // Add popup to DOM
        document.body.appendChild(popup);
        
        // Add event listeners after popup is added to DOM
        popup.addEventListener('click', (e) => {
            if (e.target === popup) {
                closePopup();
            }
        });
        
        const closeButton = popup.querySelector('#close-popup');
        const closeBtnButton = popup.querySelector('#close-popup-btn');
        const viewAllButton = popup.querySelector('#view-all-btn');
        
        if (closeButton) {
            closeButton.addEventListener('click', closePopup);
        }
        
        if (closeBtnButton) {
            closeBtnButton.addEventListener('click', closePopup);
        }
        
        if (viewAllButton) {
            viewAllButton.addEventListener('click', () => {
                closePopup();
                window.location.href = 'caisse-history.html';
            });
        }
        
        // Render operations
        const contentDiv = popup.querySelector('#popup-content');
        if (contentDiv) {
            contentDiv.innerHTML = renderOperations(operations);
        }
        
        // Add animation
        requestAnimationFrame(() => {
            popup.style.opacity = '0';
            popup.style.transform = 'scale(0.95)';
            popup.style.transition = 'all 0.3s ease';
            
            requestAnimationFrame(() => {
                popup.style.opacity = '1';
                popup.style.transform = 'scale(1)';
            });
        });
    });
}
function showPaymentFields(mode) {
    const paymentFields = document.getElementById('paymentFields');
    
    // Clear previous fields completely
    paymentFields.innerHTML = '';
    
    if (mode === 'virement') {
        paymentFields.innerHTML = `
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nom du fournisseur</label>
                    <input type="text" id="nomFournisseur" placeholder="Nom du fournisseur" class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Banque</label>
                    <select id="banque" class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
                        <option value="">Choisir la banque</option>
                        <option value="BEA">BEA</option>
                        <option value="BDL">BDL</option>
                        <option value="Albaraka Bank">Albaraka Bank</option>
                        <option value="AGB">AGB</option>
                        <option value="Alsalam Bank">Alsalam Bank</option>
                    </select>
                </div>
            </div>
        `;
    } else if (mode === 'cheque') {
        paymentFields.innerHTML = `
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nom du fournisseur</label>
                    <input type="text" id="nomFournisseur" placeholder="Nom du fournisseur" class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Numéro de chèque</label>
                    <input type="text" id="numeroCheque" placeholder="Numéro de chèque" class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
                </div>
            </div>
        `;
    } else if (mode === 'espece') {
        // Add supplier name field for cash payments
        paymentFields.innerHTML = `
            <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nom du fournisseur (optionnel)</label>
                <input type="text" id="nomFournisseur" placeholder="Nom du fournisseur" class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
            </div>
        `;
    }
}
function showValidationError(message) {
    // Remove existing error if any
    const existingError = document.getElementById('validationError');
    if (existingError) {
        existingError.remove();
    }
    
    // Create error element
    const errorDiv = document.createElement('div');
    errorDiv.id = 'validationError';
    errorDiv.className = 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-4';
    errorDiv.innerHTML = `
        <div class="flex items-center">
            <i class="fas fa-exclamation-triangle mr-2"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Insert error at the top of modal body
    const modalBody = document.getElementById('modalBody');
    modalBody.insertBefore(errorDiv, modalBody.firstChild);
    
    // Remove error after 5 seconds
    setTimeout(() => {
        if (document.getElementById('validationError')) {
            document.getElementById('validationError').remove();
        }
    }, 5000);
}
async function submitCaisseOperation(data) {
    try {
        const formData = new FormData();
        
        // Basic required fields
        formData.append('amount', data.amount);
        formData.append('description', data.description || '');
        formData.append('created_at', data.date || new Date().toISOString().split('T')[0]);
        
        // Optional project ID
        if (data.projectId) {
            formData.append('project_id', data.projectId);
        }
        
        const operationType = data.operationType;
        const dynamicData = data.dynamicData || {};
        
        console.log('Submitting operation:', operationType, data);
        
        if (operationType === 'encaissement') {
            const incomeSource = dynamicData.incomeSource;
            
            if (incomeSource) {
                formData.append('income_source', incomeSource);
            }
            
            // Handle different income sources
            if (incomeSource === 'personnelle') {
                if (dynamicData.bankName) {
                    formData.append('bank_name', dynamicData.bankName);
                }
            } else if (incomeSource === 'dette') {
                // For dette creation, send creditor_name
                if (dynamicData.nomCrediteur) {
                    formData.append('creditor_name', dynamicData.nomCrediteur);
                }
                
                // If linking to existing dette, send dette_id
                if (dynamicData.detteId) {
                    formData.append('dette_id', dynamicData.detteId);
                }
            } else if (incomeSource === 'collaborator') {
                // Handle collaborator-specific fields if any
                if (dynamicData.collaboratorName) {
                    formData.append('collaborator_name', dynamicData.collaboratorName);
                }
            }
            
            // Common encaissement fields that might be used
            if (dynamicData.modePaiement) {
                formData.append('mode_paiement', dynamicData.modePaiement);
            }
            
            if (dynamicData.nomFournisseur) {
                formData.append('nom_fournisseur', dynamicData.nomFournisseur);
            }
            
            if (dynamicData.banque) {
                formData.append('banque', dynamicData.banque);
            }
            
            if (dynamicData.numeroCheque) {
                formData.append('numero_cheque', dynamicData.numeroCheque);
            }
            
        } else if (operationType === 'decaissement') {
            const modePaiement = dynamicData.modePaiement;
            
            if (modePaiement) {
                formData.append('mode_paiement', modePaiement);
            }
            
            // Handle different payment modes
            if (modePaiement === 'virement') {
                if (dynamicData.nomFournisseur) {
                    formData.append('nom_fournisseur', dynamicData.nomFournisseur);
                }
                if (dynamicData.banque) {
                    formData.append('banque', dynamicData.banque);
                }
            } else if (modePaiement === 'cheque') {
                if (dynamicData.nomFournisseur) {
                    formData.append('nom_fournisseur', dynamicData.nomFournisseur);
                }
                if (dynamicData.numeroCheque) {
                    formData.append('numero_cheque', dynamicData.numeroCheque);
                }
            } else if (modePaiement === 'espece') {
                // Handle cash payments
                if (dynamicData.nomFournisseur) {
                    formData.append('nom_fournisseur', dynamicData.nomFournisseur);
                }
            }
            
            // Other decaissement fields
            if (dynamicData.bankName) {
                formData.append('bank_name', dynamicData.bankName);
            }
            
            if (dynamicData.incomeSource) {
                formData.append('income_source', dynamicData.incomeSource);
            }
            
            if (dynamicData.detteId) {
                formData.append('dette_id', dynamicData.detteId);
            }
        }
        
        // Handle file upload
        const preuveFile = document.getElementById('preuveFile');
        if (preuveFile && preuveFile.files[0]) {
            formData.append('preuve_file', preuveFile.files[0]);
        }
        
        // Log all form data for debugging
        console.log('FormData contents:');
        for (let [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`);
        }
        
        const response = await fetch(`${API_BASE_URL}caisse/${operationType}/`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });
        
        const result = await response.json();
        
        if (response.ok) {
            showSuccess(result.message);
            
            // Log success details
            console.log('Operation successful:', result);
            
            // Show additional info for dette creation
            if (result.dette_created) {
                console.log('Dette created:', result.dette_created);
                showSuccess(`Dette créée pour ${result.dette_created.creditor_name}: ${result.dette_created.amount} DZD`);
            }
            
            // Refresh relevant data
            fetchCaisseStatus();
            fetchCaisseHistory();
            fetchProjects();
            
            // Reset form if it exists
            const form = document.getElementById('caisseOperationForm');
            if (form) {
                form.reset();
            }
            
        } else {
            console.error('Operation failed:', result);
            showError(result.error || result.message || 'Erreur lors de l\'opération');
        }
        
    } catch (error) {
        console.error('Error submitting operation:', error);
        showError('Erreur de connexion. Veuillez réessayer.');
    }
}

function showNewProjectModal() {
    currentStep = 1;
    currentFormData = {};
    
    const content = `
        <div class="space-y-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nom du projet</label>
                <input type="text" id="projectName" placeholder="Nom du projet" class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
            </div>
            
            <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
                <textarea id="projectDescription" placeholder="Description du projet" class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none" rows="3"></textarea>
            </div>
            
            <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Budget estimé</label>
                <input type="number" id="estimatedBudget" step="0.01" placeholder="Budget en DZD" class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
            </div>
            
            <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Opération</label>
                <input type="text" id="operation" placeholder="Type d'opération" class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
            </div>
            
            <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Numéro d'opération</label>
                <input type="text" id="numeroOperation" placeholder="Numéro d'opération" class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
            </div>
        </div>
    `;
    
    const modalHTML = createModalHTML('Nouveau Projet - Étape 1/2', content);
    showModal(modalHTML);
    
    document.getElementById('nextBtn').addEventListener('click', validateAndProceedProjectStep1);
}
function validateAndProceedProjectStep1() {
    const projectName = document.getElementById('projectName').value;
    const projectDescription = document.getElementById('projectDescription').value;
    const estimatedBudget = document.getElementById('estimatedBudget').value;
    const operation = document.getElementById('operation').value;
    const numeroOperation = document.getElementById('numeroOperation').value;
    
    if (!projectName || !projectDescription || !estimatedBudget || !operation || !numeroOperation) {
        showValidationError('Veuillez remplir tous les champs obligatoires');
        return;
    }
    
    // Store form data including operation fields
    currentFormData = {
        projectName,
        projectDescription,
        estimatedBudget: parseFloat(estimatedBudget),
        operation,
        numeroOperation
    };
    
    showNewProjectModalStep2();
}
function showNewProjectModalStep2() {
    currentStep = 2;
    
    const content = `
        <div class="space-y-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date de début</label>
                <input type="date" id="dateDebut" class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
            </div>
            
            <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Durée (mois)</label>
                <input type="number" id="periodMonths" min="1" placeholder="Durée en mois" class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
            </div>
            
            <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Collaborateur (optionnel)</label>
                <input type="text" id="collaboratorName" placeholder="Nom du collaborateur" class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
            </div>
            
            <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Fichier contrat (optionnel)</label>
                <input type="file" id="contractFile" accept=".pdf,.doc,.docx" class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100">
            </div>
            
            <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Fichier ODS (optionnel)</label>
                <input type="file" id="odsFile" accept=".ods,.xls,.xlsx" class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100">
            </div>
        </div>
    `;
    
    // Update modal title
    const modalHTML = createModalHTML('Nouveau Projet - Étape 2/2', content, true);
    document.querySelector('#customModal h2').textContent = 'Nouveau Projet - Étape 2/2';
    document.getElementById('nextBtnText').textContent = 'Créer le projet';
    
    // Update button text
    document.getElementById('nextBtnText').textContent = 'Créer le projet';
    
    
    
    // Animate content change
    animateContentChange(content);
    const backBtn = document.getElementById('backBtn');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            showNewProjectModal();
        });
    }
    // Update next button event
    document.getElementById('nextBtn').removeEventListener('click', validateAndProceedProjectStep1);
    document.getElementById('nextBtn').addEventListener('click', validateAndSubmitProject);
}
function validateAndSubmitProject() {
    const dateDebut = document.getElementById('dateDebut').value;
    const periodMonths = document.getElementById('periodMonths').value;
    
    if (!dateDebut || !periodMonths) {
        showValidationError('Veuillez remplir tous les champs obligatoires');
        return;
    }
    
    // Add remaining data to existing currentFormData
    currentFormData.dateDebut = dateDebut;
    currentFormData.periodMonths = parseInt(periodMonths);
    currentFormData.collaboratorName = document.getElementById('collaboratorName').value;
    
    submitNewProject(currentFormData);
    closeModal();
}

async function submitNewProject(data) {
    try {
        // Add loading state
        const submitBtn = document.getElementById('nextBtn');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Création en cours...';
        
        const formData = new FormData();
        formData.append('name', data.projectName);
        formData.append('description', data.projectDescription);
        formData.append('estimated_budget', data.estimatedBudget);
        formData.append('date_debut', data.dateDebut);
        formData.append('period_months', data.periodMonths);
        
        // Get current values from DOM (these might be null if modal was recreated)
        const operationInput = document.getElementById('operation');
        const numeroOperationInput = document.getElementById('numeroOperation');
        const collaboratorInput = document.getElementById('collaboratorName');
        
        // Use stored data if DOM elements are not available
        const operation = operationInput ? operationInput.value : data.operation;
        const numeroOperation = numeroOperationInput ? numeroOperationInput.value : data.numeroOperation;
        const collaboratorName = collaboratorInput ? collaboratorInput.value : data.collaboratorName;
        
        if (operation) formData.append('operation', operation);
        if (numeroOperation) formData.append('numero_operation', numeroOperation);
        if (collaboratorName) formData.append('collaborator_name', collaboratorName);
        
        const contractFileInput = document.getElementById('contractFile');
        const odsFileInput = document.getElementById('odsFile');
        
        if (contractFileInput && contractFileInput.files[0]) {
            formData.append('contract_file', contractFileInput.files[0]);
        }
        if (odsFileInput && odsFileInput.files[0]) {
            formData.append('ods_file', odsFileInput.files[0]);
        }
        
        // Check if API_BASE_URL and token are defined
        if (!API_BASE_URL) {
            throw new Error('API_BASE_URL is not defined');
        }
        if (!token) {
            throw new Error('Authentication token is missing');
        }
        
        console.log('Sending request to:', `${API_BASE_URL}projects/create/`);
        console.log('Form data entries:', Array.from(formData.entries()));
        
        const response = await fetch(`${API_BASE_URL}projects/create/`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
                // Don't set Content-Type header for FormData, let browser set it
            },
            body: formData
        });
        
        // Reset button state
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        
        // Check if response is ok
        if (!response.ok) {
            // Try to get error details
            const errorText = await response.text();
            console.error('API Error Response:', errorText);
            
            try {
                const errorData = JSON.parse(errorText);
                throw new Error(errorData.error || errorData.message || `HTTP ${response.status}: ${response.statusText}`);
            } catch (parseError) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
        }
        
        const result = await response.json();
        console.log('Success response:', result);
        
        showSuccess(result.message || 'Projet créé avec succès');
        fetchProjects();
        
    } catch (error) {
        console.error('Error details:', error);
        
        // Reset button state if error occurs
        const submitBtn = document.getElementById('nextBtn');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Créer le projet';
        }
        
        // More specific error messages
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            showError('Erreur de connexion: Impossible de contacter le serveur. Vérifiez votre connexion internet et l\'URL de l\'API.');
        } else if (error.message.includes('API_BASE_URL')) {
            showError('Erreur de configuration: URL de l\'API non définie');
        } else if (error.message.includes('token')) {
            showError('Erreur d\'authentification: Token manquant. Veuillez vous reconnecter.');
        } else if (error.message.includes('HTTP')) {
            showError(`Erreur serveur: ${error.message}`);
        } else {
            showError(`Erreur: ${error.message}`);
        }
    }
}


function showCaisseHistory() {
    window.location.href = 'caisse_history.html';
}

function showTransferToProjectModal() {
    Swal.fire({
        title: 'Transférer vers un Projet',
        html: `
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Projet de destination</label>
                    <select id="transferProjectSelect" class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white">
                        <option value="">Choisir un projet</option>
                    </select>
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Montant à transférer</label>
                    <input type="number" id="transferAmount" step="0.01" placeholder="Montant en DZD" class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white">
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                    <textarea id="transferDescription" placeholder="Description du transfert" class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"></textarea>
                </div>
            </div>
        `,
        showCancelButton: true,
        confirmButtonText: 'Transférer',
        cancelButtonText: 'Annuler',
        confirmButtonColor: '#f97316',
        didOpen: () => {
            loadProjectsForTransfer();
        },
        preConfirm: () => {
            const projectId = document.getElementById('transferProjectSelect').value;
            const amount = document.getElementById('transferAmount').value;
            const description = document.getElementById('transferDescription').value;
            
            if (!projectId || !amount) {
                Swal.showValidationMessage('Veuillez remplir tous les champs obligatoires');
                return false;
            }
            
            return {
                projectId,
                amount: parseFloat(amount),
                description
            };
        }
    }).then((result) => {
        if (result.isConfirmed) {
            submitTransferToProject(result.value);
        }
    });
}

async function loadProjectsForTransfer() {
    try {
        const response = await fetch(`${API_BASE_URL}projects/`, {
            headers: apiHeaders
        });
        const projects = await response.json();
        
        const projectSelect = document.getElementById('transferProjectSelect');
        projectSelect.innerHTML = '<option value="">Choisir un projet</option>';
        
        projects.forEach(project => {
            const option = document.createElement('option');
            option.value = project.id;
            option.textContent = project.name;
            projectSelect.appendChild(option);
        });
    } catch (error) {
        showError('Erreur lors du chargement des projets');
    }
}

async function submitTransferToProject(data) {
    try {
        const formData = new FormData();
        formData.append('amount', data.amount);
        formData.append('description', data.description || 'Transfert vers projet');
        formData.append('project_id', data.projectId);
        
        const response = await fetch(`${API_BASE_URL}caisse/decaissement/`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });
        
        const result = await response.json();
        
        if (response.ok) {
            showSuccess('Transfert effectué avec succès');
            fetchCaisseStatus();
            fetchProjects();
        } else {
            showError(result.error || 'Erreur lors du transfert');
        }
    } catch (error) {
        showError('Erreur de connexion');
    }
}

function filterProjects() {
    const nameFilter = document.getElementById('nameFilter').value.toLowerCase();
    const dateFilter = document.getElementById('dateFilter').value;
    
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        const projectName = card.querySelector('h3').textContent.toLowerCase();
        const projectDate = card.querySelector('.text-xs').textContent;
        
        let showCard = true;
        
        if (nameFilter && !projectName.includes(nameFilter)) {
            showCard = false;
        }
        
        if (dateFilter) {
            const filterDate = new Date(dateFilter);
            const cardDate = new Date(projectDate.replace('Créé le ', ''));
            
            if (cardDate.toDateString() !== filterDate.toDateString()) {
                showCard = false;
            }
        }
        
        if (showCard) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

function clearFilters() {
    document.getElementById('nameFilter').value = '';
    document.getElementById('dateFilter').value = '';
    
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.style.display = 'block';
    });
}

function initializeDarkMode() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    
    if (isDarkMode) {
        document.documentElement.classList.add('dark');
    }
    
    darkModeToggle.addEventListener('click', () => {
        document.documentElement.classList.toggle('dark');
        const isDark = document.documentElement.classList.contains('dark');
        localStorage.setItem('darkMode', isDark);
    });
}

function initializeEventListeners() {
    document.getElementById('updateCaisseBtn').addEventListener('click', showUpdateCaisseModal);
    // REMOVE this line: document.getElementById('transferToProjectBtn').addEventListener('click', showTransferToProjectModal);
    document.getElementById('viewHistoryBtn').addEventListener('click', showHistoryPopup); // CHANGE this
    document.getElementById('newProjectBtn').addEventListener('click', showNewProjectModal);
    document.getElementById('refreshProjectsBtn').addEventListener('click', fetchProjects);
    document.getElementById('nameFilter').addEventListener('input', filterProjects);
    document.getElementById('dateFilter').addEventListener('change', filterProjects);
    document.getElementById('clearFiltersBtn').addEventListener('click', clearFilters);
    
    // Rest of the event listeners remain the same...
    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('username');
        localStorage.removeItem('user_groups');
        window.location.href = 'login.html';
    });
    
    document.getElementById('usersBtn').addEventListener('click', () => {
        window.location.href = 'users.html';
    });
    
    document.getElementById('Ordredemission').addEventListener('click', () => {
        window.location.href = 'ordre_mission.html';
    });
    
    document.getElementById('BonDeLivraison').addEventListener('click', () => {
        window.location.href = 'bon_livraison.html';
    });
    
    document.getElementById('BonDeCommande').addEventListener('click', () => {
        window.location.href = 'bon_commande.html';
    });
    
    document.getElementById('profileBtn').addEventListener('click', () => {
        window.location.href = 'profile.html';
    });
    
    const actionsDropdownBtn = document.getElementById('actionsDropdownBtn');
    const actionsDropdown = document.getElementById('actionsDropdown');
    
    actionsDropdownBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        actionsDropdown.classList.toggle('hidden');
    });
    
    document.addEventListener('click', (e) => {
        if (!actionsDropdown.contains(e.target) && !actionsDropdownBtn.contains(e.target)) {
            actionsDropdown.classList.add('hidden');
        }
    });
}
function checkAuth() {
    if (!token) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

function displayUserInfo() {
    if (username) {
        document.getElementById('welcomeUser').textContent = `Bienvenue, ${username}`;
        
        if (userGroups.length > 0) {
            document.getElementById('userRole').textContent = userGroups.join(', ');
        } else {
            document.getElementById('userRole').textContent = 'Utilisateur';
        }
    }
}

function hideLoadingState() {
    document.getElementById('loadingState').classList.add('hidden');
    document.getElementById('mainContent').classList.remove('hidden');
}

async function initializeDashboard() {
    if (!checkAuth()) return;
    
    displayUserInfo();
    initializeDarkMode();
    initializeEventListeners();
    
    // Wait for DOM to be fully ready
    await new Promise(resolve => {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', resolve);
        } else {
            resolve();
        }
    });
    
    // Load each component separately to identify which one fails
    try {
        await fetchCaisseStatus();
        console.log('Caisse status loaded successfully');
    } catch (error) {
        console.error('Error loading caisse status:', error);
        showError('Erreur lors du chargement du statut de la caisse');
    }
    
    try {
        await fetchProjects();
        console.log('Projects loaded successfully');
    } catch (error) {
        console.error('Error loading projects:', error);
        showError('Erreur lors du chargement des projets');
    }
    
    try {
        await fetchCaisseHistory();
        console.log('Caisse history loaded successfully');
    } catch (error) {
        console.error('Error loading caisse history:', error);
        // Don't show error here as it's already handled in fetchCaisseHistory
    }
}

function validateApiEndpoint(endpoint) {
    const fullUrl = `${API_BASE_URL}${endpoint}`;
    console.log('Calling API endpoint:', fullUrl);
    
    // Check if the base URL is correctly formed
    if (!API_BASE_URL.endsWith('/')) {
        console.warn('API_BASE_URL should end with /');
    }
    
    return fullUrl;
}
async function initializeDashboard() {
    if (!checkAuth()) return;
    
    displayUserInfo();
    initializeDarkMode();
    initializeEventListeners();
    
    try {
        await Promise.all([
            fetchCaisseStatus(),
            fetchProjects(),
            fetchCaisseHistory()
        ]);
    } catch (error) {
        showError('Erreur lors du chargement des données');
    } finally {
        hideLoadingState();
    }
}

// document.addEventListener('DOMContentLoaded', initializeDashboard);
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing dashboard...');
    initializeDashboard();
});
document.addEventListener('DOMContentLoaded', function() {
    // Update Caisse button
    document.getElementById('updateCaisseBtn').addEventListener('click', showUpdateCaisseModal);
    
    // New Project button
    document.getElementById('newProjectBtn').addEventListener('click', showNewProjectModal);
});