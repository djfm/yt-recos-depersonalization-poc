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

  console.log('Sending the script to the background page for evaluation...');
  const recommendations = await chrome.runtime.sendMessage({ type: 'GET_RECOMMENDATIONS', initialDataScript });
  console.log('Recommendations:', recommendations);
};

if (/\?v=[^/]+$/.test(href)) {
  onNavigatedToVideoPage();
}