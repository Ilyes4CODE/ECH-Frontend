document.addEventListener('DOMContentLoaded', function() {
    const API_BASE = 'http://127.0.0.1:8000/gestion/caisse/operations/';
    const PDF_API = 'http://127.0.0.1:8000/gestion/caisse/operations/history/pdf/';
    
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
        yearFilter: document.getElementById('yearFilter'),
        monthFilter: document.getElementById('monthFilter'),
        dayFilter: document.getElementById('dayFilter'),
        startDate: document.getElementById('startDate'),
        endDate: document.getElementById('endDate'),
        searchBtn: document.getElementById('searchBtn'),
        periodSearchBtn: document.getElementById('periodSearchBtn'),
        clearFiltersBtn: document.getElementById('clearFiltersBtn'),
        generatePdfBtn: document.getElementById('generatePdfBtn'),
        refreshBtn: document.getElementById('refreshBtn'),
        backBtn: document.getElementById('backBtn'),
        darkModeToggle: document.getElementById('darkModeToggle'),
        totalEncaissements: document.getElementById('totalEncaissements'),
        totalDecaissements: document.getElementById('totalDecaissements'),
        netBalance: document.getElementById('netBalance'),
        totalOperations: document.getElementById('totalOperations'),
        lastRefresh: document.getElementById('lastRefresh'),
        prevPage: document.getElementById('prevPage'),
        nextPage: document.getElementById('nextPage'),
        pageNumbers: document.getElementById('pageNumbers'),
        itemsStart: document.getElementById('itemsStart'),
        itemsEnd: document.getElementById('itemsEnd'),
        totalItems: document.getElementById('totalItems'),
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

    async function fetchOperations(filters = {}) {
        try {
            const token = getAuthToken();
            if (!token) {
                showToast('error', 'Token d\'authentification manquant');
                return;
            }

            const params = new URLSearchParams();
            Object.keys(filters).forEach(key => {
                if (filters[key]) {
                    params.append(key, filters[key]);
                }
            });

            const response = await fetch(`${API_BASE}${params.toString() ? '?' + params.toString() : ''}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            allOperations = data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            filteredOperations = [...allOperations];
            
            populateYearFilter();
            updateSummary();
            displayOperations();
            updateLastRefresh();
            
        } catch (error) {
            console.error('Erreur lors du chargement des opérations:', error);
            showToast('error', 'Erreur lors du chargement des opérations');
        }
    }

    function populateYearFilter() {
        const years = [...new Set(allOperations.map(op => new Date(op.created_at).getFullYear()))];
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
        const totalEncaissements = filteredOperations
            .filter(op => op.operation_type === 'encaissement')
            .reduce((sum, op) => sum + parseFloat(op.amount), 0);
        
        const totalDecaissements = filteredOperations
            .filter(op => op.operation_type === 'decaissement')
            .reduce((sum, op) => sum + parseFloat(op.amount), 0);
        
        const netBalance = totalEncaissements - totalDecaissements;
        const totalOps = filteredOperations.length;

        elements.totalEncaissements.textContent = formatCurrency(totalEncaissements);
        elements.totalDecaissements.textContent = formatCurrency(totalDecaissements);
        elements.netBalance.textContent = formatCurrency(netBalance);
        elements.totalOperations.textContent = totalOps.toString();
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

        elements.operationsList.innerHTML = operationsToShow.map(operation => `
            <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border-l-4 border-${operation.operation_type === 'encaissement' ? 'green' : operation.operation_type === 'decaissement' ? 'red' : 'blue'}-500">
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-4">
                        <div class="w-12 h-12 bg-${operation.operation_type === 'encaissement' ? 'green' : operation.operation_type === 'decaissement' ? 'red' : 'blue'}-100 dark:bg-${operation.operation_type === 'encaissement' ? 'green' : operation.operation_type === 'decaissement' ? 'red' : 'blue'}-900 rounded-full flex items-center justify-center">
                            <i class="${getOperationIcon(operation.operation_type)}"></i>
                        </div>
                        <div>
                            <h3 class="font-semibold text-gray-900 dark:text-white">
                                ${getOperationTitle(operation.operation_type)}
                                <span class="status-badge ${getOperationTypeClass(operation.operation_type)} ml-2">
                                    ${operation.operation_type.charAt(0).toUpperCase() + operation.operation_type.slice(1)}
                                </span>
                            </h3>
                            <p class="text-sm text-gray-600 dark:text-gray-400">${operation.description || 'Aucune description'}</p>
                            ${operation.project_name ? `<p class="text-sm text-blue-600 dark:text-blue-400"><i class="fas fa-project-diagram mr-1"></i>${operation.project_name}</p>` : ''}
                        </div>
                    </div>
                    <div class="text-right">
                        <p class="text-lg font-bold text-${operation.operation_type === 'encaissement' ? 'green' : 'red'}-600 dark:text-${operation.operation_type === 'encaissement' ? 'green' : 'red'}-400">
                            ${operation.operation_type === 'encaissement' ? '+' : '-'}${formatCurrency(Math.abs(operation.amount))}
                        </p>
                        <p class="text-sm text-gray-500 dark:text-gray-400">${formatDate(operation.created_at)}</p>
                    </div>
                </div>
                
                <div class="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    ${operation.mode_paiement ? `
                    <div class="flex items-center text-gray-600 dark:text-gray-400">
                        <i class="fas fa-credit-card mr-2"></i>
                        <span>Mode: ${operation.mode_paiement.charAt(0).toUpperCase() + operation.mode_paiement.slice(1)}</span>
                    </div>` : ''}
                    
                    ${operation.nom_fournisseur ? `
                    <div class="flex items-center text-gray-600 dark:text-gray-400">
                        <i class="fas fa-user mr-2"></i>
                        <span>Fournisseur: ${operation.nom_fournisseur}</span>
                    </div>` : ''}
                    
                    ${operation.numero_cheque ? `
                    <div class="flex items-center text-gray-600 dark:text-gray-400">
                        <i class="fas fa-receipt mr-2"></i>
                        <span>Chèque: ${operation.numero_cheque}</span>
                    </div>` : ''}
                    
                    ${operation.income_source ? `
                    <div class="flex items-center text-gray-600 dark:text-gray-400">
                        <i class="fas fa-source mr-2"></i>
                        <span>Source: ${operation.income_source}</span>
                    </div>` : ''}
                    
                    ${operation.dette_creditor ? `
                    <div class="flex items-center text-gray-600 dark:text-gray-400">
                        <i class="fas fa-handshake mr-2"></i>
                        <span>Créancier: ${operation.dette_creditor}</span>
                    </div>` : ''}
                    
                    ${operation.bank_name ? `
                    <div class="flex items-center text-gray-600 dark:text-gray-400">
                        <i class="fas fa-university mr-2"></i>
                        <span>Banque: ${operation.bank_name}</span>
                    </div>` : ''}
                </div>
                
                <div class="mt-4 flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-600">
                    <div class="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                        <span><i class="fas fa-user mr-1"></i>Par: ${operation.user || 'N/A'}</span>
                        <span><i class="fas fa-balance-scale mr-1"></i>Solde avant: ${formatCurrency(operation.balance_before)}</span>
                        <span><i class="fas fa-arrow-right mr-1"></i>Solde après: ${formatCurrency(operation.balance_after)}</span>
                    </div>
                    ${operation.has_preuve ? `
                    <a href="${operation.preuve_file}" target="_blank" class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                        <i class="fas fa-paperclip mr-1"></i>Voir preuve
                    </a>` : ''}
                </div>
            </div>
        `).join('');

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
        
        if (elements.yearFilter.value) filters.year = elements.yearFilter.value;
        if (elements.monthFilter.value) filters.month = elements.monthFilter.value;
        if (elements.dayFilter.value) filters.day = elements.dayFilter.value;
        if (elements.startDate.value) filters.start_date = elements.startDate.value;
        if (elements.endDate.value) filters.end_date = elements.endDate.value;
        
        currentPage = 1;
        fetchOperations(filters);
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
            if (elements.yearFilter.value) filters.year = elements.yearFilter.value;
            if (elements.monthFilter.value) filters.month = elements.monthFilter.value;
            if (elements.dayFilter.value) filters.day = elements.dayFilter.value;
            if (elements.startDate.value) filters.start_date = elements.startDate.value;
            if (elements.endDate.value) filters.end_date = elements.endDate.value;

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
    }

    function initialize() {
        updateUserInfo();
        initializeDarkMode();
        initializeEventListeners();
        
        setTimeout(() => {
            elements.loadingState.classList.add('hidden');
            elements.mainContent.classList.remove('hidden');
            fetchOperations();
        }, 1000);
    }

    initialize();
});