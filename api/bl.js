let currentLanguage = 'fr';
let projects = [];
let blList = [];
let itemCounter = 0;
let chargeCounter = 0;

const translations = {
    fr: {
        navSubtitle: "Gestion des Bons de Livraison",
        welcomeUser: "Bienvenue",
        userRole: "Utilisateur",
        loadingText: "Chargement des données...",
        mainTitle: "Gestion des Bons de Livraison",
        mainSubtitle: "Suivi et gestion de toutes vos livraisons",
        totalBLLabel: "Total BL",
        totalAmountLabel: "Montant Total",
        thisMonthLabel: "Ce Mois",
        newBLBtn: "Nouveau BL",
        filtersTitle: "Filtres",
        resetBtn: "Réinitialiser",
        projectFilterLabel: "Projet",
        searchFilterLabel: "Rechercher",
        emptyStateTitle: "Aucun bon de livraison trouvé",
        emptyStateDesc: "Commencez par créer votre premier bon de livraison",
        emptyStateBtn: "Créer un BL",
        addModalTitle: "Nouveau Bon de Livraison",
        projectLabel: "Projet *",
        paymentMethodLabel: "Mode de Paiement *",
        originAddressLabel: "Adresse d'Origine *",
        destinationAddressLabel: "Adresse de Destination *",
        supplierNameLabel: "Nom Fournisseur",
        bankLabel: "Banque",
        checkNumberLabel: "Numéro Chèque",
        descriptionLabel: "Description",
        itemsTitle: "Articles",
        addItemText: "Ajouter Article",
        chargesTitle: "Charges Additionnelles",
        addChargeText: "Ajouter Charge",
        saveBtn: "Enregistrer",
        cancelBtn: "Annuler",
        detailModalTitle: "Détails du Bon de Livraison",
        productNameLabel: "Nom du Produit",
        quantityLabel: "Quantité",
        unitPriceLabel: "Prix Unitaire",
        totalPriceLabel: "Prix Total",
        chargeDescLabel: "Description Charge",
        chargeAmountLabel: "Montant Charge",
        viewDetails: "Voir Détails",
        editBtn: "Modifier",
        deleteBtn: "Supprimer",
        downloadBtn: "Télécharger PDF",
        grandTotalLabel: "Total Général"
    },
    ar: {
        navSubtitle: "إدارة سندات التسليم",
        welcomeUser: "مرحباً",
        userRole: "مستخدم",
        loadingText: "تحميل البيانات...",
        mainTitle: "إدارة سندات التسليم",
        mainSubtitle: "تتبع وإدارة جميع التسليمات",
        totalBLLabel: "إجمالي السندات",
        totalAmountLabel: "المبلغ الإجمالي",
        thisMonthLabel: "هذا الشهر",
        newBLBtn: "سند جديد",
        filtersTitle: "المرشحات",
        resetBtn: "إعادة تعيين",
        projectFilterLabel: "المشروع",
        searchFilterLabel: "البحث",
        emptyStateTitle: "لم يتم العثور على أي سند تسليم",
        emptyStateDesc: "ابدأ بإنشاء أول سند تسليم",
        emptyStateBtn: "إنشاء سند",
        addModalTitle: "سند تسليم جديد",
        projectLabel: "المشروع *",
        paymentMethodLabel: "طريقة الدفع *",
        originAddressLabel: "عنوان المنشأ *",
        destinationAddressLabel: "عنوان الوجهة *",
        supplierNameLabel: "اسم المورد",
        bankLabel: "البنك",
        checkNumberLabel: "رقم الشيك",
        descriptionLabel: "الوصف",
        itemsTitle: "المواد",
        addItemText: "إضافة مادة",
        chargesTitle: "الرسوم الإضافية",
        addChargeText: "إضافة رسوم",
        saveBtn: "حفظ",
        cancelBtn: "إلغاء",
        detailModalTitle: "تفاصيل سند التسليم",
        productNameLabel: "اسم المنتج",
        quantityLabel: "الكمية",
        unitPriceLabel: "السعر الوحدة",
        totalPriceLabel: "السعر الإجمالي",
        chargeDescLabel: "وصف الرسوم",
        chargeAmountLabel: "مبلغ الرسوم",
        viewDetails: "عرض التفاصيل",
        editBtn: "تعديل",
        deleteBtn: "حذف",
        downloadBtn: "تنزيل PDF",
        grandTotalLabel: "المجموع الكلي"
    }
};

