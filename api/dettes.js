let allDettes = [];
        let filteredDettes = [];
        let isDarkMode = localStorage.getItem('darkMode') === 'true';
        let currentLanguage = localStorage.getItem('language') || 'fr';

        const translations = {
            fr: {
                title: "Gestion des Dettes",
                subtitle: "Suivi et gestion de toutes vos dettes",
                totalDebts: "Total Dettes",
                remainingAmount: "Montant Restant",
                activeDebts: "Dettes Actives",
                completedDebts: "Dettes Complétées",
                newDebt: "Nouvelle Dette",
                exportPdf: "Export PDF",
                filters: "Filtres",
                reset: "Réinitialiser",
                allStatuses: "Tous les statuts",
                active: "Actives",
                completed: "Complétées",
                creditor: "Créditeur",
                creditorName: "Nom du Créditeur",
                originalAmount: "Montant Original",
                remainingAmountLabel: "Montant Restant",
                progress: "Progression",
                status: "Statut",
                creationDate: "Date Création",
                actions: "Actions",
                noDebtFound: "Aucune dette trouvée",
                startAdding: "Commencez par ajouter votre première dette",
                addDebt: "Ajouter une dette",
                amount: "Montant",
                description: "Description",
                save: "Enregistrer",
                cancel: "Annuler",
                debtDetails: "Détails de la Dette",
                generalInfo: "Informations Générales",
                none: "Aucun",
                totalPaid: "Total Payé",
                paymentHistory: "Historique des Paiements",
                newPayment: "Nouveau Paiement",
                noPayments: "Aucun paiement effectué",
                paymentAmount: "Montant à Payer",
                paymentMode: "Mode de Paiement",
                select: "Sélectionner...",
                cash: "Espèces",
                check: "Chèque",
                transfer: "Virement",
                other: "Autre",
                supplierName: "Nom Fournisseur",
                bank: "Banque",
                checkNumber: "Numéro Chèque",
                proofFile: "Fichier Preuve (Optionnel)",
                makePayment: "Effectuer Paiement",
                mode: "Mode",
                supplier: "Fournisseur",
                createdBy: "Créé par",
                unknown: "Inconnu",
                debtCreated: "Dette créée avec succès",
                paymentMade: "Paiement effectué avec succès",
                loadingError: "Erreur lors du chargement des dettes",
                connectionError: "Erreur de connexion",
                creationError: "Erreur lors de la création",
                detailsError: "Erreur lors du chargement des détails",
                paymentError: "Erreur lors du paiement"
            },
            ar: {
                title: "إدارة الديون",
                subtitle: "تتبع وإدارة جميع ديونك",
                totalDebts: "إجمالي الديون",
                remainingAmount: "المبلغ المتبقي",
                activeDebts: "الديون النشطة",
                completedDebts: "الديون المكتملة",
                newDebt: "دين جديد",
                exportPdf: "تصدير PDF",
                filters: "المرشحات",
                reset: "إعادة تعيين",
                allStatuses: "جميع الحالات",
                active: "نشط",
                completed: "مكتمل",
                creditor: "الدائن",
                creditorName: "اسم الدائن",
                originalAmount: "المبلغ الأصلي",
                remainingAmountLabel: "المبلغ المتبقي",
                progress: "التقدم",
                status: "الحالة",
                creationDate: "تاريخ الإنشاء",
                actions: "الإجراءات",
                noDebtFound: "لا توجد ديون",
                startAdding: "ابدأ بإضافة أول دين لك",
                addDebt: "إضافة دين",
                amount: "المبلغ",
                description: "الوصف",
                save: "حفظ",
                cancel: "إلغاء",
                debtDetails: "تفاصيل الدين",
                generalInfo: "معلومات عامة",
                none: "لا يوجد",
                totalPaid: "إجمالي المدفوع",
                paymentHistory: "تاريخ المدفوعات",
                newPayment: "دفعة جديدة",
                noPayments: "لم يتم دفع أي مبلغ",
                paymentAmount: "مبلغ الدفع",
                paymentMode: "طريقة الدفع",
                select: "اختر...",
                cash: "نقدي",
                check: "شيك",
                transfer: "تحويل",
                other: "أخرى",
                supplierName: "اسم المورد",
                bank: "البنك",
                checkNumber: "رقم الشيك",
                proofFile: "ملف الإثبات (اختياري)",
                makePayment: "تنفيذ الدفعة",
                mode: "الطريقة",
                supplier: "المورد",
                createdBy: "أنشأ بواسطة",
                unknown: "غير معروف",
                debtCreated: "تم إنشاء الدين بنجاح",
                paymentMade: "تم الدفع بنجاح",
                loadingError: "خطأ في تحميل الديون",
                connectionError: "خطأ في الاتصال",
                creationError: "خطأ في الإنشاء",
                detailsError: "خطأ في تحميل التفاصيل",
                paymentError: "خطأ في الدفع"
            }
        };

        function t(key) {
            return translations[currentLanguage][key] || key;
        }

        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        }

        document.addEventListener('DOMContentLoaded', function() {
            applyLanguageDirection();
            initializeEventListeners();
            updateUI();
            loadDettes();
        });

        function applyLanguageDirection() {
            document.documentElement.setAttribute('dir', currentLanguage === 'ar' ? 'rtl' : 'ltr');
            document.documentElement.setAttribute('lang', currentLanguage);
        }

        function initializeEventListeners() {
            document.getElementById('darkModeToggle').addEventListener('click', toggleDarkMode);
            document.getElementById('languageToggle').addEventListener('click', toggleLanguage);
            document.getElementById('backBtn').addEventListener('click', () => window.history.back());
            
            document.getElementById('addDetteBtn').addEventListener('click', showAddDetteModal);
            document.getElementById('addFirstDetteBtn').addEventListener('click', showAddDetteModal);
            document.getElementById('closeAddModal').addEventListener('click', hideAddDetteModal);
            document.getElementById('cancelAdd').addEventListener('click', hideAddDetteModal);
            
            document.getElementById('closeDetailModal').addEventListener('click', hideDetteDetailModal);
            document.getElementById('closePaymentModal').addEventListener('click', hidePaymentModal);
            document.getElementById('cancelPayment').addEventListener('click', hidePaymentModal);
            
            document.getElementById('addDetteForm').addEventListener('submit', handleAddDette);
            document.getElementById('paymentForm').addEventListener('submit', handlePayment);
            
            document.getElementById('statusFilter').addEventListener('change', applyFilters);
            document.getElementById('creditorFilter').addEventListener('input', applyFilters);
            document.getElementById('resetFiltersBtn').addEventListener('click', resetFilters);
            
            document.getElementById('paymentMode').addEventListener('change', toggleBankFields);
        }

        function toggleLanguage() {
            currentLanguage = currentLanguage === 'fr' ? 'ar' : 'fr';
            localStorage.setItem('language', currentLanguage);
            applyLanguageDirection();
            updateUI();
            renderDettes();
        }

        function updateUI() {
            document.getElementById('mainTitle').textContent = t('title');
            document.getElementById('mainSubtitle').textContent = t('subtitle');
            document.getElementById('totalDettesLabel').textContent = t('totalDebts');
            document.getElementById('totalRemainingLabel').textContent = t('remainingAmount');
            document.getElementById('activeDettesLabel').textContent = t('activeDebts');
            document.getElementById('completedDettesLabel').textContent = t('completedDebts');
            document.getElementById('newDebtBtn').innerHTML = `<i class="fas fa-plus mr-1"></i>${t('newDebt')}`;
            document.getElementById('filtersTitle').innerHTML = `<i class="fas fa-filter text-red-500 mr-2"></i>${t('filters')}`;
            document.getElementById('resetBtn').innerHTML = `<i class="fas fa-refresh mr-1"></i>${t('reset')}`;
            
            document.getElementById('statusFilterLabel').textContent = t('status');
            document.getElementById('creditorFilterLabel').textContent = t('creditor');
            
            const statusOptions = document.querySelectorAll('#statusFilter option');
            statusOptions[0].textContent = t('allStatuses');
            statusOptions[1].textContent = t('active');
            statusOptions[2].textContent = t('completed');
            
            document.getElementById('creditorFilter').placeholder = t('creditorName') + '...';
            
            const tableHeaders = document.querySelectorAll('thead th');
            if (tableHeaders.length >= 6) {
                tableHeaders[0].textContent = t('creditor');
                tableHeaders[1].textContent = t('originalAmount');
                tableHeaders[2].textContent = t('remainingAmountLabel');
                tableHeaders[3].textContent = t('progress');
                tableHeaders[4].textContent = t('status');
                tableHeaders[5].textContent = t('creationDate');
                tableHeaders[6].textContent = t('actions');
            }
            
            document.getElementById('emptyStateTitle').textContent = t('noDebtFound');
            document.getElementById('emptyStateDesc').textContent = t('startAdding');
            document.getElementById('emptyStateBtn').innerHTML = `<i class="fas fa-plus mr-2"></i>${t('addDebt')}`;
            
            document.getElementById('addModalTitle').textContent = t('newDebt');
            document.getElementById('creditorNameLabel').textContent = t('creditorName') + ' *';
            document.getElementById('amountLabel').textContent = t('amount') + ' (DZD) *';
            document.getElementById('descriptionLabel').textContent = t('description');
            document.getElementById('saveBtn').innerHTML = `<i class="fas fa-save mr-2"></i>${t('save')}`;
            document.getElementById('cancelBtn').innerHTML = `<i class="fas fa-times mr-2"></i>${t('cancel')}`;
            
            document.getElementById('detailModalTitle').textContent = t('debtDetails');
            document.getElementById('paymentModalTitle').textContent = t('newPayment');
            document.getElementById('paymentAmountLabel').textContent = t('paymentAmount') + ' (DZD) *';
            document.getElementById('paymentModeLabel').textContent = t('paymentMode') + ' *';
            
            const paymentOptions = document.querySelectorAll('#paymentMode option');
            if (paymentOptions.length >= 5) {
                paymentOptions[0].textContent = t('select');
                paymentOptions[1].textContent = t('cash');
                paymentOptions[2].textContent = t('check');
                paymentOptions[3].textContent = t('transfer');
                paymentOptions[4].textContent = t('other');
            }
            
            document.getElementById('supplierNameLabel').textContent = t('supplierName');
            document.getElementById('bankLabel').textContent = t('bank');
            document.getElementById('checkNumberLabel').textContent = t('checkNumber');
            document.getElementById('paymentDescLabel').textContent = t('description');
            document.getElementById('proofFileLabel').textContent = t('proofFile');
            document.getElementById('makePaymentBtn').innerHTML = `<i class="fas fa-save mr-2"></i>${t('makePayment')}`;
            document.getElementById('cancelPaymentBtn').innerHTML = `<i class="fas fa-times mr-2"></i>${t('cancel')}`;
        }

        function toggleDarkMode() {
            isDarkMode = !isDarkMode;
            localStorage.setItem('darkMode', isDarkMode);
            document.documentElement.classList.toggle('dark', isDarkMode);
        }

        async function loadDettes() {
            try {
                showLoading();
                const response = await fetch('http://127.0.0.1:8000/gestion/dettes/', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                    }
                });
                
                if (response.ok) {
                    allDettes = await response.json();
                    filteredDettes = [...allDettes];
                    renderDettes();
                    updateStatistics();
                    hideLoading();
                } else {
                    showError(t('loadingError'));
                    hideLoading();
                }
            } catch (error) {
                showError(t('connectionError'));
                hideLoading();
            }
        }

        function renderDettes() {
            const dettesList = document.getElementById('dettesList');
            const emptyState = document.getElementById('emptyState');

            if (filteredDettes.length === 0) {
                dettesList.innerHTML = '';
                emptyState.classList.remove('hidden');
                return;
            }

            emptyState.classList.add('hidden');
            dettesList.innerHTML = filteredDettes.map(dette => {
                const progress = ((dette.original_amount - dette.remaining_amount) / dette.original_amount) * 100;
                const statusClass = dette.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800';
                const statusIcon = dette.status === 'completed' ? 'fa-check-circle' : 'fa-clock';
                const statusText = dette.status === 'completed' ? t('completed') : t('active');
                
                return `
                    <tr class="dette-row">
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="text-sm font-medium text-gray-900 dark:text-white">${dette.creditor_name}</div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="text-sm font-medium text-gray-900 dark:text-white">${formatCurrency(dette.original_amount)}</div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="text-sm font-medium text-gray-900 dark:text-white">${formatCurrency(dette.remaining_amount)}</div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-1">
                                <div class="progress-bar h-2 rounded-full" style="width: ${progress}%"></div>
                            </div>
                            <div class="text-xs text-gray-500">${Math.round(progress)}%</div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClass}">
                                <i class="fas ${statusIcon} mr-1"></i>
                                ${statusText}
                            </span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            ${formatDate(dette.date_created)}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div class="flex space-x-2">
                                <button onclick="showDetteDetail(${dette.id})" class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300" title="${t('debtDetails')}">
                                    <i class="fas fa-eye"></i>
                                </button>
                                <button onclick="generatePDF(${dette.id})" class="text-orange-600 hover:text-orange-900 dark:text-orange-400 dark:hover:text-orange-300" title="${t('exportPdf')}">
                                    <i class="fas fa-file-pdf"></i>
                                </button>
                                ${dette.status === 'active' ? `
                                    <button onclick="showPaymentModal(${dette.id}, ${dette.remaining_amount})" class="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300" title="${t('newPayment')}">
                                        <i class="fas fa-money-bill"></i>
                                    </button>
                                ` : ''}
                            </div>
                        </td>
                    </tr>
                `;
            }).join('');
        }

        async function generatePDF(detteId) {
            try {
                const response = await fetch(`http://127.0.0.1:8000/gestion/dettes/${detteId}/`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                    }
                });

                if (response.ok) {
                    const dette = await response.json();
                    const pdfResponse = await fetch(`http://127.0.0.1:8000/gestion/dettes/${detteId}/journal/pdf/`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                        }
                    });

                    if (pdfResponse.ok) {
                        const blob = await pdfResponse.blob();
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.style.display = 'none';
                        a.href = url;
                        a.download = `dette_${dette.creditor_name}_${new Date().toISOString().split('T')[0]}.pdf`;
                        document.body.appendChild(a);
                        a.click();
                        window.URL.revokeObjectURL(url);
                        document.body.removeChild(a);
                    } else {
                        showError('Erreur lors de la génération du PDF');
                    }
                } else {
                    showError(t('detailsError'));
                }
            } catch (error) {
                showError(t('connectionError'));
            }
        }

        function updateStatistics() {
            const totalDettes = allDettes.reduce((sum, dette) => sum + parseFloat(dette.original_amount), 0);
            const totalRemaining = allDettes.reduce((sum, dette) => sum + parseFloat(dette.remaining_amount), 0);
            const activeDettes = allDettes.filter(dette => dette.status === 'active').length;
            const completedDettes = allDettes.filter(dette => dette.status === 'completed').length;

            document.getElementById('totalDettes').textContent = formatCurrency(totalDettes);
            document.getElementById('totalRemaining').textContent = formatCurrency(totalRemaining);
            document.getElementById('activeDettes').textContent = activeDettes;
            document.getElementById('completedDettes').textContent = completedDettes;
        }

        function applyFilters() {
            const statusFilter = document.getElementById('statusFilter').value;
            const creditorFilter = document.getElementById('creditorFilter').value.toLowerCase();

            filteredDettes = allDettes.filter(dette => {
                const matchesStatus = !statusFilter || dette.status === statusFilter;
                const matchesCreditor = !creditorFilter || dette.creditor_name.toLowerCase().includes(creditorFilter);

                return matchesStatus && matchesCreditor;
            });

            renderDettes();
        }

        function resetFilters() {
            document.getElementById('statusFilter').value = '';
            document.getElementById('creditorFilter').value = '';
            filteredDettes = [...allDettes];
            renderDettes();
        }

        function showAddDetteModal() {
            document.getElementById('addDetteModal').classList.remove('hidden');
        }

        function hideAddDetteModal() {
            document.getElementById('addDetteModal').classList.add('hidden');
            document.getElementById('addDetteForm').reset();
        }

        async function handleAddDette(e) {
            e.preventDefault();
            
            const formData = {
                creditor_name: document.getElementById('creditorName').value,
                original_amount: document.getElementById('originalAmount').value,
                description: document.getElementById('description').value
            };

            try {
                const response = await fetch('http://127.0.0.1:8000/gestion/dettes/create/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                    },
                    body: JSON.stringify(formData)
                });

                if (response.ok) {
                    showSuccess(t('debtCreated'));
                    hideAddDetteModal();
                    loadDettes();
                } else {
                    const error = await response.json();
                    showError(error.error || t('creationError'));
                }
            } catch (error) {
                showError(t('connectionError'));
            }
        }

        async function showDetteDetail(detteId) {
            try {
                const response = await fetch(`http://127.0.0.1:8000/gestion/dettes/${detteId}/`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                    }
                });

                if (response.ok) {
                    const dette = await response.json();
                    renderDetteDetail(dette);
                    document.getElementById('detteDetailModal').classList.remove('hidden');
                } else {
                    showError(t('detailsError'));
                }
            } catch (error) {
                showError(t('connectionError'));
            }
        }

        function renderDetteDetail(dette) {
            const progress = ((dette.original_amount - dette.remaining_amount) / dette.original_amount) * 100;
            const totalPaid = dette.original_amount - dette.remaining_amount;
            const statusClass = dette.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800';
            const statusIcon = dette.status === 'completed' ? 'fa-check-circle' : 'fa-clock';
            const statusText = dette.status === 'completed' ? t('completed') : t('active');

            const detailContent = `
                <div class="space-y-6">
                    <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                        <h4 class="font-semibold text-gray-900 dark:text-white mb-3">${t('generalInfo')}</h4>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <p class="text-sm text-gray-600 dark:text-gray-400">${t('creditor')}</p>
                                <p class="font-medium text-gray-900 dark:text-white">${dette.creditor_name}</p>
                            </div>
                            <div>
                                <p class="text-sm text-gray-600 dark:text-gray-400">${t('originalAmount')}</p>
                                <p class="font-medium text-gray-900 dark:text-white">${formatCurrency(dette.original_amount)}</p>
                            </div>
                            <div>
                                <p class="text-sm text-gray-600 dark:text-gray-400">${t('remainingAmountLabel')}</p>
                                <p class="font-medium text-red-600">${formatCurrency(dette.remaining_amount)}</p>
                            </div>
                            <div>
                                <p class="text-sm text-gray-600 dark:text-gray-400">${t('totalPaid')}</p>
                                <p class="font-medium text-green-600">${formatCurrency(totalPaid)}</p>
                            </div>
                            <div>
                                <p class="text-sm text-gray-600 dark:text-gray-400">${t('status')}</p>
                                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClass}">
                                    <i class="fas ${statusIcon} mr-1"></i>
                                    ${statusText}
                                </span>
                            </div>
                        </div>
                        ${dette.description ? `
                            <div class="mt-4">
                                <p class="text-sm text-gray-600 dark:text-gray-400">${t('description')}</p>
                                <p class="text-gray-900 dark:text-white">${dette.description}</p>
                            </div>
                        ` : ''}
                    </div>

                    <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                        <h4 class="font-semibold text-gray-900 dark:text-white mb-3">${t('progress')}</h4>
                        <div class="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-4 mb-2">
                            <div class="progress-bar h-4 rounded-full" style="width: ${progress}%"></div>
                        </div>
                        <p class="text-sm text-gray-600 dark:text-gray-400">${Math.round(progress)}% ${currentLanguage === 'fr' ? 'payé' : 'مدفوع'}</p>
                    </div>

                    <div>
                        <div class="flex justify-between items-center mb-4">
                            <h4 class="font-semibold text-gray-900 dark:text-white">${t('paymentHistory')}</h4>
                            ${dette.status === 'active' ? `
                                <button onclick="showPaymentModal(${dette.id}, ${dette.remaining_amount})" class="btn-success text-white px-3 py-1 rounded text-sm">
                                    <i class="fas fa-plus mr-1"></i>${t('newPayment')}
                                </button>
                            ` : ''}
                        </div>
                        
                        ${dette.payments && dette.payments.length > 0 ? `
                            <div class="space-y-3">
                                ${dette.payments.map(payment => `
                                    <div class="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                                        <div class="flex justify-between items-start">
                                            <div class="flex-1">
                                                <div class="flex items-center space-x-2 mb-2">
                                                    <span class="font-medium text-green-600">${formatCurrency(payment.amount_paid)}</span>
                                                    <span class="text-sm text-gray-500">${formatDate(payment.payment_date)}</span>
                                                </div>
                                                <div class="text-sm text-gray-600 dark:text-gray-400">
                                                    <p><strong>${t('mode')}:</strong> ${payment.mode_paiement || t('none')}</p>
                                                    ${payment.nom_fournisseur ? `<p><strong>${t('supplier')}:</strong> ${payment.nom_fournisseur}</p>` : ''}
                                                    ${payment.banque ? `<p><strong>${t('bank')}:</strong> ${payment.banque}</p>` : ''}
                                                    ${payment.numero_cheque ? `<p><strong>${t('checkNumber')}:</strong> ${payment.numero_cheque}</p>` : ''}
                                                    ${payment.description ? `<p><strong>${t('description')}:</strong> ${payment.description}</p>` : ''}
                                                    <p><strong>${t('createdBy')}:</strong> ${payment.created_by || t('unknown')}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        ` : `
                            <div class="text-center py-8 text-gray-500 dark:text-gray-400">
                                <i class="fas fa-money-bill text-4xl mb-2"></i>
                                <p>${t('noPayments')}</p>
                            </div>
                        `}
                    </div>
                </div>
            `;

            document.getElementById('detteDetailContent').innerHTML = detailContent;
        }

        function hideDetteDetailModal() {
            document.getElementById('detteDetailModal').classList.add('hidden');
        }

        function showPaymentModal(detteId, remainingAmount) {
            document.getElementById('paymentDetteId').value = detteId;
            document.getElementById('remainingAmountDisplay').textContent = formatCurrency(remainingAmount);
            document.getElementById('paymentAmount').max = remainingAmount;
            document.getElementById('paymentModal').classList.remove('hidden');
        }

        function hidePaymentModal() {
            document.getElementById('paymentModal').classList.add('hidden');
            document.getElementById('paymentForm').reset();
            document.getElementById('bankFields').classList.add('hidden');
        }

        function toggleBankFields() {
            const paymentMode = document.getElementById('paymentMode').value;
            const bankFields = document.getElementById('bankFields');
            
            if (paymentMode === 'cheque' || paymentMode === 'virement') {
                bankFields.classList.remove('hidden');
            } else {
                bankFields.classList.add('hidden');
            }
        }

        async function handlePayment(e) {
            e.preventDefault();
            
            const detteId = document.getElementById('paymentDetteId').value;
            const formData = new FormData();
            
            formData.append('amount_paid', document.getElementById('paymentAmount').value);
            formData.append('mode_paiement', document.getElementById('paymentMode').value);
            formData.append('description', document.getElementById('paymentDescription').value);
            
            const nomFournisseur = document.getElementById('nomFournisseur').value;
            const banque = document.getElementById('banque').value;
            const numeroCheque = document.getElementById('numeroCheque').value;
            
            if (nomFournisseur) formData.append('nom_fournisseur', nomFournisseur);
            if (banque) formData.append('banque', banque);
            if (numeroCheque) formData.append('numero_cheque', numeroCheque);
            
            const paymentFile = document.getElementById('paymentFile').files[0];
            if (paymentFile) formData.append('preuve_file', paymentFile);

            try {
                const response = await fetch(`http://127.0.0.1:8000/gestion/dettes/${detteId}/payment/`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                    },
                    body: formData
                });

                if (response.ok) {
                    const result = await response.json();
                    showSuccess(t('paymentMade'));
                    hidePaymentModal();
                    hideDetteDetailModal();
                    loadDettes();
                } else {
                    const error = await response.json();
                    showError(error.error || t('paymentError'));
                }
            } catch (error) {
                showError(t('connectionError'));
            }
        }

        function showLoading() {
            document.getElementById('loadingState').classList.remove('hidden');
            document.getElementById('mainContent').classList.add('hidden');
        }

        function hideLoading() {
            document.getElementById('loadingState').classList.add('hidden');
            document.getElementById('mainContent').classList.remove('hidden');
        }

        function showError(message) {
            const errorToast = document.getElementById('errorToast');
            document.getElementById('errorMessage').textContent = message;
            errorToast.classList.remove('hidden');
            setTimeout(() => errorToast.classList.add('hidden'), 5000);
        }

        function showSuccess(message) {
            const successToast = document.getElementById('successToast');
            document.getElementById('successMessage').textContent = message;
            successToast.classList.remove('hidden');
            setTimeout(() => successToast.classList.add('hidden'), 5000);
        }

        function formatCurrency(amount) {
            return new Intl.NumberFormat('fr-DZ', {
                style: 'currency',
                currency: 'DZD',
                minimumFractionDigits: 2
            }).format(amount);
        }

        function formatDate(dateString) {
            const locale = currentLanguage === 'ar' ? 'ar-DZ' : 'fr-FR';
            return new Date(dateString).toLocaleDateString(locale, {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        }