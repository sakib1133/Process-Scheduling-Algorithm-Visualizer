# CPU Scheduling Algorithm Visualizer

Compact, browser-first simulator that visualizes CPU scheduling behavior with interactive Gantt charts, per-process and aggregate metrics, and side-by-side algorithm comparison — ideal for portfolio demos and interview walkthroughs.

## Project overview
Built using JavaScript, Tailwind CSS, Chart.js, and browser storage APIs to simulate and analyze CPU scheduling algorithms with real-time visualizations and performance analytics. Lightweight, modular web app that simulates process scheduling policies, calculates performance metrics (waiting time, turnaround time, CPU utilization, throughput, context switches), and visualizes execution timelines to compare algorithm trade-offs. Designed to showcase algorithmic reasoning, modular JavaScript architecture, and data visualization skills.

## Feature highlights
- Interactive process editor: add / edit / remove processes (ID, arrival, burst, priority)  
- Single-run simulation or “Compare All” for side-by-side analytics  
- Gantt chart visualization (merged execution blocks, idle segments)  
- Per-process table and aggregate metrics with context-switch accounting  
- Minimal, framework-free front end and small dependency surface (Chart.js)  
- Client-side persistence via `localStorage` for quick experimentation

## Supported algorithms (implemented)
- FCFS — First-Come, First-Served (non-preemptive)  
- SJF — Shortest Job First (non-preemptive)  
- SRTF — Shortest Remaining Time First (preemptive)  
- Round Robin — Time-sliced (configurable quantum)  
- Priority — Priority Scheduling (non-preemptive)  
- Preemptive Priority — Priority with preemption  
- MLFQ — Multilevel Feedback Queue (preemptive, multi-queue demotion/promotion)  
- Advanced schedulers (implemented): Multilevel Queue, Lottery Scheduling

## Technology stack
- JavaScript (ES6+), HTML5, CSS3  
- Tailwind CSS (optional build step)  
- Chart.js for charts and analytics  
- `localStorage` for persistence  
- Dev tooling: Node.js (optional), `http-server` or `python -m http.server` for local hosting

 ## Architecture
- Modular JavaScript architecture
- Separate scheduling engine and UI layer
- Reusable metrics calculation module
- Chart.js powered analytics dashboard
- LocalStorage-based persistence

## Live demo
🔗https://process-scheduling-visualizer.onrender.com/

## Installation (local)
Prerequisites: modern browser. Node.js is optional for the CSS build.

```bash
git clone https://github.com/<sakib1133>/Process-Scheduling-Algorithm-Visualizer.git
cd Process-Scheduling-Algorithm-Visualizer

# optional: install and build Tailwind CSS
npm install
npm run build:css

# Serve locally with Python
python -m http.server 8000
# or with Node
npx http-server
# Open http://localhost:8000
```

## Quick usage
1. Open the app (index.html or served root).  
2. Add processes (ID, arrival, burst, priority).  
3. Select algorithm (or "Compare All") and set Round Robin quantum.  
4. Click **Run Simulation** and inspect the Gantt chart and metrics.

## Project structure
```
.
├── index.html
├── css/
│   └── output.css
├── js/
│   ├── app.js            # UI controller and event handlers
│   ├── scheduler.js      # Algorithm registry and scheduler orchestration
│   ├── ganttChart.js     # Gantt chart renderer
│   ├── chartRenderer.js  # Chart.js wrappers for analytics
│   ├── metrics.js        # Metric calculations
│   └── algorithms/
│       ├── fcfs.js
│       ├── sjf.js
│       ├── srtf.js
│       ├── rr.js
│       ├── priority.js
│       ├── preemptivePriority.js
│       └── mlfq.js       # Multilevel Feedback Queue
└── README.md
```

## Developer notes — add an algorithm
1. Create `js/algorithms/<name>.js`.  
2. Implement a class exposing `execute(processes, timeQuantum?)`.  
3. Return `{ schedule, processes, totalTime, contextSwitches }` where `schedule` is an array of `{ processId, startTime, endTime, duration }`.  
4. Register the class in scheduler.js's algorithm map.

## What this project demonstrates
- Algorithm design and simulation (preemption, time-slicing, queueing)  
- Front-end engineering: modular JS, UI state management, visualization  
- Data-informed reasoning: metrics, comparisons, and trade-off analysis

## Future enhancements
- Add export formats (CSV/PDF) and shareable permalinks  
- CI + unit tests for algorithm correctness and regression detection  
- More schedulers and configurable policy parameters  
- Accessibility improvements and responsive UI polish

## Contributing
Fork → branch → PR. Include tests or representative scenarios when adding or changing schedulers.

## License & author
- License: ISC  
- Author: sakib1133 — final-year Computer Science student
