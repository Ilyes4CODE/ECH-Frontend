// Configuration and Constants - UPDATED
const API_BASE = `http://${window.location.hostname}:8000/gestion/bon-commande/`;
let currentBCs = [];
let itemCounter = 0;
let currentLanguage = localStorage.getItem('language') || 'fr';
let editingBC = null; // Track which BC is being edited

// Language translations - ADD THESE NEW TRANSLATIONS
const translations = {
    fr: {
        // ... existing translations ...
        // ADD THESE NEW TRANSLATIONS:
        editModalTitle: "Modifier le Bon de Commande",
        updateBtn: "Mettre à jour",
        downloadPdfBtn: "Télécharger PDF",
        confirmDelete: "Êtes-vous sûr de vouloir supprimer ce bon de commande?",
        deleteSuccess: "Bon de commande supprimé avec succès",
        updateSuccess: "Bon de commande mis à jour avec succès",
        updateError: "Erreur lors de la mise à jour",
        deleteError: "Erreur lors de la suppression",
        pdfError: "Erreur lors de la génération du PDF",
        downloading: "Téléchargement en cours...",
        
        // Update existing buttons text
        edit: "Modifier",
        delete: "Supprimer",
        pdfBtn: "PDF",
        
        // ... rest of existing French translations remain the same ...
        navSubtitle: "Gestion des Bons de Commande",
        welcomeUser: "Bienvenue",
        userRole: "Utilisateur",
        mainTitle: "Gestion des Bons de Commande",
        mainSubtitle: "Création et suivi de vos commandes",
        totalBCLabel: "Total BC",
        totalValueLabel: "Valeur Totale",
        totalItemsLabel: "Articles Totaux",
        avgValueLabel: "Valeur Moyenne",
        newBCBtn: "Nouveau BC",
        resetBtn: "Réinitialiser",
        addArticleBtn: "Ajouter Article",
        saveBtn: "Enregistrer BC",
        cancelBtn: "Annuler",
        emptyStateBtn: "Créer un BC",
        filtersTitle: "Filtres",
        bcNumberFilterLabel: "Numéro BC",
        createdByFilterLabel: "Créé par",
        dateFilterLabel: "Date",
        descriptionLabel: "Description",
        articlesTitle: "Articles",
        totalLabel: "Total HT:",
        addModalTitle: "Nouveau Bon de Commande",
        detailModalTitle: "Détails du Bon de Commande",
        tableHeaderBCNumber: "Numéro BC",
        tableHeaderDate: "Date Commande",
        tableHeaderTotal: "Total HT",
        tableHeaderItems: "Nb Articles",
        tableHeaderCreatedBy: "Créé par",
        tableHeaderActions: "Actions",
        emptyStateTitle: "Aucun bon de commande trouvé",
        emptyStateDesc: "Commencez par créer votre premier bon de commande",
        loadingText: "Chargement des bons de commande...",
        loadDataError: "Erreur lors du chargement des données",
        connectionError: "Erreur de connexion",
        createError: "Erreur lors de la création du bon de commande",
        addItemError: "Veuillez ajouter au moins un article",
        fillFieldsError: "Veuillez remplir tous les champs requis",
        createSuccessPrefix: "Bon de commande",
        createSuccessSuffix: "créé avec succès",
        seeDetails: "Voir détails",
        developmentMsg: "Fonction en développement",
        articleNumber: "Article",
        removeBtn: "Supprimer",
        designation: "Désignation",
        quantity: "Quantité", 
        unitPrice: "Prix Unitaire (DZD)",
        amount: "Montant HT:",
        productNamePlaceholder: "Nom du produit",
        generalInfo: "Informations Générales",
        totals: "Totaux",
        articlesOrdered: "Articles Commandés",
        numberLabel: "Numéro:",
        orderDate: "Date commande:",
        createdOn: "Créé le:",
        createdBy: "Créé par:",
        itemsCount: "Nombre d'articles:",
        totalHT: "Total HT:",
        productHeader: "Produit",
        designationHeader: "Désignation", 
        quantityHeader: "Quantité",
        unitPriceHeader: "Prix Unit.",
        amountHTHeader: "Montant HT"
    },
    ar: {
        // ... existing translations ...
        // ADD THESE NEW TRANSLATIONS:
        editModalTitle: "تعديل أمر الشراء",
        updateBtn: "تحديث",
        downloadPdfBtn: "تحميل PDF",
        confirmDelete: "هل أنت متأكد من حذف أمر الشراء هذا؟",
        deleteSuccess: "تم حذف أمر الشراء بنجاح",
        updateSuccess: "تم تحديث أمر الشراء بنجاح",
        updateError: "خطأ في التحديث",
        deleteError: "خطأ في الحذف",
        pdfError: "خطأ في إنشاء ملف PDF",
        downloading: "جاري التحميل...",
        
        // Update existing buttons text
        edit: "تعديل",
        delete: "حذف",
        pdfBtn: "PDF",
        
        // ... rest of existing Arabic translations remain the same ...
        navSubtitle: "إدارة أوامر الشراء",
        welcomeUser: "مرحباً",
        userRole: "مستخدم",
        mainTitle: "إدارة أوامر الشراء",
        mainSubtitle: "إنشاء ومتابعة طلباتكم",
        totalBCLabel: "إجمالي الأوامر",
        totalValueLabel: "القيمة الإجمالية",
        totalItemsLabel: "إجمالي المواد",
        avgValueLabel: "القيمة المتوسطة",
        newBCBtn: "أمر جديد",
        resetBtn: "إعادة تعيين",
        addArticleBtn: "إضافة مادة",
        saveBtn: "حفظ الأمر",
        cancelBtn: "إلغاء",
        emptyStateBtn: "إنشاء أمر",
        filtersTitle: "التصفيات",
        bcNumberFilterLabel: "رقم الأمر",
        createdByFilterLabel: "أنشئ بواسطة",
        dateFilterLabel: "التاريخ",
        descriptionLabel: "الوصف",
        articlesTitle: "المواد",
        totalLabel: "الإجمالي:",
        addModalTitle: "أمر شراء جديد",
        detailModalTitle: "تفاصيل أمر الشراء",
        tableHeaderBCNumber: "رقم الأمر",
        tableHeaderDate: "تاريخ الطلب",
        tableHeaderTotal: "الإجمالي",
        tableHeaderItems: "عدد المواد",
        tableHeaderCreatedBy: "أنشئ بواسطة",
        tableHeaderActions: "الإجراءات",
        emptyStateTitle: "لا توجد أوامر شراء",
        emptyStateDesc: "ابدأ بإنشاء أمر الشراء الأول",
        loadingText: "جاري تحميل أوامر الشراء...",
        loadDataError: "خطأ في تحميل البيانات",
        connectionError: "خطأ في الاتصال",
        createError: "خطأ في إنشاء أمر الشراء",
        addItemError: "يرجى إضافة مادة واحدة على الأقل",
        fillFieldsError: "يرجى ملء جميع الحقول المطلوبة",
        createSuccessPrefix: "تم إنشاء أمر الشراء",
        createSuccessSuffix: "بنجاح",
        seeDetails: "عرض التفاصيل",
        developmentMsg: "الوظيفة قيد التطوير",
        articleNumber: "مادة",
        removeBtn: "حذف",
        designation: "التسمية",
        quantity: "الكمية",
        unitPrice: "سعر الوحدة (دج)",
        amount: "المبلغ:",
        productNamePlaceholder: "اسم المنتج",
        generalInfo: "المعلومات العامة",
        totals: "الإجماليات",
        articlesOrdered: "المواد المطلوبة",
        numberLabel: "الرقم:",
        orderDate: "تاريخ الطلب:",
        createdOn: "تم الإنشاء في:",
        createdBy: "أنشئ بواسطة:",
        itemsCount: "عدد المواد:",
        totalHT: "الإجمالي:",
        productHeader: "المنتج",
        designationHeader: "التسمية",
        quantityHeader: "الكمية",
        unitPriceHeader: "سعر الوحدة",
        amountHTHeader: "المبلغ"
    }
};

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    currentLanguage = localStorage.getItem('language') || 'fr';
    initializePage();
    updatePageLanguage();
    loadBonCommandes();
});

