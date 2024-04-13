document.addEventListener('DOMContentLoaded', function() {
    // Display visit times
    chrome.storage.local.get('visitTimes', async function(data) {
        const timesDiv = document.getElementById('times');
        if (data.visitTimes) {
            // Sort visit times in descending order based on time spent
            const sortedVisitTimes = Object.entries(data.visitTimes).sort((a, b) => b[1] - a[1]);
            
            // Display a maximum of five sites
            const displayCount = Math.min(sortedVisitTimes.length, 5);
            for (let i = 0; i < displayCount; i++) {
                const [url, ms] = sortedVisitTimes[i];
                const hours = Math.floor(ms / 3600000); // Convert milliseconds to hours
                const minutes = Math.floor((ms % 3600000) / 60000); // Convert remaining milliseconds to minutes
                const seconds = Math.floor((ms % 60000) / 1000); // Convert remaining milliseconds to seconds
                const timeFormatted = `${hours} Hrs ${minutes} Mins ${seconds} Secs`;
                const timeElement = document.createElement('div');
                timeElement.classList.add('time-entry');

                // Remove "www." from the URL
                const siteName = url.replace(/^www\./,'');

                // Fetch the favicon for the site
                const faviconUrl = `https://www.google.com/s2/favicons?domain=${url}`;
                const favicon = document.createElement('img');
                favicon.src = faviconUrl;
                favicon.classList.add('site-logo');

                timeElement.innerHTML = `<div class="time-entry-title">${siteName}</div><div class="time">${timeFormatted}</div>`;
                timeElement.prepend(favicon);
                timesDiv.appendChild(timeElement);
            }
        } else {
            timesDiv.textContent = 'No data available.';
        }
    });
});
