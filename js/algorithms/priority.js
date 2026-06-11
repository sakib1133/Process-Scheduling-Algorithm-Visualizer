/**
 * Priority Scheduling Algorithm
 * Non-preemptive scheduling algorithm
 */

class Priority {
    /**
     * Execute Priority scheduling (non-preemptive)
     * @param {Array} processes - Array of process objects
     * @param {number} timeQuantum - Not used for Priority
     * @returns {Object} Scheduling result
     */
    execute(processes, timeQuantum = null) {
        const schedule = [];
        const processesCopy = processes.map(p => ({ ...p }));
        let currentTime = 0;
        let contextSwitches = 0;
        let lastProcessId = null;
        const completed = new Set();

        while (completed.size < processesCopy.length) {
            // Find arrived processes that are not completed
            const arrivedProcesses = processesCopy.filter(p => 
                p.arrivalTime <= currentTime && !completed.has(p.id)
            );

            if (arrivedProcesses.length === 0) {
                // Find next arrival time
                const nextArrival = processesCopy
                    .filter(p => !completed.has(p.id))
                    .reduce((min, p) => Math.min(min, p.arrivalTime), Infinity);

                if (nextArrival !== Infinity) {
                    // Add idle block
                    const idleDuration = nextArrival - currentTime;
                    schedule.push({
                        processId: 'idle',
                        startTime: currentTime,
                        endTime: nextArrival,
                        duration: idleDuration
                    });
                    currentTime = nextArrival;
                    lastProcessId = 'idle';
                }
                continue;
            }

            // Select process with highest priority (lowest number), arrival time as tiebreaker
            arrivedProcesses.sort((a, b) => {
                if (a.priority !== b.priority) {
                    return a.priority - b.priority;
                }
                return a.arrivalTime - b.arrivalTime;
            });

            const selectedProcess = arrivedProcesses[0];

            // Execute the process to completion
            const startTime = currentTime;
            const endTime = startTime + selectedProcess.burstTime;
            schedule.push({
                processId: selectedProcess.id,
                startTime: startTime,
                endTime: endTime,
                duration: selectedProcess.burstTime
            });

            // Count context switch if different from last process
            if (lastProcessId !== null && lastProcessId !== selectedProcess.id) {
                contextSwitches++;
            }

            currentTime = endTime;
            lastProcessId = selectedProcess.id;
            completed.add(selectedProcess.id);
        }

        return {
            schedule: schedule,
            processes: processesCopy,
            totalTime: currentTime,
            contextSwitches: contextSwitches
        };
    }
}