// Initialize page functionality
function initializePage() {
    // Dark mode toggle
    const darkModeToggle = document.getElementById('darkModeToggle');
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    
    if (isDarkMode) {
        document.documentElement.classList.add('dark');
    }

    darkModeToggle.addEventListener('click', function() {
        document.documentElement.classList.toggle('dark');
        localStorage.setItem('darkMode', document.documentElement.classList.contains('dark'));
    });

    // Language toggle
    const languageToggle = document.getElementById('languageToggle');
    if (languageToggle) {
        languageToggle.addEventListener('click', switchLanguage);
    }

    // Event listeners
    document.getElementById('backBtn').addEventListener('click', () => {
        window.history.back();
    });

    document.getElementById('addBCBtn').addEventListener('click', openAddModal);
    document.getElementById('addFirstBCBtn').addEventListener('click', openAddModal);
    document.getElementById('closeAddModal').addEventListener('click', closeAddModal);
    document.getElementById('cancelAddBC').addEventListener('click', closeAddModal);
    document.getElementById('closeDetailModal').addEventListener('click', closeDetailModal);

    document.getElementById('addItemBtn').addEventListener('click', addItemRow);
    document.getElementById('addBCForm').addEventListener('submit', handleCreateOrUpdateBC); // UPDATED

    // Filters
    document.getElementById('bcNumberFilter').addEventListener('input', applyFilters);
    document.getElementById('createdByFilter').addEventListener('input', applyFilters);
    document.getElementById('dateFilter').addEventListener('change', applyFilters);
    document.getElementById('resetFiltersBtn').addEventListener('click', resetFilters);
}

