document.addEventListener('DOMContentLoaded', () => {
    const uploadForm = document.getElementById('upload-form');
    const fileUpload = document.getElementById('file-upload');
    const resultsContainer = document.getElementById('results-container');

    uploadForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!fileUpload.files || fileUpload.files.length === 0) {
            alert('Please select a file to upload.');
            return;
        }

        const file = fileUpload.files[0];
        const formData = new FormData();
        formData.append('file', file);

        resultsContainer.innerHTML = '<p class="text-center">Scanning file...</p>';

        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const results = await response.json();
            displayResults(results);

        } catch (error) {
            console.error('Error uploading file:', error);
            resultsContainer.innerHTML = `<p class="text-center text-red-500">Error scanning file: ${error.message}</p>`;
        }
    });

    function displayResults(results) {
        if (!results || results.length === 0) {
            resultsContainer.innerHTML = '<p class="text-center">No vulnerabilities found.</p>';
            return;
        }

        let html = '<h2 class="text-2xl font-bold mb-4">Scan Results</h2>';
        html += '<div class="grid grid-cols-1 md:grid-cols-2 gap-4">';

        results.forEach(result => {
            html += `
                <div class="bg-white rounded-lg shadow-lg p-6">
                    <h3 class="text-xl font-bold mb-2">${result.vulnerability}</h3>
                    <p class="text-gray-700 mb-2"><strong>Severity:</strong> ${result.severity}</p>
                    <p class="text-gray-700">${result.description}</p>
                </div>
            `;
        });

        html += '</div>';
        resultsContainer.innerHTML = html;
    }
});
