/**
 * Metrics Calculator
 * Calculates and displays scheduling performance metrics
 */

class Metrics {
    /**
     * Calculate all metrics for a set of processes
     * @param {Array} processes - Array of process objects with calculated metrics
     * @returns {Object} Calculated metrics
     */
    calculate(processes) {
        if (!processes || processes.length === 0) {
            return {
                avgWaitingTime: 0,
                avgTurnaroundTime: 0,
                cpuUtilization: 0,
                throughput: 0,
                totalBurstTime: 0,
                totalWaitingTime: 0,
                totalTurnaroundTime: 0
            };
        }

        const totalBurstTime = processes.reduce((sum, p) => sum + p.burstTime, 0);
        const totalWaitingTime = processes.reduce((sum, p) => sum + p.waitingTime, 0);
        const totalTurnaroundTime = processes.reduce((sum, p) => sum + p.turnaroundTime, 0);
        
        const avgWaitingTime = totalWaitingTime / processes.length;
        const avgTurnaroundTime = totalTurnaroundTime / processes.length;
        
        // CPU utilization = (Total burst time / Total completion time) * 100
        const maxCompletionTime = Math.max(...processes.map(p => p.completionTime));
        const cpuUtilization = maxCompletionTime > 0 
            ? (totalBurstTime / maxCompletionTime) * 100 
            : 0;
        
        // Throughput = Number of processes / Total completion time
        const throughput = maxCompletionTime > 0 
            ? processes.length / maxCompletionTime 
            : 0;

        return {
            avgWaitingTime,
            avgTurnaroundTime,
            cpuUtilization,
            throughput,
            totalBurstTime,
            totalWaitingTime,
            totalTurnaroundTime,
            maxCompletionTime
        };
    }

    /**
     * Calculate average waiting time
     * @param {Array} processes - Array of process objects
     * @returns {number} Average waiting time
     */
    calculateAvgWaitingTime(processes) {
        if (!processes || processes.length === 0) return 0;
        
        const totalWaitingTime = processes.reduce((sum, p) => sum + p.waitingTime, 0);
        return totalWaitingTime / processes.length;
    }

    /**
     * Calculate average turnaround time
     * @param {Array} processes - Array of process objects
     * @returns {number} Average turnaround time
     */
    calculateAvgTurnaroundTime(processes) {
        if (!processes || processes.length === 0) return 0;
        
        const totalTurnaroundTime = processes.reduce((sum, p) => sum + p.turnaroundTime, 0);
        return totalTurnaroundTime / processes.length;
    }

    /**
     * Calculate CPU utilization
     * @param {Array} processes - Array of process objects
     * @returns {number} CPU utilization percentage
     */
    calculateCPUUtilization(processes) {
        if (!processes || processes.length === 0) return 0;
        
        const totalBurstTime = processes.reduce((sum, p) => sum + p.burstTime, 0);
        const maxCompletionTime = Math.max(...processes.map(p => p.completionTime));
        
        return maxCompletionTime > 0 
            ? (totalBurstTime / maxCompletionTime) * 100 
            : 0;
    }

    /**
     * Calculate throughput
     * @param {Array} processes - Array of process objects
     * @returns {number} Throughput (processes per time unit)
     */
    calculateThroughput(processes) {
        if (!processes || processes.length === 0) return 0;
        
        const maxCompletionTime = Math.max(...processes.map(p => p.completionTime));
        return maxCompletionTime > 0 
            ? processes.length / maxCompletionTime 
            : 0;
    }

    /**
     * Compare metrics between different algorithms
     * @param {Object} results - Object with algorithm names as keys and metrics as values
     * @returns {Object} Comparison results
     */
    compareAlgorithms(results) {
        const comparison = {};
        
        Object.keys(results).forEach(algorithm => {
            comparison[algorithm] = this.calculate(results[algorithm]);
        });

        return comparison;
    }

    /**
     * Find the best algorithm based on a specific metric
     * @param {Object} results - Object with algorithm names as keys and metrics as values
     * @param {string} metric - Metric to optimize ('avgWaitingTime', 'avgTurnaroundTime', etc.)
     * @returns {string} Best algorithm name
     */
    findBestAlgorithm(results, metric = 'avgWaitingTime') {
        let bestAlgorithm = null;
        let bestValue = metric.includes('Time') || metric === 'cpuUtilization' || metric === 'contextSwitches'
            ? Infinity 
            : -Infinity;

        Object.keys(results).forEach(algorithm => {
            const value = results[algorithm][metric];
            
            if (metric.includes('Time') || metric === 'cpuUtilization' || metric === 'contextSwitches') {
                if (value < bestValue) {
                    bestValue = value;
                    bestAlgorithm = algorithm;
                }
            } else {
                if (value > bestValue) {
                    bestValue = value;
                    bestAlgorithm = algorithm;
                }
            }
        });

        return bestAlgorithm;
    }

    /**
     * Format metric value for display
     * @param {number} value - Metric value
     * @param {string} metric - Metric type
     * @returns {string} Formatted value
     */
    formatMetric(value, metric) {
        if (metric === 'cpuUtilization') {
            return value.toFixed(1) + '%';
        }
        if (metric === 'throughput') {
            return value.toFixed(2) + ' processes/unit';
        }
        return value.toFixed(2);
    }
}