// UPDATE THE DISPLAY FUNCTION TO INCLUDE ALL ACTIONS
function displayBonCommandes(bcs) {
    const tbody = document.getElementById('bcList');
    const emptyState = document.getElementById('emptyState');

    if (!bcs || bcs.length === 0) {
        tbody.innerHTML = '';
        emptyState.classList.remove('hidden');
        return;
    }

    emptyState.classList.add('hidden');
    
    tbody.innerHTML = bcs.map(bc => {
        const date = new Date(bc.date_commande).toLocaleDateString(currentLanguage === 'ar' ? 'ar-DZ' : 'fr-FR');
        const articleText = currentLanguage === 'ar' ? 
            (bc.items_count > 1 ? 'مواد' : 'مادة') : 
            (bc.items_count > 1 ? 'articles' : 'article');
        
        return `
            <tr class="bc-row hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer" onclick="showBCDetails(${bc.id})">
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                        <div class="w-2 h-2 bg-blue-500 rounded-full mr-3 rtl:mr-0 rtl:ml-3"></div>
                        <div>
                            <div class="text-sm font-medium text-gray-900 dark:text-white">${bc.bc_number}</div>
                        </div>
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">${date}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 dark:text-blue-400">${parseFloat(bc.total_ht).toLocaleString(currentLanguage === 'ar' ? 'ar-DZ' : 'fr-FR', { minimumFractionDigits: 2 })} DZD</td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        ${bc.items_count} ${articleText}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">${bc.created_by || 'N/A'}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div class="flex space-x-2 rtl:space-x-reverse">
                        <button onclick="event.stopPropagation(); showBCDetails(${bc.id})" class="text-blue-600 hover:text-blue-800 dark:text-blue-400" title="${translations[currentLanguage].seeDetails}">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button onclick="event.stopPropagation(); downloadPDF(${bc.id})" class="text-green-600 hover:text-green-800 dark:text-green-400" title="${translations[currentLanguage].downloadPdfBtn}">
                            <i class="fas fa-file-pdf"></i>
                        </button>
                        <button onclick="event.stopPropagation(); editBC(${bc.id})" class="text-orange-600 hover:text-orange-800 dark:text-orange-400" title="${translations[currentLanguage].edit}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="event.stopPropagation(); deleteBC(${bc.id})" class="text-red-600 hover:text-red-800 dark:text-red-400" title="${translations[currentLanguage].delete}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// NEW FUNCTION: Edit BC
function editBC(bcId) {
    const bc = currentBCs.find(b => b.id === bcId);
    if (!bc) return;

    editingBC = bc;
    
    // Update modal title and button
    document.getElementById('addModalTitle').textContent = translations[currentLanguage].editModalTitle;
    document.getElementById('saveBtn').innerHTML = `<i class="fas fa-save mr-2 rtl:mr-0 rtl:ml-2"></i>${translations[currentLanguage].updateBtn}`;
    
    // Fill form with existing data
    document.getElementById('bcDescription').value = bc.description || '';
    
    // Clear existing items
    document.getElementById('itemsList').innerHTML = '';
    itemCounter = 0;
    
    // Add existing items
    bc.items.forEach(item => {
        addItemRow();
        const currentItemDiv = document.getElementById(`item-${itemCounter}`);
        currentItemDiv.querySelector('input[name="designation"]').value = item.designation;
        currentItemDiv.querySelector('input[name="quantity"]').value = item.quantity;
        currentItemDiv.querySelector('input[name="prix_unitaire"]').value = item.prix_unitaire;
        calculateItemTotal(itemCounter);
    });
    
    // Open modal
    document.getElementById('addBCModal').classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
}

// NEW FUNCTION: Delete BC
async function deleteBC(bcId) {
    const bc = currentBCs.find(b => b.id === bcId);
    if (!bc) return;

    if (!confirm(translations[currentLanguage].confirmDelete)) {
        return;
    }

    try {
        showLoading();
        const response = await fetch(API_BASE + `${bcId}/delete/`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('access_token') || ''}`
            }
        });

        const result = await response.json();

        if (response.ok) {
            showSuccess(translations[currentLanguage].deleteSuccess);
            loadBonCommandes();
        } else {
            showError(result.error || translations[currentLanguage].deleteError);
        }
        
        hideLoading();
    } catch (error) {
        console.error('Error:', error);
        showError(translations[currentLanguage].connectionError);
        hideLoading();
    }
}

