# CPU Scheduling Algorithm Visualizer

A browser-based simulator for visualizing CPU scheduling algorithms using interactive Gantt charts and performance metrics. Built to help understand and compare scheduling techniques used in Operating Systems.


## Features

- Add, edit, and delete processes
- Interactive Gantt Chart visualization
- Compare multiple scheduling algorithms
- Performance metrics (Waiting Time, Turnaround Time, CPU Utilization,Throughput Context Switches)
- Round Robin with configurable time quantum
- Process data saved using LocalStorage

## Supported Algorithms

- FCFS
- SJF
- SRTF
- Round Robin
- Priority
- Preemptive Priority
- MLFQ
- Multilevel Queue

## Tech Stack

- HTML5
- CSS3
- Tailwind CSS
- JavaScript (ES6)
- Chart.js
- LocalStorage

## Live Demo

🔗 https://process-scheduling-visualizer.onrender.com/

## Installation

```bash
git clone https://github.com/sakib1133/Process-Scheduling-Algorithm-Visualizer.git

cd Process-Scheduling-Algorithm-Visualizer

# Optional
npm install
npm run build:css

# Run locally
python -m http.server 8000

# or
npx http-server
```

Open:

```
http://localhost:8000
```

## Project Structure

```
.
├── index.html
├── css/
├── js/
│   ├── app.js
│   ├── scheduler.js
│   ├── ganttChart.js
│   ├── chartRenderer.js
│   ├── metrics.js
│   └── algorithms/
└── README.md
```

## What I Learned

- CPU scheduling algorithms
- Algorithm visualization
- Modular JavaScript architecture
- Performance analysis
- Data visualization with Chart.js

## Future enhancements 

- Add export formats (CSV/PDF) and shareable permalinks 
- CI + unit tests for algorithm correctness and regression detection 
- More schedulers and configurable policy parameters 
- Accessibility improvements and responsive UI polish

## Author

**Mohd Sakib Malik**

- GitHub: https://github.com/sakib1133
- LinkedIn: https://linkedin.com/in/mohd-sakib-malik-97ab4a283
- LeetCode: https://leetcode.com/u/sakib_malik79/
