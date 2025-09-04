const urlParams = new URLSearchParams(window.location.search);
const projectId = urlParams.get('id') || window.location.pathname.split('/').pop();
let currentStepNum = 1;
const totalSteps = 3;
let currentProject = null;
const stepTitles = {
    1: 'Informations Générales',
    2: 'Détails Opération',
    3: 'Fichiers'
};

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

        const response = await fetch(`http://${window.location.hostname}:8000/accounts/token/refresh/`, {
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
    // Convert to number if it's a string
    const numAmount = parseFloat(amount);
    
    // Check if it's a valid number
    if (isNaN(numAmount)) {
        return '0';
    }
    
    // Format the number with commas as thousand separators and dot as decimal separator
    return numAmount.toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    });
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
function updateCarousel() {
    // Hide all steps
    document.querySelectorAll('.carousel-step').forEach(step => {
        step.classList.add('hidden');
    });
    
    // Show current step
    document.getElementById(`step${currentStepNum}`).classList.remove('hidden');
    
    // Update progress bar
    const progressPercent = (currentStepNum / totalSteps) * 100;
    document.getElementById('progressBar').style.width = `${progressPercent}%`;
    
    // Update step indicator
    document.getElementById('currentStep').textContent = currentStepNum;
    document.getElementById('stepTitle').textContent = stepTitles[currentStepNum];
    
    // Update navigation buttons
    document.getElementById('prevBtn').disabled = currentStepNum === 1;
    
    if (currentStepNum === totalSteps) {
        document.getElementById('nextBtn').classList.add('hidden');
        document.getElementById('submitBtn').classList.remove('hidden');
    } else {
        document.getElementById('nextBtn').classList.remove('hidden');
        document.getElementById('submitBtn').classList.add('hidden');
    }
}

document.getElementById('prevBtn').addEventListener('click', () => {
    if (currentStepNum > 1) {
        currentStepNum--;
        updateCarousel();
    }
});

document.getElementById('nextBtn').addEventListener('click', () => {
    if (currentStepNum < totalSteps) {
        currentStepNum++;
        updateCarousel();
    }
});

// File upload display functionality
document.getElementById('editContractFile').addEventListener('change', function(e) {
    const fileName = e.target.files[0]?.name;
    const fileNameDiv = document.getElementById('contractFileName');
    if (fileName) {
        fileNameDiv.textContent = `Fichier sélectionné: ${fileName}`;
        fileNameDiv.classList.remove('hidden');
    } else {
        fileNameDiv.classList.add('hidden');
    }
});

