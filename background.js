let currentTabId = null;
let startTime = 0;
let updateTimer = null;
const updateTimeInterval = 1000; // Define updateTimeInterval variable and set it to 1000 milliseconds (1 second)

chrome.tabs.onActivated.addListener(activeInfo => {
    updateVisitTime(activeInfo.tabId);
    currentTabId = activeInfo.tabId;
    startTime = Date.now(); // Start timing the newly activated tab
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (tabId === currentTabId && changeInfo.status === 'complete') {
        updateVisitTime(tabId); // Update time whenever the tab's URL changes
        startTime = Date.now(); // Restart timing
    }
});

chrome.windows.onFocusChanged.addListener(windowId => {
    if (windowId === chrome.windows.WINDOW_ID_NONE) { // No focused window (e.g., browser minimized)
        updateVisitTime(currentTabId);
    }
});

chrome.windows.onRemoved.addListener(windowId => {
    updateVisitTime(currentTabId);
});

function updateVisitTime(tabId) {
    if (currentTabId !== null && startTime !== 0) {
        const currentTime = Date.now();
        const elapsed = currentTime - startTime;

        chrome.tabs.get(tabId, tab => {
            if (!tab || !tab.url) return; // Check if tab is valid and has a URL
            const url = new URL(tab.url).hostname; // Extract domain from URL

            chrome.storage.local.get({ visitTimes: {} }, data => {
                const updatedVisitTimes = data.visitTimes;
                updatedVisitTimes[url] = (updatedVisitTimes[url] || 0) + elapsed;
                chrome.storage.local.set({ visitTimes: updatedVisitTimes });
            });
        });
    }

    startTime = Date.now(); // Reset the start time
    clearInterval(updateTimer); // Clear previous interval
    updateTimer = setInterval(() => updateVisitTime(currentTabId), updateTimeInterval);
}