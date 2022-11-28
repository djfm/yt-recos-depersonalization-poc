const onVideoChanged = async (url) => {
    console.log('ServiceWorker onVideoChanged:', url);

    const resp = await fetch(url, {
        credentials: 'omit',
    });

    const html = await resp.text();

    const exp =/{\"videoId\":\"(.*?)\"}/g;

    const matches = [...html.matchAll(exp)];
    console.log({  matches });

    const beforeQuote = /^([^"]+)"/;

    const cleanMatches = matches.map((match) => {
        const m = match[1].match(beforeQuote);

        if (m) {
            return m[1];
        }

        return '';
    });

    const uniqueMatches = [...new Set(cleanMatches)];

    return {
        url,
        html,
        matches,
        uniqueMatches,
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

        if (message.type === 'GET_RECOMMENDATIONS') {
            console.log('ServiceWorker onMessage GET_RECOMMENDATIONS:', message);

            const { initialDataScript } = message;

            eval(initialDataScript);

            sendResponse({ ytInitialData: globalThis.ytInitialData });
            return true;
        }
    });
});