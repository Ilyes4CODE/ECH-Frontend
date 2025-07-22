// Collaborator functionality variables
let collabCurrentPage = 1;
let collabTotalPages = 1;
let collabOperationsPerPage = 10;
let collabAllOperations = [];
let collabFilteredOperations = [];
const urlParams = new URLSearchParams(window.location.search);

const projectId = urlParams.get('project_id');
console.log('Project ID:', projectId);

// Helper function to get auth headers
function getAuthHeaders() {
    const token = localStorage.getItem('access_token');
    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };
}

// Helper function to show error messages
function showError(message) {
    console.error(message);
    // You can replace this with your actual error display logic
    alert(message);
}

async function checkCollaborator() {
    try {
        const response = await fetch(`${API_BASE_URL}/gestion/projects/${projectId}/has-collaborator/`, {
            headers: getAuthHeaders()
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.has_collaborator) {
            document.getElementById('collaboratorHistoryBtn').classList.remove('hidden');
        }
    } catch (error) {
        console.error('Error checking collaborator:', error);
    }
}

// Load collaborator operations
async function loadCollaboratorOperations() {
    try {
        const params = new URLSearchParams();
        const year = document.getElementById('collabYearFilter').value;
        const month = document.getElementById('collabMonthFilter').value;
        const day = document.getElementById('collabDayFilter').value;
        
        if (year) params.append('year', year);
        if (month) params.append('month', month);
        if (day) params.append('day', day);
        
        const response = await fetch(`${API_BASE_URL}/gestion/api/projects/${projectId}/caisse-history-collaborator/?${params}`, {
            headers: getAuthHeaders()
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Ensure data is an array
        if (!Array.isArray(data)) {
            console.error('Expected array but got:', data);
            throw new Error('Invalid data format received from server');
        }
        
        collabAllOperations = data;
        collabFilteredOperations = data;
        
        updateCollaboratorSummary();
        renderCollaboratorOperations();
        setupCollaboratorPagination();
        
    } catch (error) {
        console.error('Error loading collaborator operations:', error);
        showError('Erreur lors du chargement des opérations du collaborateur');
        
        // Initialize with empty arrays to prevent further errors
        collabAllOperations = [];
        collabFilteredOperations = [];
        updateCollaboratorSummary();
        renderCollaboratorOperations();
        setupCollaboratorPagination();
    }
}

// Update collaborator summary
function updateCollaboratorSummary() {
    let totalEncaissement = 0;
    let totalDecaissement = 0;
    
    // Check if collabFilteredOperations is an array
    if (Array.isArray(collabFilteredOperations)) {
        collabFilteredOperations.forEach(op => {
            if (op.operation_type === 'encaissement') {
                totalEncaissement += parseFloat(op.amount || 0);
            } else if (op.operation_type === 'decaissement') {
                totalDecaissement += parseFloat(op.amount || 0);
            }
        });
    }
    
    const netBalance = totalEncaissement - totalDecaissement;
    
    // Update DOM elements if they exist
    const encaissementElement = document.getElementById('collabTotalEncaissement');
    const decaissementElement = document.getElementById('collabTotalDecaissement');
    const balanceElement = document.getElementById('collabNetBalance');
    
    if (encaissementElement) encaissementElement.textContent = `${totalEncaissement.toLocaleString()} DZD`;
    if (decaissementElement) decaissementElement.textContent = `${totalDecaissement.toLocaleString()} DZD`;
    if (balanceElement) balanceElement.textContent = `${netBalance.toLocaleString()} DZD`;
}

// Render collaborator operations
function renderCollaboratorOperations() {
    const container = document.getElementById('collabOperationsContainer');
    const emptyState = document.getElementById('collabEmptyOperationsState');
    
    if (!container) {
        console.error('Operations container not found');
        return;
    }
    
    if (!Array.isArray(collabFilteredOperations) || collabFilteredOperations.length === 0) {
        container.innerHTML = '';
        if (emptyState) emptyState.classList.remove('hidden');
        return;
    }
    
    if (emptyState) emptyState.classList.add('hidden');
    
    const startIndex = (collabCurrentPage - 1) * collabOperationsPerPage;
    const endIndex = startIndex + collabOperationsPerPage;
    const operationsToShow = collabFilteredOperations.slice(startIndex, endIndex);
    
    container.innerHTML = operationsToShow.map(operation => {
        const operationDate = new Date(operation.created_at);
        const formattedDate = operationDate.toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        const typeClass = operation.operation_type === 'encaissement' ? 'text-green-600' : 'text-red-600';
        const typeIcon = operation.operation_type === 'encaissement' ? 'fa-arrow-down' : 'fa-arrow-up';
        const typeText = operation.operation_type === 'encaissement' ? 'Encaissement' : 'Décaissement';
        
        return `
            <div class="operation-card bg-white dark:bg-gray-700 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-600">
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-4">
                        <div class="flex-shrink-0">
                            <div class="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-600 flex items-center justify-center">
                                <i class="fas ${typeIcon} ${typeClass}"></i>
                            </div>
                        </div>
                        <div class="flex-1 min-w-0">
                            <div class="flex items-center space-x-2">
                                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${typeClass} bg-gray-100 dark:bg-gray-600">
                                    ${typeText}
                                </span>
                                <span class="text-sm text-gray-500 dark:text-gray-400">${formattedDate}</span>
                            </div>
                            <p class="mt-1 text-sm text-gray-600 dark:text-gray-300">${operation.description || 'Aucune description'}</p>
                            ${operation.user ? `<p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Par: ${operation.user.full_name || operation.user.username}</p>` : ''}
                        </div>
                    </div>
                    <div class="flex items-center space-x-4">
                        <div class="text-right">
                            <p class="text-lg font-semibold ${typeClass}">${parseFloat(operation.amount || 0).toLocaleString()} DZD</p>
                            <p class="text-sm text-gray-500 dark:text-gray-400">
                                Solde: ${parseFloat(operation.balance_after || 0).toLocaleString()} DZD
                            </p>
                        </div>
                        ${operation.preuve_file ? `
                            <a href="${operation.preuve_file}" target="_blank" class="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                                <i class="fas fa-file-alt text-lg"></i>
                            </a>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Setup collaborator pagination
function setupCollaboratorPagination() {
    const operationsLength = Array.isArray(collabFilteredOperations) ? collabFilteredOperations.length : 0;
    collabTotalPages = Math.ceil(operationsLength / collabOperationsPerPage);
    
    // Update pagination info
    const paginationInfo = document.getElementById('collabPaginationInfo');
    if (paginationInfo) {
        const startIndex = (collabCurrentPage - 1) * collabOperationsPerPage + 1;
        const endIndex = Math.min(collabCurrentPage * collabOperationsPerPage, operationsLength);
        paginationInfo.textContent = operationsLength > 0 ? `${startIndex}-${endIndex} sur ${operationsLength}` : '0 sur 0';
    }
    
    // Update navigation buttons
    const prevBtn = document.getElementById('collabPrevPageBtn');
    const nextBtn = document.getElementById('collabNextPageBtn');
    
    if (prevBtn) prevBtn.disabled = collabCurrentPage === 1;
    if (nextBtn) nextBtn.disabled = collabCurrentPage === collabTotalPages || collabTotalPages === 0;
    
    // Generate page numbers
    const pageNumbers = document.getElementById('collabPageNumbers');
    if (pageNumbers) {
        pageNumbers.innerHTML = '';
        
        for (let i = 1; i <= collabTotalPages; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.className = `px-3 py-1 rounded ${i === collabCurrentPage ? 'bg-orange-500 text-white' : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'}`;
            pageBtn.textContent = i;
            pageBtn.onclick = () => {
                collabCurrentPage = i;
                renderCollaboratorOperations();
                setupCollaboratorPagination();
            };
            pageNumbers.appendChild(pageBtn);
        }
    }
}

// Populate collaborator filter years
function populateCollaboratorFilterYears() {
    const yearFilter = document.getElementById('collabYearFilter');
    if (!yearFilter) return;
    
    const currentYear = new Date().getFullYear();
    
    // Clear existing options except "Toutes"
    yearFilter.innerHTML = '<option value="">Toutes</option>';
    
    // Add years from current year back to 2020
    for (let year = currentYear; year >= 2020; year--) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearFilter.appendChild(option);
    }
}

// Populate collaborator filter days
function populateCollaboratorFilterDays() {
    const dayFilter = document.getElementById('collabDayFilter');
    const monthFilter = document.getElementById('collabMonthFilter');
    const yearFilter = document.getElementById('collabYearFilter');
    
    if (!dayFilter || !monthFilter || !yearFilter) return;
    
    const month = monthFilter.value;
    const year = yearFilter.value || new Date().getFullYear();
    
    // Clear existing options except "Tous"
    dayFilter.innerHTML = '<option value="">Tous</option>';
    
    if (month) {
        const daysInMonth = new Date(year, month, 0).getDate();
        for (let day = 1; day <= daysInMonth; day++) {
            const option = document.createElement('option');
            option.value = day;
            option.textContent = day;
            dayFilter.appendChild(option);
        }
    }
}

// Event listeners for collaborator functionality
document.addEventListener('DOMContentLoaded', function() {
    // Check collaborator on page load
    checkCollaborator();
    
    // Collaborator history button
    const collaboratorHistoryBtn = document.getElementById('collaboratorHistoryBtn');
    if (collaboratorHistoryBtn) {
        collaboratorHistoryBtn.addEventListener('click', function() {
            const modal = document.getElementById('collaboratorModal');
            if (modal) {
                modal.classList.remove('hidden');
                populateCollaboratorFilterYears();
                loadCollaboratorOperations();
            }
        });
    }
    
    // Close collaborator modal
    const closeBtn = document.getElementById('closeCollaboratorModalBtn');
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            const modal = document.getElementById('collaboratorModal');
            if (modal) modal.classList.add('hidden');
        });
    }
    
    // Collaborator filter events
    const monthFilter = document.getElementById('collabMonthFilter');
    const yearFilter = document.getElementById('collabYearFilter');
    
    if (monthFilter) monthFilter.addEventListener('change', populateCollaboratorFilterDays);
    if (yearFilter) yearFilter.addEventListener('change', populateCollaboratorFilterDays);
    
    // Apply collaborator filter
    const applyFilterBtn = document.getElementById('collabApplyFilterBtn');
    if (applyFilterBtn) {
        applyFilterBtn.addEventListener('click', function() {
            collabCurrentPage = 1;
            loadCollaboratorOperations();
        });
    }
    
    // Collaborator pagination
    const prevPageBtn = document.getElementById('collabPrevPageBtn');
    const nextPageBtn = document.getElementById('collabNextPageBtn');
    
    if (prevPageBtn) {
        prevPageBtn.addEventListener('click', function() {
            if (collabCurrentPage > 1) {
                collabCurrentPage--;
                renderCollaboratorOperations();
                setupCollaboratorPagination();
            }
        });
    }
    
    if (nextPageBtn) {
        nextPageBtn.addEventListener('click', function() {
            if (collabCurrentPage < collabTotalPages) {
                collabCurrentPage++;
                renderCollaboratorOperations();
                setupCollaboratorPagination();
            }
        });
    }
    
    // Collaborator export PDF (placeholder)
    const exportPdfBtn = document.getElementById('collabExportPdfBtn');
    if (exportPdfBtn) {
        exportPdfBtn.addEventListener('click', function() {
            downloadCollaboratorPDF();
        });
    }
    
    async function downloadCollaboratorPDF() {
        try {
            // Get current filter values
            const params = new URLSearchParams();
            const year = document.getElementById('collabYearFilter').value;
            const month = document.getElementById('collabMonthFilter').value;
            const day = document.getElementById('collabDayFilter').value;
            
            if (year) params.append('year', year);
            if (month) params.append('month', month);
            if (day) params.append('day', day);
            
            // Show loading state (optional)
            const exportBtn = document.getElementById('collabExportPdfBtn');
            const originalText = exportBtn.textContent;
            exportBtn.disabled = true;
            exportBtn.textContent = 'Génération...';
            
            const response = await fetch(`${API_BASE_URL}/gestion/api/projects/${projectId}/generate-project-caisse-colab-pdf/?${params}`, {
                method: 'GET',
                headers: getAuthHeaders()
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            // Get the PDF blob
            const blob = await response.blob();
            
            // Create download link
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `caisse_history_collaborator_${new Date().toISOString().slice(0, 10)}.pdf`;
            document.body.appendChild(a);
            a.click();
            
            // Cleanup
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            
            // Reset button state
            exportBtn.disabled = false;
            exportBtn.textContent = originalText;
            
        } catch (error) {
            console.error('Error downloading PDF:', error);
            showError('Erreur lors du téléchargement du PDF');
            
            // Reset button state
            const exportBtn = document.getElementById('collabExportPdfBtn');
            exportBtn.disabled = false;
            exportBtn.textContent = 'Exporter PDF';
        }
    }
    // Close modal when clicking outside
    const modal = document.getElementById('collaboratorModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.add('hidden');
            }
        });
    }
});

// Additional CSS for pagination buttons (add to your existing styles)
const additionalStyles = `
    .pagination-btn {
        padding: 0.5rem;
        border: 1px solid #d1d5db;
        background: white;
        color: #374151;
        border-radius: 0.375rem;
        transition: all 0.2s;
    }
    
    .pagination-btn:hover:not(:disabled) {
        background: #f3f4f6;
    }
    
    .pagination-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
    
    .dark .pagination-btn {
        border-color: #4b5563;
        background: #374151;
        color: #d1d5db;
    }
    
    .dark .pagination-btn:hover:not(:disabled) {
        background: #4b5563;
    }
`;

// Add the additional styles to the document
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);