// NEW FUNCTION: Download PDF
async function downloadPDF(bcId) {
    try {
        showLoading();
        const response = await fetch(API_BASE + `${bcId}/pdf/`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('access_token') || ''}`
            }
        });

        if (response.ok) {
            // Create blob from response
            const blob = await response.blob();
            
            // Create download link
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            
            // Get filename from Content-Disposition header or use default
            const contentDisposition = response.headers.get('Content-Disposition');
            let filename = 'bon_commande.pdf';
            if (contentDisposition) {
                const filenameMatch = contentDisposition.match(/filename="(.+)"/);
                if (filenameMatch) {
                    filename = filenameMatch[1];
                }
            }
            
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            
            showSuccess(translations[currentLanguage].downloading);
        } else {
            const result = await response.json();
            showError(result.error || translations[currentLanguage].pdfError);
        }
        
        hideLoading();
    } catch (error) {
        console.error('Error:', error);
        showError(translations[currentLanguage].connectionError);
        hideLoading();
    }
}

// UPDATED FUNCTION: Handle Create or Update BC
async function handleCreateOrUpdateBC(e) {
    e.preventDefault();
    
    const description = document.getElementById('bcDescription').value;
    const doit = document.getElementById('bcDoit').value; // NEW FIELD
    const itemDivs = document.querySelectorAll('.item-row');
    
    if (itemDivs.length === 0) {
        showError(translations[currentLanguage].addItemError);
        return;
    }

    const items = [];
    let hasError = false;

    // Collect items data
    itemDivs.forEach(itemDiv => {
        const designation = itemDiv.querySelector('input[name="designation"]').value;
        const quantity = itemDiv.querySelector('input[name="quantity"]').value;
        const prixUnitaire = itemDiv.querySelector('input[name="prix_unitaire"]').value;

        if (!designation || !quantity || !prixUnitaire) {
            hasError = true;
            return;
        }

        items.push({
            name: designation,
            quantity: parseFloat(quantity),
            prix_unitaire: parseFloat(prixUnitaire)
        });
    });

    if (hasError) {
        showError(translations[currentLanguage].fillFieldsError);
        return;
    }

    const formData = {
        description: description,
        doit: doit, // NEW FIELD
        items: items
    };

    try {
        showLoading();
        
        // Determine if we're creating or updating
        const isUpdate = editingBC !== null;
        const url = isUpdate ? API_BASE + `${editingBC.id}/update/` : API_BASE + 'create/';
        const method = isUpdate ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('access_token') || ''}`
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (response.ok) {
            const texts = translations[currentLanguage];
            if (isUpdate) {
                showSuccess(texts.updateSuccess);
            } else {
                showSuccess(`${texts.createSuccessPrefix} ${result.bc_number} ${texts.createSuccessSuffix}`);
            }
            closeAddModal();
            loadBonCommandes();
        } else {
            showError(result.error || (isUpdate ? translations[currentLanguage].updateError : translations[currentLanguage].createError));
        }
        
        hideLoading();
    } catch (error) {
        console.error('Error:', error);
        showError(translations[currentLanguage].connectionError);
        hideLoading();
    }
}

