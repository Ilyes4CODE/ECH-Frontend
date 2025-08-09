document.addEventListener('DOMContentLoaded', function() {
    const API_BASE = 'http://127.0.0.1:8000/gestion/caisse/history/';
    const PDF_API = 'http://127.0.0.1:8000/gestion/caisse/operations/history/pdf/';
    const OPERATION_PDF_API = 'http://127.0.0.1:8000/gestion/caisse/operation/'; // Base URL for single operation PDF
    
    let currentPage = 1;
    const itemsPerPage = 10;
    let allOperations = [];
    let filteredOperations = [];
    
    const elements = {
    loadingState: document.getElementById('loadingState'),
    mainContent: document.getElementById('mainContent'),
    operationsList: document.getElementById('operationsList'),
    noOperations: document.getElementById('noOperations'),
    welcomeUser: document.getElementById('welcomeUser'),
    userRole: document.getElementById('userRole'),
    
    // Date filters
    yearFilter: document.getElementById('yearFilter'),
    monthFilter: document.getElementById('monthFilter'),
    dayFilter: document.getElementById('dayFilter'),
    startDate: document.getElementById('startDate'),
    endDate: document.getElementById('endDate'),
    
    // New filters
    actionFilter: document.getElementById('actionFilter'),
    codeFilter : document.getElementById('codeFilter'),
    modePaiementFilter: document.getElementById('modePaiementFilter'),
    fournisseurFilter: document.getElementById('fournisseurFilter'),
    banqueFilter: document.getElementById('banqueFilter'),
    searchFilter: document.getElementById('searchFilter'),
    amountMinFilter: document.getElementById('amountMinFilter'),
    amountMaxFilter: document.getElementById('amountMaxFilter'),
    chequeFilter: document.getElementById('chequeFilter'),
    
    // Buttons
    searchBtn: document.getElementById('searchBtn'),
    periodSearchBtn: document.getElementById('periodSearchBtn'),
    clearFiltersBtn: document.getElementById('clearFiltersBtn'),
    generatePdfBtn: document.getElementById('generatePdfBtn'),
    refreshBtn: document.getElementById('refreshBtn'),
    backBtn: document.getElementById('backBtn'),
    darkModeToggle: document.getElementById('darkModeToggle'),
    
    // Summary elements
    totalEncaissements: document.getElementById('totalEncaissements'),
    totalDecaissements: document.getElementById('totalDecaissements'),
    netBalance: document.getElementById('netBalance'),
    totalOperations: document.getElementById('totalOperations'),
    lastRefresh: document.getElementById('lastRefresh'),
    
    // Pagination
    prevPage: document.getElementById('prevPage'),
    nextPage: document.getElementById('nextPage'),
    pageNumbers: document.getElementById('pageNumbers'),
    itemsStart: document.getElementById('itemsStart'),
    itemsEnd: document.getElementById('itemsEnd'),
    totalItems: document.getElementById('totalItems'),
    
    // Toast notifications
    errorToast: document.getElementById('errorToast'),
    successToast: document.getElementById('successToast'),
    errorMessage: document.getElementById('errorMessage'),
    successMessage: document.getElementById('successMessage')
};

    function getAuthToken() {
        return localStorage.getItem('access_token');
    }

    function getUserInfo() {
        const username = localStorage.getItem('username') || 'Utilisateur';
        const userGroups = JSON.parse(localStorage.getItem('user_groups') || '[]');
        return {
            username,
            role: userGroups.length > 0 ? userGroups[0] : 'Utilisateur'
        };
    }

    function updateUserInfo() {
        const userInfo = getUserInfo();
        elements.welcomeUser.textContent = `Bienvenue, ${userInfo.username}`;
        elements.userRole.textContent = userInfo.role;
    }

    function showToast(type, message) {
        const toast = type === 'error' ? elements.errorToast : elements.successToast;
        const messageElement = type === 'error' ? elements.errorMessage : elements.successMessage;
        
        messageElement.textContent = message;
        toast.classList.remove('hidden');
        
        setTimeout(() => {
            toast.classList.add('hidden');
        }, 5000);
    }

    function formatCurrency(amount) {
        return new Intl.NumberFormat('fr-DZ', {
            style: 'currency',
            currency: 'DZD',
            minimumFractionDigits: 2
        }).format(amount).replace('DZD', 'DZD');
    }

    function formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    function getOperationTypeClass(type) {
        switch(type) {
            case 'encaissement':
                return 'operation-encaissement';
            case 'decaissement':
                return 'operation-decaissement';
            case 'transfer':
                return 'operation-transfer';
            default:
                return 'operation-encaissement';
        }
    }

    function getOperationIcon(type) {
        switch(type) {
            case 'encaissement':
                return 'fas fa-arrow-down text-green-500';
            case 'decaissement':
                return 'fas fa-arrow-up text-red-500';
            case 'transfer':
                return 'fas fa-exchange-alt text-blue-500';
            default:
                return 'fas fa-arrow-down text-green-500';
        }
    }

    function getOperationTitle(type) {
        switch(type) {
            case 'encaissement':
                return 'Encaissement';
            case 'decaissement':
                return 'Décaissement';
            case 'transfer':
                return 'Transfert';
            default:
                return 'Opération';
        }
    }

    // NEW FUNCTION: Generate PDF for a single operation
    async function generateOperationPDF(historyId) {
        try {
            const token = getAuthToken();
            if (!token) {
                showToast('error', 'Token d\'authentification manquant');
                return;
            }

            showToast('success', 'Génération du PDF en cours...');

            const response = await fetch(`${OPERATION_PDF_API}${historyId}/pdf/`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                if (response.status === 401) {
                    showToast('error', 'Session expirée. Veuillez vous reconnecter.');
                    window.location.href = '/login/';
                    return;
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            
            // Open PDF in a new window
            const newWindow = window.open(url, '_blank');
            if (!newWindow) {
                // Fallback: Download the PDF if popup is blocked
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = `operation_${historyId}_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.pdf`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                showToast('success', 'PDF téléchargé avec succès!');
            } else {
                showToast('success', 'PDF ouvert dans un nouvel onglet!');
            }
            
            // Clean up the URL object after a delay
            setTimeout(() => {
                window.URL.revokeObjectURL(url);
            }, 100);

        } catch (error) {
            console.error('Erreur lors de la génération du PDF:', error);
            showToast('error', 'Erreur lors de la génération du PDF: ' + error.message);
        }
    }

    async function fetchOperations(filters = {}) {
    try {
        const token = getAuthToken();
        if (!token) {
            showToast('error', 'Token d\'authentification manquant');
            return;
        }

        // Add pagination parameters
        const params = new URLSearchParams();
        params.append('page', '1');
        params.append('page_size', '1000'); // Get more records for client-side pagination
        
        Object.keys(filters).forEach(key => {
            if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
                params.append(key, filters[key]);
            }
        });

        const response = await fetch(`${API_BASE}?${params.toString()}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            if (response.status === 401) {
                showToast('error', 'Session expirée. Veuillez vous reconnecter.');
                // Redirect to login page
                window.location.href = '/login/';
                return;
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        // Handle the paginated response structure
        if (data.results) {
            allOperations = data.results.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        } else {
            // Fallback for non-paginated response
            allOperations = (Array.isArray(data) ? data : []).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        }
        
        filteredOperations = [...allOperations];
        
        populateYearFilter();
        updateSummary();
        displayOperations();
        updateLastRefresh();
        
    } catch (error) {
        console.error('Erreur lors du chargement des opérations:', error);
        showToast('error', 'Erreur lors du chargement des opérations: ' + error.message);
    }
}

function initializeRealTimeSearch() {
    let searchTimeout;
    
    if (elements.searchFilter) {
        elements.searchFilter.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                if (e.target.value.length >= 3 || e.target.value.length === 0) {
                    applyFilters();
                }
            }, 500); // 500ms delay for real-time search
        });
    }
}

    function populateYearFilter() {
    const years = [...new Set(allOperations.map(entry => {
        // Use the date field from history entry, fallback to created_at
        const dateStr = entry.date || entry.created_at;
        return new Date(dateStr).getFullYear();
    }))];
    years.sort((a, b) => b - a);
    
    elements.yearFilter.innerHTML = '<option value="">Toutes les années</option>';
    years.forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        elements.yearFilter.appendChild(option);
    });
}

    function updateSummary() {
    let totalEncaissements = 0;
    let totalDecaissements = 0;
    
    filteredOperations.forEach(entry => {
        const amount = parseFloat(entry.amount) || 0;
        const action = entry.action;
        const operationType = entry.operation ? entry.operation.operation_type : null;
        
        // Determine if it's an encaissement or decaissement
        if (action === 'encaissement' || operationType === 'encaissement') {
            totalEncaissements += Math.abs(amount);
        } else if (action === 'decaissement' || operationType === 'decaissement') {
            totalDecaissements += Math.abs(amount);
        }
    });
    
    const netBalance = totalEncaissements - totalDecaissements;
    const totalOps = filteredOperations.length;

    elements.totalEncaissements.textContent = formatCurrency(totalEncaissements);
    elements.totalDecaissements.textContent = formatCurrency(totalDecaissements);
    elements.netBalance.textContent = formatCurrency(netBalance);
    elements.totalOperations.textContent = totalOps.toString();
    
    // Update net balance color based on positive/negative
    elements.netBalance.className = elements.netBalance.className.replace(/text-\w+-\d+/g, '');
    if (netBalance >= 0) {
        elements.netBalance.classList.add('text-green-700', 'dark:text-green-200');
    } else {
        elements.netBalance.classList.add('text-red-700', 'dark:text-red-200');
    }
}

    function displayOperations() {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const operationsToShow = filteredOperations.slice(startIndex, endIndex);

    if (operationsToShow.length === 0) {
        elements.operationsList.classList.add('hidden');
        elements.noOperations.classList.remove('hidden');
        return;
    }

    elements.noOperations.classList.add('hidden');
    elements.operationsList.classList.remove('hidden');

    elements.operationsList.innerHTML = operationsToShow.map(entry => {
        // Determine operation type from entry.action or entry.operation.operation_type
        const operationType = entry.operation ? entry.operation.operation_type : entry.action;
        const amount = parseFloat(entry.amount);
        const description = entry.description || (entry.operation ? entry.operation.description : 'Aucune description');
        const projectName = entry.project ? entry.project.name : null;
        const userName = entry.user ? `${entry.user.first_name || ''} ${entry.user.last_name || ''}`.trim() || entry.user.username : 'N/A';
        
        return `
            <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border-l-4 border-${operationType === 'encaissement' ? 'green' : operationType === 'decaissement' ? 'red' : 'blue'}-500">
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-4">
                        <div class="w-12 h-12 bg-${operationType === 'encaissement' ? 'green' : operationType === 'decaissement' ? 'red' : 'blue'}-100 dark:bg-${operationType === 'encaissement' ? 'green' : operationType === 'decaissement' ? 'red' : 'blue'}-900 rounded-full flex items-center justify-center">
                            <i class="${getOperationIcon(operationType)}"></i>
                        </div>
                        <div>
                            <h3 class="font-semibold text-gray-900 dark:text-white">
                                ${getOperationTitle(operationType)}
                                <span class="status-badge ${getOperationTypeClass(operationType)} ml-2">
                                    ${operationType.charAt(0).toUpperCase() + operationType.slice(1)}
                                </span>
                            </h3>
                            <p class="text-sm text-gray-600 dark:text-gray-400">${description}</p>
                            ${projectName ? `<p class="text-sm text-blue-600 dark:text-blue-400"><i class="fas fa-project-diagram mr-1"></i>${projectName}</p>` : ''}
                            ${entry.numero ? `<p class="text-sm text-gray-500 dark:text-gray-500"><i class="fas fa-hashtag mr-1"></i>N° ${entry.numero}</p>` : ''}
                        </div>
                    </div>
                    <div class="text-right">
                        <p class="text-lg font-bold text-${operationType === 'encaissement' ? 'green' : 'red'}-600 dark:text-${operationType === 'encaissement' ? 'green' : 'red'}-400">
                            ${operationType === 'encaissement' ? '+' : '-'}${formatCurrency(Math.abs(amount))}
                        </p>
                        <p class="text-sm text-gray-500 dark:text-gray-400">${formatDate(entry.created_at)}</p>
                        <!-- NEW: Print Button -->
                        <button 
                            onclick="generateOperationPDF(${entry.id})" 
                            class="mt-2 inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                            title="Imprimer cette opération"
                        >
                            <i class="fas fa-print mr-1"></i>
                            Imprimer
                        </button>
                    </div>
                </div>
                
                <div class="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    ${entry.operation && entry.operation.mode_paiement ? `
                    <div class="flex items-center text-gray-600 dark:text-gray-400">
                        <i class="fas fa-credit-card mr-2"></i>
                        <span>Mode: ${entry.operation.mode_paiement.charAt(0).toUpperCase() + entry.operation.mode_paiement.slice(1)}</span>
                    </div>` : ''}
                    
                    ${entry.operation && entry.operation.nom_fournisseur ? `
                    <div class="flex items-center text-gray-600 dark:text-gray-400">
                        <i class="fas fa-user mr-2"></i>
                        <span>Fournisseur: ${entry.operation.nom_fournisseur}</span>
                    </div>` : ''}
                    
                    ${entry.operation && entry.operation.numero_cheque ? `
                    <div class="flex items-center text-gray-600 dark:text-gray-400">
                        <i class="fas fa-receipt mr-2"></i>
                        <span>Chèque: ${entry.operation.numero_cheque}</span>
                    </div>` : ''}
                    
                    ${entry.operation && entry.operation.income_source ? `
                    <div class="flex items-center text-gray-600 dark:text-gray-400">
                        <i class="fas fa-source mr-2"></i>
                        <span>Source: ${entry.operation.income_source}</span>
                    </div>` : ''}
                    
                    ${entry.operation && entry.operation.banque ? `
                    <div class="flex items-center text-gray-600 dark:text-gray-400">
                        <i class="fas fa-university mr-2"></i>
                        <span>Banque: ${entry.operation.banque}</span>
                    </div>` : ''}
                    
                    ${entry.operation && entry.operation.bank_name ? `
                    <div class="flex items-center text-gray-600 dark:text-gray-400">
                        <i class="fas fa-university mr-2"></i>
                        <span>Banque: ${entry.operation.bank_name}</span>
                    </div>` : ''}
                </div>
                
                <div class="mt-4 flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-600">
                    <div class="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                        <span><i class="fas fa-user mr-1"></i>Par: ${userName}</span>
                        <span><i class="fas fa-balance-scale mr-1"></i>Solde avant: ${formatCurrency(entry.balance_before)}</span>
                        <span><i class="fas fa-arrow-right mr-1"></i>Solde après: ${formatCurrency(entry.balance_after)}</span>
                    </div>
                    ${entry.operation && entry.operation.preuve_file ? `
                    <a href="${entry.operation.preuve_file}" target="_blank" class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                        <i class="fas fa-paperclip mr-1"></i>Voir preuve
                    </a>` : ''}
                </div>
            </div>
        `;
    }).join('');

    updatePagination();
}


    function updatePagination() {
        const totalPages = Math.ceil(filteredOperations.length / itemsPerPage);
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = Math.min(startIndex + itemsPerPage, filteredOperations.length);

        elements.itemsStart.textContent = filteredOperations.length > 0 ? startIndex + 1 : 0;
        elements.itemsEnd.textContent = endIndex;
        elements.totalItems.textContent = filteredOperations.length;

        elements.prevPage.disabled = currentPage === 1;
        elements.nextPage.disabled = currentPage === totalPages;

        elements.pageNumbers.innerHTML = '';
        for (let i = Math.max(1, currentPage - 2); i <= Math.min(totalPages, currentPage + 2); i++) {
            const pageBtn = document.createElement('button');
            pageBtn.textContent = i;
            pageBtn.className = `px-3 py-2 text-sm rounded-lg ${
                i === currentPage 
                    ? 'bg-orange-500 text-white' 
                    : 'border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`;
            pageBtn.addEventListener('click', () => {
                currentPage = i;
                displayOperations();
            });
            elements.pageNumbers.appendChild(pageBtn);
        }
    }

    function applyFilters() {
    const filters = {};
    
    // Date filters
    if (elements.yearFilter.value) {
        const year = elements.yearFilter.value;
        if (!elements.monthFilter.value && !elements.dayFilter.value) {
            filters.date_from = `${year}-01-01`;
            filters.date_to = `${year}-12-31`;
        }
    }
    if (elements.monthFilter.value) {
        const year = elements.yearFilter.value || new Date().getFullYear();
        const month = elements.monthFilter.value.padStart(2, '0');
        const daysInMonth = new Date(year, month, 0).getDate();
        if (!elements.dayFilter.value) {
            filters.date_from = `${year}-${month}-01`;
            filters.date_to = `${year}-${month}-${daysInMonth}`;
        }
    }
    if (elements.dayFilter.value) {
        const year = elements.yearFilter.value || new Date().getFullYear();
        const month = (elements.monthFilter.value || new Date().getMonth() + 1).toString().padStart(2, '0');
        const day = elements.dayFilter.value.padStart(2, '0');
        filters.date_from = `${year}-${month}-${day}`;
        filters.date_to = `${year}-${month}-${day}`;
    }
    if (elements.startDate.value) filters.date_from = elements.startDate.value;
    if (elements.endDate.value) filters.date_to = elements.endDate.value;
    
    // Action filter
    if (elements.actionFilter.value) filters.action = elements.actionFilter.value;
    // Code filter
    if (elements.codeFilter.value) filters.numero = elements.codeFilter.value;
    
    // Operation filters
    if (elements.modePaiementFilter.value) filters.mode_paiement = elements.modePaiementFilter.value;
    if (elements.fournisseurFilter.value) filters.nom_fournisseur = elements.fournisseurFilter.value;
    if (elements.banqueFilter.value) {
        filters.banque = elements.banqueFilter.value;
        
    }
    if (elements.chequeFilter.value) filters.numero_cheque = elements.chequeFilter.value;
    
    // Amount filters
    if (elements.amountMinFilter.value) filters.amount_min = elements.amountMinFilter.value;
    if (elements.amountMaxFilter.value) filters.amount_max = elements.amountMaxFilter.value;
    
    // Search filter
    if (elements.searchFilter.value) filters.search = elements.searchFilter.value;
    
    currentPage = 1;
    fetchOperations(filters);
}

// 3. Update the clearFilters function to clear all new filters
function clearFilters() {
    elements.yearFilter.value = '';
    elements.monthFilter.value = '';
    elements.dayFilter.value = '';
    elements.startDate.value = '';
    elements.endDate.value = '';
    elements.actionFilter.value = '';
    elements.codeFilter.value = '';
    elements.modePaiementFilter.value = '';
    elements.fournisseurFilter.value = '';
    elements.banqueFilter.value = '';
    elements.searchFilter.value = '';
    elements.amountMinFilter.value = '';
    elements.amountMaxFilter.value = '';
    elements.chequeFilter.value = '';
    
    currentPage = 1;
    fetchOperations();
}

    function clearFilters() {
        elements.yearFilter.value = '';
        elements.monthFilter.value = '';
        elements.dayFilter.value = '';
        elements.startDate.value = '';
        elements.endDate.value = '';
        
        currentPage = 1;
        fetchOperations();
    }

    async function generatePDF() {
    try {
        const token = getAuthToken();
        if (!token) {
            showToast('error', 'Token d\'authentification manquant');
            return;
        }

        const filters = {};
        
        // Date filters
        if (elements.yearFilter.value) {
            const year = elements.yearFilter.value;
            if (!elements.monthFilter.value && !elements.dayFilter.value) {
                filters.date_from = `${year}-01-01`;
                filters.date_to = `${year}-12-31`;
            }
        }
        if (elements.monthFilter.value) {
            const year = elements.yearFilter.value || new Date().getFullYear();
            const month = elements.monthFilter.value.padStart(2, '0');
            const daysInMonth = new Date(year, month, 0).getDate();
            if (!elements.dayFilter.value) {
                filters.date_from = `${year}-${month}-01`;
                filters.date_to = `${year}-${month}-${daysInMonth}`;
            }
        }
        if (elements.dayFilter.value) {
            const year = elements.yearFilter.value || new Date().getFullYear();
            const month = (elements.monthFilter.value || new Date().getMonth() + 1).toString().padStart(2, '0');
            const day = elements.dayFilter.value.padStart(2, '0');
            filters.date_from = `${year}-${month}-${day}`;
            filters.date_to = `${year}-${month}-${day}`;
        }
        if (elements.startDate.value) filters.date_from = elements.startDate.value;
        if (elements.endDate.value) filters.date_to = elements.endDate.value;
        
        // Other filters
        if (elements.actionFilter.value) filters.action = elements.actionFilter.value;
        if (elements.modePaiementFilter.value) filters.mode_paiement = elements.modePaiementFilter.value;
        if (elements.fournisseurFilter.value) filters.nom_fournisseur = elements.fournisseurFilter.value;
        if (elements.banqueFilter.value) {
            filters.banque = elements.banqueFilter.value;
            filters.bank_name = elements.banqueFilter.value;
        }
        if (elements.chequeFilter.value) filters.numero_cheque = elements.chequeFilter.value;
        if (elements.amountMinFilter.value) filters.amount_min = elements.amountMinFilter.value;
        if (elements.amountMaxFilter.value) filters.amount_max = elements.amountMaxFilter.value;
        if (elements.searchFilter.value) filters.search = elements.searchFilter.value;

        const params = new URLSearchParams();
        Object.keys(filters).forEach(key => {
            if (filters[key]) {
                params.append(key, filters[key]);
            }
        });

        showToast('success', 'Génération du PDF en cours...');

        const response = await fetch(`${PDF_API}${params.toString() ? '?' + params.toString() : ''}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `historique_caisse_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        showToast('success', 'PDF généré avec succès!');

    } catch (error) {
        console.error('Erreur lors de la génération du PDF:', error);
        showToast('error', 'Erreur lors de la génération du PDF');
    }
}


    function updateLastRefresh() {
        elements.lastRefresh.textContent = new Date().toLocaleTimeString('fr-FR');
    }

    function initializeDarkMode() {
        const isDark = localStorage.getItem('theme') === 'dark';
        if (isDark) {
            document.documentElement.classList.add('dark');
        }
    }

    function toggleDarkMode() {
        const isDark = document.documentElement.classList.contains('dark');
        if (isDark) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        }
    }

    function initializeEventListeners() {
        elements.searchBtn.addEventListener('click', applyFilters);
        elements.periodSearchBtn.addEventListener('click', applyFilters);
        elements.clearFiltersBtn.addEventListener('click', clearFilters);
        elements.generatePdfBtn.addEventListener('click', generatePDF);
        elements.refreshBtn.addEventListener('click', () => fetchOperations());
        elements.darkModeToggle.addEventListener('click', toggleDarkMode);
        
        elements.backBtn.addEventListener('click', () => {
            window.history.back();
        });

        elements.prevPage.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                displayOperations();
            }
        });

        elements.nextPage.addEventListener('click', () => {
            const totalPages = Math.ceil(filteredOperations.length / itemsPerPage);
            if (currentPage < totalPages) {
                currentPage++;
                displayOperations();
            }
        });
        
        const textInputs = [
            elements.fournisseurFilter,
            elements.banqueFilter,
            elements.searchFilter,
            elements.chequeFilter,
            elements.amountMinFilter,
            elements.amountMaxFilter,
            elements.dayFilter
        ];
        
        textInputs.forEach(input => {
            if (input) {
                input.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        applyFilters();
                    }
                });
            }
        });
        
        // Add change event listeners for select elements
        const selectElements = [
            elements.yearFilter,
            elements.monthFilter,
            elements.actionFilter,
            elements.modePaiementFilter
        ];
        
        selectElements.forEach(select => {
            if (select) {
                select.addEventListener('change', () => {
                    // Auto-apply filters when certain selects change
                    if (select === elements.yearFilter || select === elements.monthFilter) {
                        applyFilters();
                    }
                });
            }
        });
    }

    // Make generateOperationPDF available globally so it can be called from onclick
    window.generateOperationPDF = generateOperationPDF;

    function initialize() {
        updateUserInfo();
        initializeDarkMode();
        initializeEventListeners();
        initializeRealTimeSearch();
        
        setTimeout(() => {
            elements.loadingState.classList.add('hidden');
            elements.mainContent.classList.remove('hidden');
            fetchOperations();
        }, 1000);
    }
    
    initialize();
});