function updateLanguage() {
    const t = translations[currentLanguage];
    
    Object.keys(t).forEach(key => {
        const elements = document.querySelectorAll(`[id="${key}"], #${key}`);
        elements.forEach(el => {
            if (el) {
                if (el.tagName === 'INPUT' && el.type !== 'submit') {
                    el.placeholder = t[key];
                } else {
                    el.textContent = t[key];
                }
            }
        });
    });

    if (currentLanguage === 'ar') {
        document.body.setAttribute('dir', 'rtl');
    } else {
        document.body.setAttribute('dir', 'ltr');
    }
}

function showToast(message, type = 'success') {
    const toast = document.getElementById(type + 'Toast');
    const messageEl = document.getElementById(type + 'Message');
    messageEl.textContent = message;
    toast.classList.remove('hidden');
    setTimeout(() => {
        toast.classList.add('hidden');
    }, 3000);
}

async function loadProjects() {
    try {
        const response = await fetch(`http://${window.location.hostname}:8000/gestion/projects/`,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            },
        });
        if (response.ok) {
            projects = await response.json();
            populateProjectSelects();
        }
    } catch (error) {
        console.error('Error loading projects:', error);
    }
}

function populateProjectSelects() {
    const projectSelect = document.getElementById('projectSelect');
    const projectFilter = document.getElementById('projectFilter');
    
    [projectSelect, projectFilter].forEach(select => {
        select.innerHTML = select.id === 'projectFilter' ? '<option value="">Tous les projets</option>' : '<option value="">Sélectionner un projet</option>';
        projects.forEach(project => {
            const option = document.createElement('option');
            option.value = project.id;
            option.textContent = project.name;
            select.appendChild(option);
        });
    });
}

