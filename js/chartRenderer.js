/**
 * Chart Renderer
 * Handles Chart.js integration for performance comparison charts
 */

class ChartRenderer {
    constructor() {
        this.charts = {};
        this.defaultOptions = {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    labels: {
                        color: '#9CA3AF',
                        font: {
                            size: 12
                        }
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#9CA3AF',
                        font: {
                            size: 11
                        }
                    },
                    grid: {
                        color: '#374151'
                    }
                },
                y: {
                    ticks: {
                        color: '#9CA3AF',
                        font: {
                            size: 11
                        }
                    },
                    grid: {
                        color: '#374151'
                    }
                }
            }
        };
    }

    /**
     * Initialize all charts
     */
    initCharts() {
        this.createWaitingTimeChart();
        this.createTurnaroundTimeChart();
        this.createCPUUtilizationChart();
        this.createThroughputChart();
    }

    /**
     * Create waiting time comparison chart
     */
    createWaitingTimeChart() {
        const ctx = document.getElementById('waitingTimeChart');
        if (!ctx) return;

        this.charts.waitingTime = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: [],
                datasets: [{
                    label: 'Avg Waiting Time',
                    data: [],
                    backgroundColor: [
                        'rgba(59, 130, 246, 0.7)',
                        'rgba(16, 185, 129, 0.7)',
                        'rgba(139, 92, 246, 0.7)',
                        'rgba(249, 115, 22, 0.7)',
                        'rgba(236, 72, 153, 0.7)',
                        'rgba(14, 165, 233, 0.7)'
                    ],
                    borderColor: [
                        'rgba(59, 130, 246, 1)',
                        'rgba(16, 185, 129, 1)',
                        'rgba(139, 92, 246, 1)',
                        'rgba(249, 115, 22, 1)',
                        'rgba(236, 72, 153, 1)',
                        'rgba(14, 165, 233, 1)'
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                ...this.defaultOptions,
                plugins: {
                    ...this.defaultOptions.plugins,
                    title: {
                        display: true,
                        text: 'Average Waiting Time by Algorithm',
                        color: '#E5E7EB',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    }
                },
                scales: {
                    ...this.defaultOptions.scales,
                    y: {
                        ...this.defaultOptions.scales.y,
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Time Units',
                            color: '#9CA3AF'
                        }
                    }
                }
            }
        });
    }

    /**
     * Create turnaround time comparison chart
     */
    createTurnaroundTimeChart() {
        const ctx = document.getElementById('turnaroundTimeChart');
        if (!ctx) return;

        this.charts.turnaroundTime = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: [],
                datasets: [{
                    label: 'Avg Turnaround Time',
                    data: [],
                    backgroundColor: [
                        'rgba(59, 130, 246, 0.7)',
                        'rgba(16, 185, 129, 0.7)',
                        'rgba(139, 92, 246, 0.7)',
                        'rgba(249, 115, 22, 0.7)',
                        'rgba(236, 72, 153, 0.7)',
                        'rgba(14, 165, 233, 0.7)'
                    ],
                    borderColor: [
                        'rgba(59, 130, 246, 1)',
                        'rgba(16, 185, 129, 1)',
                        'rgba(139, 92, 246, 1)',
                        'rgba(249, 115, 22, 1)',
                        'rgba(236, 72, 153, 1)',
                        'rgba(14, 165, 233, 1)'
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                ...this.defaultOptions,
                plugins: {
                    ...this.defaultOptions.plugins,
                    title: {
                        display: true,
                        text: 'Average Turnaround Time by Algorithm',
                        color: '#E5E7EB',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    }
                },
                scales: {
                    ...this.defaultOptions.scales,
                    y: {
                        ...this.defaultOptions.scales.y,
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Time Units',
                            color: '#9CA3AF'
                        }
                    }
                }
            }
        });
    }

    /**
     * Create CPU utilization comparison chart
     */
    createCPUUtilizationChart() {
        const ctx = document.getElementById('cpuUtilizationChart');
        if (!ctx) return;

        this.charts.cpuUtilization = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: [],
                datasets: [{
                    label: 'CPU Utilization',
                    data: [],
                    backgroundColor: [
                        'rgba(59, 130, 246, 0.7)',
                        'rgba(16, 185, 129, 0.7)',
                        'rgba(139, 92, 246, 0.7)',
                        'rgba(249, 115, 22, 0.7)',
                        'rgba(236, 72, 153, 0.7)',
                        'rgba(14, 165, 233, 0.7)'
                    ],
                    borderColor: [
                        'rgba(59, 130, 246, 1)',
                        'rgba(16, 185, 129, 1)',
                        'rgba(139, 92, 246, 1)',
                        'rgba(249, 115, 22, 1)',
                        'rgba(236, 72, 153, 1)',
                        'rgba(14, 165, 233, 1)'
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                ...this.defaultOptions,
                plugins: {
                    ...this.defaultOptions.plugins,
                    title: {
                        display: true,
                        text: 'CPU Utilization by Algorithm',
                        color: '#E5E7EB',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    }
                },
                scales: {
                    ...this.defaultOptions.scales,
                    y: {
                        ...this.defaultOptions.scales.y,
                        beginAtZero: true,
                        max: 100,
                        title: {
                            display: true,
                            text: 'Percentage (%)',
                            color: '#9CA3AF'
                        }
                    }
                }
            }
        });
    }

    /**
     * Create throughput comparison chart
     */
    createThroughputChart() {
        const ctx = document.getElementById('throughputChart');
        if (!ctx) return;

        this.charts.throughput = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: [],
                datasets: [{
                    label: 'Throughput',
                    data: [],
                    backgroundColor: [
                        'rgba(59, 130, 246, 0.7)',
                        'rgba(16, 185, 129, 0.7)',
                        'rgba(139, 92, 246, 0.7)',
                        'rgba(249, 115, 22, 0.7)',
                        'rgba(236, 72, 153, 0.7)',
                        'rgba(14, 165, 233, 0.7)'
                    ],
                    borderColor: [
                        'rgba(59, 130, 246, 1)',
                        'rgba(16, 185, 129, 1)',
                        'rgba(139, 92, 246, 1)',
                        'rgba(249, 115, 22, 1)',
                        'rgba(236, 72, 153, 1)',
                        'rgba(14, 165, 233, 1)'
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                ...this.defaultOptions,
                plugins: {
                    ...this.defaultOptions.plugins,
                    title: {
                        display: true,
                        text: 'Throughput by Algorithm',
                        color: '#E5E7EB',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    }
                },
                scales: {
                    ...this.defaultOptions.scales,
                    y: {
                        ...this.defaultOptions.scales.y,
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Processes/Time Unit',
                            color: '#9CA3AF'
                        }
                    }
                }
            }
        });
    }

    /**
     * Update all charts with comparison data
     * @param {Object} comparisonData - Comparison results for all algorithms
     */
    updateCharts(comparisonData) {
        const algorithmNames = {
            fcfs: 'FCFS',
            sjf: 'SJF',
            srtf: 'SRTF',
            rr: 'Round Robin',
            priority: 'Priority',
            preemptivePriority: 'Preemptive Priority'
        };

        const labels = Object.keys(comparisonData).map(key => algorithmNames[key] || key);
        const waitingTimeData = Object.values(comparisonData).map(data => data.avgWaitingTime);
        const turnaroundTimeData = Object.values(comparisonData).map(data => data.avgTurnaroundTime);
        const cpuUtilizationData = Object.values(comparisonData).map(data => data.cpuUtilization);
        const throughputData = Object.values(comparisonData).map(data => data.throughput);

        // Update waiting time chart
        if (this.charts.waitingTime) {
            this.charts.waitingTime.data.labels = labels;
            this.charts.waitingTime.data.datasets[0].data = waitingTimeData;
            this.charts.waitingTime.update();
        }

        // Update turnaround time chart
        if (this.charts.turnaroundTime) {
            this.charts.turnaroundTime.data.labels = labels;
            this.charts.turnaroundTime.data.datasets[0].data = turnaroundTimeData;
            this.charts.turnaroundTime.update();
        }

        // Update CPU utilization chart
        if (this.charts.cpuUtilization) {
            this.charts.cpuUtilization.data.labels = labels;
            this.charts.cpuUtilization.data.datasets[0].data = cpuUtilizationData;
            this.charts.cpuUtilization.update();
        }

        // Update throughput chart
        if (this.charts.throughput) {
            this.charts.throughput.data.labels = labels;
            this.charts.throughput.data.datasets[0].data = throughputData;
            this.charts.throughput.update();
        }
    }

    /**
     * Destroy all charts
     */
    destroyCharts() {
        Object.keys(this.charts).forEach(key => {
            if (this.charts[key]) {
                this.charts[key].destroy();
                delete this.charts[key];
            }
        });
    }
}