document.getElementById('editOdsFile').addEventListener('change', function(e) {
    const fileName = e.target.files[0]?.name;
    const fileNameDiv = document.getElementById('odsFileName');
    if (fileName) {
        fileNameDiv.textContent = `Fichier sélectionné: ${fileName}`;
        fileNameDiv.classList.remove('hidden');
    } else {
        fileNameDiv.classList.add('hidden');
    }
});


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

        const response = await fetch(`http://${window.location.hostname}:8000/gestion/projects/${projectId}/`, {
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
    document.getElementById('totalRecus').textContent = formatCurrency(project.total_accreance);
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

    // Handle Contract File
    const downloadContractBtn = document.getElementById('downloadContractBtn');
    const uploadContractAlert = document.getElementById('uploadContractAlert');
    
    if (project.contract_file_url) {
        downloadContractBtn.classList.remove('hidden');
        uploadContractAlert.classList.add('hidden');
        downloadContractBtn.onclick = () => downloadFile(project.contract_file_url, project.contract_file_name || 'contrat.pdf');
    } else {
        downloadContractBtn.classList.add('hidden');
        uploadContractAlert.classList.remove('hidden');
        uploadContractAlert.onclick = () => showUploadAlert('Contrat');
    }

    // Handle ODS File
    const downloadOdsBtn = document.getElementById('downloadOdsBtn');
    const uploadOdsAlert = document.getElementById('uploadOdsAlert');
    
    if (project.ods_file_url) {
        downloadOdsBtn.classList.remove('hidden');
        uploadOdsAlert.classList.add('hidden');
        downloadOdsBtn.onclick = () => downloadFile(project.ods_file_url, project.ods_file_name || 'fichier.ods');
    } else {
        downloadOdsBtn.classList.add('hidden');
        uploadOdsAlert.classList.remove('hidden');
        uploadOdsAlert.onclick = () => showUploadAlert('Fichier ODS');
    }

    document.getElementById('loadingState').classList.add('hidden');
    document.getElementById('mainContent').classList.remove('hidden');
}

function generateProjectPdf() {
    if (!projectId) {
        alert('Erreur: ID du projet non trouvé');
        return;
    }
    
    // Show loading state
    const btn = document.getElementById('printPdfBtn');
    const originalContent = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Génération...';
    btn.disabled = true;
    
    // Create a temporary link to download the PDF
    const link = document.createElement('a');
    link.href = `http://${window.location.hostname}:8000/gestion/projects/${projectId}/pdf/`; // Adjust URL to match your URL pattern
    link.download = `projet_${projectId}.pdf`;
    
    // Handle successful download
    link.onclick = function() {
        setTimeout(() => {
            btn.innerHTML = originalContent;
            btn.disabled = false;
        }, 2000);
    };
    
    // Handle error
    link.onerror = function() {
        alert('Erreur lors de la génération du PDF');
        btn.innerHTML = originalContent;
        btn.disabled = false;
    };
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}



function downloadFile(url, filename) {
    const token = localStorage.getItem('access_token');
    
    // Fix the URL if it's pointing to the wrong port
    let correctedUrl = url;
    if (url.includes(`${window.location.hostname}:5501`)) {
        correctedUrl = url.replace(`${window.location.hostname}:5501`, `${window.location.hostname}:8000`);
    } else if (url.startsWith('/upload/')) {
        // If it's a relative URL, make it absolute with correct port
        correctedUrl = `http://${window.location.hostname}:8000${url}`;
    } else if (!url.startsWith('http')) {
        // If it's just a filename or relative path
        correctedUrl = `http://${window.location.hostname}:8000/upload/${url}`;
    }
    
    console.log('Original URL:', url);
    console.log('Corrected URL:', correctedUrl);
    console.log('Downloading file:', filename);
    
    // Create a temporary anchor element for download
    const link = document.createElement('a');
    
    // For files that require authentication, fetch and create blob
    fetch(correctedUrl, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.blob();
    })
    .then(blob => {
        const objectUrl = URL.createObjectURL(blob);
        link.href = objectUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(objectUrl);
    })
    .catch(error => {
        console.error('Error downloading file:', error);
        showError('Erreur lors du téléchargement du fichier');
    });
}

document.getElementById('editProjectBtn').addEventListener('click', () => {
    if (currentProject) {
        // Reset carousel to first step
        currentStepNum = 1;
        updateCarousel();
        
        // Populate all form fields including operation fields
        document.getElementById('editProjectName').value = currentProject.name || '';
        document.getElementById('editProjectDescription').value = currentProject.description || '';
        document.getElementById('editEstimatedBudget').value = currentProject.estimated_budget || '';
        document.getElementById('editOperation').value = currentProject.operation || '';
        document.getElementById('editNumeroOperation').value = currentProject.numero_operation || '';
        document.getElementById('editCollaboratorName').value = currentProject.collaborator_name || '';
        
        // Clear file inputs
        document.getElementById('editContractFile').value = '';
        document.getElementById('editOdsFile').value = '';
        document.getElementById('contractFileName').classList.add('hidden');
        document.getElementById('odsFileName').classList.add('hidden');
        
        // Show modal
        document.getElementById('editModal').classList.remove('hidden');
    }
});

