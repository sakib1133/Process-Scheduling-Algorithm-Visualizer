# CPU Scheduling Algorithm Visualizer

A comprehensive interactive web application for visualizing and comparing various CPU scheduling algorithms. This tool helps students, educators, and developers understand how different scheduling algorithms work through interactive simulations, visual Gantt charts, and detailed performance metrics.

## Features

### Dashboard
- **Process Management**: Add, edit, and remove processes with customizable arrival time, burst time, and priority
- **Algorithm Selection**: Choose from 6 different scheduling algorithms
- **Interactive Simulation**: Run simulations with real-time visualization
- **Gantt Chart**: Visual representation of process execution timeline
- **Results Table**: Detailed process metrics including waiting time, turnaround time, and completion time
- **Statistics Cards**: Quick overview of throughput, context switches, and total execution time
- **Algorithm Comparison**: Compare all algorithms side-by-side with performance charts

### Analytics Page
- **Performance Overview**: Key metrics at a glance
  - Average Waiting Time
  - Average Turnaround Time
  - CPU Utilization
  - Throughput
  - Context Switches
- **Visual Charts**: Bar charts comparing all algorithms
  - Waiting Time Chart
  - Turnaround Time Chart
  - CPU Utilization Chart
  - Throughput Chart
- **Algorithm Comparison Table**: Detailed comparison with best-performing algorithm highlighting
- **Additional Metrics**: Total processes, total execution time, best performing algorithm
- **No Data State**: Helpful message when no simulation has been run

### Settings Page
- **Appearance**: Dark/Light mode toggle
- **Simulation Settings**:
  - Default Time Quantum (for Round Robin)
  - Animation Speed
- **Preferences**:
  - Auto-save processes to localStorage
  - Show toast notifications
  - Enable/disable animations
- **Data Management**:
  - Clear saved processes
  - Reset all settings to defaults
  - Export settings to JSON
  - Import settings from JSON

## Supported Algorithms

1. **FCFS (First-Come, First-Served)**: Processes are scheduled in the order they arrive
2. **SJF (Shortest Job First)**: Non-preemptive algorithm that schedules the shortest available process
3. **SRTF (Shortest Remaining Time First)**: Preemptive version of SJF that can interrupt running processes
4. **Round Robin**: Time-sliced scheduling where each process gets a fixed time quantum
5. **Priority**: Non-preemptive scheduling based on process priority
6. **Preemptive Priority**: Priority-based scheduling that can interrupt running processes

## Technologies Used

- **HTML5**: Structure and semantic markup
- **Tailwind CSS v4**: Utility-first CSS framework for styling
- **JavaScript (ES6+)**: Application logic and interactivity
- **Chart.js**: Data visualization for performance charts
- **localStorage**: Client-side data persistence

## Installation

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- Node.js (for development with Tailwind CSS)

### Setup

1. Clone the repository:
```bash
git clone https://github.com/sakib1133/Process-Scheduling-Algorithm-Visualizer.git
cd Process-Scheduling-Algorithm-Visualizer
```

2. Install dependencies:
```bash
npm install
```

3. Build CSS (if needed):
```bash
npm run build:css
```

4. Open `index.html` in your browser or use a local server:
```bash
# Using Python
python -m http.server 8000

# Using Node.js (http-server)
npx http-server

# Or simply open index.html directly in your browser
```

## Usage

### Running a Simulation

1. **Add Processes**:
   - Enter Process ID (e.g., P1, P2)
   - Set Arrival Time (when the process becomes available)
   - Set Burst Time (execution time required)
   - Set Priority (for priority-based algorithms)
   - Click "Add Process"

2. **Select Algorithm**:
   - Choose from the available algorithms in the Algorithm Selection section
   - For Round Robin, specify the Time Quantum

3. **Run Simulation**:
   - Click "Run Simulation" to execute the selected algorithm
   - View the Gantt chart and results table

4. **Compare Algorithms**:
   - Click "Run Comparison" to compare all algorithms
   - View the comparison table and performance charts

### Navigating Pages

- Use the sidebar navigation to switch between Dashboard, Analytics, and Settings
- Dashboard: Main simulation interface
- Analytics: Detailed performance analysis and comparisons
- Settings: Customize appearance and behavior

### Customizing Settings

1. Navigate to the Settings page
2. Adjust appearance (dark/light mode)
3. Configure simulation parameters
4. Set preferences for auto-save, notifications, and animations
5. Manage data (clear processes, reset settings, export/import)

## Project Structure

```
Process-Scheduling-Algorithm-Visualizer/
├── css/
│   └── output.css          # Compiled Tailwind CSS
├── js/
│   ├── app.js              # Main application controller
│   ├── chartRenderer.js    # Chart.js integration
│   ├── ganttChart.js       # Gantt chart visualization
│   ├── metrics.js          # Performance metrics calculation
│   └── scheduler.js       # Scheduling algorithm implementations
├── index.html              # Main HTML file
├── package.json            # Node.js dependencies
└── README.md               # This file
```

## Architecture

The application follows a modular, object-oriented architecture:

- **App Class**: Main controller that manages state, event handling, and page navigation
- **Scheduler Class**: Implements all scheduling algorithms
- **Metrics Class**: Calculates performance metrics (waiting time, turnaround time, CPU utilization, throughput)
- **GanttChart Class**: Renders visual timeline of process execution
- **ChartRenderer Class**: Manages Chart.js visualizations for algorithm comparison

## Performance Metrics Explained

- **Waiting Time**: Time a process spends waiting in the ready queue
- **Turnaround Time**: Total time from arrival to completion (Waiting Time + Burst Time)
- **CPU Utilization**: Percentage of time CPU is busy executing processes
- **Throughput**: Number of processes completed per unit time
- **Context Switches**: Number of times CPU switches from one process to another

## Browser Compatibility

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Opera: ✅ Full support

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Future Enhancements

- [ ] Add more scheduling algorithms (e.g., Multilevel Queue, Multilevel Feedback Queue)
- [ ] Export simulation results to CSV/PDF
- [ ] Save and load simulation scenarios
- [ ] Add process templates for common scenarios
- [ ] Real-time animation of process execution
- [ ] Mobile-responsive improvements
- [ ] Add unit tests

## License

This project is licensed under the ISC License.

## Author

Created by [sakib1133]

## Acknowledgments

- Built with Tailwind CSS for rapid UI development
- Chart.js for beautiful data visualizations
- Inspired by operating system scheduling concepts from standard CS curricula

---

For questions, issues, or suggestions, please open an issue on GitHub.
