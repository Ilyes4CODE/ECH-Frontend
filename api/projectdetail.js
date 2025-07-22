 const API_BASE_URL = 'http://127.0.0.1:8000';
        let currentProject = null;
        let currentBenefits = null;
        let isDarkMode = localStorage.getItem('darkMode') === 'true';
        let currentPage = 1;
        let totalPages = 1;
        let itemsPerPage = 10;
        let currentOperations = [];
        let currentFilters = {};
        
        function initializeDarkMode() {
            if (isDarkMode) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        }

        function toggleDarkMode() {
            isDarkMode = !isDarkMode;
            localStorage.setItem('darkMode', isDarkMode);
            document.documentElement.classList.toggle('dark', isDarkMode);
        }

        function getProjectId() {
            const urlParams = new URLSearchParams(window.location.search);
            return urlParams.get('project_id');
        }

        function getAuthToken() {
            return localStorage.getItem('access_token');
        }

        function showToast(message, type = 'success') {
            const toast = document.getElementById(type + 'Toast');
            const messageElement = document.getElementById(type + 'Message');
            messageElement.textContent = message;
            
            toast.classList.remove('hidden');
            setTimeout(() => {
                toast.classList.add('hidden');
            }, 3000);
        }

        function formatCurrency(amount) {
            return new Intl.NumberFormat('fr-DZ', {
                style: 'currency',
                currency: 'DZD',
                minimumFractionDigits: 0
            }).format(amount);
        }
        async function loadUserProfile() {
            try {
                const response = await fetch(`${API_BASE_URL}/auth/profile/`, {
                    headers: {
                        'Authorization': `Bearer ${getAuthToken()}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('Erreur lors du chargement du profil');
                }

                const profile = await response.json();
                document.getElementById('welcomeUser').textContent = `Bienvenue, ${profile.username}`;
                document.getElementById('userRole').textContent = profile.group || 'Utilisateur';
            } catch (error) {
                console.error('Error loading profile:', error);
            }
        }

        async function loadCaisseHistory(page = 1, filters = {}) {
            try {
                const projectId = getProjectId();
                const params = new URLSearchParams({
                    page: page.toString(),
                    ...filters
                });

                const response = await fetch(`${API_BASE_URL}/gestion/api/projects/${projectId}/caisse-history/?${params}`, {
                    headers: {
                        'Authorization': `Bearer ${getAuthToken()}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('Erreur lors du chargement de l\'historique');
                }

                const data = await response.json();
                currentOperations = data.results || data;
                
                if (data.count !== undefined) {
                    totalPages = Math.ceil(data.count / itemsPerPage);
                    updatePaginationInfo(data.count, page);
                }
                
                displayOperationsHistory(currentOperations);
                updatePaginationControls();
            } catch (error) {
                showToast('Erreur lors du chargement de l\'historique', 'error');
                console.error('Error loading caisse history:', error);
            }
        }

        function formatDate(dateString) {
            return new Date(dateString).toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }
        function updatePaginationInfo(total, page) {
            const start = (page - 1) * itemsPerPage + 1;
            const end = Math.min(page * itemsPerPage, total);
            document.getElementById('paginationInfo').textContent = `${start}-${end} sur ${total}`;
        }
        function updatePaginationControls() {
            const prevBtn = document.getElementById('prevPageBtn');
            const nextBtn = document.getElementById('nextPageBtn');
            const pageNumbers = document.getElementById('pageNumbers');
            
            prevBtn.disabled = currentPage === 1;
            nextBtn.disabled = currentPage === totalPages;
            
            // Generate page numbers
            let pagesHTML = '';
            const maxVisiblePages = 5;
            let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
            let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
            
            if (endPage - startPage + 1 < maxVisiblePages) {
                startPage = Math.max(1, endPage - maxVisiblePages + 1);
            }
            
            for (let i = startPage; i <= endPage; i++) {
                pagesHTML += `
                    <button class="pagination-btn ${i === currentPage ? 'active' : ''}" 
                            onclick="goToPage(${i})">${i}</button>
                `;
            }
            
            pageNumbers.innerHTML = pagesHTML;
        }

        function goToPage(page) {
            currentPage = page;
            loadCaisseHistory(page, currentFilters);
        }
        function initializeFilters() {
            const currentYear = new Date().getFullYear();
            const yearFilter = document.getElementById('yearFilter');
            
            // Populate years (current year and previous 5 years)
            for (let year = currentYear; year >= currentYear - 5; year--) {
                const option = document.createElement('option');
                option.value = year;
                option.textContent = year;
                yearFilter.appendChild(option);
            }
            
            // Populate days
            const dayFilter = document.getElementById('dayFilter');
            for (let day = 1; day <= 31; day++) {
                const option = document.createElement('option');
                option.value = day;
                option.textContent = day;
                dayFilter.appendChild(option);
            }
        }

        function applyFilters() {
            const year = document.getElementById('yearFilter').value;
            const month = document.getElementById('monthFilter').value;
            const day = document.getElementById('dayFilter').value;
            
            currentFilters = {};
            if (year) currentFilters.year = year;
            if (month) currentFilters.month = month;
            if (day) currentFilters.day = day;
            
            currentPage = 1;
            loadCaisseHistory(1, currentFilters);
        }
        async function submitOperation(event) {
            event.preventDefault();
            
            const formData = new FormData();
            formData.append('operation_type', document.getElementById('operationType').value);
            formData.append('amount', document.getElementById('operationAmount').value);
            formData.append('description', document.getElementById('operationDescription').value);
            formData.append('preuve_type', document.getElementById('preuveType').value);
            const byCollaborator = document.getElementById('byCollaborator').checked;
            formData.append('by_collaborator', byCollaborator);
            const preuveFile = document.getElementById('preuveFile').files[0];
            if (preuveFile) {
                formData.append('preuve_file', preuveFile);
            }
            
            try {
                const projectId = getProjectId();
                const response = await fetch(`${API_BASE_URL}/gestion/api/projects/${projectId}/caisse-operation/`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${getAuthToken()}`
                    },
                    body: formData
                });
                
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Erreur lors de l\'opération');
                }
                
                const result = await response.json();
                showToast(result.message, 'success');
                hideOperationModal();
                
                // Refresh data
                await loadProjectDetails();
                await loadProjectBenefits();
                await loadCaisseHistory(currentPage, currentFilters);
                
            } catch (error) {
                showToast(error.message, 'error');
                console.error('Error submitting operation:', error);
            }
        }

        async function exportToPDF() {
            try {
                const projectId = getProjectId();
                const params = new URLSearchParams(currentFilters);
                
                const response = await fetch(`${API_BASE_URL}/gestion/api/projects/${projectId}/generate-project-caisse-pdf/?${params}`, {
                    headers: {
                        'Authorization': `Bearer ${getAuthToken()}`
                    }
                });
                
                if (!response.ok) {
                    throw new Error('Erreur lors de l\'export PDF');
                }
                
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `historique_caisse_${projectId}_${new Date().toISOString().split('T')[0]}.pdf`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
                
                showToast('Export PDF réussi', 'success');
            } catch (error) {
                showToast('Erreur lors de l\'export PDF', 'error');
                console.error('Error exporting PDF:', error);
            }
        }


        function getOperationIcon(type) {
            switch(type) {
                case 'encaissement': return 'fas fa-arrow-down text-green-500';
                case 'decaissement': return 'fas fa-arrow-up text-red-500';
                case 'remboursement': return 'fas fa-undo text-purple-500';
                case 'expense': return 'fas fa-money-bill-wave text-orange-500';
                case 'receive_from_global': return 'fas fa-exchange-alt text-blue-500';
                case 'adjustment': return 'fas fa-cogs text-yellow-500';
                default: return 'fas fa-circle text-gray-500';
            }
        }

        function getOperationLabel(type) {
            switch(type) {
                case 'encaissement': return 'Encaissement';
                case 'decaissement': return 'Décaissement';
                case 'remboursement': return 'Remboursement';
                case 'expense': return 'Dépense';
                case 'receive_from_global': return 'Reçu de la caisse globale';
                case 'adjustment': return 'Ajustement';
                default: return type;
            }
        }

        async function loadProjectDetails() {
            try {
                const projectId = getProjectId();
                if (!projectId) {
                    showToast('ID du projet manquant', 'error');
                    return;
                }

                const response = await fetch(`${API_BASE_URL}/gestion/api/projects/${projectId}/`, {
                    headers: {
                        'Authorization': `Bearer ${getAuthToken()}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('Erreur lors du chargement du projet');
                }

                const project = await response.json();
                currentProject = project;
                displayProjectDetails(project);
                
                await loadProjectBenefits();
            } catch (error) {
                showToast('Erreur lors du chargement du projet', 'error');
                console.error('Error loading project:', error);
            }
        }

        async function loadProjectBenefits() {
            try {
                const projectId = getProjectId();
                const response = await fetch(`${API_BASE_URL}/gestion/api/projects/${projectId}/benefits/`, {
                    headers: {
                        'Authorization': `Bearer ${getAuthToken()}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('Erreur lors du chargement des bénéfices');
                }

                const benefits = await response.json();
                currentBenefits = benefits;
                displayBenefitsData(benefits);
                displayOperationsHistory(benefits.operations_history);
            } catch (error) {
                showToast('Erreur lors du chargement des bénéfices', 'error');
                console.error('Error loading benefits:', error);
            }
        }
        async function submitProjectUpdate(event) {
            event.preventDefault();
            
            const formData = new FormData();
            const name = document.getElementById('editProjectName').value;
            const description = document.getElementById('editProjectDescription').value;
            const collaborator = document.getElementById('editProjectCollaborator').value;
            const estimatedCost = document.getElementById('editProjectCost').value;
            const durationDays = document.getElementById('editProjectDuration').value;
            const contractFile = document.getElementById('editContractFile').files[0];
            const odsFile = document.getElementById('editOdsFile').files[0];
            
            if (name) formData.append('name', name);
            if (description) formData.append('description', description);
            if (collaborator) formData.append('collaborator', collaborator);
            if (estimatedCost) formData.append('estimated_cost', estimatedCost);
            if (durationDays) formData.append('duration_days', durationDays);
            if (contractFile) formData.append('contract_file', contractFile);
            if (odsFile) formData.append('ods_file', odsFile);
            
            try {
                const projectId = getProjectId();
                const response = await fetch(`${API_BASE_URL}/gestion/api/projects/${projectId}/update/`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${getAuthToken()}`
                    },
                    body: formData
                });
                
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Erreur lors de la mise à jour');
                }
                
                const result = await response.json();
                showToast('Projet mis à jour avec succès', 'success');
                hideEditProjectModal();
                
                // Refresh project data
                await loadProjectDetails();
                
            } catch (error) {
                showToast(error.message, 'error');
                console.error('Error updating project:', error);
            }
        }

        async function showOperationModal() {
            document.getElementById('operationModal').classList.remove('hidden');
            await checkProjectCollaborator();
        }
        function hideOperationModal() {
            document.getElementById('operationModal').classList.add('hidden');
            document.getElementById('operationForm').reset();
            document.getElementById('byCollaborator').checked = false;
        }
        function showEditProjectModal() {
            if (currentProject) {
                document.getElementById('editProjectName').value = currentProject.name || '';
                document.getElementById('editProjectDescription').value = currentProject.description || '';
                document.getElementById('editProjectCollaborator').value = currentProject.collaborator || '';
                document.getElementById('editProjectCost').value = currentProject.estimated_cost || '';
                document.getElementById('editProjectDuration').value = currentProject.duration_days || '';
                document.getElementById('editProjectModal').classList.remove('hidden');
            }
        }
        function hideEditProjectModal() {
            document.getElementById('editProjectModal').classList.add('hidden');
            document.getElementById('editProjectForm').reset();
        }
        function checkMissingFiles(project) {
            const missingFiles = [];
            const hasContract = project.contract_file && project.contract_file.trim() !== '';
            const hasOds = project.ods_file && project.ods_file.trim() !== '';
            
            if (!hasContract) missingFiles.push('Contrat');
            if (!hasOds) missingFiles.push('ODS');
            
            const filesAlert = document.getElementById('filesAlert');
            const missingFilesText = document.getElementById('missingFilesText');
            
            if (missingFiles.length > 0) {
                filesAlert.classList.remove('hidden');
                missingFilesText.textContent = `Fichiers manquants: ${missingFiles.join(', ')}`;
            } else {
                filesAlert.classList.add('hidden');
            }
        }
        function displayProjectDetails(project) {
            document.getElementById('projectName').textContent = project.name;
            document.getElementById('projectDescription').textContent = project.description;
            document.getElementById('estimatedCost').textContent = formatCurrency(project.estimated_cost);
            document.getElementById('actualSpent').textContent = formatCurrency(project.actual_spent);
            document.getElementById('durationDays').textContent = `${project.duration_days} jours`;
            
            if (project.created_by) {
                document.getElementById('createdBy').textContent = project.created_by.full_name || project.created_by.username;
            }

            const progress = project.estimated_cost > 0 ? 
                Math.min((project.actual_spent / project.estimated_cost) * 100, 100) : 0;
            document.getElementById('progressBar').style.width = `${progress}%`;
            document.getElementById('progressPercentage').textContent = `${Math.round(progress)}%`;

            // Update download buttons
            const downloadContractBtn = document.getElementById('downloadContractBtn');
            const downloadOdsBtn = document.getElementById('downloadOdsBtn');
            
            if (project.contract_file) {
                downloadContractBtn.classList.remove('hidden');
                downloadContractBtn.onclick = () => window.open(project.contract_file, '_blank');
            } else {
                downloadContractBtn.classList.add('hidden');
            }
            
            if (project.ods_file) {
                if (!downloadOdsBtn) {
                    // Create ODS download button if it doesn't exist
                    const odsBtn = document.createElement('button');
                    odsBtn.id = 'downloadOdsBtn';
                    odsBtn.className = 'bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-all duration-300';
                    odsBtn.innerHTML = '<i class="fas fa-download mr-2"></i>ODS';
                    odsBtn.onclick = () => window.open(project.ods_file, '_blank');
                    downloadContractBtn.parentNode.appendChild(odsBtn);
                } else {
                    downloadOdsBtn.classList.remove('hidden');
                    downloadOdsBtn.onclick = () => window.open(project.ods_file, '_blank');
                }
            } else if (downloadOdsBtn) {
                downloadOdsBtn.classList.add('hidden');
            }
            
            // Check for missing files
            checkMissingFiles(project);
        }

        function displayBenefitsData(benefits) {
            document.getElementById('currentBalance').textContent = formatCurrency(benefits.current_balance);
            document.getElementById('totalReceived').textContent = formatCurrency(benefits.total_received);
            document.getElementById('totalSpent').textContent = formatCurrency(benefits.total_spent);
            
            const benefitsElement = document.getElementById('projectBenefits');
            benefitsElement.textContent = formatCurrency(benefits.project_benefits);
            
            if (benefits.project_benefits < 0) {
                benefitsElement.classList.add('text-red-300');
                benefitsElement.classList.remove('text-green-300');
            } else {
                benefitsElement.classList.add('text-green-300');
                benefitsElement.classList.remove('text-red-300');
            }
        }

        function displayOperationsHistory(operations) {
            const container = document.getElementById('operationsContainer');
            const emptyState = document.getElementById('emptyOperationsState');
            
            if (operations.length === 0) {
                container.innerHTML = '';
                emptyState.classList.remove('hidden');
                return;
            }

            emptyState.classList.add('hidden');
            
            container.innerHTML = operations.map(operation => `
                <div class="operation-card bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-4">
                            <div class="flex-shrink-0">
                                <i class="${getOperationIcon(operation.operation_type)} text-xl"></i>
                            </div>
                            <div>
                                <h4 class="font-semibold text-gray-900 dark:text-white">${getOperationLabel(operation.operation_type)}</h4>
                                <p class="text-sm text-gray-600 dark:text-gray-400">${operation.description || 'Aucune description'}</p>
                                <div class="flex items-center space-x-4 mt-1">
                                    <p class="text-xs text-gray-500 dark:text-gray-400">${formatDate(operation.created_at)}</p>
                                    ${operation.user ? `<p class="text-xs text-gray-500 dark:text-gray-400">Par: ${operation.user.full_name || operation.user.username}</p>` : ''}
                                </div>
                                ${operation.preuve_file ? `<a href="${operation.preuve_file}" target="_blank" class="text-xs text-blue-500 hover:text-blue-600 mt-1 inline-block"><i class="fas fa-paperclip mr-1"></i>Voir preuve</a>` : ''}
                            </div>
                        </div>
                        <div class="text-right">
                            <div class="text-lg font-bold ${operation.operation_type === 'encaissement' || operation.operation_type === 'receive_from_global' || operation.operation_type === 'remboursement'  ? 'text-green-600' : 'text-red-600'}">
                                ${operation.operation_type === 'encaissement' || operation.operation_type === 'receive_from_global' || operation.operation_type === 'remboursement'  ? '+' : '-'}${formatCurrency(Math.abs(operation.amount))}
                            </div>
                            <div class="text-sm text-gray-500 dark:text-gray-400">
                                Solde: ${formatCurrency(operation.balance_after)}
                            </div>
                        </div>
                    </div>
                </div>
            `).join('');
        }

        function initializeEventListeners() {
            document.getElementById('darkModeToggle').addEventListener('click', toggleDarkMode);
            
            document.getElementById('backBtn').addEventListener('click', () => {
                window.history.back();
            });

            document.getElementById('refreshCaisseBtn').addEventListener('click', () => {
                loadProjectBenefits();
            });

            document.getElementById('logoutBtn').addEventListener('click', () => {
                localStorage.removeItem('authToken');
                window.location.href = 'login.html';
            });

            document.getElementById('editProjectBtn').addEventListener('click', showEditProjectModal);

            document.getElementById('newOperationBtn').addEventListener('click', showOperationModal);
            document.getElementById('closeModalBtn').addEventListener('click', hideOperationModal);
            document.getElementById('cancelOperationBtn').addEventListener('click', hideOperationModal);
            document.getElementById('operationForm').addEventListener('submit', submitOperation);
            document.getElementById('downloadContractBtn').addEventListener('click', () => {
                if (currentProject && currentProject.contract_file) {
                    window.open(currentProject.contract_file, '_blank');
                }
            });
            document.getElementById('applyFilterBtn').addEventListener('click', applyFilters);
            document.getElementById('exportPdfBtn').addEventListener('click', exportToPDF);
            document.getElementById('prevPageBtn').addEventListener('click', () => {
                if (currentPage > 1) goToPage(currentPage - 1);
            });
            document.getElementById('nextPageBtn').addEventListener('click', () => {
                if (currentPage < totalPages) goToPage(currentPage + 1);
            });
            document.getElementById('operationModal').addEventListener('click', (e) => {
                if (e.target.id === 'operationModal') {
                    hideOperationModal();
                }
            });
            document.getElementById('editProjectBtn').addEventListener('click', showEditProjectModal);
            document.getElementById('closeEditModalBtn').addEventListener('click', hideEditProjectModal);
            document.getElementById('cancelEditBtn').addEventListener('click', hideEditProjectModal);
            document.getElementById('editProjectForm').addEventListener('submit', submitProjectUpdate);
            document.getElementById('editProjectModal').addEventListener('click', (e) => {
                if (e.target.id === 'editProjectModal') {
                    hideEditProjectModal();
                }
            });
        }
        
        async function initialize() {
            if (!getAuthToken()) {
                window.location.href = 'login.html';
                return;
            }

            initializeDarkMode();
            initializeEventListeners();
            initializeFilters();
            await loadProjectDetails();
            await loadUserProfile();
            await loadCaisseHistory(); 
            document.getElementById('loadingState').classList.add('hidden');
            document.getElementById('mainContent').classList.remove('hidden');
        }
        async function checkProjectCollaborator() {
            try {
                const projectId = getProjectId();
                const response = await fetch(`${API_BASE_URL}/gestion/projects/${projectId}/has-collaborator/`, {
                    headers: {
                        'Authorization': `Bearer ${getAuthToken()}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('Erreur lors de la vérification du collaborateur');
                }

                const data = await response.json();
                const checkboxContainer = document.getElementById('collaboratorCheckboxContainer');
                
                if (data.has_collaborator) {
                    checkboxContainer.style.display = 'block';
                } else {
                    checkboxContainer.style.display = 'none';
                }
            } catch (error) {
                console.error('Error checking collaborator:', error);
            }
        }
        document.addEventListener('DOMContentLoaded', initialize);