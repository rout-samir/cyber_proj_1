document.addEventListener('DOMContentLoaded', () => {
	const uploadForm = document.getElementById('upload-form');
	const fileUpload = document.getElementById('file-upload');
	const dragDropArea = document.getElementById('drag-drop-area');
	const fileName = document.getElementById('file-name');
	const loadingSpinner = document.getElementById('loading-spinner');
	const resultsContainer = document.getElementById('results-container');
	const progressBar = document.getElementById('progress-bar');
	const scanStatus = document.getElementById('scan-status');
	const scanPercentage = document.getElementById('scan-percentage');

	// Enhanced drag and drop functionality
	['dragenter', 'dragover', 'dragleave', 'drop'].forEach((eventName) => {
		dragDropArea.addEventListener(eventName, preventDefaults, false);
		document.body.addEventListener(eventName, preventDefaults, false);
	});

	['dragenter', 'dragover'].forEach((eventName) => {
		dragDropArea.addEventListener(
			eventName,
			() => {
				dragDropArea.classList.add('drag-active');
			},
			false,
		);
	});

	['dragleave', 'drop'].forEach((eventName) => {
		dragDropArea.addEventListener(
			eventName,
			() => {
				dragDropArea.classList.remove('drag-active');
			},
			false,
		);
	});

	dragDropArea.addEventListener('drop', handleDrop, false);

	function preventDefaults(e) {
		e.preventDefault();
		e.stopPropagation();
	}

	function handleDrop(e) {
		const dt = e.dataTransfer;
		const files = dt.files;
		fileUpload.files = files;
		handleFileSelection();
	}

	// File selection handler
	fileUpload.addEventListener('change', handleFileSelection);

	function handleFileSelection() {
		if (fileUpload.files && fileUpload.files.length > 0) {
			const file = fileUpload.files[0];
			fileName.textContent = `Selected: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`;
			fileName.classList.add('animate-pulse');
			setTimeout(() => fileName.classList.remove('animate-pulse'), 2000);
		}
	}

	// Enhanced form submission with animation
	uploadForm.addEventListener('submit', async (e) => {
		e.preventDefault();

		if (!fileUpload.files || fileUpload.files.length === 0) {
			showNotification('Please select a file to upload.', 'warning');
			return;
		}

		const file = fileUpload.files[0];

		// Validate file type
		const allowedTypes = ['.java', '.js', '.py', '.cpp', '.c', '.php', '.rb', '.go', '.rs', '.ts'];
		const fileExtension = '.' + file.name.split('.').pop().toLowerCase();

		if (!allowedTypes.includes(fileExtension)) {
			showNotification('Please upload a supported code file type.', 'error');
			return;
		}

		const formData = new FormData();
		formData.append('file', file);

		// Show loading with enhanced animation
		showLoadingAnimation();

		try {
			const response = await fetch('/api/upload', {
				method: 'POST',
				body: formData,
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const results = await response.json();
			hideLoadingAnimation();
			displayEnhancedResults(results, file.name);
		} catch (error) {
			console.error('Error uploading file:', error);
			hideLoadingAnimation();
			showNotification(`Error scanning file: ${error.message}`, 'error');
		}
	});

	function showLoadingAnimation() {
		loadingSpinner.classList.remove('hidden');
		loadingSpinner.scrollIntoView({ behavior: 'smooth' });

		// Simulate progress animation
		let progress = 0;
		const statuses = [
			'Initializing scan...',
			'Parsing code structure...',
			'Analyzing vulnerabilities...',
			'Running security checks...',
			'Generating report...',
			'Finalizing results...',
		];

		const progressInterval = setInterval(() => {
			progress += Math.random() * 15;
			if (progress > 95) progress = 95;

			progressBar.style.width = `${progress}%`;
			scanPercentage.textContent = `${Math.round(progress)}%`;

			const statusIndex = Math.floor((progress / 100) * statuses.length);
			if (statusIndex < statuses.length) {
				scanStatus.textContent = statuses[statusIndex];
			}
		}, 300);

		// Store interval for cleanup
		window.progressInterval = progressInterval;
	}

	function hideLoadingAnimation() {
		if (window.progressInterval) {
			clearInterval(window.progressInterval);
		}
		progressBar.style.width = '100%';
		scanPercentage.textContent = '100%';
		scanStatus.textContent = 'Analysis complete!';

		setTimeout(() => {
			loadingSpinner.classList.add('hidden');
			progressBar.style.width = '0%';
			scanPercentage.textContent = '0%';
			scanStatus.textContent = 'Initializing scan...';
		}, 1000);
	}

	function displayEnhancedResults(results, filename) {
		if (!results || results.length === 0) {
			resultsContainer.innerHTML = `
                        <div class="glass-morphism rounded-3xl p-12 max-w-4xl mx-auto text-center glow-effect">
                            <div class="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <i class="fas fa-shield-check text-4xl text-white"></i>
                            </div>
                            <h3 class="text-3xl font-bold text-white mb-4">Scan Complete</h3>
                            <p class="text-xl text-green-400 font-semibold mb-2">No vulnerabilities detected!</p>
                            <p class="text-gray-300">Your code appears to be secure based on our analysis.</p>
                            <div class="mt-8 security-score rounded-2xl p-6">
                                <div class="text-6xl font-bold text-green-400 mb-2">A+</div>
                                <p class="text-gray-300">Security Score</p>
                            </div>
                        </div>
                    `;
			return;
		}

		// Calculate overall security score
		const totalVulns = results.length;
		const criticalCount = results.filter((r) => r.severity === 'Critical').length;
		const highCount = results.filter((r) => r.severity === 'High').length;
		const mediumCount = results.filter((r) => r.severity === 'Medium').length;
		const lowCount = results.filter((r) => r.severity === 'Low').length;

		// Score calculation logic
		let score = 100;
		score -= criticalCount * 25;
		score -= highCount * 15;
		score -= mediumCount * 10;
		score -= lowCount * 5;
		score = Math.max(0, score);

		let scoreGrade = 'F';
		let scoreColor = 'text-red-400';
		if (score >= 90) {
			scoreGrade = 'A+';
			scoreColor = 'text-green-400';
		} else if (score >= 80) {
			scoreGrade = 'A';
			scoreColor = 'text-green-400';
		} else if (score >= 70) {
			scoreGrade = 'B';
			scoreColor = 'text-yellow-400';
		} else if (score >= 60) {
			scoreGrade = 'C';
			scoreColor = 'text-orange-400';
		} else if (score >= 50) {
			scoreGrade = 'D';
			scoreColor = 'text-red-400';
		}

		let html = `
                    <div class="glass-morphism rounded-3xl shadow-2xl p-10 max-w-6xl mx-auto glow-effect">
                        <div class="text-center mb-12">
                            <div class="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-500 to-orange-600 rounded-2xl mb-6">
                                <i class="fas fa-exclamation-triangle text-3xl text-white"></i>
                            </div>
                            <h2 class="text-4xl font-bold text-white mb-4">Security Analysis Report</h2>
                            <p class="text-gray-300 text-lg">File: <span class="text-cyan-400 font-semibold">${filename}</span></p>
                        </div>

                        <!-- Security Score Card -->
                        <div class="security-score rounded-2xl p-8 mb-12 text-center">
                            <div class="grid md:grid-cols-2 gap-8 items-center">
                                <div>
                                    <div class="text-8xl font-bold ${scoreColor} mb-4">${scoreGrade}</div>
                                    <div class="text-2xl text-gray-300 mb-2">Security Score: <span class="${scoreColor} font-bold">${score}/100</span></div>
                                    <p class="text-gray-400">Based on ${totalVulns} vulnerabilities found</p>
                                </div>
                                <div class="space-y-4">
                                    <div class="flex justify-between items-center">
                                        <span class="text-red-400">Critical</span>
                                        <span class="bg-red-500 text-white px-3 py-1 rounded-full font-bold">${criticalCount}</span>
                                    </div>
                                    <div class="flex justify-between items-center">
                                        <span class="text-orange-400">High</span>
                                        <span class="bg-orange-500 text-white px-3 py-1 rounded-full font-bold">${highCount}</span>
                                    </div>
                                    <div class="flex justify-between items-center">
                                        <span class="text-yellow-400">Medium</span>
                                        <span class="bg-yellow-500 text-white px-3 py-1 rounded-full font-bold">${mediumCount}</span>
                                    </div>
                                    <div class="flex justify-between items-center">
                                        <span class="text-blue-400">Low</span>
                                        <span class="bg-blue-500 text-white px-3 py-1 rounded-full font-bold">${lowCount}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Vulnerabilities Grid -->
                        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                `;

		results.forEach((result, index) => {
			let severityColor = 'bg-blue-500';
			let severityIcon = 'fa-info-circle';
			let borderColor = 'border-blue-400';

			switch (result.severity) {
				case 'Critical':
					severityColor = 'bg-red-500';
					severityIcon = 'fa-skull-crossbones';
					borderColor = 'border-red-400';
					break;
				case 'High':
					severityColor = 'bg-orange-500';
					severityIcon = 'fa-exclamation-triangle';
					borderColor = 'border-orange-400';
					break;
				case 'Medium':
					severityColor = 'bg-yellow-500';
					severityIcon = 'fa-exclamation-circle';
					borderColor = 'border-yellow-400';
					break;
				case 'Low':
					severityColor = 'bg-blue-500';
					severityIcon = 'fa-info-circle';
					borderColor = 'border-blue-400';
					break;
			}

			html += `
                        <div class="bg-gray-800 bg-opacity-50 rounded-2xl p-6 border-l-4 ${borderColor} hover:bg-opacity-70 transition-all duration-300">
                            <div class="flex items-start justify-between mb-4">
                                <h3 class="text-xl font-bold text-white flex-1">${result.vulnerability}</h3>
                                <div class="flex items-center space-x-2">
                                    <span class="${severityColor} text-white px-3 py-1 rounded-full text-sm font-bold flex items-center">
                                        <i class="fas ${severityIcon} mr-2"></i>
                                        ${result.severity}
                                    </span>
                                </div>
                            </div>
                            <p class="text-gray-300 leading-relaxed mb-4">${result.description}</p>

                            ${
															result.recommendation
																? `
                                <div class="bg-gray-700 bg-opacity-50 rounded-lg p-4 mt-4">
                                    <h4 class="text-cyan-400 font-semibold mb-2">
                                        <i class="fas fa-lightbulb mr-2"></i>Recommendation
                                    </h4>
                                    <p class="text-gray-300 text-sm">${result.recommendation}</p>
                                </div>
                            `
																: ''
														}
                        </div>
                    `;
		});

		html += `
                        </div>

                        <!-- Action Buttons -->
                        <div class="mt-12 text-center space-y-4">
                            <button onclick="downloadReport()" class="cyber-button text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 mr-4">
                                <i class="fas fa-download mr-2"></i>Download Report
                            </button>
                            <button onclick="resetScan()" class="bg-gray-600 hover:bg-gray-500 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105">
                                <i class="fas fa-redo mr-2"></i>Scan Another File
                            </button>
                        </div>
                    </div>
                `;

		resultsContainer.innerHTML = html;
		resultsContainer.scrollIntoView({ behavior: 'smooth' });
	}

	function showNotification(message, type = 'info') {
		const notification = document.createElement('div');
		let bgColor = 'bg-blue-500';
		let icon = 'fa-info-circle';

		switch (type) {
			case 'error':
				bgColor = 'bg-red-500';
				icon = 'fa-exclamation-triangle';
				break;
			case 'warning':
				bgColor = 'bg-yellow-500';
				icon = 'fa-exclamation-circle';
				break;
			case 'success':
				bgColor = 'bg-green-500';
				icon = 'fa-check-circle';
				break;
		}

		notification.className = `fixed top-4 right-4 ${bgColor} text-white px-6 py-4 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300`;
		notification.innerHTML = `
                    <div class="flex items-center">
                        <i class="fas ${icon} mr-3"></i>
                        <span>${message}</span>
                        <button onclick="this.parentElement.parentElement.remove()" class="ml-4 text-white hover:text-gray-200">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                `;

		document.body.appendChild(notification);

		setTimeout(() => {
			notification.classList.remove('translate-x-full');
		}, 100);

		setTimeout(() => {
			notification.classList.add('translate-x-full');
			setTimeout(() => notification.remove(), 300);
		}, 5000);
	}

	// Global functions for buttons
	window.downloadReport = function () {
		showNotification('Report download started!', 'success');
	};

	window.resetScan = function () {
		fileUpload.value = '';
		fileName.textContent = '';
		resultsContainer.innerHTML = '';
		document.getElementById('scan').scrollIntoView({ behavior: 'smooth' });
	};

	// Smooth scrolling for navigation
	document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
		anchor.addEventListener('click', function (e) {
			e.preventDefault();
			const target = document.querySelector(this.getAttribute('href'));
			if (target) {
				target.scrollIntoView({ behavior: 'smooth' });
			}
		});
	});

	// Add some interactive particles effect
	function createParticle() {
		const particle = document.createElement('div');
		particle.style.cssText = `
                    position: fixed;
                    width: 2px;
                    height: 2px;
                    background: rgba(0, 212, 255, 0.5);
                    pointer-events: none;
                    z-index: 1;
                    border-radius: 50%;
                    animation: particle-float 15s linear infinite;
                `;

		particle.style.left = Math.random() * 100 + 'vw';
		particle.style.animationDelay = Math.random() * 15 + 's';

		document.body.appendChild(particle);

		setTimeout(() => particle.remove(), 15000);
	}

	// Create floating particles occasionally
	setInterval(createParticle, 3000);

	// Add particle animation
	const style = document.createElement('style');
	style.textContent = `
                @keyframes particle-float {
                    0% {
                        transform: translateY(100vh) scale(0);
                        opacity: 0;
                    }
                    10% {
                        opacity: 1;
                        transform: scale(1);
                    }
                    90% {
                        opacity: 1;
                    }
                    100% {
                        transform: translateY(-100vh) scale(0);
                        opacity: 0;
                    }
                }
            `;
	document.head.appendChild(style);
});
