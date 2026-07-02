/**
 * SRTF (Shortest Remaining Time First) Algorithm
 * Preemptive scheduling algorithm
 */

class SRTF {
    /**
     * Execute SRTF scheduling
     * @param {Array} processes - Array of process objects
     * @param {number} timeQuantum - Not used for SRTF
     * @returns {Object} Scheduling result
     */
    execute(processes, timeQuantum = null) {
        const schedule = [];
        const processesCopy = processes.map(p => ({ ...p, remainingTime: p.burstTime }));
        let currentTime = 0;
        let contextSwitches = 0;
        let lastProcessId = null;
        let currentProcess = null;
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
                    currentProcess = null;
                }
                continue;
            }

            // Select process with shortest remaining time
            // Tiebreaker 1: arrival time (earlier = higher priority)
            // Tiebreaker 2: process ID (smaller = higher priority)
            arrivedProcesses.sort((a, b) => {
                if (a.remainingTime !== b.remainingTime) {
                    return a.remainingTime - b.remainingTime;
                }
                if (a.arrivalTime !== b.arrivalTime) {
                    return a.arrivalTime - b.arrivalTime;
                }
                return String(a.id).localeCompare(String(b.id));
            });

            const selectedProcess = arrivedProcesses[0];

            // Check if we need to preempt
            if (currentProcess && currentProcess.id !== selectedProcess.id) {
                // Context switch occurred
                contextSwitches++;
            }

            currentProcess = selectedProcess;

            // Execute for 1 time unit
            const startTime = currentTime;
            currentTime++;
            selectedProcess.remainingTime--;

            // Check if process completed
            if (selectedProcess.remainingTime === 0) {
                completed.add(selectedProcess.id);
            }

            // Add schedule block
            schedule.push({
                processId: selectedProcess.id,
                startTime: startTime,
                endTime: currentTime,
                duration: 1
            });

            lastProcessId = selectedProcess.id;
        }

        // Merge adjacent blocks of same process
        const mergedSchedule = [];
        for (const block of schedule) {
            if (mergedSchedule.length === 0) {
                mergedSchedule.push(block);
            } else {
                const lastBlock = mergedSchedule[mergedSchedule.length - 1];
                if (lastBlock.processId === block.processId) {
                    lastBlock.endTime = block.endTime;
                    lastBlock.duration += block.duration;
                } else {
                    mergedSchedule.push(block);
                }
            }
        }

        return {
            schedule: mergedSchedule,
            processes: processesCopy,
            totalTime: currentTime,
            contextSwitches: contextSwitches
        };
    }
}