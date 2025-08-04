document.addEventListener('DOMContentLoaded', () => {
    const uploadForm = document.getElementById('upload-form');
    const fileUpload = document.getElementById('file-upload');
    const dragDropArea = document.getElementById('drag-drop-area');
    const fileNameDisplay = document.getElementById('file-name');
    const resultsContainer = document.getElementById('results-container');
    const loadingSpinner = document.getElementById('loading-spinner');
    const uploadSection = document.getElementById('upload-section');

    // Drag and drop event listeners
    dragDropArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        dragDropArea.classList.add('dragover');
    });

    dragDropArea.addEventListener('dragleave', () => {
        dragDropArea.classList.remove('dragover');
    });

    dragDropArea.addEventListener('drop', (e) => {
        e.preventDefault();
        dragDropArea.classList.remove('dragover');
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            fileUpload.files = files;
            fileNameDisplay.textContent = files[0].name;
        }
    });

    fileUpload.addEventListener('change', () => {
        if (fileUpload.files.length > 0) {
            fileNameDisplay.textContent = fileUpload.files[0].name;
        }
    });

    uploadForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const file = fileUpload.files[0];

        if (!file) {
            alert('Please select a file to upload.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        // Show spinner and hide form
        uploadSection.classList.add('hidden');
        loadingSpinner.classList.remove('hidden');
        resultsContainer.innerHTML = '';

        try {
            // Fake delay to simulate scanning
            await new Promise(resolve => setTimeout(resolve, 1500));

            const response = await fetch('/api/scan', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const results = await response.json();
            displayResults(results);

        } catch (error) {
            console.error('Error uploading or scanning file:', error);
            displayError('Failed to scan the file. Please check the console for more details.');
        } finally {
            // Hide spinner and show form again
            loadingSpinner.classList.add('hidden');
            uploadSection.classList.remove('hidden');
            // Clear file input for next use
            fileUpload.value = '';
            fileNameDisplay.textContent = '';
        }
    });

    function displayError(message) {
        resultsContainer.innerHTML = `
            <div class="result-card error">
                <h3 class="text-xl font-bold text-red-400">Scan Failed</h3>
                <p>${message}</p>
            </div>
        `;
    }

    function displayResults(results) {
        resultsContainer.innerHTML = ''; // Clear previous results

        if (results.error) {
            displayError(results.error);
            return;
        }

        if (results.vulnerabilities && results.vulnerabilities.length > 0) {
            const resultCard = document.createElement('div');
            resultCard.className = 'result-card';
            
            let content = `<h3 class="text-2xl font-bold mb-4 text-cyan-400">Scan Complete: <span class="text-red-400">${results.vulnerabilities.length} vulnerabilities found</span></h3>`;
            
            results.vulnerabilities.forEach(vuln => {
                content += `
                    <div class="vulnerability-details mb-4">
                        <p class="font-bold text-lg text-red-400">${vuln.name}</p>
                        <p class="text-gray-300">${vuln.description}</p>
                    </div>
                `;
            });
            resultCard.innerHTML = content;
            resultsContainer.appendChild(resultCard);
        } else {
            resultsContainer.innerHTML = `
                <div class="result-card success">
                    <h3 class="text-2xl font-bold mb-4 text-green-400">Scan Complete</h3>
                    <p class="text-lg font-semibold">No vulnerabilities were found.</p>
                    <i class="fas fa-check-circle text-green-400 text-3xl mt-4"></i>
                </div>
            `;
        }
    }
});