/**
 * Gantt Chart Renderer
 * Handles visualization of process execution schedule
 */

class GanttChart {
    constructor() {
        this.container = document.getElementById('ganttChart');
        this.colors = [
            '#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444',
            '#06b6d4', '#ec4899', '#84cc16', '#f97316', '#6366f1'
        ];
    }

    /**
     * Render the Gantt chart
     * @param {Array} schedule - Array of schedule blocks
     */
    render(schedule) {
        if (!schedule || schedule.length === 0) {
            this.container.innerHTML = '<p class="text-gray-500">No schedule to display</p>';
            return;
        }

        const totalTime = schedule[schedule.length - 1].endTime;
        const minBlockWidth = 50;

        let html = '<div class="gantt-wrapper overflow-x-auto pb-4">';
        html += '<div class="gantt-container flex relative" style="min-width: 100%;">';
        
        schedule.forEach((block, index) => {
            const color = this.getProcessColor(block.processId);
            const width = Math.max(minBlockWidth, (block.duration / totalTime) * 800);
            
            html += `
                <div class="gantt-block flex-shrink-0 flex items-center justify-center text-xs font-semibold text-white border-r border-gray-700 transition-all hover:opacity-90" 
                     style="background-color: ${color}; width: ${width}px; height: 60px;"
                     title="${block.processId}: ${block.startTime} - ${block.endTime}">
                    <div class="text-center">
                        <div class="font-bold">${block.processId}</div>
                        <div class="text-[10px] opacity-80">${block.startTime}-${block.endTime}</div>
                    </div>
                </div>
            `;
        });

        html += '</div>';

        // Add time axis with markers
        html += '<div class="gantt-time-axis flex relative mt-2" style="min-width: 100%;">';
        
        schedule.forEach((block, index) => {
            const width = Math.max(minBlockWidth, (block.duration / totalTime) * 800);
            
            html += `
                <div class="flex-shrink-0 text-center text-xs text-gray-400 border-r border-gray-800" 
                     style="width: ${width}px;">
                    <span class="block">${block.startTime}</span>
                </div>
            `;
        });

        // Add final time marker
        html += `
            <div class="flex-shrink-0 text-center text-xs text-gray-400" style="width: 40px;">
                <span class="block">${totalTime}</span>
            </div>
        `;

        html += '</div>';
        html += '</div>';

        this.container.innerHTML = html;

        // Auto-scroll to the right if schedule is large
        if (schedule.length > 10) {
            setTimeout(() => {
                const wrapper = this.container.querySelector('.gantt-wrapper');
                if (wrapper) {
                    wrapper.scrollLeft = wrapper.scrollWidth;
                }
            }, 100);
        }
    }

    /**
     * Get color for a process
     * @param {string} processId - Process identifier
     * @returns {string} Hex color code
     */
    getProcessColor(processId) {
        if (processId === 'idle') {
            return '#4b5563';
        }

        // Extract number from process ID (e.g., P1 -> 1)
        const match = processId.match(/\d+/);
        if (match) {
            const index = (parseInt(match[0]) - 1) % this.colors.length;
            return this.colors[index];
        }

        // Generate color from string hash
        let hash = 0;
        for (let i = 0; i < processId.length; i++) {
            hash = processId.charCodeAt(i) + ((hash << 5) - hash);
        }
        const index = Math.abs(hash) % this.colors.length;
        return this.colors[index];
    }

    /**
     * Clear the Gantt chart
     */
    clear() {
        this.container.innerHTML = '<p class="text-gray-500">Run a simulation to see the Gantt chart</p>';
    }

    /**
     * Render a simplified Gantt chart for mobile
     * @param {Array} schedule - Array of schedule blocks
     */
    renderMobile(schedule) {
        if (!schedule || schedule.length === 0) {
            this.container.innerHTML = '<p class="text-gray-500">No schedule to display</p>';
            return;
        }

        let html = '<div class="space-y-2">';
        
        schedule.forEach((block, index) => {
            const color = this.getProcessColor(block.processId);
            
            html += `
                <div class="flex items-center gap-2 text-sm">
                    <div class="w-3 h-3 rounded" style="background-color: ${color}"></div>
                    <span class="text-gray-300">${block.processId}</span>
                    <span class="text-gray-500">${block.startTime} - ${block.endTime}</span>
                </div>
            `;
        });

        html += '</div>';
        this.container.innerHTML = html;
    }

    /**
     * Export Gantt chart as image
     * @returns {string} Data URL of the image
     */
    exportAsImage() {
        // This would require a library like html2canvas
        // For now, return placeholder
        console.log('Export functionality requires html2canvas library');
        return null;
    }
}
