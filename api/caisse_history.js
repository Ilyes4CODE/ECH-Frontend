document.addEventListener('DOMContentLoaded', function() {
    // Base URL Configuration
    const BASE_URL = `http://${window.location.hostname}:8000/gestion/caisse`;
    const API_BASE = `${BASE_URL}/history/`;
    const PDF_API = `${BASE_URL}/operations/history/pdf/`;
    const OPERATION_PDF_API = `${BASE_URL}/operation/`; // Base URL for single operation PDF
    
    // Language Configuration
    let currentLanguage = localStorage.getItem('language') || 'fr';
    
    const translations = {
        fr: {
            // Navigation & Headers
            pageTitle: 'Historique de Caisse',
            subtitle: 'Toutes les opérations',
            welcome: 'Bienvenue',
            loading: 'Chargement de l\'historique...',
            
            // Filters
            filtersTitle: 'Filtres de recherche',
            allYears: 'Toutes les années',
            allMonths: 'Tous les mois',
            allActions: 'Toutes les actions',
            allModes: 'Tous les modes',
            chooseBank: 'Choisir la banque',
            
            // Month names
            months: {
                1: 'Janvier', 2: 'Février', 3: 'Mars', 4: 'Avril',
                5: 'Mai', 6: 'Juin', 7: 'Juillet', 8: 'Août',
                9: 'Septembre', 10: 'Octobre', 11: 'Novembre', 12: 'Décembre'
            },
            
            // Form labels
            year: 'Année',
            month: 'Mois',
            day: 'Jour',
            actionType: 'Type d\'action',
            paymentMode: 'Mode de paiement',
            supplier: 'Fournisseur',
            bank: 'Banque',
            search: 'Recherche',
            operationCode: 'Code opération',
            minAmount: 'Montant min',
            maxAmount: 'Montant max',
            chequeNumber: 'N° Chèque',
            customPeriod: 'Période personnalisée',
            
            // Placeholders
            dayPlaceholder: 'Jour',
            supplierPlaceholder: 'Nom du fournisseur',
            searchPlaceholder: 'Description, observation...',
            codePlaceholder: 'example : ECH001',
            chequePlaceholder: 'Numéro de chèque',
            
            // Buttons
            search: 'Rechercher',
            clear: 'Effacer',
            generatePdf: 'Générer PDF',
            refresh: 'Actualiser',
            print: 'Imprimer',
            previous: 'Précédent',
            next: 'Suivant',
            
            // Operation types
            encaissement: 'Encaissement',
            decaissement: 'Décaissement',
            transfer: 'Transfert',
            operation: 'Opération',
            
            // Payment modes
            espece: 'Espèce',
            cheque: 'Chèque',
            virement: 'Virement',
            
            // Summary
            summaryTitle: 'Résumé des opérations',
            totalEncaissements: 'Encaissements',
            totalDecaissements: 'Décaissements',
            netBalance: 'Solde Net',
            totalOperations: 'Total Opérations',
            
            // History
            historyTitle: 'Historique des opérations',
            noOperations: 'Aucune opération trouvée',
            noOperationsSubtext: 'Essayez de modifier vos critères de recherche',
            displaying: 'Affichage de',
            to: 'à',
            on: 'sur',
            operationsText: 'opérations',
            
            // Operation details
            mode: 'Mode',
            supplierLabel: 'Fournisseur',
            chequeLabel: 'Chèque',
            source: 'Source',
            bankLabel: 'Banque',
            by: 'Par',
            balanceBefore: 'Solde avant',
            balanceAfter: 'Solde après',
            viewProof: 'Voir preuve',
            printOperation: 'Imprimer cette opération',
            
            // Messages
            authTokenMissing: 'Token d\'authentification manquant',
            sessionExpired: 'Session expirée. Veuillez vous reconnecter.',
            pdfGenerating: 'Génération du PDF en cours...',
            pdfSuccess: 'PDF généré avec succès!',
            pdfDownloaded: 'PDF téléchargé avec succès!',
            pdfOpened: 'PDF ouvert dans un nouvel onglet!',
            pdfError: 'Erreur lors de la génération du PDF',
            loadingError: 'Erreur lors du chargement des opérations',
            operationError: 'Une erreur s\'est produite',
            operationSuccess: 'Opération réussie',
            
            // No description
            noDescription: 'Aucune description'
        },
        
        ar: {
            // Navigation & Headers
            pageTitle: 'سجل الصندوق',
            subtitle: 'جميع العمليات',
            welcome: 'مرحباً',
            loading: 'جاري تحميل السجل...',
            
            // Filters
            filtersTitle: 'مرشحات البحث',
            allYears: 'جميع السنوات',
            allMonths: 'جميع الأشهر',
            allActions: 'جميع الإجراءات',
            allModes: 'جميع الطرق',
            chooseBank: 'اختر البنك',
            
            // Month names
            months: {
                1: 'يناير', 2: 'فبراير', 3: 'مارس', 4: 'أبريل',
                5: 'مايو', 6: 'يونيو', 7: 'يوليو', 8: 'أغسطس',
                9: 'سبتمبر', 10: 'أكتوبر', 11: 'نوفمبر', 12: 'ديسمبر'
            },
            
            // Form labels
            year: 'السنة',
            month: 'الشهر',
            day: 'اليوم',
            actionType: 'نوع العملية',
            paymentMode: 'طريقة الدفع',
            supplier: 'المورد',
            bank: 'البنك',
            search: 'بحث',
            operationCode: 'رمز العملية',
            minAmount: 'الحد الأدنى للمبلغ',
            maxAmount: 'الحد الأقصى للمبلغ',
            chequeNumber: 'رقم الشيك',
            customPeriod: 'فترة مخصصة',
            
            // Placeholders
            dayPlaceholder: 'اليوم',
            supplierPlaceholder: 'اسم المورد',
            searchPlaceholder: 'الوصف، الملاحظات...',
            codePlaceholder: 'مثال: ECH001',
            chequePlaceholder: 'رقم الشيك',
            
            // Buttons
            search: 'بحث',
            clear: 'مسح',
            generatePdf: 'إنشاء PDF',
            refresh: 'تحديث',
            print: 'طباعة',
            previous: 'السابق',
            next: 'التالي',
            
            // Operation types
            encaissement: 'قبض',
            decaissement: 'صرف',
            transfer: 'تحويل',
            operation: 'عملية',
            
            // Payment modes
            espece: 'نقداً',
            cheque: 'شيك',
            virement: 'تحويل',
            
            // Summary
            summaryTitle: 'ملخص العمليات',
            totalEncaissements: 'إجمالي المقبوضات',
            totalDecaissements: 'إجمالي المصروفات',
            netBalance: 'الرصيد الصافي',
            totalOperations: 'إجمالي العمليات',
            
            // History
            historyTitle: 'سجل العمليات',
            noOperations: 'لم يتم العثور على عمليات',
            noOperationsSubtext: 'حاول تعديل معايير البحث',
            displaying: 'عرض من',
            to: 'إلى',
            on: 'من',
            operationsText: 'عمليات',
            
            // Operation details
            mode: 'الطريقة',
            supplierLabel: 'المورد',
            chequeLabel: 'شيك',
            source: 'المصدر',
            bankLabel: 'البنك',
            by: 'بواسطة',
            balanceBefore: 'الرصيد قبل',
            balanceAfter: 'الرصيد بعد',
            viewProof: 'عرض الإثبات',
            printOperation: 'طباعة هذه العملية',
            
            // Messages
            authTokenMissing: 'رمز المصادقة مفقود',
            sessionExpired: 'انتهت الجلسة. يرجى تسجيل الدخول مرة أخرى.',
            pdfGenerating: 'جاري إنشاء PDF...',
            pdfSuccess: 'تم إنشاء PDF بنجاح!',
            pdfDownloaded: 'تم تحميل PDF بنجاح!',
            pdfOpened: 'تم فتح PDF في علامة تبويب جديدة!',
            pdfError: 'خطأ في إنشاء PDF',
            loadingError: 'خطأ في تحميل العمليات',
            operationError: 'حدث خطأ',
            operationSuccess: 'تمت العملية بنجاح',
            
            // No description
            noDescription: 'لا يوجد وصف'
        }
    };
    
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
        languageToggle: document.getElementById('languageToggle'),
        
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
        elements.welcomeUser.textContent = `${translations[currentLanguage].welcome}, ${userInfo.username}`;
        elements.userRole.textContent = userInfo.role;
    }

    function showToast(type, messageKey) {
        const toast = type === 'error' ? elements.errorToast : elements.successToast;
        const messageElement = type === 'error' ? elements.errorMessage : elements.successMessage;
        
        const message = translations[currentLanguage][messageKey] || messageKey;
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
        const locale = currentLanguage === 'ar' ? 'ar-DZ' : 'fr-FR';
        return new Date(dateString).toLocaleDateString(locale, {
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
        return translations[currentLanguage][type] || translations[currentLanguage].operation;
    }

    function toggleLanguage() {
        currentLanguage = currentLanguage === 'fr' ? 'ar' : 'fr';
        localStorage.setItem('language', currentLanguage);
        updateUILanguage();
        updateUserInfo();
        populateYearFilter();
        displayOperations();
    }

    function updateUILanguage() {
        // Update page direction
        document.documentElement.dir = currentLanguage === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = currentLanguage;
        
        // Update page title
        document.title = translations[currentLanguage].pageTitle + ' - ERP Génie Civil';
        
        // Update text content for various elements
        const textUpdates = {
            'pageTitle': 'pageTitle',
            'pageSubtitle': 'subtitle',
            'filtersTitle': 'filtersTitle',
            'summaryTitle': 'summaryTitle',
            'historyTitle': 'historyTitle',
            'loadingText': 'loading',
            'noOperationsText': 'noOperations',
            'noOperationsSubtext': 'noOperationsSubtext'
        };
        
        Object.entries(textUpdates).forEach(([id, key]) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = translations[currentLanguage][key];
            }
        });
        
        // Update select options
        updateSelectOptions();
        updatePlaceholders();
        updateButtonTexts();
    }

    function updateSelectOptions() {
        // Year filter
        if (elements.yearFilter) {
            const selectedYear = elements.yearFilter.value;
            elements.yearFilter.innerHTML = `<option value="">${translations[currentLanguage].allYears}</option>`;
            const years = [...new Set(allOperations.map(entry => {
                const dateStr = entry.date || entry.created_at;
                return new Date(dateStr).getFullYear();
            }))];
            years.sort((a, b) => b - a);
            years.forEach(year => {
                const option = document.createElement('option');
                option.value = year;
                option.textContent = year;
                option.selected = year.toString() === selectedYear;
                elements.yearFilter.appendChild(option);
            });
        }
        
        // Month filter
        if (elements.monthFilter) {
            const selectedMonth = elements.monthFilter.value;
            elements.monthFilter.innerHTML = `<option value="">${translations[currentLanguage].allMonths}</option>`;
            Object.entries(translations[currentLanguage].months).forEach(([value, name]) => {
                const option = document.createElement('option');
                option.value = value;
                option.textContent = name;
                option.selected = value === selectedMonth;
                elements.monthFilter.appendChild(option);
            });
        }
        
        // Action filter
        if (elements.actionFilter) {
            const selectedAction = elements.actionFilter.value;
            elements.actionFilter.innerHTML = `
                <option value="">${translations[currentLanguage].allActions}</option>
                <option value="encaissement" ${selectedAction === 'encaissement' ? 'selected' : ''}>${translations[currentLanguage].encaissement}</option>
                <option value="decaissement" ${selectedAction === 'decaissement' ? 'selected' : ''}>${translations[currentLanguage].decaissement}</option>
            `;
        }
        
        // Payment mode filter
        if (elements.modePaiementFilter) {
            const selectedMode = elements.modePaiementFilter.value;
            elements.modePaiementFilter.innerHTML = `
                <option value="">${translations[currentLanguage].allModes}</option>
                <option value="espece" ${selectedMode === 'espece' ? 'selected' : ''}>${translations[currentLanguage].espece}</option>
                <option value="cheque" ${selectedMode === 'cheque' ? 'selected' : ''}>${translations[currentLanguage].cheque}</option>
                <option value="virement" ${selectedMode === 'virement' ? 'selected' : ''}>${translations[currentLanguage].virement}</option>
            `;
        }
        
        // Bank filter
        if (elements.banqueFilter) {
            const selectedBank = elements.banqueFilter.value;
            elements.banqueFilter.innerHTML = `
                <option value="">${translations[currentLanguage].chooseBank}</option>
                <option value="BEA" ${selectedBank === 'BEA' ? 'selected' : ''}>BEA</option>
                <option value="BDL" ${selectedBank === 'BDL' ? 'selected' : ''}>BDL</option>
                <option value="Albaraka Bank" ${selectedBank === 'Albaraka Bank' ? 'selected' : ''}>Albaraka Bank</option>
                <option value="AGB" ${selectedBank === 'AGB' ? 'selected' : ''}>AGB</option>
                <option value="Alsalam Bank" ${selectedBank === 'Alsalam Bank' ? 'selected' : ''}>Alsalam Bank</option>
            `;
        }
    }

    function updatePlaceholders() {
        const placeholderUpdates = {
            dayFilter: 'dayPlaceholder',
            fournisseurFilter: 'supplierPlaceholder',
            searchFilter: 'searchPlaceholder',
            codeFilter: 'codePlaceholder',
            chequeFilter: 'chequePlaceholder'
        };
        
        Object.entries(placeholderUpdates).forEach(([elementId, key]) => {
            const element = elements[elementId];
            if (element) {
                element.placeholder = translations[currentLanguage][key];
            }
        });
    }

    function updateButtonTexts() {
        const buttonUpdates = {
            searchBtn: 'search',
            clearFiltersBtn: 'clear',
            generatePdfBtn: 'generatePdf',
            refreshBtn: 'refresh',
            prevPage: 'previous',
            nextPage: 'next'
        };
        
        Object.entries(buttonUpdates).forEach(([elementId, key]) => {
            const element = elements[elementId];
            if (element) {
                // Update text while preserving icons
                const icon = element.querySelector('i');
                const iconClass = icon ? icon.className : '';
                const text = translations[currentLanguage][key];
                
                if (elementId === 'prevPage') {
                    element.innerHTML = `<i class="fas fa-chevron-left mr-1"></i>${text}`;
                } else if (elementId === 'nextPage') {
                    element.innerHTML = `${text}<i class="fas fa-chevron-right ml-1"></i>`;
                } else if (icon) {
                    element.innerHTML = `<i class="${iconClass} mr-2"></i>${text}`;
                } else {
                    element.textContent = text;
                }
            }
        });
    }

    // NEW FUNCTION: Generate PDF for a single operation
    async function generateOperationPDF(historyId) {
        try {
            const token = getAuthToken();
            if (!token) {
                showToast('error', 'authTokenMissing');
                return;
            }

            showToast('success', 'pdfGenerating');

            const response = await fetch(`${OPERATION_PDF_API}${historyId}/pdf/`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                if (response.status === 401) {
                    showToast('error', 'sessionExpired');
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
                showToast('success', 'pdfDownloaded');
            } else {
                showToast('success', 'pdfOpened');
            }
            
            // Clean up the URL object after a delay
            setTimeout(() => {
                window.URL.revokeObjectURL(url);
            }, 100);

        } catch (error) {
            console.error('Erreur lors de la génération du PDF:', error);
            showToast('error', 'pdfError');
        }
    }

    async function fetchOperations(filters = {}) {
        try {
            const token = getAuthToken();
            if (!token) {
                showToast('error', 'authTokenMissing');
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
                    showToast('error', 'sessionExpired');
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
            showToast('error', 'loadingError');
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
            const dateStr = entry.date || entry.created_at;
            return new Date(dateStr).getFullYear();
        }))];
        years.sort((a, b) => b - a);
        
        const currentValue = elements.yearFilter.value;
        elements.yearFilter.innerHTML = `<option value="">${translations[currentLanguage].allYears}</option>`;
        years.forEach(year => {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            option.selected = year.toString() === currentValue;
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
            const description = entry.description || (entry.operation ? entry.operation.description : translations[currentLanguage].noDescription);
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
                                title="${translations[currentLanguage].printOperation}"
                            >
                                <i class="fas fa-print mr-1"></i>
                                ${translations[currentLanguage].print}
                            </button>
                        </div>
                    </div>
                    
                    <div class="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        ${entry.operation && entry.operation.mode_paiement ? `
                        <div class="flex items-center text-gray-600 dark:text-gray-400">
                            <i class="fas fa-credit-card mr-2"></i>
                            <span>${translations[currentLanguage].mode}: ${entry.operation.mode_paiement.charAt(0).toUpperCase() + entry.operation.mode_paiement.slice(1)}</span>
                        </div>` : ''}
                        
                        ${entry.operation && entry.operation.nom_fournisseur ? `
                        <div class="flex items-center text-gray-600 dark:text-gray-400">
                            <i class="fas fa-user mr-2"></i>
                            <span>${translations[currentLanguage].supplierLabel}: ${entry.operation.nom_fournisseur}</span>
                        </div>` : ''}
                        
                        ${entry.operation && entry.operation.numero_cheque ? `
                        <div class="flex items-center text-gray-600 dark:text-gray-400">
                            <i class="fas fa-receipt mr-2"></i>
                            <span>${translations[currentLanguage].chequeLabel}: ${entry.operation.numero_cheque}</span>
                        </div>` : ''}
                        
                        ${entry.operation && entry.operation.income_source ? `
                        <div class="flex items-center text-gray-600 dark:text-gray-400">
                            <i class="fas fa-source mr-2"></i>
                            <span>${translations[currentLanguage].source}: ${entry.operation.income_source}</span>
                        </div>` : ''}
                        
                        ${entry.operation && entry.operation.banque ? `
                        <div class="flex items-center text-gray-600 dark:text-gray-400">
                            <i class="fas fa-university mr-2"></i>
                            <span>${translations[currentLanguage].bankLabel}: ${entry.operation.banque}</span>
                        </div>` : ''}
                        
                        ${entry.operation && entry.operation.bank_name ? `
                        <div class="flex items-center text-gray-600 dark:text-gray-400">
                            <i class="fas fa-university mr-2"></i>
                            <span>${translations[currentLanguage].bankLabel}: ${entry.operation.bank_name}</span>
                        </div>` : ''}
                    </div>
                    
                    <div class="mt-4 flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-600">
                        <div class="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                            <span><i class="fas fa-user mr-1"></i>${translations[currentLanguage].by}: ${userName}</span>
                            <span><i class="fas fa-balance-scale mr-1"></i>${translations[currentLanguage].balanceBefore}: ${formatCurrency(entry.balance_before)}</span>
                            <span><i class="fas fa-arrow-right mr-1"></i>${translations[currentLanguage].balanceAfter}: ${formatCurrency(entry.balance_after)}</span>
                        </div>
                        ${entry.operation && entry.operation.preuve_file ? `
                        <a href="${entry.operation.preuve_file}" target="_blank" class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                            <i class="fas fa-paperclip mr-1"></i>${translations[currentLanguage].viewProof}
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
        
        // Update pagination text
        const paginationText = document.getElementById('paginationText');
        if (paginationText) {
            paginationText.innerHTML = `${translations[currentLanguage].displaying} <span id="itemsStart">${filteredOperations.length > 0 ? startIndex + 1 : 0}</span> ${translations[currentLanguage].to} <span id="itemsEnd">${endIndex}</span> ${translations[currentLanguage].on} <span id="totalItems">${filteredOperations.length}</span> ${translations[currentLanguage].operationsText}`;
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

    async function generatePDF() {
        try {
            const token = getAuthToken();
            if (!token) {
                showToast('error', 'authTokenMissing');
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

            showToast('success', 'pdfGenerating');

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

            showToast('success', 'pdfSuccess');

        } catch (error) {
            console.error('Erreur lors de la génération du PDF:', error);
            showToast('error', 'pdfError');
        }
    }

    function updateLastRefresh() {
        const locale = currentLanguage === 'ar' ? 'ar-DZ' : 'fr-FR';
        elements.lastRefresh.textContent = new Date().toLocaleTimeString(locale);
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
        
        // Language toggle listener
        if (elements.languageToggle) {
            elements.languageToggle.addEventListener('click', toggleLanguage);
        }
        
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
        // Set initial language and direction
        document.documentElement.dir = currentLanguage === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = currentLanguage;
        
        updateUILanguage();
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