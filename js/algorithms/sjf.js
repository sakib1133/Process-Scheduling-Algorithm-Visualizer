/**
 * SJF (Shortest Job First) Algorithm with Aging
 * Non-preemptive scheduling algorithm
 * 
 * Aging fix: if a process waits more than STARVATION_THRESHOLD
 * time units, it gets forced to the front of the queue.
 * This prevents long processes from waiting forever.
 */

class SJF {
    /**
     * Execute SJF scheduling
     * @param {Array} processes - Array of process objects
     * @param {number} timeQuantum - Not used for SJF
     * @returns {Object} Scheduling result
     */
    execute(processes, timeQuantum = null) {
        const STARVATION_THRESHOLD = 20; // if waiting > 20 units, force to front

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

            // Calculate how long each process has been waiting
            arrivedProcesses.forEach(p => {
                p.waitingTime = currentTime - p.arrivalTime;
            });

            // Check if any process has been waiting too long (starvation)
            const starvingProcess = arrivedProcesses.find(
                p => p.waitingTime >= STARVATION_THRESHOLD
            );

            let selectedProcess;

            if (starvingProcess) {
                // Aging: pick the process that has waited the longest
                // This prevents starvation of long burst-time processes
                arrivedProcesses.sort((a, b) => {
                    if (a.waitingTime !== b.waitingTime) {
                        return b.waitingTime - a.waitingTime; // longest wait first
                    }
                    return String(a.id).localeCompare(String(b.id));
                });
                selectedProcess = arrivedProcesses[0];
            } else {
                // Normal SJF: shortest burst time first
                // Tiebreaker 1: arrival time (earlier = higher priority)
                // Tiebreaker 2: process ID (smaller = higher priority)
                arrivedProcesses.sort((a, b) => {
                    if (a.burstTime !== b.burstTime) {
                        return a.burstTime - b.burstTime;
                    }
                    if (a.arrivalTime !== b.arrivalTime) {
                        return a.arrivalTime - b.arrivalTime;
                    }
                    return String(a.id).localeCompare(String(b.id));
                });
                selectedProcess = arrivedProcesses[0];
            }

            // Execute the process to completion
            const startTime = currentTime;
            const endTime = startTime + selectedProcess.burstTime;
            schedule.push({
                processId: selectedProcess.id,
                startTime: startTime,
                endTime: endTime,
                duration: selectedProcess.burstTime,
                wasStarving: !!starvingProcess // track if aging was triggered
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