// UPDATED FUNCTION: Open Add Modal (reset editing state)
function openAddModal() {
    editingBC = null; // Reset editing state
    
    // Reset modal title and button
    document.getElementById('addModalTitle').textContent = translations[currentLanguage].addModalTitle;
    document.getElementById('saveBtn').innerHTML = `<i class="fas fa-save mr-2 rtl:mr-0 rtl:ml-2"></i>${translations[currentLanguage].saveBtn}`;
    
    document.getElementById('addBCModal').classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
    resetForm();
    addItemRow(); // Add first item row
}

// UPDATED FUNCTION: Close Add Modal (reset editing state)
function closeAddModal() {
    editingBC = null; // Reset editing state
    document.getElementById('addBCModal').classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
}

// ... REST OF THE FUNCTIONS REMAIN THE SAME ...

function updatePageLanguage() {
    const texts = translations[currentLanguage];
    
    // Update navigation
    document.getElementById('navSubtitle').textContent = texts.navSubtitle;
    document.getElementById('welcomeUser').textContent = texts.welcomeUser;
    document.getElementById('userRole').textContent = texts.userRole;
    
    // Update main header
    document.getElementById('mainTitle').textContent = texts.mainTitle;
    document.getElementById('mainSubtitle').textContent = texts.mainSubtitle;
    
    // Update statistics labels
    document.getElementById('totalBCLabel').textContent = texts.totalBCLabel;
    document.getElementById('totalValueLabel').textContent = texts.totalValueLabel;
    document.getElementById('totalItemsLabel').textContent = texts.totalItemsLabel;
    document.getElementById('avgValueLabel').textContent = texts.avgValueLabel;
    
    // Update buttons
    document.getElementById('newBCBtn').textContent = texts.newBCBtn;
    document.getElementById('resetBtn').innerHTML = `<i class="fas fa-refresh mr-1 rtl:mr-0 rtl:ml-1"></i>${texts.resetBtn}`;
    document.getElementById('addArticleBtn').textContent = texts.addArticleBtn;
    
    // Check if we're in edit mode to set correct button text
    if (editingBC) {
        document.getElementById('saveBtn').innerHTML = `<i class="fas fa-save mr-2 rtl:mr-0 rtl:ml-2"></i>${texts.updateBtn}`;
    } else {
        document.getElementById('saveBtn').innerHTML = `<i class="fas fa-save mr-2 rtl:mr-0 rtl:ml-2"></i>${texts.saveBtn}`;
    }
    
    document.getElementById('cancelBtn').innerHTML = `<i class="fas fa-times mr-2 rtl:mr-0 rtl:ml-2"></i>${texts.cancelBtn}`;
    document.getElementById('emptyStateBtn').innerHTML = `<i class="fas fa-plus mr-2 rtl:mr-0 rtl:ml-2"></i>${texts.emptyStateBtn}`;
    document.getElementById('pdfBtn').innerHTML = `<i class="fas fa-file-pdf mr-1 rtl:mr-0 rtl:ml-1"></i>${texts.pdfBtn}`;
    
    // Update form labels
    document.getElementById('filtersTitle').innerHTML = `<i class="fas fa-filter text-blue-500 mr-2 rtl:mr-0 rtl:ml-2"></i>${texts.filtersTitle}`;
    document.getElementById('bcNumberFilterLabel').textContent = texts.bcNumberFilterLabel;
    document.getElementById('createdByFilterLabel').textContent = texts.createdByFilterLabel;
    document.getElementById('dateFilterLabel').textContent = texts.dateFilterLabel;
    document.getElementById('descriptionLabel').textContent = texts.descriptionLabel;
    document.getElementById('articlesTitle').textContent = texts.articlesTitle;
    document.getElementById('totalLabel').textContent = texts.totalLabel;
    
    // Check if we're in edit mode to set correct modal title
    if (editingBC) {
        document.getElementById('addModalTitle').textContent = texts.editModalTitle;
    } else {
        document.getElementById('addModalTitle').textContent = texts.addModalTitle;
    }
    
    document.getElementById('detailModalTitle').textContent = texts.detailModalTitle;
    
    // Update table headers
    document.getElementById('tableHeaderBCNumber').textContent = texts.tableHeaderBCNumber;
    document.getElementById('tableHeaderDate').textContent = texts.tableHeaderDate;
    document.getElementById('tableHeaderTotal').textContent = texts.tableHeaderTotal;
    document.getElementById('tableHeaderItems').textContent = texts.tableHeaderItems;
    document.getElementById('tableHeaderCreatedBy').textContent = texts.tableHeaderCreatedBy;
    document.getElementById('tableHeaderActions').textContent = texts.tableHeaderActions;
    
    // Update empty state
    document.getElementById('emptyStateTitle').textContent = texts.emptyStateTitle;
    document.getElementById('emptyStateDesc').textContent = texts.emptyStateDesc;
    
    // Update loading text
    document.getElementById('loadingText').textContent = texts.loadingText;
}