async function loadBonLivraisons() {
    try {
        const response = await fetch(`http://${window.location.hostname}:8000/gestion/bon-livraison/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            },
        });
        if (response.ok) {
            blList = await response.json();
            displayBonLivraisons(blList);
            updateStatistics();
        }
    } catch (error) {
        console.error('Error loading bon livraisons:', error);
        showToast('Erreur lors du chargement des données', 'error');
    }
}

function displayBonLivraisons(bls) {
    const tbody = document.getElementById('blList');
    const emptyState = document.getElementById('emptyState');
    
    tbody.innerHTML = '';
    
    if (bls.length === 0) {
        emptyState.classList.remove('hidden');
        return;
    }
    
    emptyState.classList.add('hidden');
    
    bls.forEach(bl => {
        const row = document.createElement('tr');
        row.className = 'bl-row';
        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900 dark:text-white">${bl.bl_number}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900 dark:text-white">${bl.project_name}</div>
            </td>
            <td class="px-6 py-4">
                <div class="text-sm text-gray-900 dark:text-white max-w-xs truncate">${bl.origin_address}</div>
            </td>
            <td class="px-6 py-4">
                <div class="text-sm text-gray-900 dark:text-white max-w-xs truncate">${bl.destination_address}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-green-600">${bl.total_amount ? parseFloat(bl.total_amount).toLocaleString() : '0'} DZD</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900 dark:text-white">${new Date(bl.created_at).toLocaleDateString()}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex space-x-2">
                    <button onclick="viewBLDetails(${bl.id})" class="text-blue-600 hover:text-blue-900 dark:text-blue-400" title="Voir Détails">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button onclick="editBL(${bl.id})" class="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400" title="Modifier">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="deleteBL(${bl.id})" class="text-red-600 hover:text-red-900 dark:text-red-400" title="Supprimer">
                        <i class="fas fa-trash"></i>
                    </button>
                    <button onclick="downloadBLPDF(${bl.id})" class="text-green-600 hover:text-green-900 dark:text-green-400" title="Télécharger PDF">
                        <i class="fas fa-download"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function updateStatistics() {
    const totalBL = document.getElementById('totalBL');
    const totalAmount = document.getElementById('totalAmount');
    const thisMonthCount = document.getElementById('thisMonthCount');
    
    const total = blList.length;
    const amount = blList.reduce((sum, bl) => sum + (parseFloat(bl.total_amount) || 0), 0);
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthCount = blList.filter(bl => {
        const blDate = new Date(bl.created_at);
        return blDate.getMonth() === currentMonth && blDate.getFullYear() === currentYear;
    }).length;
    
    totalBL.textContent = total;
    totalAmount.textContent = amount.toLocaleString() + ' DZD';
    thisMonthCount.textContent = monthCount;
}

// Auto calculation functions
function calculateItemTotal(itemId) {
    const quantityInput = document.querySelector(`[name="quantity_${itemId}"]`);
    const unitPriceInput = document.querySelector(`[name="unit_price_${itemId}"]`);
    const totalPriceInput = document.querySelector(`[name="total_price_${itemId}"]`);
    
    if (quantityInput && unitPriceInput && totalPriceInput) {
        const quantity = parseFloat(quantityInput.value) || 0;
        const unitPrice = parseFloat(unitPriceInput.value) || 0;
        const total = quantity * unitPrice;
        
        totalPriceInput.value = total.toFixed(2);
        calculateGrandTotal();
    }
}

function calculateGrandTotal() {
    let itemsTotal = 0;
    let chargesTotal = 0;
    
    // Calculate items total
    const totalPriceInputs = document.querySelectorAll('[name*="total_price_"]');
    totalPriceInputs.forEach(input => {
        itemsTotal += parseFloat(input.value) || 0;
    });
    
    // Calculate charges total
    const chargeAmountInputs = document.querySelectorAll('[name*="charge_amount_"]');
    chargeAmountInputs.forEach(input => {
        chargesTotal += parseFloat(input.value) || 0;
    });
    
    const grandTotal = itemsTotal + chargesTotal;
    
    // Update grand total display
    let grandTotalElement = document.getElementById('grandTotalDisplay');
    if (!grandTotalElement) {
        // Create grand total display if it doesn't exist
        const container = document.getElementById('chargesContainer').parentNode;
        const totalDiv = document.createElement('div');
        totalDiv.className = 'bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border-2 border-blue-200 dark:border-blue-700';
        totalDiv.innerHTML = `
            <div class="flex justify-between items-center">
                <h4 id="grandTotalLabel" class="text-lg font-bold text-blue-900 dark:text-blue-100">Total Général:</h4>
                <span id="grandTotalDisplay" class="text-xl font-bold text-blue-600 dark:text-blue-300">${grandTotal.toLocaleString()} DZD</span>
            </div>
            <div class="text-sm text-blue-700 dark:text-blue-300 mt-2">
                Articles: ${itemsTotal.toLocaleString()} DZD | Charges: ${chargesTotal.toLocaleString()} DZD
            </div>
        `;
        container.appendChild(totalDiv);
        grandTotalElement = document.getElementById('grandTotalDisplay');
    } else {
        grandTotalElement.textContent = `${grandTotal.toLocaleString()} DZD`;
        // Update breakdown
        const breakdown = grandTotalElement.parentNode.nextElementSibling;
        if (breakdown) {
            breakdown.textContent = `Articles: ${itemsTotal.toLocaleString()} DZD | Charges: ${chargesTotal.toLocaleString()} DZD`;
        }
    }
}

function addItemRow() {
    itemCounter++;
    const container = document.getElementById('itemsContainer');
    const itemDiv = document.createElement('div');
    itemDiv.className = 'grid grid-cols-1 md:grid-cols-5 gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg';
    itemDiv.innerHTML = `
        <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nom du Produit *</label>
            <input type="text" name="product_name_${itemCounter}" required class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white">
        </div>
        <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Quantité *</label>
            <input type="number" name="quantity_${itemCounter}" required min="1" step="0.01" onchange="calculateItemTotal(${itemCounter})" oninput="calculateItemTotal(${itemCounter})" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white">
        </div>
        <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Prix Unitaire</label>
            <input type="number" name="unit_price_${itemCounter}" step="0.01" onchange="calculateItemTotal(${itemCounter})" oninput="calculateItemTotal(${itemCounter})" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white">
        </div>
        <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Prix Total</label>
            <input type="number" name="total_price_${itemCounter}" step="0.01" readonly class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
        </div>
        <div class="flex items-end">
            <button type="button" onclick="removeItem(this)" class="w-full btn-danger text-white px-3 py-2 rounded-lg">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
    container.appendChild(itemDiv);
}

function addChargeRow() {
    chargeCounter++;
    const container = document.getElementById('chargesContainer');
    const chargeDiv = document.createElement('div');
    chargeDiv.className = 'grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg';
    chargeDiv.innerHTML = `
        <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description *</label>
            <input type="text" name="charge_desc_${chargeCounter}" required class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white">
        </div>
        <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Montant *</label>
            <div class="flex">
                <input type="number" name="charge_amount_${chargeCounter}" required step="0.01" onchange="calculateGrandTotal()" oninput="calculateGrandTotal()" class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white">
                <button type="button" onclick="removeCharge(this)" class="btn-danger text-white px-3 py-2 rounded-r-lg">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `;
    container.appendChild(chargeDiv);
}

function removeItem(button) {
    button.closest('.grid').remove();
    calculateGrandTotal();
}

function removeCharge(button) {
    button.closest('.grid').remove();
    calculateGrandTotal();
}

async function saveBonLivraison(formData) {
    try {
        const response = await fetch(`http://${window.location.hostname}:8000/gestion/bon-livraison/create/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            const result = await response.json();
            showToast('Bon de livraison créé avec succès');
            document.getElementById('addBLModal').classList.add('hidden');
            document.getElementById('addBLForm').reset();
            document.getElementById('itemsContainer').innerHTML = '';
            document.getElementById('chargesContainer').innerHTML = '';
            // Remove grand total display
            const grandTotalDiv = document.getElementById('grandTotalDisplay')?.parentNode;
            if (grandTotalDiv) {
                grandTotalDiv.remove();
            }
            itemCounter = 0;
            chargeCounter = 0;
            loadBonLivraisons();
        } else {
            const error = await response.json();
            showToast(error.error || 'Erreur lors de la création', 'error');
        }
    } catch (error) {
        console.error('Error saving bon livraison:', error);
        showToast('Erreur lors de la sauvegarde', 'error');
    }
}

function viewBLDetails(blId) {
    const bl = blList.find(b => b.id === blId);
    if (!bl) return;

    const modal = document.getElementById('blDetailModal');
    const content = document.getElementById('blDetailContent');
    
    content.innerHTML = `
        <div class="space-y-6">
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <h4 class="font-semibold text-gray-900 dark:text-white mb-2">Informations Générales</h4>
                    <div class="space-y-2">
                        <p><span class="font-medium">N° BL:</span> ${bl.bl_number}</p>
                        <p><span class="font-medium">Projet:</span> ${bl.project_name}</p>
                        <p><span class="font-medium">Mode de Paiement:</span> ${bl.payment_method}</p>
                        <p><span class="font-medium">Date:</span> ${new Date(bl.created_at).toLocaleDateString()}</p>
                    </div>
                </div>
                <div>
                    <h4 class="font-semibold text-gray-900 dark:text-white mb-2">Adresses</h4>
                    <div class="space-y-2">
                        <p><span class="font-medium">Origine:</span> ${bl.origin_address}</p>
                        <p><span class="font-medium">Destination:</span> ${bl.destination_address}</p>
                        <p><span class="font-medium">Montant Total:</span> <span class="text-green-600 font-bold">${bl.total_amount ? parseFloat(bl.total_amount).toLocaleString() : '0'} DZD</span></p>
                    </div>
                </div>
            </div>

            ${bl.description ? `
            <div>
                <h4 class="font-semibold text-gray-900 dark:text-white mb-2">Description</h4>
                <p class="text-gray-600 dark:text-gray-400">${bl.description}</p>
            </div>
            ` : ''}

            ${bl.items && bl.items.length > 0 ? `
            <div>
                <h4 class="font-semibold text-gray-900 dark:text-white mb-2">Articles</h4>
                <div class="overflow-x-auto">
                    <table class="w-full text-sm">
                        <thead class="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th class="px-4 py-2 text-left">Produit</th>
                                <th class="px-4 py-2 text-left">Quantité</th>
                                <th class="px-4 py-2 text-left">Prix Unitaire</th>
                                <th class="px-4 py-2 text-left">Prix Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${bl.items.map(item => `
                                <tr class="border-b border-gray-200 dark:border-gray-600">
                                    <td class="px-4 py-2">${item.product_name}</td>
                                    <td class="px-4 py-2">${item.quantity}</td>
                                    <td class="px-4 py-2">${item.unit_price ? parseFloat(item.unit_price).toLocaleString() + ' DZD' : '-'}</td>
                                    <td class="px-4 py-2">${item.total_price ? parseFloat(item.total_price).toLocaleString() + ' DZD' : '-'}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
            ` : ''}

            ${bl.additional_charges && bl.additional_charges.length > 0 ? `
            <div>
                <h4 class="font-semibold text-gray-900 dark:text-white mb-2">Charges Additionnelles</h4>
                <div class="space-y-2">
                    ${bl.additional_charges.map(charge => `
                        <div class="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
                            <span>${charge.description}</span>
                            <span class="font-medium">${parseFloat(charge.amount).toLocaleString()} DZD</span>
                        </div>
                    `).join('')}
                </div>
            </div>
            ` : ''}
        </div>
    `;
    
    modal.classList.remove('hidden');
}

async function editBL(blId) {
    try {
        const bl = blList.find(b => b.id === blId);
        if (!bl) {
            showToast('Bon de livraison non trouvé', 'error');
            return;
        }

        // Reset form and counters
        document.getElementById('addBLForm').reset();
        document.getElementById('itemsContainer').innerHTML = '';
        document.getElementById('chargesContainer').innerHTML = '';
        const grandTotalDiv = document.getElementById('grandTotalDisplay')?.parentNode;
        if (grandTotalDiv) {
            grandTotalDiv.remove();
        }
        itemCounter = 0;
        chargeCounter = 0;

        // Set form mode to edit
        const modal = document.getElementById('addBLModal');
        const modalTitle = document.getElementById('addModalTitle');
        const saveBtn = document.getElementById('saveBLBtn');
        
        modalTitle.textContent = currentLanguage === 'ar' ? 'تعديل سند التسليم' : 'Modifier Bon de Livraison';
        saveBtn.textContent = currentLanguage === 'ar' ? 'تحديث' : 'Mettre à jour';
        saveBtn.setAttribute('data-edit-id', blId);

        // Populate basic fields
        document.getElementById('projectSelect').value = bl.project_id || '';
        document.getElementById('originAddress').value = bl.origin_address || '';
        document.getElementById('destinationAddress').value = bl.destination_address || '';
        document.getElementById('description').value = bl.description || '';
        document.getElementById('paymentMethod').value = bl.payment_method || '';
        document.getElementById('nomFournisseur').value = bl.nom_fournisseur || '';
        document.getElementById('banque').value = bl.banque || '';
        document.getElementById('numeroCheque').value = bl.numero_cheque || '';

        // Show/hide bank fields based on payment method
        const bankFields = document.getElementById('bankFields');
        const paymentMethod = bl.payment_method;
        if (paymentMethod === 'cheque' || paymentMethod === 'virement') {
            bankFields.classList.remove('hidden');
        } else {
            bankFields.classList.add('hidden');
        }

        // Populate items
        if (bl.items && bl.items.length > 0) {
            bl.items.forEach(item => {
                itemCounter++;
                const container = document.getElementById('itemsContainer');
                const itemDiv = document.createElement('div');
                itemDiv.className = 'grid grid-cols-1 md:grid-cols-5 gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg';
                itemDiv.innerHTML = `
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nom du Produit *</label>
                        <input type="text" name="product_name_${itemCounter}" value="${item.product_name || ''}" required class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Quantité *</label>
                        <input type="number" name="quantity_${itemCounter}" value="${item.quantity || ''}" required min="1" step="0.01" onchange="calculateItemTotal(${itemCounter})" oninput="calculateItemTotal(${itemCounter})" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Prix Unitaire</label>
                        <input type="number" name="unit_price_${itemCounter}" value="${item.unit_price || ''}" step="0.01" onchange="calculateItemTotal(${itemCounter})" oninput="calculateItemTotal(${itemCounter})" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Prix Total</label>
                        <input type="number" name="total_price_${itemCounter}" value="${item.total_price || ''}" step="0.01" readonly class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                    </div>
                    <div class="flex items-end">
                        <button type="button" onclick="removeItem(this)" class="w-full btn-danger text-white px-3 py-2 rounded-lg">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `;
                container.appendChild(itemDiv);
            });
        } else {
            // Add one empty item if no items exist
            addItemRow();
        }

        // Populate additional charges
        if (bl.additional_charges && bl.additional_charges.length > 0) {
            bl.additional_charges.forEach(charge => {
                chargeCounter++;
                const container = document.getElementById('chargesContainer');
                const chargeDiv = document.createElement('div');
                chargeDiv.className = 'grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg';
                chargeDiv.innerHTML = `
                    <div class="md:col-span-2">
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description *</label>
                        <input type="text" name="charge_desc_${chargeCounter}" value="${charge.description || ''}" required class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Montant *</label>
                        <div class="flex">
                            <input type="number" name="charge_amount_${chargeCounter}" value="${charge.amount || ''}" required step="0.01" onchange="calculateGrandTotal()" oninput="calculateGrandTotal()" class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white">
                            <button type="button" onclick="removeCharge(this)" class="btn-danger text-white px-3 py-2 rounded-r-lg">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                `;
                container.appendChild(chargeDiv);
            });
        }

        // Calculate initial grand total
        setTimeout(calculateGrandTotal, 100);

        // Show modal
        modal.classList.remove('hidden');

    } catch (error) {
        console.error('Error editing BL:', error);
        const errorMessage = currentLanguage === 'ar' ? 'خطأ في تحميل البيانات' : 'Erreur lors du chargement des données';
        showToast(errorMessage, 'error');
    }
}
async function updateBonLivraison(blId, formData) {
    try {
        const response = await fetch(`http://${window.location.hostname}:8000/gestion/bon-livraison/${blId}/update/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            const result = await response.json();
            const successMessage = currentLanguage === 'ar' ? 'تم تحديث سند التسليم بنجاح' : 'Bon de livraison mis à jour avec succès';
            showToast(successMessage);
            
            // Close modal and reset
            document.getElementById('addBLModal').classList.add('hidden');
            document.getElementById('addBLForm').reset();
            document.getElementById('itemsContainer').innerHTML = '';
            document.getElementById('chargesContainer').innerHTML = '';
            
            // Remove grand total display
            const grandTotalDiv = document.getElementById('grandTotalDisplay')?.parentNode;
            if (grandTotalDiv) {
                grandTotalDiv.remove();
            }
            
            // Reset form to create mode
            const modalTitle = document.getElementById('addModalTitle');
            const saveBtn = document.getElementById('saveBLBtn');
            modalTitle.textContent = currentLanguage === 'ar' ? 'سند تسليم جديد' : 'Nouveau Bon de Livraison';
            saveBtn.textContent = currentLanguage === 'ar' ? 'حفظ' : 'Enregistrer';
            saveBtn.removeAttribute('data-edit-id');
            
            itemCounter = 0;
            chargeCounter = 0;
            
            // Reload data
            loadBonLivraisons();
        } else {
            const error = await response.json();
            const errorMessage = currentLanguage === 'ar' ? 'خطأ في التحديث' : 'Erreur lors de la mise à jour';
            showToast(error.error || errorMessage, 'error');
        }
    } catch (error) {
        console.error('Error updating bon livraison:', error);
        const errorMessage = currentLanguage === 'ar' ? 'خطأ في الاتصال' : 'Erreur de connexion';
        showToast(errorMessage, 'error');
    }
}


async function deleteBL(blId) {
    const bl = blList.find(b => b.id === blId);
    const blNumber = bl ? bl.bl_number : `ID ${blId}`;
    
    const confirmTitle = currentLanguage === 'ar' ? 'هل أنت متأكد؟' : 'Êtes-vous sûr?';
    const confirmText = currentLanguage === 'ar' ? 
        `سيتم حذف سند التسليم ${blNumber} نهائياً!` : 
        `Le bon de livraison ${blNumber} sera supprimé définitivement!`;
    const confirmButton = currentLanguage === 'ar' ? 'نعم، احذف' : 'Oui, supprimer';
    const cancelButton = currentLanguage === 'ar' ? 'إلغاء' : 'Annuler';

    const result = await Swal.fire({
        title: confirmTitle,
        text: confirmText,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#6b7280',
        confirmButtonText: confirmButton,
        cancelButtonText: cancelButton,
        reverseButtons: currentLanguage === 'ar'
    });

    if (result.isConfirmed) {
        try {
            const response = await fetch(`http://${window.location.hostname}:8000/gestion/bon-livraison/${blId}/delete/`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                }
            });

            if (response.ok) {
                const result = await response.json();
                const successMessage = currentLanguage === 'ar' ? 
                    `تم حذف سند التسليم ${blNumber} بنجاح` : 
                    `Bon de livraison ${blNumber} supprimé avec succès`;
                
                showToast(successMessage);
                
                // Reload the list
                loadBonLivraisons();
                
                // Show success alert
                Swal.fire({
                    title: currentLanguage === 'ar' ? 'تم الحذف!' : 'Supprimé!',
                    text: result.message,
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false
                });
            } else {
                const error = await response.json();
                const errorMessage = currentLanguage === 'ar' ? 'خطأ في الحذف' : 'Erreur lors de la suppression';
                showToast(error.error || errorMessage, 'error');
            }
        } catch (error) {
            console.error('Error deleting BL:', error);
            const errorMessage = currentLanguage === 'ar' ? 'خطأ في الاتصال' : 'Erreur de connexion';
            showToast(errorMessage, 'error');
        }
    }
}
async function downloadBLPDF(blId) {
    try {
        // Show loading state
        const downloadBtn = document.querySelector(`button[onclick="downloadBLPDF(${blId})"]`);
        const originalHTML = downloadBtn.innerHTML;
        downloadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        downloadBtn.disabled = true;

        // Make request to PDF generation endpoint
        const response = await fetch(`http://${window.location.hostname}:8000/gestion/bon-livraison/${blId}/pdf/`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            },
        });

        if (response.ok) {
            // Get the blob data
            const blob = await response.blob();
            
            // Get filename from response headers or create default
            const contentDisposition = response.headers.get('Content-Disposition');
            let filename = `BL_${blId}.pdf`;
            
            if (contentDisposition) {
                const filenameMatch = contentDisposition.match(/filename="(.+)"/);
                if (filenameMatch) {
                    filename = filenameMatch[1];
                }
            }

            // Create download link
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = filename;
            
            // Trigger download
            document.body.appendChild(a);
            a.click();
            
            // Cleanup
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            
            // Show success message based on current language
            const successMessage = currentLanguage === 'ar' ? 'تم تنزيل PDF بنجاح' : 'PDF téléchargé avec succès';
            showToast(successMessage);
        } else {
            const errorData = await response.json().catch(() => ({}));
            const errorMessage = currentLanguage === 'ar' ? 'خطأ في إنشاء PDF' : 'Erreur lors de la génération du PDF';
            throw new Error(errorData.error || errorMessage);
        }
    } catch (error) {
        console.error('Error downloading PDF:', error);
        const errorMessage = currentLanguage === 'ar' ? 
            'خطأ في تنزيل PDF' : 
            'Erreur lors du téléchargement du PDF';
        showToast(error.message || errorMessage, 'error');
    } finally {
        // Restore button state
        const downloadBtn = document.querySelector(`button[onclick="downloadBLPDF(${blId})"]`);
        if (downloadBtn) {
            downloadBtn.innerHTML = originalHTML;
            downloadBtn.disabled = false;
        }
    }
}

function filterBonLivraisons() {
    const projectFilter = document.getElementById('projectFilter').value;
    const searchFilter = document.getElementById('searchFilter').value.toLowerCase();
    
    let filtered = blList;
    
    if (projectFilter) {
        filtered = filtered.filter(bl => bl.project_name.includes(projectFilter));
    }
    
    if (searchFilter) {
        filtered = filtered.filter(bl => 
            bl.bl_number.toLowerCase().includes(searchFilter) ||
            bl.description.toLowerCase().includes(searchFilter) ||
            bl.origin_address.toLowerCase().includes(searchFilter) ||
            bl.destination_address.toLowerCase().includes(searchFilter)
        );
    }
    
    displayBonLivraisons(filtered);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        document.getElementById('loadingState').style.display = 'none';
        document.getElementById('mainContent').classList.remove('hidden');
    }, 1500);

    loadProjects();
    loadBonLivraisons();
    updateLanguage();
});