document.getElementById('cancelEdit').addEventListener('click', () => {
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
        const formData = new FormData();
        
        // Add text fields to FormData
        formData.append('name', document.getElementById('editProjectName').value);
        formData.append('description', document.getElementById('editProjectDescription').value);
        formData.append('estimated_budget', document.getElementById('editEstimatedBudget').value);
        formData.append('collaborator_name', document.getElementById('editCollaboratorName').value);
        
        // Add operation fields (now they will always be included)
        formData.append('operation', document.getElementById('editOperation').value);
        formData.append('numero_operation', document.getElementById('editNumeroOperation').value);
        
        // Add files if selected
        const contractFile = document.getElementById('editContractFile');
        const odsFile = document.getElementById('editOdsFile');
        
        if (contractFile && contractFile.files[0]) {
            formData.append('contract_file', contractFile.files[0]);
        }
        
        if (odsFile && odsFile.files[0]) {
            formData.append('ods_file', odsFile.files[0]);
        }

        const response = await fetch(`http://${window.location.hostname}:8000/gestion/projects/${projectId}/update/`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                // Don't set Content-Type for FormData - browser will set it automatically with boundary
            },
            body: formData,
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
            const errorData = await response.json();
            throw new Error(errorData.message || 'Erreur lors de la mise à jour');
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
        console.log('Loading collaborator operations for project:', projectId);
        const token = localStorage.getItem('access_token');
        
        if (!token) {
            console.error('No access token found');
            window.location.href = 'login.html';
            return;
        }

        if (!projectId) {
            console.error('No project ID found');
            showError('ID du projet non trouvé');
            return;
        }

        const url = `http://${window.location.hostname}:8000/gestion/caisse/history/?project_id=${projectId}&by_collaborator=true`;
        console.log('Making request to:', url);
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        console.log('Response status:', response.status);
        console.log('Response headers:', Object.fromEntries(response.headers.entries()));

        if (response.ok) {
            const data = await response.json();
            console.log('Collaborator operations API response:', data);
            
            // Check if data has results property (paginated) or is an array
            const operations = data.results || data;
            console.log('Operations to display:', operations);
            
            displayCollaboratorOperations(operations);
        } else {
            // Log the error response
            const errorText = await response.text();
            console.error('API Error Response:', {
                status: response.status,
                statusText: response.statusText,
                body: errorText
            });

            if (response.status === 401) {
                console.log('Token expired, attempting refresh...');
                const refreshed = await refreshToken();
                if (refreshed) {
                    console.log('Token refreshed, retrying...');
                    await loadCollaboratorOperations();
                } else {
                    console.log('Token refresh failed, redirecting to login');
                    window.location.href = 'login.html';
                }
            } else if (response.status === 404) {
                console.error('Endpoint not found - check if the URL is correct');
                showError('Endpoint non trouvé. Vérifiez la configuration de l\'API.');
            } else if (response.status === 500) {
                console.error('Server error:', errorText);
                showError('Erreur serveur. Vérifiez les logs du serveur Django.');
            } else {
                console.error('Unexpected error:', response.status, errorText);
                showError(`Erreur API: ${response.status} - ${response.statusText}`);
            }
        }
    } catch (error) {
        console.error('Network or parsing error:', error);
        
        // Check if it's a network error
        if (error instanceof TypeError && error.message.includes('fetch')) {
            showError('Erreur de connexion. Vérifiez que le serveur Django est en cours d\'exécution.');
        } else {
            showError('Erreur lors du chargement des opérations du collaborateur: ' + error.message);
        }
    }
}

