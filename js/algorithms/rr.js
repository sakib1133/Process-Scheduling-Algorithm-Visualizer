/**
 * Round Robin Algorithm
 * Preemptive scheduling algorithm with time quantum
 */

class RoundRobin {
    /**
     * Execute Round Robin scheduling
     * @param {Array} processes - Array of process objects
     * @param {number} timeQuantum - Time quantum for each process
     * @returns {Object} Scheduling result
     */
    execute(processes, timeQuantum) {
        const schedule = [];
        const processesCopy = processes.map(p => ({ ...p, remainingTime: p.burstTime }));
        let currentTime = 0;
        let contextSwitches = 0;
        let lastProcessId = null;
        const readyQueue = [];
        const completed = new Set();
        let processIndex = 0;

        while (completed.size < processesCopy.length) {
            // Add newly arrived processes to ready queue
            while (processIndex < processesCopy.length && 
                   processesCopy[processIndex].arrivalTime <= currentTime) {
                readyQueue.push(processesCopy[processIndex]);
                processIndex++;
            }

            if (readyQueue.length === 0) {
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

            // Get next process from ready queue
            const currentProcess = readyQueue.shift();

            // Calculate execution time
            const executionTime = Math.min(timeQuantum, currentProcess.remainingTime);
            const startTime = currentTime;
            const endTime = startTime + executionTime;

            // Execute the process
            schedule.push({
                processId: currentProcess.id,
                startTime: startTime,
                endTime: endTime,
                duration: executionTime
            });

            // Count context switch if different from last process
            if (lastProcessId !== null && lastProcessId !== currentProcess.id) {
                contextSwitches++;
            }

            currentTime = endTime;
            currentProcess.remainingTime -= executionTime;
            lastProcessId = currentProcess.id;

            // Add newly arrived processes during execution
            while (processIndex < processesCopy.length && 
                   processesCopy[processIndex].arrivalTime <= currentTime) {
                readyQueue.push(processesCopy[processIndex]);
                processIndex++;
            }

            // If process not completed, add back to ready queue
            if (currentProcess.remainingTime > 0) {
                readyQueue.push(currentProcess);
            } else {
                completed.add(currentProcess.id);
            }
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
