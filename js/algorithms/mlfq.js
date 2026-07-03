/**
 * MLFQ (Multilevel Feedback Queue) Algorithm
 * 
 * 3 queues with different time quantums:
 * Queue 0: quantum = 4  (highest priority)
 * Queue 1: quantum = 8  (medium priority)
 * Queue 2: quantum = Infinity (lowest priority, runs to completion)
 * 
 * New processes always start in Queue 0.
 * If a process doesn't finish in its quantum, it moves to next queue.
 * Higher priority queues are always checked first.
 */

class MLFQ {
    execute(processes, timeQuantum = null) {
        const schedule = [];
        const contextSwitches = { count: 0 };
        let lastProcessId = null;

        // 3 queues with their time quantums
        const queues = [
            { quantum: 4,        ready: [] },
            { quantum: 8,        ready: [] },
            { quantum: Infinity, ready: [] }
        ];

        // Copy processes and add tracking fields
        const processesCopy = processes.map(p => ({
            ...p,
            remainingTime: p.burstTime,
            currentQueue: 0,       // all start in Queue 0
            finishedAt: null
        }));

        let currentTime = 0;
        const arrived = new Set();    // processes that have been queued
        const completed = new Set();  // processes that are done

        // Helper: add newly arrived processes to Queue 0
        const enqueueArrivals = () => {
            processesCopy.forEach(p => {
                if (p.arrivalTime <= currentTime && !arrived.has(p.id)) {
                    queues[0].ready.push(p);
                    arrived.add(p.id);
                }
            });
        };

        // Helper: find next process arrival time
        const nextArrivalTime = () => {
            const pending = processesCopy.filter(p => !arrived.has(p.id));
            if (pending.length === 0) return Infinity;
            return Math.min(...pending.map(p => p.arrivalTime));
        };

        // Helper: pick highest priority non-empty queue
        const getNextProcess = () => {
            for (const queue of queues) {
                if (queue.ready.length > 0) {
                    return { process: queue.ready[0], queue };
                }
            }
            return null;
        };

        enqueueArrivals();

        while (completed.size < processesCopy.length) {
            const next = getNextProcess();

            // No process ready — CPU is idle
            if (!next) {
                const idleUntil = nextArrivalTime();
                if (idleUntil === Infinity) break;

                schedule.push({
                    processId: 'idle',
                    startTime: currentTime,
                    endTime: idleUntil,
                    duration: idleUntil - currentTime,
                    queueLevel: null
                });

                currentTime = idleUntil;
                enqueueArrivals();
                continue;
            }

            const { process: proc, queue } = next;
            const quantum = queue.quantum;
            const queueIndex = queues.indexOf(queue);

            // Context switch check
            if (lastProcessId !== null && lastProcessId !== proc.id) {
                contextSwitches.count++;
            }

            // How long will this process run?
            // It runs for quantum time OR until it finishes, whichever is sooner
            // BUT we also stop early if a new process arrives (so it can enter Q0)
            const nextArrival = nextArrivalTime();
            const runUntilFinish = currentTime + proc.remainingTime;
            const runUntilQuantum = currentTime + quantum;
            const runUntilArrival = nextArrival; // preempt if new process arrives

            const endTime = Math.min(runUntilFinish, runUntilQuantum, runUntilArrival);
            const ran = endTime - currentTime;

            // Record this block in the schedule
            schedule.push({
                processId: proc.id,
                startTime: currentTime,
                endTime: endTime,
                duration: ran,
                queueLevel: queueIndex  // which queue it ran from
            });

            proc.remainingTime -= ran;
            currentTime = endTime;
            lastProcessId = proc.id;

            // Enqueue any new arrivals first (they go to Q0)
            enqueueArrivals();

            // Remove process from current queue
            queue.ready.shift();

            if (proc.remainingTime === 0) {
                // Process finished
                proc.finishedAt = currentTime;
                completed.add(proc.id);
            } else if (currentTime >= runUntilQuantum && proc.remainingTime > 0) {
                // Quantum expired — demote to next queue
                const nextQueueIndex = Math.min(queueIndex + 1, queues.length - 1);
                proc.currentQueue = nextQueueIndex;
                queues[nextQueueIndex].ready.push(proc);
            } else {
                // Was preempted by a new arrival — stay in same queue
                queue.ready.unshift(proc);
            }
        }

        return {
            schedule,
            processes: processesCopy,
            totalTime: currentTime,
            contextSwitches: contextSwitches.count
        };
    }
}