function displayCollaboratorOperations(history) {
    console.log('Displaying collaborator operations:', history);

    let totalRecus = 0;
    let totalDepenses = 0;

    // Calculate totals from the history entries
    history.forEach(item => {
        if (item.operation) {
            const amount = parseFloat(item.operation.amount) || 0;
            if (item.operation.operation_type === 'recu') {
                totalRecus += amount;
            } else if (item.operation.operation_type === 'depense') {
                totalDepenses += amount;
            }
        }
    });

    // Update the stats
    document.getElementById('collaboratorRecus').textContent = formatCurrency(totalRecus) + ' DZD';
    document.getElementById('collaboratorDepenses').textContent = formatCurrency(totalDepenses) + ' DZD';
    document.getElementById('collaboratorOperations').textContent = history.length;

    const operationsList = document.getElementById('collaboratorOperationsList');
    const noOperations = document.getElementById('noCollaboratorOperations');

    if (history.length === 0) {
        operationsList.innerHTML = '';
        noOperations.classList.remove('hidden');
        return;
    }

    noOperations.classList.add('hidden');
    operationsList.innerHTML = history.map(item => {
        const operation = item.operation;
        if (!operation) return '';

        const isRecu = operation.operation_type === 'recu';
        const amount = parseFloat(operation.amount) || 0;
        const description = operation.description || (isRecu ? 'Reçu' : 'Dépense');
        const formattedDate = item.date ? formatDate(item.date) : 'Date non disponible';
        const user = item.user ? `${item.user.first_name} ${item.user.last_name}`.trim() || item.user.username : 'Collaborateur';

        return `
            <div class="bg-white dark:bg-gray-700 rounded-lg p-4 border-l-4 ${isRecu ? 'border-green-500' : 'border-red-500'} shadow-sm">
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
                                        ${user}
                                    </span>
                                    <span>
                                        <i class="fas fa-calendar mr-1"></i>
                                        ${formattedDate}
                                    </span>
                                    ${operation.mode_paiement ? `
                                        <span>
                                            <i class="fas fa-credit-card mr-1"></i>
                                            ${operation.mode_paiement}
                                        </span>
                                    ` : ''}
                                </div>
                            </div>
                        </div>
                        
                        ${operation.observation ? `
                            <div class="mt-3 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded p-2">
                                <strong>Observation:</strong> ${operation.observation}
                            </div>
                        ` : ''}
                        
                        ${operation.nom_fournisseur ? `
                            <div class="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                <strong>Fournisseur:</strong> ${operation.nom_fournisseur}
                            </div>
                        ` : ''}
                        
                        ${operation.income_source ? `
                            <div class="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                <strong>Source:</strong> ${operation.income_source}
                            </div>
                        ` : ''}
                    </div>
                    <div class="text-right ml-4">
                        <p class="text-xl font-bold ${isRecu ? 'text-green-600' : 'text-red-600'}">
                            ${formatCurrency(amount)} DZD
                        </p>
                        <p class="text-sm text-gray-500 dark:text-gray-400">
                            N° ${item.numero || 'N/A'}
                        </p>
                    </div>
                </div>
            </div>
        `;
    }).filter(html => html !== '').join('');
}

async function exportHistoryPDF() {
    const exportBtn = document.getElementById('exportHistoryPDF');
    if (!exportBtn) return;
    
    // Store original button content
    const originalHTML = exportBtn.innerHTML;
    const wasDisabled = exportBtn.disabled;
    
    try {
        const token = localStorage.getItem('access_token');
        if (!token) {
            window.location.href = 'login.html';
            return;
        }

        // Show loading state
        exportBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Génération...';
        exportBtn.disabled = true;

        const response = await fetch(`http://${window.location.hostname}:8000/gestion/projects/project-finance-pdf/`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',  // Add this line
            },
            body: JSON.stringify({
                project_id: projectId,
                by_collaborator: false,
            }),
        });

        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = `historique_projet_${currentProject?.name || 'projet'}_${new Date().toISOString().slice(0,10)}.pdf`;
            document.body.appendChild(a);
            a.click();
            
            // Clean up
            setTimeout(() => {
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            }, 100);
            
            showSuccess('PDF exporté avec succès');
        } else if (response.status === 401) {
            // Restore button state before recursive call
            exportBtn.innerHTML = originalHTML;
            exportBtn.disabled = wasDisabled;
            
            const refreshed = await refreshToken();
            if (refreshed) {
                await exportHistoryPDF(); // This will handle its own button states
                return; // Exit early to avoid double restoration
            } else {
                window.location.href = 'login.html';
                return;
            }
        } else {
            const errorText = await response.text();
            console.error('Server error:', errorText);
            throw new Error(`Erreur serveur: ${response.status}`);
        }
    } catch (error) {
        console.error('Error exporting PDF:', error);
        showError('Erreur lors de l\'export PDF: ' + error.message);
    } finally {
        // Always restore button state
        if (exportBtn) {
            exportBtn.innerHTML = originalHTML;
            exportBtn.disabled = wasDisabled;
        }
    }
}
// Function to export collaborator operations as PDF
async function exportCollaboratorPDF() {
    const exportBtn = document.getElementById('exportCollaboratorPDF');
    if (!exportBtn) return;
    
    // Store original button content
    const originalHTML = exportBtn.innerHTML;
    const wasDisabled = exportBtn.disabled;
    
    try {
        const token = localStorage.getItem('access_token');
        if (!token) {
            window.location.href = 'login.html';
            return;
        }

        // Show loading state
        exportBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Génération...';
        exportBtn.disabled = true;

        const response = await fetch(`http://${window.location.hostname}:8000/gestion/projects/project-finance-pdf/`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                project_id: projectId,
                by_collaborator: true,
            }),
        });

        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = `historique_collaborateur_${currentProject?.collaborator_name || 'collaborateur'}_${new Date().toISOString().slice(0,10)}.pdf`;
            document.body.appendChild(a);
            a.click();
            
            // Clean up
            setTimeout(() => {
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            }, 100);
            
            showSuccess('PDF exporté avec succès');
        } else if (response.status === 401) {
            // Restore button state before recursive call
            exportBtn.innerHTML = originalHTML;
            exportBtn.disabled = wasDisabled;
            
            const refreshed = await refreshToken();
            if (refreshed) {
                await exportCollaboratorPDF(); // This will handle its own button states
                return; // Exit early to avoid double restoration
            } else {
                window.location.href = 'login.html';
                return;
            }
        } else {
            const errorText = await response.text();
            console.error('Server error:', errorText);
            throw new Error(`Erreur serveur: ${response.status}`);
        }
    } catch (error) {
        console.error('Error exporting collaborator PDF:', error);
        showError('Erreur lors de l\'export PDF du collaborateur: ' + error.message);
    } finally {
        // Always restore button state
        if (exportBtn) {
            exportBtn.innerHTML = originalHTML;
            exportBtn.disabled = wasDisabled;
        }
    }
}

