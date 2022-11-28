const onVideoChanged = async (url) => {
    console.log('ServiceWorker onVideoChanged:', url);

    return {
        url,
    }
};

// See https://developer.chrome.com/docs/extensions/reference/events/ for additional details.
chrome.runtime.onInstalled.addListener(() => {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        console.log('ServiceWorker onMessage:', message);

        if (message.type === 'ON_VIDEO_CHANGED') {
            onVideoChanged(message.url).then(sendResponse);
            return true;
        }
    });
});