// Language toggle
document.getElementById('languageToggle').addEventListener('click', function() {
    currentLanguage = currentLanguage === 'fr' ? 'ar' : 'fr';
    updateLanguage();
});

// Dark mode toggle
document.getElementById('darkModeToggle').addEventListener('click', function() {
    document.documentElement.classList.toggle('dark');
});

// Back button
document.getElementById('backBtn').addEventListener('click', function() {
    window.history.back();
});

// Add BL Modal
document.getElementById('addBLBtn').addEventListener('click', function() {
    document.getElementById('addBLModal').classList.remove('hidden');
    addItemRow(); // Add first item row by default
});

document.getElementById('addFirstBLBtn').addEventListener('click', function() {
    document.getElementById('addBLModal').classList.remove('hidden');
    addItemRow();
});

document.getElementById('closeAddModal').addEventListener('click', function() {
    document.getElementById('addBLModal').classList.add('hidden');
    // Reset form and remove grand total display
    document.getElementById('addBLForm').reset();
    document.getElementById('itemsContainer').innerHTML = '';
    document.getElementById('chargesContainer').innerHTML = '';
    const grandTotalDiv = document.getElementById('grandTotalDisplay')?.parentNode;
    if (grandTotalDiv) {
        grandTotalDiv.remove();
    }
    itemCounter = 0;
    chargeCounter = 0;
});