async function loadCollaboratorOperations() {
    try {
        console.log('Loading collaborator operations for project:', projectId);
        const token = localStorage.getItem('access_token');
        
        if (!token) {
            console.error('No access token found');
            window.location.href = 'login.html';
            return;
        }

        if (!projectId) {
            console.error('No project ID found');
            showError('ID du projet non trouvé');
            return;
        }

        // Use the correct caisse history endpoint
        const url = `http://${window.location.hostname}:8000/gestion/caisse/history/?project_id=${projectId}&by_collaborator=true`;
        console.log('Making request to:', url);
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        console.log('Response status:', response.status);

        if (response.ok) {
            const data = await response.json();
            console.log('Collaborator operations API response:', data);
            
            // Check if data has results property (paginated) or is an array
            const operations = data.results || data;
            console.log('Operations to display:', operations);
            
            displayCollaboratorOperations(operations);
        } else if (response.status === 401) {
            console.log('Token expired, attempting refresh...');
            const refreshed = await refreshToken();
            if (refreshed) {
                console.log('Token refreshed, retrying...');
                await loadCollaboratorOperations();
            } else {
                console.log('Token refresh failed, redirecting to login');
                window.location.href = 'login.html';
            }
        } else {
            const errorText = await response.text();
            console.error('API Error Response:', {
                status: response.status,
                statusText: response.statusText,
                body: errorText
            });
            throw new Error(`Erreur API: ${response.status}`);
        }
    } catch (error) {
        console.error('Error loading collaborator operations:', error);
        showError('Erreur lors du chargement des opérations du collaborateur');
    }
}
async function loadProjectHistory() {
    try {
        console.log('Loading project history for project:', projectId);
        const token = localStorage.getItem('access_token');
        
        if (!token) {
            window.location.href = 'login.html';
            return;
        }

        // Use the correct caisse history endpoint
        const url = `http://${window.location.hostname}:8000/gestion/caisse/history/?project_id=${projectId}&by_collaborator=false`;
        console.log('Making request to:', url);
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Project history API response:', data);
            displayProjectHistory(data.results || data);
        } else if (response.status === 401) {
            const refreshed = await refreshToken();
            if (refreshed) {
                await loadProjectHistory();
            } else {
                window.location.href = 'login.html';
            }
        } else {
            const errorText = await response.text();
            console.error('History API Error:', errorText);
            throw new Error(`Erreur lors du chargement de l'historique: ${response.status}`);
        }
    } catch (error) {
        console.error('Error loading history:', error);
        showError('Erreur lors du chargement de l\'historique');
    }
}
function displayProjectHistory(history) {
    console.log('Displaying project history:', history);
    
    const historyList = document.getElementById('historyList');
    const noHistory = document.getElementById('noHistory');

    if (history.length === 0) {
        historyList.innerHTML = '';
        noHistory.classList.remove('hidden');
        return;
    }

    noHistory.classList.add('hidden');
    historyList.innerHTML = history.map(item => {
        const operation = item.operation;
        if (!operation) return '';

        const isRecu = operation.operation_type === 'recu';
        const amount = parseFloat(operation.amount) || 0;
        const description = operation.description || (isRecu ? 'Reçu' : 'Dépense');
        const formattedDate = item.date ? formatDate(item.date) : 'Date non disponible';
        const formattedDateTime = item.created_at ? formatDateTime(item.created_at) : 'Date non disponible';
        const user = item.user ? `${item.user.first_name} ${item.user.last_name}`.trim() || item.user.username : 'Système';

        // Get balance information
        const balanceBefore = parseFloat(item.balance_before) || 0;
        const balanceAfter = parseFloat(item.balance_after) || 0;

        return `
            <div class="history-item bg-white dark:bg-gray-700 rounded-lg p-4 border-l-4 ${isRecu ? 'border-green-500' : 'border-red-500'} shadow-sm">
                <div class="flex items-center justify-between">
                    <div class="flex-1">
                        <div class="flex items-center space-x-3">
                            <div class="w-12 h-12 rounded-full ${isRecu ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'} flex items-center justify-center">
                                <i class="fas ${isRecu ? 'fa-arrow-up text-green-600' : 'fa-arrow-down text-red-600'} text-lg"></i>
                            </div>
                            <div>
                                <h4 class="font-medium text-gray-900 dark:text-white">${description}</h4>
                                <div class="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    <span>
                                        <i class="fas fa-user mr-1"></i>
                                        ${user}
                                    </span>
                                    <span>
                                        <i class="fas fa-clock mr-1"></i>
                                        ${formattedDateTime}
                                    </span>
                                    <span>
                                        <i class="fas fa-hashtag mr-1"></i>
                                        ${item.numero || 'N/A'}
                                    </span>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Operation Details -->
                        <div class="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                            ${operation.mode_paiement ? `
                                <div class="bg-gray-50 dark:bg-gray-800 rounded p-2">
                                    <strong class="text-gray-700 dark:text-gray-300">Mode de paiement:</strong>
                                    <span class="text-gray-600 dark:text-gray-400 ml-1">${operation.mode_paiement}</span>
                                </div>
                            ` : ''}
                            
                            ${operation.nom_fournisseur ? `
                                <div class="bg-gray-50 dark:bg-gray-800 rounded p-2">
                                    <strong class="text-gray-700 dark:text-gray-300">Fournisseur:</strong>
                                    <span class="text-gray-600 dark:text-gray-400 ml-1">${operation.nom_fournisseur}</span>
                                </div>
                            ` : ''}
                            
                            ${operation.income_source ? `
                                <div class="bg-gray-50 dark:bg-gray-800 rounded p-2">
                                    <strong class="text-gray-700 dark:text-gray-300">Source:</strong>
                                    <span class="text-gray-600 dark:text-gray-400 ml-1">${operation.income_source}</span>
                                </div>
                            ` : ''}
                            
                            ${operation.banque ? `
                                <div class="bg-gray-50 dark:bg-gray-800 rounded p-2">
                                    <strong class="text-gray-700 dark:text-gray-300">Banque:</strong>
                                    <span class="text-gray-600 dark:text-gray-400 ml-1">${operation.banque}</span>
                                </div>
                            ` : ''}
                            
                            ${operation.numero_cheque ? `
                                <div class="bg-gray-50 dark:bg-gray-800 rounded p-2">
                                    <strong class="text-gray-700 dark:text-gray-300">N° Chèque:</strong>
                                    <span class="text-gray-600 dark:text-gray-400 ml-1">${operation.numero_cheque}</span>
                                </div>
                            ` : ''}
                        </div>
                        
                        ${operation.observation ? `
                            <div class="mt-3 text-sm text-gray-600 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/20 rounded p-2">
                                <strong class="text-blue-700 dark:text-blue-300">Observation:</strong>
                                <p class="mt-1">${operation.observation}</p>
                            </div>
                        ` : ''}
                        
                        <!-- Balance Information -->
                        <div class="mt-3 flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                            <span>Solde avant: <strong>${formatCurrency(balanceBefore)} DZD</strong></span>
                            <span>→</span>
                            <span>Solde après: <strong class="${balanceAfter >= 0 ? 'text-green-600' : 'text-red-600'}">${formatCurrency(balanceAfter)} DZD</strong></span>
                        </div>
                    </div>
                    
                    <div class="text-right ml-4">
                        <p class="text-2xl font-bold ${isRecu ? 'text-green-600' : 'text-red-600'}">
                            ${isRecu ? '+' : '-'}${formatCurrency(amount)}
                        </p>
                        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            DZD
                        </p>
                        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            ${item.action === 'recu_added' ? 'Reçu ajouté' : 'Dépense ajoutée'}
                        </p>
                    </div>
                </div>
            </div>
        `;
    }).filter(html => html !== '').join('');
}
document.addEventListener('DOMContentLoaded', async function() {
    console.log('DOM loaded, setting up all event listeners...');
    
    // User info setup
    const userInfo = localStorage.getItem('username');
    const role =  localStorage.getItem('user_groups');
    if (userInfo) {
        const user = JSON.parse(role);
        document.getElementById('welcomeUser').textContent = `Bienvenue, ${userInfo}`;
        document.getElementById('userRole').textContent = role|| 'Utilisateur';
    }

    // Load project details
    await loadProjectDetails();

    // History button event listener
    const historyBtn = document.getElementById('historyBtn');
    if (historyBtn) {
        console.log('History button found, attaching event listener');
        historyBtn.addEventListener('click', async function(e) {
            e.preventDefault();
            console.log('History button clicked');
            try {
                await loadProjectHistory();
                document.getElementById('historyModal').classList.remove('hidden');
                console.log('History modal opened');
            } catch (error) {
                console.error('Error opening history modal:', error);
                showError('Erreur lors de l\'ouverture de l\'historique');
            }
        });
    } else {
        console.error('History button not found!');
    }

    // Close History Modal
    const closeHistoryModal = document.getElementById('closeHistoryModal');
    if (closeHistoryModal) {
        closeHistoryModal.addEventListener('click', function() {
            console.log('Closing history modal');
            document.getElementById('historyModal').classList.add('hidden');
        });
    }

    // Collaborator button event listener
    const collaboratorBtn = document.getElementById('collaboratorBtn');
    if (collaboratorBtn) {
        console.log('Collaborator button found, attaching event listener');
        collaboratorBtn.addEventListener('click', async function(e) {
            e.preventDefault();
            console.log('Collaborator button clicked');
            try {
                await loadCollaboratorOperations();
                document.getElementById('collaboratorModal').classList.remove('hidden');
                console.log('Collaborator modal opened');
            } catch (error) {
                console.error('Error opening collaborator modal:', error);
                showError('Erreur lors de l\'ouverture des opérations du collaborateur');
            }
        });
    } else {
        console.error('Collaborator button not found!');
    }

    // Close Collaborator Modal
    const closeCollaboratorModal = document.getElementById('closeCollaboratorModal');
    if (closeCollaboratorModal) {
        closeCollaboratorModal.addEventListener('click', function() {
            console.log('Closing collaborator modal');
            document.getElementById('collaboratorModal').classList.add('hidden');
        });
    }

    // PDF export event listeners
    const exportHistoryPDFBtn = document.getElementById('exportHistoryPDF');
    if (exportHistoryPDFBtn) {
        exportHistoryPDFBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Export history PDF clicked');
            exportHistoryPDF();
        });
    }

    const exportCollaboratorPDFBtn = document.getElementById('exportCollaboratorPDF');
    if (exportCollaboratorPDFBtn) {
        exportCollaboratorPDFBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Export collaborator PDF clicked');
            exportCollaboratorPDF();
        });
    }

    // Accréance button functionality
    const accreanceBtn = document.getElementById('accreanceBtn');
    if (accreanceBtn) {
        accreanceBtn.addEventListener('click', function() {
            try {
                // Get the current project ID from URL parameters or localStorage
                const urlParams = new URLSearchParams(window.location.search);
                const projectId = urlParams.get('id') || localStorage.getItem('currentProjectId');
                
                if (projectId) {
                    window.location.href = `accreance.html?projectId=${projectId}`;
                } else {
                    window.location.href = 'accreance.html';
                }
            } catch (error) {
                console.error('Erreur lors de la redirection vers accréance:', error);
                window.location.href = 'accreance.html';
            }
        });
    }

    console.log('All event listeners attached');
});
document.addEventListener('DOMContentLoaded', function() {
    updateCarousel();
});