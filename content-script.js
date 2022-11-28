const { href } = window.location;

const onNavigatedToVideoPage = async () => {
  console.log('Navigated to video page');
  console.log('href:', href);

  console.log('Sending message to background script...');
  const resp = await chrome.runtime.sendMessage({ type: 'ON_VIDEO_CHANGED', url: href });
  console.log('Response from background script:', resp);

  const parser = new DOMParser();
  const doc = parser.parseFromString(resp.html, 'text/html');
  const scripts = [...doc.querySelectorAll('script')];

  console.log('Got the following scripts without cookies:', scripts);
  
  const initialDataScript = scripts.find((script) => {
    const { textContent } = script;

    if (textContent) {
      return textContent.trimStart().startsWith('var ytInitialData = ');
    }
  
    return false;
  });

  console.log('The script with initial data:', initialDataScript);

  if (!initialDataScript) {
    console.error('Could not find the script with initial data.');
  }

  const json = initialDataScript.textContent.replace('var ytInitialData = ', '').replace(';', '');
  const initialData = JSON.parse(json);

  const recommendations = initialData.contents.twoColumnWatchNextResults.secondaryResults.secondaryResults.results.map(
    ({compactVideoRenderer}) => {
        if (compactVideoRenderer) {
          return {
            raw: compactVideoRenderer,
            title: compactVideoRenderer.title.simpleText,
            channel: compactVideoRenderer.longBylineText.runs[0].text,
            thumbnails: compactVideoRenderer.thumbnail.thumbnails,
            viewCount: compactVideoRenderer.shortViewCountText.simpleText,
            publishedTime: compactVideoRenderer.publishedTimeText.simpleText,
          };
        }
        
        return null;
    }).filter(Boolean);

  console.log('Initial data:', initialData);
  console.log('Recommendations:', recommendations);
};

if (/\?v=[^/]+$/.test(href)) {
  onNavigatedToVideoPage();
}