document.getElementById('cancelAdd').addEventListener('click', function() {
    document.getElementById('addBLModal').classList.add('hidden');
    // Reset form and remove grand total display
    document.getElementById('addBLForm').reset();
    document.getElementById('itemsContainer').innerHTML = '';
    document.getElementById('chargesContainer').innerHTML = '';
    const grandTotalDiv = document.getElementById('grandTotalDisplay')?.parentNode;
    if (grandTotalDiv) {
        grandTotalDiv.remove();
    }
    itemCounter = 0;
    chargeCounter = 0;
});

// Close detail modal
document.getElementById('closeDetailModal').addEventListener('click', function() {
    document.getElementById('blDetailModal').classList.add('hidden');
});

// Add item/charge buttons
document.getElementById('addItemBtn').addEventListener('click', addItemRow);
document.getElementById('addChargeBtn').addEventListener('click', addChargeRow);

// Payment method change
document.getElementById('paymentMethod').addEventListener('change', function() {
    const bankFields = document.getElementById('bankFields');
    if (this.value === 'cheque' || this.value === 'virement') {
        bankFields.classList.remove('hidden');
    } else {
        bankFields.classList.add('hidden');
    }
});

// Form submission
document.getElementById('addBLForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const saveBtn = document.getElementById('saveBLBtn');
    const editId = saveBtn.getAttribute('data-edit-id');
    const isEdit = editId !== null;
    
    const formData = new FormData(e.target);
    const data = {
        origin_address: formData.get('origin_address'),
        destination_address: formData.get('destination_address'),
        description: formData.get('description') || '',
        payment_method: formData.get('payment_method'),
        nom_fournisseur: formData.get('nom_fournisseur') || '',
        banque: formData.get('banque') || '',
        numero_cheque: formData.get('numero_cheque') || '',
        items: [],
        additional_charges: []
    };

    // Only include project_id for create operations
    if (!isEdit) {
        data.project_id = formData.get('project');
    }

    // Collect items
    for (let i = 1; i <= itemCounter; i++) {
        const productName = document.querySelector(`[name="product_name_${i}"]`);
        const quantity = document.querySelector(`[name="quantity_${i}"]`);
        const unitPrice = document.querySelector(`[name="unit_price_${i}"]`);
        const totalPrice = document.querySelector(`[name="total_price_${i}"]`);
        
        if (productName && productName.value && quantity && quantity.value) {
            data.items.push({
                product_name: productName.value,
                quantity: parseFloat(quantity.value),
                unit_price: unitPrice?.value ? parseFloat(unitPrice.value) : null,
                total_price: totalPrice?.value ? parseFloat(totalPrice.value) : null
            });
        }
    }

    // Collect charges
    for (let i = 1; i <= chargeCounter; i++) {
        const desc = document.querySelector(`[name="charge_desc_${i}"]`);
        const amount = document.querySelector(`[name="charge_amount_${i}"]`);
        
        if (desc && desc.value && amount && amount.value) {
            data.additional_charges.push({
                description: desc.value,
                amount: parseFloat(amount.value)
            });
        }
    }

    // Calculate total amount from grand total display
    const grandTotalElement = document.getElementById('grandTotalDisplay');
    if (grandTotalElement) {
        const totalText = grandTotalElement.textContent.replace(/[^\d.,]/g, '').replace(',', '');
        data.total_amount = parseFloat(totalText) || 0;
    }

    // Call appropriate function based on mode
    if (isEdit) {
        updateBonLivraison(editId, data);
    } else {
        saveBonLivraison(data);
    }
});
// Filters
document.getElementById('projectFilter').addEventListener('change', filterBonLivraisons);
document.getElementById('searchFilter').addEventListener('input', filterBonLivraisons);

document.getElementById('resetFiltersBtn').addEventListener('click', function() {
    document.getElementById('projectFilter').value = '';
    document.getElementById('searchFilter').value = '';
    displayBonLivraisons(blList);
});

// Fix form field names
document.getElementById('projectSelect').setAttribute('name', 'project');
document.getElementById('paymentMethod').setAttribute('name', 'payment_method');
document.getElementById('originAddress').setAttribute('name', 'origin_address');
document.getElementById('destinationAddress').setAttribute('name', 'destination_address');
document.getElementById('description').setAttribute('name', 'description');
document.getElementById('nomFournisseur').setAttribute('name', 'nom_fournisseur');
document.getElementById('banque').setAttribute('name', 'banque');
document.getElementById('numeroCheque').setAttribute('name', 'numero_cheque');

// Global functions for window access
window.calculateItemTotal = calculateItemTotal;
window.calculateGrandTotal = calculateGrandTotal;
window.removeItem = removeItem;
window.removeCharge = removeCharge;
window.viewBLDetails = viewBLDetails;
window.editBL = editBL;
window.deleteBL = deleteBL;
window.downloadBLPDF = downloadBLPDF;