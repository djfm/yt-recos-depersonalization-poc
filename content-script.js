const { href } = window.location;

const onNavigatedToVideoPage = async () => {
  console.log('Navigated to video page');
  console.log('href:', href);

  console.log('Sending message to background script...');
  const resp = await chrome.runtime.sendMessage({ type: 'ON_VIDEO_CHANGED', url: href });
  console.log('Response from background script:', resp);
};

if (/\?v=[^/]+$/.test(href)) {
  onNavigatedToVideoPage();
}