function switchLanguage() {
    currentLanguage = currentLanguage === 'fr' ? 'ar' : 'fr';
    localStorage.setItem('language', currentLanguage);
    
    // Update HTML attributes
    document.documentElement.lang = currentLanguage;
    document.documentElement.dir = currentLanguage === 'ar' ? 'rtl' : 'ltr';
    document.getElementById('currentLang').textContent = currentLanguage.toUpperCase();
    
    // Update all text content
    updatePageLanguage();
    
    // Refresh displayed data to update language-dependent content
    if (currentBCs.length > 0) {
        displayBonCommandes(currentBCs);
        updateStatistics(currentBCs);
    }
}

async function loadBonCommandes() {
    try {
        showLoading();
        const response = await fetch(API_BASE, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('access_token') || ''}`
            }
        });

        if (!response.ok) {
            throw new Error('Erreur lors du chargement des bons de commande');
        }

        currentBCs = await response.json();
        displayBonCommandes(currentBCs);
        updateStatistics(currentBCs);
        hideLoading();
    } catch (error) {
        console.error('Error:', error);
        showError(translations[currentLanguage].loadDataError);
        hideLoading();
    }
}

function updateStatistics(bcs) {
    const totalBC = bcs.length;
    const totalValue = bcs.reduce((sum, bc) => sum + parseFloat(bc.total_ht || 0), 0);
    const totalItems = bcs.reduce((sum, bc) => sum + (bc.items_count || 0), 0);
    const avgValue = totalBC > 0 ? totalValue / totalBC : 0;

    document.getElementById('totalBC').textContent = totalBC;
    document.getElementById('totalValue').textContent = totalValue.toLocaleString(currentLanguage === 'ar' ? 'ar-DZ' : 'fr-FR', { minimumFractionDigits: 2 }) + ' DZD';
    document.getElementById('totalItems').textContent = totalItems;
    document.getElementById('avgValue').textContent = avgValue.toLocaleString(currentLanguage === 'ar' ? 'ar-DZ' : 'fr-FR', { minimumFractionDigits: 2 }) + ' DZD';
}

function closeDetailModal() {
    document.getElementById('bcDetailModal').classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
}

function resetForm() {
    document.getElementById('addBCForm').reset();
    document.getElementById('itemsList').innerHTML = '';
    document.getElementById('totalDisplay').textContent = '0.00 DZD';
    itemCounter = 0;
}

function addItemRow() {
    itemCounter++;
    const itemsContainer = document.getElementById('itemsList');
    const texts = translations[currentLanguage];
    
    const itemDiv = document.createElement('div');
    itemDiv.className = 'item-row border rounded-lg p-4 space-y-4';
    itemDiv.id = `item-${itemCounter}`;
    
    itemDiv.innerHTML = `
        <div class="flex items-center justify-between">
            <h5 class="text-sm font-medium text-gray-700 dark:text-gray-300">${texts.articleNumber} ${itemCounter}</h5>
            <button type="button" onclick="removeItem(${itemCounter})" class="text-red-600 hover:text-red-800 text-sm">
                <i class="fas fa-trash mr-1 rtl:mr-0 rtl:ml-1"></i>${texts.removeBtn}
            </button>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">${texts.designation} *</label>
                <input type="text" name="designation" required class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white" placeholder="${texts.productNamePlaceholder}">
            </div>
            
            <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">${texts.quantity} *</label>
                <input type="number" name="quantity" required min="1" step="0.01" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white" placeholder="1" onchange="calculateItemTotal(${itemCounter})">
            </div>
            
            <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">${texts.unitPrice} *</label>
                <input type="number" name="prix_unitaire" required min="0" step="0.01" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white" placeholder="0.00" onchange="calculateItemTotal(${itemCounter})">
            </div>
        </div>
        
        <div class="text-right rtl:text-left">
            <span class="text-sm text-gray-600 dark:text-gray-400">${texts.amount} </span>
            <span class="font-semibold text-blue-600 dark:text-blue-400" id="itemTotal-${itemCounter}">0.00 DZD</span>
        </div>
    `;
    
    itemsContainer.appendChild(itemDiv);
}

// Remove item
function removeItem(itemId) {
    const itemElement = document.getElementById(`item-${itemId}`);
    if (itemElement) {
        itemElement.remove();
        calculateTotal();
    }
}

// Calculate item total
function calculateItemTotal(itemId) {
    const itemDiv = document.getElementById(`item-${itemId}`);
    if (!itemDiv) return;

    const quantity = parseFloat(itemDiv.querySelector('input[name="quantity"]').value) || 0;
    const prixUnitaire = parseFloat(itemDiv.querySelector('input[name="prix_unitaire"]').value) || 0;
    const total = quantity * prixUnitaire;
    
    document.getElementById(`itemTotal-${itemId}`).textContent = total.toLocaleString(currentLanguage === 'ar' ? 'ar-DZ' : 'fr-FR', { minimumFractionDigits: 2 }) + ' DZD';
    calculateTotal();
}

// Calculate total
function calculateTotal() {
    const itemDivs = document.querySelectorAll('.item-row');
    let grandTotal = 0;

    itemDivs.forEach(itemDiv => {
        const quantity = parseFloat(itemDiv.querySelector('input[name="quantity"]').value) || 0;
        const prixUnitaire = parseFloat(itemDiv.querySelector('input[name="prix_unitaire"]').value) || 0;
        grandTotal += quantity * prixUnitaire;
    });

    document.getElementById('totalDisplay').textContent = grandTotal.toLocaleString(currentLanguage === 'ar' ? 'ar-DZ' : 'fr-FR', { minimumFractionDigits: 2 }) + ' DZD';
}

// Show BC details
function showBCDetails(bcId) {
    const bc = currentBCs.find(b => b.id === bcId);
    if (!bc) return;

    const modal = document.getElementById('bcDetailModal');
    const content = document.getElementById('bcDetailContent');
    const texts = translations[currentLanguage];
    
    const date = new Date(bc.date_commande).toLocaleDateString(currentLanguage === 'ar' ? 'ar-DZ' : 'fr-FR');
    const createdAt = new Date(bc.created_at).toLocaleDateString(currentLanguage === 'ar' ? 'ar-DZ' : 'fr-FR');

    content.innerHTML = `
        <div class="space-y-6">
            <!-- BC Header -->
            <div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            <i class="fas fa-file-invoice text-blue-500 mr-2 rtl:mr-0 rtl:ml-2"></i>${texts.generalInfo}
                        </h4>
                        <div class="space-y-2">
                            <p><span class="font-medium">${texts.numberLabel}</span> ${bc.bc_number}</p>
                            <p><span class="font-medium">${texts.orderDate}</span> ${date}</p>
                            <p><span class="font-medium">${texts.createdOn}</span> ${createdAt}</p>
                            <p><span class="font-medium">${texts.createdBy}</span> ${bc.created_by || 'N/A'}</p>
                            ${bc.doit ? `<p><span class="font-medium">${texts.doitLabel}:</span> ${bc.doit}</p>` : ''}
                        </div>
                    </div>
                    <div>
                        <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            <i class="fas fa-calculator text-green-500 mr-2 rtl:mr-0 rtl:ml-2"></i>${texts.totals}
                        </h4>
                        <div class="space-y-2">
                            <p><span class="font-medium">${texts.itemsCount}</span> ${bc.items_count}</p>
                            <p class="text-lg"><span class="font-medium">${texts.totalHT}</span> 
                                <span class="text-blue-600 dark:text-blue-400 font-bold">${parseFloat(bc.total_ht).toLocaleString(currentLanguage === 'ar' ? 'ar-DZ' : 'fr-FR', { minimumFractionDigits: 2 })} DZD</span>
                            </p>
                        </div>
                    </div>
                </div>
                
                ${bc.description ? `
                    <div class="mt-4 pt-4 border-t border-blue-200 dark:border-blue-800">
                        <h5 class="font-medium text-gray-900 dark:text-white mb-2">${texts.descriptionLabel}</h5>
                        <p class="text-gray-600 dark:text-gray-400">${bc.description}</p>
                    </div>
                ` : ''}
            </div>

            <!-- Items List -->
            <div>
                <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    <i class="fas fa-list text-purple-500 mr-2 rtl:mr-0 rtl:ml-2"></i>${texts.articlesOrdered}
                </h4>
                
                <div class="overflow-x-auto">
                    <table class="w-full border border-gray-200 dark:border-gray-700 rounded-lg">
                        <thead class="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th class="px-4 py-3 text-left rtl:text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">${texts.productHeader}</th>
                                <th class="px-4 py-3 text-left rtl:text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">${texts.designationHeader}</th>
                                <th class="px-4 py-3 text-right rtl:text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">${texts.quantityHeader}</th>
                                <th class="px-4 py-3 text-right rtl:text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">${texts.unitPriceHeader}</th>
                                <th class="px-4 py-3 text-right rtl:text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">${texts.amountHTHeader}</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                            ${bc.items.map(item => `
                                <tr class="hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td class="px-4 py-3">
                                        <div class="flex items-center">
                                            <div class="w-2 h-2 bg-purple-500 rounded-full mr-3 rtl:mr-0 rtl:ml-3"></div>
                                            <div>
                                                <div class="text-sm font-medium text-gray-900 dark:text-white">ID: ${item.product_id || 'Auto'}</div>
                                                <div class="text-xs text-gray-500 dark:text-gray-400">${item.product_name || 'N/A'}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="px-4 py-3 text-sm text-gray-900 dark:text-white">${item.designation}</td>
                                    <td class="px-4 py-3 text-right rtl:text-left text-sm text-gray-900 dark:text-white">${parseFloat(item.quantity).toLocaleString(currentLanguage === 'ar' ? 'ar-DZ' : 'fr-FR')}</td>
                                    <td class="px-4 py-3 text-right rtl:text-left text-sm text-gray-900 dark:text-white">${parseFloat(item.prix_unitaire).toLocaleString(currentLanguage === 'ar' ? 'ar-DZ' : 'fr-FR', { minimumFractionDigits: 2 })} DZD</td>
                                    <td class="px-4 py-3 text-right rtl:text-left text-sm font-medium text-purple-600 dark:text-purple-400">${parseFloat(item.montant_ht).toLocaleString(currentLanguage === 'ar' ? 'ar-DZ' : 'fr-FR', { minimumFractionDigits: 2 })} DZD</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;

    modal.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
}

// Apply filters
function applyFilters() {
    const bcNumberFilter = document.getElementById('bcNumberFilter').value.toLowerCase();
    const createdByFilter = document.getElementById('createdByFilter').value.toLowerCase();
    const dateFilter = document.getElementById('dateFilter').value;

    let filtered = currentBCs.filter(bc => {
        const matchesBcNumber = !bcNumberFilter || bc.bc_number.toLowerCase().includes(bcNumberFilter);
        const matchesCreatedBy = !createdByFilter || (bc.created_by && bc.created_by.toLowerCase().includes(createdByFilter));
        const matchesDate = !dateFilter || bc.date_commande.startsWith(dateFilter);

        return matchesBcNumber && matchesCreatedBy && matchesDate;
    });

    displayBonCommandes(filtered);
}

// Reset filters
function resetFilters() {
    document.getElementById('bcNumberFilter').value = '';
    document.getElementById('createdByFilter').value = '';
    document.getElementById('dateFilter').value = '';
    displayBonCommandes(currentBCs);
}

// Utility functions
function showLoading() {
    document.getElementById('loadingState').classList.remove('hidden');
    document.getElementById('mainContent').classList.add('hidden');
}

function hideLoading() {
    document.getElementById('loadingState').classList.add('hidden');
    document.getElementById('mainContent').classList.remove('hidden');
}

function showError(message) {
    const toast = document.getElementById('errorToast');
    document.getElementById('errorMessage').textContent = message;
    toast.classList.remove('hidden');
    setTimeout(() => toast.classList.add('hidden'), 5000);
}

function showSuccess(message) {
    const toast = document.getElementById('successToast');
    document.getElementById('successMessage').textContent = message;
    toast.classList.remove('hidden');
    setTimeout(() => toast.classList.add('hidden'), 5000);
}