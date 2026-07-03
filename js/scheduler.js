/**
 * Scheduler Core
 * Coordinates algorithm execution and manages scheduling logic
 */

class Scheduler {
    constructor() {
        this.algorithms = {
            fcfs: new FCFS(),
            sjf: new SJF(),
            srtf: new SRTF(),
            rr: new RoundRobin(),
            priority: new Priority(),
            preemptivePriority: new PreemptivePriority(),
            mlfq: new MLFQ()  // ← ADDED
        };
    }

    /**
     * Schedule processes using the specified algorithm
     * @param {Array} processes - Array of process objects
     * @param {string} algorithm - Algorithm name
     * @param {number} timeQuantum - Time quantum for Round Robin (optional)
     * @returns {Object} Scheduling result with schedule and metrics
     */
    schedule(processes, algorithm, timeQuantum = null) {
        if (!this.algorithms[algorithm]) {
            throw new Error(`Algorithm ${algorithm} not implemented`);
        }

        // Sort processes by arrival time
        const sortedProcesses = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);

        // Execute the selected algorithm
        const result = this.algorithms[algorithm].execute(sortedProcesses, timeQuantum);

        // Calculate completion times, turnaround times, and waiting times
        this.calculateProcessMetrics(result.processes, result.schedule);

        return {
            schedule: result.schedule,
            processes: result.processes,
            totalTime: result.totalTime,
            contextSwitches: result.contextSwitches || 0
        };
    }

    /**
     * Calculate process metrics based on schedule
     * @param {Array} processes - Process objects
     * @param {Array} schedule - Execution schedule
     */
    calculateProcessMetrics(processes, schedule) {
        // Find completion time for each process
        const completionTimes = {};
        
        schedule.forEach(block => {
            if (block.processId !== 'idle') {
                completionTimes[block.processId] = block.endTime;
            }
        });

        // Calculate metrics for each process
        processes.forEach(process => {
            process.completionTime = completionTimes[process.id] || 0;
            process.turnaroundTime = process.completionTime - process.arrivalTime;
            process.waitingTime = process.turnaroundTime - process.burstTime;
        });
    }

    /**
     * Validate process data
     * @param {Array} processes - Process objects to validate
     * @returns {boolean} True if valid
     */
    validateProcesses(processes) {
        if (!processes || processes.length === 0) {
            return false;
        }

        return processes.every(p => {
            return p.id && 
                   typeof p.arrivalTime === 'number' && p.arrivalTime >= 0 &&
                   typeof p.burstTime === 'number' && p.burstTime > 0 &&
                   typeof p.priority === 'number' && p.priority > 0;
        });
    }

    /**
     * Get available algorithms
     * @returns {Array} Array of algorithm names
     */
    getAvailableAlgorithms() {
        return Object.keys(this.algorithms);
    }

    /**
     * Get algorithm information
     * @param {string} algorithm - Algorithm name
     * @returns {Object} Algorithm metadata
     */
    getAlgorithmInfo(algorithm) {
        const info = {
            fcfs: {
                name: 'First Come First Serve',
                type: 'non-preemptive',
                description: 'Processes are executed in the order they arrive'
            },
            sjf: {
                name: 'Shortest Job First',
                type: 'non-preemptive',
                description: 'Process with the shortest burst time is executed first'
            },
            srtf: {
                name: 'Shortest Remaining Time First',
                type: 'preemptive',
                description: 'Process with the shortest remaining time is executed first'
            },
            rr: {
                name: 'Round Robin',
                type: 'preemptive',
                description: 'Each process gets a fixed time quantum to execute'
            },
            priority: {
                name: 'Priority Scheduling',
                type: 'non-preemptive',
                description: 'Process with highest priority is executed first'
            },
            preemptivePriority: {
                name: 'Preemptive Priority',
                type: 'preemptive',
                description: 'Higher priority process can preempt lower priority process'
            },
            mlfq: {                                   
                name: 'Multilevel Feedback Queue',    
                type: 'preemptive',                   
                description: 'Processes move between queues based on CPU usage. Q0 (quantum=4) → Q1 (quantum=8) → Q2 (FCFS). How real OS schedulers work.'
            }                                         
        };

        return info[algorithm] || null;
    }
}