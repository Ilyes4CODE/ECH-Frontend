const API_BASE = `http://${window.location.hostname}:8000/gestion`;
        let allMissions = [];
        let currentLanguage = localStorage.getItem('language') || 'fr';
        let isDarkMode = localStorage.getItem('darkMode') === 'true';

        const translations = {
            fr: {
                navSubtitle: 'Gestion des Ordres de Mission',
                loadingText: 'Chargement des ordres de mission...',
                mainTitle: 'Gestion des Ordres de Mission',
                mainSubtitle: 'Suivi et gestion de tous vos ordres de mission',
                totalMissionsLabel: 'Total Missions',
                thisMonthLabel: 'Ce Mois',
                recentLabel: 'Récentes',
                newMissionBtn: 'Nouvel Ordre',
                filtersTitle: 'Filtres',
                resetBtn: 'Réinitialiser',
                nameFilterLabel: 'Nom & Prénom',
                destinationFilterLabel: 'Destination',
                dateFilterLabel: 'Date Départ',
                numeroHeader: 'N°',
                nameHeader: 'Nom & Prénom',
                functionHeader: 'Fonction',
                destinationHeader: 'Destination',
                motifHeader: 'Motif',
                dateStartHeader: 'Date Départ',
                actionsHeader: 'Actions',
                emptyStateTitle: 'Aucun ordre de mission trouvé',
                emptyStateDesc: 'Commencez par créer votre premier ordre de mission',
                emptyStateBtn: 'Créer un ordre',
                addModalTitle: 'Nouvel Ordre de Mission',
                nomPrenomLabel: 'Nom & Prénom *',
                fonctionLabel: 'Fonction *',
                adresseLabel: 'Adresse *',
                destinationLabel: 'Destination *',
                moyenDeplacementLabel: 'Moyen de Déplacement *',
                motifLabel: 'Motif de la Mission *',
                matriculeLabel: 'Matricule *',
                matricule2Label: 'Matricule 2',
                dateDepartLabel: 'Date de Départ *',
                dateRetourLabel: 'Date de Retour',
                accompagneParLabel: 'Accompagné Par',
                saveBtnText: 'Enregistrer',
                cancelBtn: 'Annuler',
                editModalTitle: 'Modifier l\'Ordre de Mission',
                updateBtnText: 'Mettre à jour',
                cancelEditBtn: 'Annuler',
                editNomPrenomLabel: 'Nom & Prénom *',
                editFonctionLabel: 'Fonction *',
                editAdresseLabel: 'Adresse *',
                editDestinationLabel: 'Destination *',
                editMoyenDeplacementLabel: 'Moyen de Déplacement *',
                editMotifLabel: 'Motif de la Mission *',
                editMatriculeLabel: 'Matricule *',
                editMatricule2Label: 'Matricule 2',
                editDateDepartLabel: 'Date de Départ *',
                editDateRetourLabel: 'Date de Retour',
                editAccompagneParLabel: 'Accompagné Par',
                errorMessage: 'Une erreur s\'est produite',
                successMessage: 'Opération réussie',
                deleteConfirmTitle: 'Supprimer l\'ordre de mission',
                deleteConfirmText: 'Êtes-vous sûr de vouloir supprimer cet ordre de mission ?',
                confirmBtn: 'Oui, supprimer',
                cancelDeleteBtn: 'Annuler',
                viewPdf: 'Voir PDF',
                edit: 'Modifier',
                delete: 'Supprimer',
                welcomeUser: 'Bienvenue'
            },
            ar: {
                navSubtitle: 'إدارة أوامر المهمة',
                loadingText: 'جاري تحميل أوامر المهمة...',
                mainTitle: 'إدارة أوامر المهمة',
                mainSubtitle: 'متابعة وإدارة جميع أوامر مهماتك',
                totalMissionsLabel: 'إجمالي المهمات',
                thisMonthLabel: 'هذا الشهر',
                recentLabel: 'الحديثة',
                newMissionBtn: 'أمر جديد',
                filtersTitle: 'الفلاتر',
                resetBtn: 'إعادة تعيين',
                nameFilterLabel: 'الاسم واللقب',
                destinationFilterLabel: 'الوجهة',
                dateFilterLabel: 'تاريخ المغادرة',
                numeroHeader: 'الرقم',
                nameHeader: 'الاسم واللقب',
                functionHeader: 'الوظيفة',
                destinationHeader: 'الوجهة',
                motifHeader: 'السبب',
                dateStartHeader: 'تاريخ المغادرة',
                actionsHeader: 'الإجراءات',
                emptyStateTitle: 'لم يتم العثور على أوامر مهمة',
                emptyStateDesc: 'ابدأ بإنشاء أول أمر مهمة لك',
                emptyStateBtn: 'إنشاء أمر',
                addModalTitle: 'أمر مهمة جديد',
                nomPrenomLabel: 'الاسم واللقب *',
                fonctionLabel: 'الوظيفة *',
                adresseLabel: 'العنوان *',
                destinationLabel: 'الوجهة *',
                moyenDeplacementLabel: 'وسيلة النقل *',
                motifLabel: 'سبب المهمة *',
                matriculeLabel: 'الرقم التسلسلي *',
                matricule2Label: 'الرقم التسلسلي 2',
                dateDepartLabel: 'تاريخ المغادرة *',
                dateRetourLabel: 'تاريخ العودة',
                accompagneParLabel: 'مرافق من طرف',
                saveBtnText: 'حفظ',
                cancelBtn: 'إلغاء',
                editModalTitle: 'تعديل أمر المهمة',
                updateBtnText: 'تحديث',
                cancelEditBtn: 'إلغاء',
                editNomPrenomLabel: 'الاسم واللقب *',
                editFonctionLabel: 'الوظيفة *',
                editAdresseLabel: 'العنوان *',
                editDestinationLabel: 'الوجهة *',
                editMoyenDeplacementLabel: 'وسيلة النقل *',
                editMotifLabel: 'سبب المهمة *',
                editMatriculeLabel: 'الرقم التسلسلي *',
                editMatricule2Label: 'الرقم التسلسلي 2',
                editDateDepartLabel: 'تاريخ المغادرة *',
                editDateRetourLabel: 'تاريخ العودة',
                editAccompagneParLabel: 'مرافق من طرف',
                errorMessage: 'حدث خطأ',
                successMessage: 'تمت العملية بنجاح',
                deleteConfirmTitle: 'حذف أمر المهمة',
                deleteConfirmText: 'هل أنت متأكد من رغبتك في حذف أمر المهمة هذا؟',
                confirmBtn: 'نعم، احذف',
                cancelDeleteBtn: 'إلغاء',
                viewPdf: 'عرض PDF',
                edit: 'تعديل',
                delete: 'حذف',
                welcomeUser: 'مرحباً'
            }
        };

        function initializeApp() {
            setupDarkMode();
            updateLanguage();
            loadUserInfo();
            setupEventListeners();
            loadMissions();
        }

        function setupDarkMode() {
            if (isDarkMode) {
                document.documentElement.classList.add('dark');
            }
        }

        function updateLanguage() {
            const t = translations[currentLanguage];
            document.dir = currentLanguage === 'ar' ? 'rtl' : 'ltr';
            document.lang = currentLanguage;
            
            Object.keys(t).forEach(key => {
                const element = document.getElementById(key);
                if (element) {
                    if (element.tagName === 'INPUT' && element.type !== 'submit') {
                        element.placeholder = t[key];
                    } else {
                        element.textContent = t[key];
                    }
                }
            });
        }

        function loadUserInfo() {
            const username = localStorage.getItem('username') || 'User';
            const welcomeElement = document.getElementById('welcomeUser');
            if (welcomeElement) {
                welcomeElement.textContent = `${translations[currentLanguage].welcomeUser} ${username}`;
            }
        }

        function setupEventListeners() {
            document.getElementById('darkModeToggle').addEventListener('click', toggleDarkMode);
            document.getElementById('languageToggle').addEventListener('click', toggleLanguage);
            document.getElementById('backBtn').addEventListener('click', () => window.history.back());
            
            document.getElementById('addMissionBtn').addEventListener('click', openAddModal);
            document.getElementById('addFirstMissionBtn').addEventListener('click', openAddModal);
            document.getElementById('closeAddModal').addEventListener('click', closeAddModal);
            document.getElementById('cancelAdd').addEventListener('click', closeAddModal);
            
            document.getElementById('closeEditModal').addEventListener('click', closeEditModal);
            document.getElementById('cancelEdit').addEventListener('click', closeEditModal);
            
            document.getElementById('addMissionForm').addEventListener('submit', handleAddMission);
            document.getElementById('editMissionForm').addEventListener('submit', handleEditMission);
            
            document.getElementById('nameFilter').addEventListener('input', applyFilters);
            document.getElementById('destinationFilter').addEventListener('input', applyFilters);
            document.getElementById('dateFilter').addEventListener('change', applyFilters);
            document.getElementById('resetFiltersBtn').addEventListener('click', resetFilters);
        }

        function toggleDarkMode() {
            isDarkMode = !isDarkMode;
            localStorage.setItem('darkMode', isDarkMode);
            document.documentElement.classList.toggle('dark');
        }

        function toggleLanguage() {
            currentLanguage = currentLanguage === 'fr' ? 'ar' : 'fr';
            localStorage.setItem('language', currentLanguage);
            updateLanguage();
            renderMissions(allMissions);
        }

        async function loadMissions() {
            try {
                showLoading(true);
                const token = localStorage.getItem('access_token');
                
                const response = await fetch(`${API_BASE}/ordre-mission/`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                });

                if (response.ok) {
                    allMissions = await response.json();
                    renderMissions(allMissions);
                    updateStats();
                } else {
                    showError('Erreur lors du chargement des missions');
                }
            } catch (error) {
                console.error('Error loading missions:', error);
                showError('Erreur de connexion');
            } finally {
                showLoading(false);
            }
        }

        function showLoading(show) {
            document.getElementById('loadingState').classList.toggle('hidden', !show);
            document.getElementById('mainContent').classList.toggle('hidden', show);
        }

        function renderMissions(missions) {
            const tbody = document.getElementById('missionsList');
            const emptyState = document.getElementById('emptyState');
            
            if (missions.length === 0) {
                tbody.innerHTML = '';
                emptyState.classList.remove('hidden');
                return;
            }
            
            emptyState.classList.add('hidden');
            
            tbody.innerHTML = missions.map(mission => `
                <tr class="mission-row">
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        ${mission.numero}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        ${mission.nom_prenom}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        ${mission.fonction}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        ${mission.destination}
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
                        ${mission.motif}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        ${new Date(mission.date_depart).toLocaleDateString(currentLanguage === 'ar' ? 'ar-DZ' : 'fr-FR')}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm">
                        <div class="flex items-center space-x-2">
                            <button onclick="downloadPdf(${mission.id})" class="btn-warning text-white px-2 py-1 rounded text-xs transition-all duration-300" title="${translations[currentLanguage].viewPdf}">
                                <i class="fas fa-file-pdf"></i>
                            </button>
                            <button onclick="editMission(${mission.id})" class="btn-primary text-white px-2 py-1 rounded text-xs transition-all duration-300" title="${translations[currentLanguage].edit}">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button onclick="deleteMission(${mission.id}, '${mission.numero}')" class="btn-danger text-white px-2 py-1 rounded text-xs transition-all duration-300" title="${translations[currentLanguage].delete}">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `).join('');
        }

        function updateStats() {
            const total = allMissions.length;
            const currentMonth = new Date().getMonth();
            const currentYear = new Date().getFullYear();
            
            const thisMonth = allMissions.filter(mission => {
                const missionDate = new Date(mission.date_creation);
                return missionDate.getMonth() === currentMonth && missionDate.getFullYear() === currentYear;
            }).length;
            
            const recent = allMissions.filter(mission => {
                const missionDate = new Date(mission.date_creation);
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                return missionDate >= weekAgo;
            }).length;
            
            document.getElementById('totalMissions').textContent = total;
            document.getElementById('thisMonth').textContent = thisMonth;
            document.getElementById('recent').textContent = recent;
        }

        function applyFilters() {
            const nameFilter = document.getElementById('nameFilter').value.toLowerCase();
            const destinationFilter = document.getElementById('destinationFilter').value.toLowerCase();
            const dateFilter = document.getElementById('dateFilter').value;
            
            const filtered = allMissions.filter(mission => {
                const nameMatch = mission.nom_prenom.toLowerCase().includes(nameFilter);
                const destinationMatch = mission.destination.toLowerCase().includes(destinationFilter);
                const dateMatch = !dateFilter || mission.date_depart === dateFilter;
                
                return nameMatch && destinationMatch && dateMatch;
            });
            
            renderMissions(filtered);
        }

        function resetFilters() {
            document.getElementById('nameFilter').value = '';
            document.getElementById('destinationFilter').value = '';
            document.getElementById('dateFilter').value = '';
            renderMissions(allMissions);
        }

        function openAddModal() {
            document.getElementById('addMissionModal').classList.remove('hidden');
            document.getElementById('addMissionForm').reset();
        }

        function closeAddModal() {
            document.getElementById('addMissionModal').classList.add('hidden');
        }

        function closeEditModal() {
            document.getElementById('editMissionModal').classList.add('hidden');
        }

        async function handleAddMission(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const missionData = {
        nom_prenom: document.getElementById('nomPrenom').value,
        fonction: document.getElementById('fonction').value,
        adresse: document.getElementById('adresse').value,
        destination: document.getElementById('destination').value,
        motif: document.getElementById('motif').value,
        moyen_deplacement: document.getElementById('moyenDeplacement').value,
        matricule: document.getElementById('matricule').value,
        matricule_2: document.getElementById('matricule2').value || null,
        date_depart: document.getElementById('dateDepart').value,
        date_retour: document.getElementById('dateRetour').value || null, // Fix: null instead of empty string
        accompagne_par: document.getElementById('accompagnePar').value || null
    };
    
    try {
        const token = localStorage.getItem('access_token');
        const response = await fetch(`${API_BASE}/ordre-mission/create/`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(missionData)
        });
        
        if (response.ok) {
            showSuccess('Ordre de mission créé avec succès');
            closeAddModal();
            loadMissions();
        } else {
            const error = await response.json();
            showError(error.message || 'Erreur lors de la création');
        }
    } catch (error) {
        console.error('Error creating mission:', error);
        showError('Erreur de connexion');
    }
}

        async function editMission(missionId) {
            try {
                const token = localStorage.getItem('access_token');
                const response = await fetch(`${API_BASE}/ordre-mission/${missionId}/`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                });
                
                if (response.ok) {
                    const mission = await response.json();
                    
                    document.getElementById('editMissionId').value = mission.id;
                    document.getElementById('editNomPrenom').value = mission.nom_prenom;
                    document.getElementById('editFonction').value = mission.fonction;
                    document.getElementById('editAdresse').value = mission.adresse;
                    document.getElementById('editDestination').value = mission.destination;
                    document.getElementById('editMotif').value = mission.motif;
                    document.getElementById('editMoyenDeplacement').value = mission.moyen_deplacement;
                    document.getElementById('editMatricule').value = mission.matricule;
                    document.getElementById('editMatricule2').value = mission.matricule_2 || '';
                    document.getElementById('editDateDepart').value = mission.date_depart;
                    document.getElementById('editDateRetour').value = mission.date_retour || '';
                    document.getElementById('editAccompagnePar').value = mission.accompagne_par || '';
                    
                    document.getElementById('editMissionModal').classList.remove('hidden');
                } else {
                    showError('Erreur lors du chargement des détails');
                }
            } catch (error) {
                console.error('Error loading mission details:', error);
                showError('Erreur de connexion');
            }
        }

        async function handleEditMission(event) {
    event.preventDefault();
    
    const missionId = document.getElementById('editMissionId').value;
    const missionData = {
        nom_prenom: document.getElementById('editNomPrenom').value,
        fonction: document.getElementById('editFonction').value,
        adresse: document.getElementById('editAdresse').value,
        destination: document.getElementById('editDestination').value,
        motif: document.getElementById('editMotif').value,
        moyen_deplacement: document.getElementById('editMoyenDeplacement').value,
        matricule: document.getElementById('editMatricule').value,
        matricule_2: document.getElementById('editMatricule2').value || null,
        date_depart: document.getElementById('editDateDepart').value,
        date_retour: document.getElementById('editDateRetour').value || null, // Fix: null instead of empty string
        accompagne_par: document.getElementById('editAccompagnePar').value || null
    };
    
    try {
        const token = localStorage.getItem('access_token');
        const response = await fetch(`${API_BASE}/ordre-mission/${missionId}/update/`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(missionData)
        });
        
        if (response.ok) {
            showSuccess('Ordre de mission mis à jour avec succès');
            closeEditModal();
            loadMissions();
        } else {
            const error = await response.json();
            showError(error.message || 'Erreur lors de la mise à jour');
        }
    } catch (error) {
        console.error('Error updating mission:', error);
        showError('Erreur de connexion');
    }
}
        async function deleteMission(missionId, numero) {
            const result = await Swal.fire({
                title: translations[currentLanguage].deleteConfirmTitle,
                text: `${translations[currentLanguage].deleteConfirmText} (${numero})`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#ef4444',
                cancelButtonColor: '#6b7280',
                confirmButtonText: translations[currentLanguage].confirmBtn,
                cancelButtonText: translations[currentLanguage].cancelDeleteBtn,
                reverseButtons: currentLanguage === 'ar'
            });
            
            if (result.isConfirmed) {
                try {
                    const token = localStorage.getItem('access_token');
                    const response = await fetch(`${API_BASE}/ordre-mission/${missionId}/delete/`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        }
                    });
                    
                    if (response.ok) {
                        showSuccess('Ordre de mission supprimé avec succès');
                        loadMissions();
                    } else {
                        const error = await response.json();
                        showError(error.message || 'Erreur lors de la suppression');
                    }
                } catch (error) {
                    console.error('Error deleting mission:', error);
                    showError('Erreur de connexion');
                }
            }
        }

        async function downloadPdf(missionId) {
            try {
                const token = localStorage.getItem('access_token');
                const response = await fetch(`${API_BASE}/ordre-mission/${missionId}/pdf/`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                if (response.ok) {
                    const blob = await response.blob();
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `ordre_mission_${missionId}.pdf`;
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url);
                    document.body.removeChild(a);
                } else {
                    showError('Erreur lors de la génération du PDF');
                }
            } catch (error) {
                console.error('Error downloading PDF:', error);
                showError('Erreur de connexion');
            }
        }

        function showError(message) {
            const toast = document.getElementById('errorToast');
            const messageElement = document.getElementById('errorMessage');
            messageElement.textContent = message;
            toast.classList.remove('hidden');
            setTimeout(() => {
                toast.classList.add('hidden');
            }, 5000);
        }

        function showSuccess(message) {
            const toast = document.getElementById('successToast');
            const messageElement = document.getElementById('successMessage');
            messageElement.textContent = message;
            toast.classList.remove('hidden');
            setTimeout(() => {
                toast.classList.add('hidden');
            }, 5000);
        }

        document.addEventListener('DOMContentLoaded', initializeApp);