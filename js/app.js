
/**
 * Main Application Controller
 * Handles UI interactions and coordinates between components
 */

class App {
    constructor() {
        this.processes = [];
        this.selectedAlgorithm = null;
        this.scheduler = new Scheduler();
        this.ganttChart = new GanttChart();
        this.metrics = new Metrics();
        this.chartRenderer = new ChartRenderer();
        this.analyticsCharts = {};
        this.analyticsData = null;
        this.currentPage = 'dashboard';
        this.settings = {
            darkMode: true,
            defaultTimeQuantum: 2,
            animationSpeed: 500,
            autoSave: true,
            showToasts: true,
            enableAnimations: true
        };
        
        this.init();
    }

    safeGetElement(id) {
        const element = document.getElementById(id);
        if (!element) {
            console.warn(`Element with id "${id}" not found`);
        }
        return element;
    }

    init() {
        this.loadSettings();
        this.applySettings();
        this.bindEvents();
        this.loadFromLocalStorage();
        this.chartRenderer.initCharts();
        this.initializeNavigation();
        this.initializeAnalyticsCharts();
    }

    bindEvents() {
        const processForm = this.safeGetElement('processForm');
        if (processForm) {
            processForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.addProcess();
            });
        }

        const clearProcesses = this.safeGetElement('clearProcesses');
        if (clearProcesses) {
            clearProcesses.addEventListener('click', () => {
                this.clearAllProcesses();
            });
        }

        document.querySelectorAll('.algorithm-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.selectAlgorithm(btn.dataset.algorithm);
            });
        });

        const runSimulation = this.safeGetElement('runSimulation');
        if (runSimulation) {
            runSimulation.addEventListener('click', () => {
                this.runSimulation();
            });
        }

        const resetSimulation = this.safeGetElement('resetSimulation');
        if (resetSimulation) {
            resetSimulation.addEventListener('click', () => {
                this.resetSimulation();
            });
        }

        const mobileMenuBtn = this.safeGetElement('mobileMenuBtn');
        if (mobileMenuBtn) {
            mobileMenuBtn.addEventListener('click', () => {
                this.toggleMobileMenu();
            });
        }

        const mobileMenuOverlay = this.safeGetElement('mobileMenuOverlay');
        if (mobileMenuOverlay) {
            mobileMenuOverlay.addEventListener('click', () => {
                this.toggleMobileMenu();
            });
        }

        const runComparison = this.safeGetElement('runComparison');
        if (runComparison) {
            runComparison.addEventListener('click', () => {
                this.runComparison();
            });
        }

        const settingDarkMode = this.safeGetElement('setting-darkMode');
        if (settingDarkMode) {
            settingDarkMode.addEventListener('change', (e) => {
                this.settings.darkMode = e.target.checked;
                this.saveSettings();
                this.applySettings();
            });
        }

        const settingDefaultTimeQuantum = this.safeGetElement('setting-defaultTimeQuantum');
        if (settingDefaultTimeQuantum) {
            settingDefaultTimeQuantum.addEventListener('change', (e) => {
                this.settings.defaultTimeQuantum = parseInt(e.target.value) || 2;
                this.saveSettings();
            });
        }

        const settingAnimationSpeed = this.safeGetElement('setting-animationSpeed');
        if (settingAnimationSpeed) {
            settingAnimationSpeed.addEventListener('change', (e) => {
                this.settings.animationSpeed = parseInt(e.target.value) || 500;
                this.saveSettings();
            });
        }

        const settingAutoSave = this.safeGetElement('setting-autoSave');
        if (settingAutoSave) {
            settingAutoSave.addEventListener('change', (e) => {
                this.settings.autoSave = e.target.checked;
                this.saveSettings();
            });
        }

        const settingShowToasts = this.safeGetElement('setting-showToasts');
        if (settingShowToasts) {
            settingShowToasts.addEventListener('change', (e) => {
                this.settings.showToasts = e.target.checked;
                this.saveSettings();
            });
        }

        const settingEnableAnimations = this.safeGetElement('setting-enableAnimations');
        if (settingEnableAnimations) {
            settingEnableAnimations.addEventListener('change', (e) => {
                this.settings.enableAnimations = e.target.checked;
                this.saveSettings();
                this.applySettings();
            });
        }

        const settingClearProcesses = this.safeGetElement('setting-clearProcesses');
        if (settingClearProcesses) {
            settingClearProcesses.addEventListener('click', () => {
                this.clearAllProcesses();
            });
        }

        const settingResetSettings = this.safeGetElement('setting-resetSettings');
        if (settingResetSettings) {
            settingResetSettings.addEventListener('click', () => {
                this.resetSettings();
            });
        }

        const settingExportSettings = this.safeGetElement('setting-exportSettings');
        if (settingExportSettings) {
            settingExportSettings.addEventListener('click', () => {
                this.exportSettings();
            });
        }

        const settingImportSettings = this.safeGetElement('setting-importSettings');
        if (settingImportSettings) {
            settingImportSettings.addEventListener('click', () => {
                this.importSettings();
            });
        }
    }

    addProcess() {
        const processIdEl = this.safeGetElement('processId');
        const arrivalTimeEl = this.safeGetElement('arrivalTime');
        const burstTimeEl = this.safeGetElement('burstTime');
        const priorityEl = this.safeGetElement('priority');

        if (!processIdEl || !arrivalTimeEl || !burstTimeEl || !priorityEl) {
            this.showToast('Form elements not found', 'error');
            return;
        }

        const processId = processIdEl.value.trim();
        const arrivalTime = parseInt(arrivalTimeEl.value);
        const burstTime = parseInt(burstTimeEl.value);
        const priority = parseInt(priorityEl.value) || 1;

        if (this.processes.some(p => p.id === processId)) {
            this.showToast('Process ID already exists', 'error');
            return;
        }

        if (priority < 1 || priority > 5) {
            this.showToast('Priority must be between 1 and 5', 'error');
            return;
        }

        if (arrivalTime < 0) {
            this.showToast('Arrival time must be non-negative', 'error');
            return;
        }

        if (burstTime <= 0) {
            this.showToast('Burst time must be positive', 'error');
            return;
        }

        const process = {
            id: processId,
            arrivalTime,
            burstTime,
            priority,
            remainingTime: burstTime,
            completionTime: 0,
            turnaroundTime: 0,
            waitingTime: 0
        };

        this.processes.push(process);
        this.updateProcessTable();
        this.updateStatistics();
        this.saveToLocalStorage();
        this.clearForm();
        this.showToast('Process added successfully', 'success');
    }

    removeProcess(processId) {
        this.processes = this.processes.filter(p => p.id !== processId);
        this.updateProcessTable();
        this.updateStatistics();
        this.saveToLocalStorage();
        this.showToast('Process removed', 'success');
    }

    clearAllProcesses() {
        this.processes = [];
        this.updateProcessTable();
        this.updateStatistics();
        this.saveToLocalStorage();
        this.showToast('All processes cleared', 'success');
    }

    selectAlgorithm(algorithm) {
        this.selectedAlgorithm = algorithm;

        document.querySelectorAll('.algorithm-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.algorithm === algorithm) {
                btn.classList.add('active');
            }
        });

        const timeQuantumContainer = document.getElementById('timeQuantumContainer');
        if (algorithm === 'rr') {
            timeQuantumContainer.style.display = 'block';
        } else {
            timeQuantumContainer.style.display = 'none';
        }

        // ✅ CHANGE 1: Added mlfq to algorithm display names
        const algorithmNames = {
            fcfs: 'FCFS (First Come First Serve)',
            sjf: 'SJF (Shortest Job First)',
            srtf: 'SRTF (Shortest Remaining Time First)',
            rr: 'Round Robin',
            priority: 'Priority (Non-Preemptive)',
            preemptivePriority: 'Priority (Preemptive)',
            mlfq: 'MLFQ (Multilevel Feedback Queue)'
        };
        document.getElementById('selectedAlgorithm').textContent = algorithmNames[algorithm] || algorithm;
    }

    runSimulation() {
        if (this.processes.length === 0) {
            this.showToast('Please add at least one process', 'error');
            return;
        }

        if (!this.selectedAlgorithm) {
            this.showToast('Please select an algorithm', 'error');
            return;
        }

        const timeQuantumEl = this.safeGetElement('timeQuantum');
        const timeQuantum = this.selectedAlgorithm === 'rr' && timeQuantumEl
            ? parseInt(timeQuantumEl.value)
            : null;

        if (this.selectedAlgorithm === 'rr' && (!timeQuantum || timeQuantum < 1)) {
            this.showToast('Please enter a valid time quantum', 'error');
            return;
        }

        if (!this.scheduler.validateProcesses(this.processes)) {
            this.showToast('Invalid process data. Please check arrival times, burst times, and priorities.', 'error');
            return;
        }

        try {
            const result = this.scheduler.schedule(
                JSON.parse(JSON.stringify(this.processes)),
                this.selectedAlgorithm,
                timeQuantum
            );

            this.displayResults(result);
            this.runComparisonAndStoreData();
            this.showToast('Simulation completed', 'success');
        } catch (error) {
            console.error('Simulation error:', error);
            this.showToast('Error running simulation: ' + error.message, 'error');
        }
    }

    resetSimulation() {
        document.getElementById('ganttChart').innerHTML = '<p class="text-gray-500">Run a simulation to see the Gantt chart</p>';
        document.getElementById('resultsTableBody').innerHTML = '<tr><td colspan="6" class="py-8 text-center text-gray-500">No results available</td></tr>';
        document.getElementById('throughput').textContent = '0 processes/unit';
        document.getElementById('contextSwitches').textContent = '0';
        document.getElementById('totalExecutionTime').textContent = '0';
        document.getElementById('comparisonSection').style.display = 'none';
        document.getElementById('chartsSection').style.display = 'none';
        this.showToast('Simulation reset', 'success');
    }

    displayResults(result) {
        this.ganttChart.render(result.schedule);
        this.updateResultsTable(result.processes);
        this.updateResultStatistics(result);
    }

    updateProcessTable() {
        const tbody = document.getElementById('processTableBody');

        if (this.processes.length === 0) {
            const row = document.createElement('tr');
            const cell = document.createElement('td');
            cell.colSpan = 5;
            cell.className = 'py-8 text-center text-gray-500';
            cell.textContent = 'No processes added yet';
            row.appendChild(cell);
            tbody.innerHTML = '';
            tbody.appendChild(row);
            return;
        }

        tbody.innerHTML = '';
        this.processes.forEach(process => {
            const row = document.createElement('tr');
            row.className = 'border-b border-gray-700 fade-in';

            const idCell = document.createElement('td');
            idCell.className = 'py-3 px-2 font-semibold text-blue-400';
            idCell.textContent = process.id;
            row.appendChild(idCell);

            const arrivalCell = document.createElement('td');
            arrivalCell.className = 'py-3 px-2';
            arrivalCell.textContent = process.arrivalTime;
            row.appendChild(arrivalCell);

            const burstCell = document.createElement('td');
            burstCell.className = 'py-3 px-2';
            burstCell.textContent = process.burstTime;
            row.appendChild(burstCell);

            const priorityCell = document.createElement('td');
            priorityCell.className = 'py-3 px-2';
            priorityCell.textContent = process.priority;
            row.appendChild(priorityCell);

            const actionCell = document.createElement('td');
            actionCell.className = 'py-3 px-2';
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'text-red-400 hover:text-red-300 transition-colors';
            deleteBtn.onclick = () => this.removeProcess(process.id);
            deleteBtn.innerHTML = '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>';
            actionCell.appendChild(deleteBtn);
            row.appendChild(actionCell);

            tbody.appendChild(row);
        });
    }

    updateResultsTable(processes) {
        const tbody = document.getElementById('resultsTableBody');

        tbody.innerHTML = '';
        processes.forEach(process => {
            const row = document.createElement('tr');
            row.className = 'border-b border-gray-700 fade-in';

            const idCell = document.createElement('td');
            idCell.className = 'py-3 px-2 font-semibold text-blue-400';
            idCell.textContent = process.id;
            row.appendChild(idCell);

            const arrivalCell = document.createElement('td');
            arrivalCell.className = 'py-3 px-2';
            arrivalCell.textContent = process.arrivalTime;
            row.appendChild(arrivalCell);

            const burstCell = document.createElement('td');
            burstCell.className = 'py-3 px-2';
            burstCell.textContent = process.burstTime;
            row.appendChild(burstCell);

            const completionCell = document.createElement('td');
            completionCell.className = 'py-3 px-2';
            completionCell.textContent = process.completionTime;
            row.appendChild(completionCell);

            const turnaroundCell = document.createElement('td');
            turnaroundCell.className = 'py-3 px-2';
            turnaroundCell.textContent = process.turnaroundTime;
            row.appendChild(turnaroundCell);

            const waitingCell = document.createElement('td');
            waitingCell.className = 'py-3 px-2';
            waitingCell.textContent = process.waitingTime;
            row.appendChild(waitingCell);

            tbody.appendChild(row);
        });
    }

    updateStatistics() {
        const totalProcessesEl = this.safeGetElement('totalProcesses');
        if (totalProcessesEl) {
            totalProcessesEl.textContent = this.processes.length;
        }
    }

    updateResultStatistics(result) {
        const metrics = this.metrics.calculate(result.processes);

        const avgWaitingTimeEl = this.safeGetElement('avgWaitingTime');
        if (avgWaitingTimeEl) avgWaitingTimeEl.textContent = metrics.avgWaitingTime.toFixed(2);

        const avgTurnaroundTimeEl = this.safeGetElement('avgTurnaroundTime');
        if (avgTurnaroundTimeEl) avgTurnaroundTimeEl.textContent = metrics.avgTurnaroundTime.toFixed(2);

        const cpuUtilizationEl = this.safeGetElement('cpuUtilization');
        if (cpuUtilizationEl) cpuUtilizationEl.textContent = metrics.cpuUtilization.toFixed(1) + '%';

        const throughputEl = this.safeGetElement('throughput');
        if (throughputEl) throughputEl.textContent = metrics.throughput.toFixed(2) + ' processes/unit';

        const contextSwitchesEl = this.safeGetElement('contextSwitches');
        if (contextSwitchesEl) contextSwitchesEl.textContent = result.contextSwitches || 0;

        const totalExecutionTimeEl = this.safeGetElement('totalExecutionTime');
        if (totalExecutionTimeEl) totalExecutionTimeEl.textContent = result.totalTime || 0;
    }

    clearForm() {
        const processIdEl = this.safeGetElement('processId');
        const arrivalTimeEl = this.safeGetElement('arrivalTime');
        const burstTimeEl = this.safeGetElement('burstTime');
        const priorityEl = this.safeGetElement('priority');

        if (processIdEl) processIdEl.value = '';
        if (arrivalTimeEl) arrivalTimeEl.value = '';
        if (burstTimeEl) burstTimeEl.value = '';
        if (priorityEl) priorityEl.value = '';

        const nextId = this.processes.length + 1;
        if (processIdEl) processIdEl.value = `P${nextId}`;
    }

    toggleMobileMenu() {
        const overlay = this.safeGetElement('mobileMenuOverlay');
        if (overlay) {
            overlay.classList.toggle('hidden');
        }
    }

    showToast(message, type = 'success') {
        if (!this.settings.showToasts) return;

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    saveToLocalStorage() {
        if (this.settings.autoSave) {
            localStorage.setItem('cpuSchedulerProcesses', JSON.stringify(this.processes));
        }
    }

    loadFromLocalStorage() {
        const saved = localStorage.getItem('cpuSchedulerProcesses');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                if (Array.isArray(data) && data.every(p =>
                    p.id &&
                    typeof p.arrivalTime === 'number' &&
                    typeof p.burstTime === 'number' &&
                    typeof p.priority === 'number'
                )) {
                    this.processes = data;
                    this.updateProcessTable();
                    this.updateStatistics();
                } else {
                    console.warn('Invalid process data in localStorage, using empty array');
                    this.processes = [];
                }
            } catch (error) {
                console.error('Error loading from localStorage:', error);
                this.processes = [];
            }
        }
    }

    runComparison() {
        if (this.processes.length === 0) {
            this.showToast('Please add at least one process', 'error');
            return;
        }

        if (!this.scheduler.validateProcesses(this.processes)) {
            this.showToast('Invalid process data. Please check arrival times, burst times, and priorities.', 'error');
            return;
        }

        const timeQuantumEl = this.safeGetElement('timeQuantum');
        const timeQuantum = timeQuantumEl ? parseInt(timeQuantumEl.value) || 2 : 2;

        // ✅ CHANGE 2: Added mlfq to comparison algorithms list
        const algorithms = ['fcfs', 'sjf', 'srtf', 'rr', 'priority', 'preemptivePriority', 'mlfq'];
        const results = {};
        const contextSwitches = {};

        algorithms.forEach(algorithm => {
            try {
                const result = this.scheduler.schedule(
                    JSON.parse(JSON.stringify(this.processes)),
                    algorithm,
                    algorithm === 'rr' ? timeQuantum : null
                );
                results[algorithm] = result.processes;
                contextSwitches[algorithm] = result.contextSwitches || 0;
            } catch (error) {
                console.error(`Error running ${algorithm}:`, error);
            }
        });

        const comparisonData = {};
        Object.keys(results).forEach(algorithm => {
            comparisonData[algorithm] = this.metrics.calculate(results[algorithm]);
            comparisonData[algorithm].contextSwitches = contextSwitches[algorithm];
        });

        this.displayComparisonTable(comparisonData);
        this.chartRenderer.updateCharts(comparisonData);

        const comparisonSection = this.safeGetElement('comparisonSection');
        if (comparisonSection) comparisonSection.style.display = 'block';
        const chartsSection = this.safeGetElement('chartsSection');
        if (chartsSection) chartsSection.style.display = 'block';

        this.showToast('Comparison completed', 'success');
    }

    runComparisonAndStoreData() {
        if (this.processes.length === 0) return;

        if (!this.scheduler.validateProcesses(this.processes)) {
            console.warn('Invalid process data, skipping comparison');
            return;
        }

        const timeQuantumEl = this.safeGetElement('timeQuantum');
        const timeQuantum = timeQuantumEl ? parseInt(timeQuantumEl.value) || 2 : 2;

        // ✅ CHANGE 3: Added mlfq to auto-comparison algorithms list
        const algorithms = ['fcfs', 'sjf', 'srtf', 'rr', 'priority', 'preemptivePriority', 'mlfq'];
        const results = {};
        const contextSwitches = {};

        algorithms.forEach(algorithm => {
            try {
                const result = this.scheduler.schedule(
                    JSON.parse(JSON.stringify(this.processes)),
                    algorithm,
                    algorithm === 'rr' ? timeQuantum : null
                );
                results[algorithm] = result.processes;
                contextSwitches[algorithm] = result.contextSwitches || 0;
            } catch (error) {
                console.error(`Error running ${algorithm}:`, error);
            }
        });

        const comparisonData = {};
        Object.keys(results).forEach(algorithm => {
            comparisonData[algorithm] = this.metrics.calculate(results[algorithm]);
            comparisonData[algorithm].contextSwitches = contextSwitches[algorithm];
        });

        this.analyticsData = comparisonData;
        this.displayComparisonTable(comparisonData);
        this.chartRenderer.updateCharts(comparisonData);

        const comparisonSection = this.safeGetElement('comparisonSection');
        if (comparisonSection) comparisonSection.style.display = 'block';
        const chartsSection = this.safeGetElement('chartsSection');
        if (chartsSection) chartsSection.style.display = 'block';
    }

    displayComparisonTable(comparisonData) {
        const tbody = document.getElementById('comparisonTableBody');

        // ✅ CHANGE 4: Added mlfq to comparison table display names
        const algorithmNames = {
            fcfs: 'FCFS',
            sjf: 'SJF',
            srtf: 'SRTF',
            rr: 'Round Robin',
            priority: 'Priority',
            preemptivePriority: 'Preemptive Priority',
            mlfq: 'MLFQ'
        };

        const bestWaitingTime = this.metrics.findBestAlgorithm(comparisonData, 'avgWaitingTime');
        const bestTurnaroundTime = this.metrics.findBestAlgorithm(comparisonData, 'avgTurnaroundTime');
        const bestCPUUtilization = this.metrics.findBestAlgorithm(comparisonData, 'cpuUtilization');
        const bestThroughput = this.metrics.findBestAlgorithm(comparisonData, 'throughput');
        const bestContextSwitches = this.metrics.findBestAlgorithm(comparisonData, 'contextSwitches');

        tbody.innerHTML = '';
        Object.keys(comparisonData).forEach(algorithm => {
            const data = comparisonData[algorithm];
            const isBestWaiting = algorithm === bestWaitingTime;
            const isBestTurnaround = algorithm === bestTurnaroundTime;
            const isBestCPU = algorithm === bestCPUUtilization;
            const isBestThroughput = algorithm === bestThroughput;
            const isBestContext = algorithm === bestContextSwitches;

            const row = document.createElement('tr');
            row.className = 'border-b border-gray-700';

            const nameCell = document.createElement('td');
            nameCell.className = 'py-3 px-2 font-semibold text-blue-400';
            nameCell.textContent = algorithmNames[algorithm] || algorithm;
            row.appendChild(nameCell);

            const waitingCell = document.createElement('td');
            waitingCell.className = `py-3 px-2 ${isBestWaiting ? 'text-green-400 font-bold' : ''}`;
            waitingCell.textContent = `${data.avgWaitingTime.toFixed(2)} ${isBestWaiting ? '★' : ''}`;
            row.appendChild(waitingCell);

            const turnaroundCell = document.createElement('td');
            turnaroundCell.className = `py-3 px-2 ${isBestTurnaround ? 'text-green-400 font-bold' : ''}`;
            turnaroundCell.textContent = `${data.avgTurnaroundTime.toFixed(2)} ${isBestTurnaround ? '★' : ''}`;
            row.appendChild(turnaroundCell);

            const cpuCell = document.createElement('td');
            cpuCell.className = `py-3 px-2 ${isBestCPU ? 'text-green-400 font-bold' : ''}`;
            cpuCell.textContent = `${data.cpuUtilization.toFixed(1)}% ${isBestCPU ? '★' : ''}`;
            row.appendChild(cpuCell);

            const throughputCell = document.createElement('td');
            throughputCell.className = `py-3 px-2 ${isBestThroughput ? 'text-green-400 font-bold' : ''}`;
            throughputCell.textContent = `${data.throughput.toFixed(2)} ${isBestThroughput ? '★' : ''}`;
            row.appendChild(throughputCell);

            const contextCell = document.createElement('td');
            contextCell.className = `py-3 px-2 ${isBestContext ? 'text-green-400 font-bold' : ''}`;
            contextCell.textContent = `${data.contextSwitches} ${isBestContext ? '★' : ''}`;
            row.appendChild(contextCell);

            tbody.appendChild(row);
        });
    }

    initializeNavigation() {
        document.getElementById('nav-dashboard').addEventListener('click', () => this.showPage('dashboard'));
        document.getElementById('nav-analytics').addEventListener('click', () => this.showPage('analytics'));
        document.getElementById('nav-settings').addEventListener('click', () => this.showPage('settings'));
    }

    showPage(pageId) {
        document.querySelectorAll('.page-section').forEach(section => {
            section.classList.add('hidden');
        });

        const page = document.getElementById(`${pageId}-page`);
        if (page) {
            page.classList.remove('hidden');
            if (this.settings.enableAnimations) {
                page.classList.add('fade-in');
                setTimeout(() => page.classList.remove('fade-in'), 300);
            }
        }

        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        const navBtn = document.getElementById(`nav-${pageId}`);
        if (navBtn) {
            navBtn.classList.add('active');
        }

        const titles = {
            dashboard: 'Dashboard',
            analytics: 'Analytics',
            settings: 'Settings'
        };
        document.querySelector('header h2').textContent = titles[pageId] || 'Dashboard';

        this.currentPage = pageId;

        if (pageId === 'analytics') {
            this.updateAnalyticsPage();
        }
    }

    loadSettings() {
        const saved = localStorage.getItem('cpuSchedulerSettings');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                if (data && typeof data === 'object') {
                    this.settings = { ...this.settings, ...data };
                }
            } catch (e) {
                console.error('Error loading settings:', e);
            }
        }
        this.syncSettingsUI();
    }

    saveSettings() {
        localStorage.setItem('cpuSchedulerSettings', JSON.stringify(this.settings));
    }

    applySettings() {
        if (this.settings.darkMode) {
            document.body.classList.remove('bg-gray-100', 'text-gray-900');
            document.body.classList.add('bg-gray-900', 'text-gray-100');
        } else {
            document.body.classList.remove('bg-gray-900', 'text-gray-100');
            document.body.classList.add('bg-gray-100', 'text-gray-900');
        }

        if (!this.settings.enableAnimations) {
            document.documentElement.style.setProperty('--transition-duration', '0s');
        } else {
            document.documentElement.style.setProperty('--transition-duration', '0.3s');
        }
    }

    syncSettingsUI() {
        document.getElementById('setting-darkMode').checked = this.settings.darkMode;
        document.getElementById('setting-defaultTimeQuantum').value = this.settings.defaultTimeQuantum;
        document.getElementById('setting-animationSpeed').value = this.settings.animationSpeed;
        document.getElementById('setting-autoSave').checked = this.settings.autoSave;
        document.getElementById('setting-showToasts').checked = this.settings.showToasts;
        document.getElementById('setting-enableAnimations').checked = this.settings.enableAnimations;
    }

    resetSettings() {
        this.settings = {
            darkMode: true,
            defaultTimeQuantum: 2,
            animationSpeed: 500,
            autoSave: true,
            showToasts: true,
            enableAnimations: true
        };
        this.saveSettings();
        this.syncSettingsUI();
        this.applySettings();
        this.showToast('Settings reset to defaults', 'success');
    }

    exportSettings() {
        const dataStr = JSON.stringify(this.settings, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'cpu-scheduler-settings.json';
        link.click();
        URL.revokeObjectURL(url);
        this.showToast('Settings exported successfully', 'success');
    }

    importSettings() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    try {
                        const imported = JSON.parse(event.target.result);
                        this.settings = { ...this.settings, ...imported };
                        this.saveSettings();
                        this.syncSettingsUI();
                        this.applySettings();
                        this.showToast('Settings imported successfully', 'success');
                    } catch (error) {
                        this.showToast('Error importing settings', 'error');
                    }
                };
                reader.readAsText(file);
            }
        };
        input.click();
    }

    initializeAnalyticsCharts() {
        const chartConfigs = [
            { id: 'analytics-waitingTimeChart', label: 'Average Waiting Time', color: 'rgb(34, 197, 94)' },
            { id: 'analytics-turnaroundTimeChart', label: 'Average Turnaround Time', color: 'rgb(168, 85, 247)' },
            { id: 'analytics-cpuUtilizationChart', label: 'CPU Utilization (%)', color: 'rgb(249, 115, 22)' },
            { id: 'analytics-throughputChart', label: 'Throughput', color: 'rgb(59, 130, 246)' }
        ];

        chartConfigs.forEach(config => {
            const canvas = document.getElementById(config.id);
            if (canvas) {
                // ✅ CHANGE 5: Added MLFQ to analytics chart labels and data
                this.analyticsCharts[config.id] = new Chart(canvas, {
                    type: 'bar',
                    data: {
                        labels: ['FCFS', 'SJF', 'SRTF', 'RR', 'Priority', 'Preemptive Priority', 'MLFQ'],
                        datasets: [{
                            label: config.label,
                            data: [0, 0, 0, 0, 0, 0, 0],
                            backgroundColor: config.color,
                            borderColor: config.color,
                            borderWidth: 1
                        }]
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            legend: { display: false }
                        },
                        scales: {
                            y: {
                                beginAtZero: true,
                                ticks: { color: 'rgb(156, 163, 175)' },
                                grid: { color: 'rgb(75, 85, 99)' }
                            },
                            x: {
                                ticks: { color: 'rgb(156, 163, 175)' },
                                grid: { color: 'rgb(75, 85, 99)' }
                            }
                        }
                    }
                });
            }
        });
    }

    updateAnalyticsPage() {
        if (!this.analyticsData) {
            document.getElementById('analytics-no-data').classList.remove('hidden');
            document.getElementById('analytics-content').classList.add('hidden');
            return;
        }

        document.getElementById('analytics-no-data').classList.add('hidden');
        document.getElementById('analytics-content').classList.remove('hidden');

        const selectedMetrics = this.analyticsData[this.selectedAlgorithm] || Object.values(this.analyticsData)[0];
        if (selectedMetrics) {
            document.getElementById('analytics-avgWaitingTime').textContent = selectedMetrics.avgWaitingTime.toFixed(2);
            document.getElementById('analytics-avgTurnaroundTime').textContent = selectedMetrics.avgTurnaroundTime.toFixed(2);
            document.getElementById('analytics-cpuUtilization').textContent = selectedMetrics.cpuUtilization.toFixed(1) + '%';
            document.getElementById('analytics-throughput').textContent = selectedMetrics.throughput.toFixed(2);
            document.getElementById('analytics-totalProcesses').textContent = this.processes.length;
            document.getElementById('analytics-totalExecutionTime').textContent = selectedMetrics.maxCompletionTime || 0;
            document.getElementById('analytics-contextSwitches').textContent = selectedMetrics.contextSwitches || 0;
        }

        const bestAlgorithm = this.metrics.findBestAlgorithm(this.analyticsData, 'avgWaitingTime');

        // ✅ CHANGE 6: Added mlfq to analytics best algorithm display names
        const algorithmNames = {
            fcfs: 'FCFS',
            sjf: 'SJF',
            srtf: 'SRTF',
            rr: 'Round Robin',
            priority: 'Priority',
            preemptivePriority: 'Preemptive Priority',
            mlfq: 'MLFQ'
        };
        document.getElementById('analytics-bestAlgorithm').textContent = algorithmNames[bestAlgorithm] || '-';

        this.updateAnalyticsCharts();
        this.updateAnalyticsComparisonTable();
    }

    updateAnalyticsCharts() {
        // ✅ CHANGE 7: Added mlfq to analytics chart data population
        const algorithms = ['fcfs', 'sjf', 'srtf', 'rr', 'priority', 'preemptivePriority', 'mlfq'];

        Object.keys(this.analyticsCharts).forEach(chartId => {
            const chart = this.analyticsCharts[chartId];
            const metricKey = chartId.includes('waiting') ? 'avgWaitingTime' :
                             chartId.includes('turnaround') ? 'avgTurnaroundTime' :
                             chartId.includes('cpu') ? 'cpuUtilization' : 'throughput';

            const data = algorithms.map(alg => {
                const metrics = this.analyticsData[alg];
                return metrics ? metrics[metricKey] : 0;
            });

            chart.data.datasets[0].data = data;
            chart.update();
        });
    }

    updateAnalyticsComparisonTable() {
        const tbody = document.getElementById('analytics-comparisonTableBody');

        // ✅ Also updated here for consistency
        const algorithmNames = {
            fcfs: 'FCFS',
            sjf: 'SJF',
            srtf: 'SRTF',
            rr: 'Round Robin',
            priority: 'Priority',
            preemptivePriority: 'Preemptive Priority',
            mlfq: 'MLFQ'
        };

        const bestWaitingTime = this.metrics.findBestAlgorithm(this.analyticsData, 'avgWaitingTime');
        const bestTurnaroundTime = this.metrics.findBestAlgorithm(this.analyticsData, 'avgTurnaroundTime');
        const bestCPUUtilization = this.metrics.findBestAlgorithm(this.analyticsData, 'cpuUtilization');
        const bestThroughput = this.metrics.findBestAlgorithm(this.analyticsData, 'throughput');
        const bestContextSwitches = this.metrics.findBestAlgorithm(this.analyticsData, 'contextSwitches');

        tbody.innerHTML = '';
        Object.keys(this.analyticsData).forEach(algorithm => {
            const data = this.analyticsData[algorithm];
            const isBestWaiting = algorithm === bestWaitingTime;
            const isBestTurnaround = algorithm === bestTurnaroundTime;
            const isBestCPU = algorithm === bestCPUUtilization;
            const isBestThroughput = algorithm === bestThroughput;
            const isBestContext = algorithm === bestContextSwitches;

            const row = document.createElement('tr');
            row.className = 'border-b border-gray-700';

            const nameCell = document.createElement('td');
            nameCell.className = 'py-3 px-2 font-semibold text-blue-400';
            nameCell.textContent = algorithmNames[algorithm] || algorithm;
            row.appendChild(nameCell);

            const waitingCell = document.createElement('td');
            waitingCell.className = `py-3 px-2 ${isBestWaiting ? 'text-green-400 font-bold' : ''}`;
            waitingCell.textContent = `${data.avgWaitingTime.toFixed(2)} ${isBestWaiting ? '★' : ''}`;
            row.appendChild(waitingCell);

            const turnaroundCell = document.createElement('td');
            turnaroundCell.className = `py-3 px-2 ${isBestTurnaround ? 'text-green-400 font-bold' : ''}`;
            turnaroundCell.textContent = `${data.avgTurnaroundTime.toFixed(2)} ${isBestTurnaround ? '★' : ''}`;
            row.appendChild(turnaroundCell);

            const cpuCell = document.createElement('td');
            cpuCell.className = `py-3 px-2 ${isBestCPU ? 'text-green-400 font-bold' : ''}`;
            cpuCell.textContent = `${data.cpuUtilization.toFixed(1)}% ${isBestCPU ? '★' : ''}`;
            row.appendChild(cpuCell);

            const throughputCell = document.createElement('td');
            throughputCell.className = `py-3 px-2 ${isBestThroughput ? 'text-green-400 font-bold' : ''}`;
            throughputCell.textContent = `${data.throughput.toFixed(2)} ${isBestThroughput ? '★' : ''}`;
            row.appendChild(throughputCell);

            const contextCell = document.createElement('td');
            contextCell.className = `py-3 px-2 ${isBestContext ? 'text-green-400 font-bold' : ''}`;
            contextCell.textContent = `${data.contextSwitches} ${isBestContext ? '★' : ''}`;
            row.appendChild(contextCell);

            tbody.appendChild(row);
        });
    }
}

// Initialize app when DOM is ready
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new App();
});
