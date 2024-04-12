document.addEventListener('DOMContentLoaded', function() {
    chrome.storage.local.get('visitTimes', function(data) {
        const timesDiv = document.getElementById('times');
        if (data.visitTimes) {
            Object.keys(data.visitTimes).forEach(function(url) {
                const ms = data.visitTimes[url];
                const minutes = Math.floor(ms / 60000);
                const seconds = ((ms % 60000) / 1000).toFixed(0);
                const timeFormatted = `${minutes}m ${seconds}s`;
                const timeElement = document.createElement('div');
                timeElement.textContent = `${url}: ${timeFormatted}`;
                timesDiv.appendChild(timeElement);
            });
        } else {
            timesDiv.textContent = 'No data available.';
        }
    });
});
