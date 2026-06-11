/**
 * FCFS (First Come First Serve) Algorithm
 * Non-preemptive scheduling algorithm
 */

class FCFS {
    /**
     * Execute FCFS scheduling
     * @param {Array} processes - Array of process objects
     * @param {number} timeQuantum - Not used for FCFS
     * @returns {Object} Scheduling result
     */
    execute(processes, timeQuantum = null) {
        const schedule = [];
        const processesCopy = processes.map(p => ({ ...p }));
        let currentTime = 0;
        let contextSwitches = 0;
        let lastProcessId = null;

        for (const process of processesCopy) {
            // Handle idle time if CPU is free before process arrives
            if (process.arrivalTime > currentTime) {
                const idleDuration = process.arrivalTime - currentTime;
                schedule.push({
                    processId: 'idle',
                    startTime: currentTime,
                    endTime: process.arrivalTime,
                    duration: idleDuration
                });
                currentTime = process.arrivalTime;
                lastProcessId = 'idle';
            }

            // Execute the process
            const startTime = currentTime;
            const endTime = startTime + process.burstTime;
            schedule.push({
                processId: process.id,
                startTime: startTime,
                endTime: endTime,
                duration: process.burstTime
            });

            // Count context switch if different from last process
            if (lastProcessId !== null && lastProcessId !== process.id) {
                contextSwitches++;
            }

            currentTime = endTime;
            lastProcessId = process.id;
        }

        return {
            schedule: schedule,
            processes: processesCopy,
            totalTime: currentTime,
            contextSwitches: contextSwitches
        };
    }
}
