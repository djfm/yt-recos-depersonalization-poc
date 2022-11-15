const EXTENSION_ROOT_ID = 'djfm-extension-root';
const IFRAME_ID='djfm-extension-iframe';
const HASH_SIGNAL = 'djfm-extension-host';
const RECOMMENDATIONS_RECEIVED = 'RECOMMENDATIONS_RECEIVED';

const initHost = () => {
  window.addEventListener('message', (event) => {
    if (event.data.type === RECOMMENDATIONS_RECEIVED) {
      console.log('recommendations received', event.data);
      console.log({ html: event.data.html });
      alert('recommendations received');
    }
  });

  const div = document.createElement('div');
  div.id=EXTENSION_ROOT_ID;
  div.style.position = 'fixed';
  div.style.top = '500px';
  div.style.bottom = '10px';
  div.style.left = '0px';
  div.style.right = '0px';
  // div.style.width = '100px';
  // div.style.height = '100px';
  div.style.zIndex = 5000;
  div.style.backgroundColor = 'red';
  div.style.textAlign = 'center';
  div.innerHTML = 'extension root';

  const hiddenIframe = document.createElement('iframe');
  // hiddenIframe.style.display = 'none';
  hiddenIframe.style.width = '1980px';
  hiddenIframe.style.height = '1024px';
  hiddenIframe.style.overflow ='scroll';
  hiddenIframe.src = `${window.location.href}#${HASH_SIGNAL}`;
  hiddenIframe.id = IFRAME_ID;
  hiddenIframe.sandbox = 'allow-scripts';
  div.appendChild(hiddenIframe);

  hiddenIframe.addEventListener('load', () => {
    console.log('iframe loaded');
  });

  document.body.appendChild(div);
};

const initIFrame = () => {
  const recommendationURLsSelector = 'ytd-watch-next-secondary-results-renderer ytd-compact-video-renderer a#thumbnail';
  const recommendationURLs = document.querySelectorAll(recommendationURLsSelector);
  const recommendationURLsArray = Array.from(recommendationURLs).map((el) => el.href);
  const html = document.documentElement.outerHTML;
  parent.postMessage({
    type: RECOMMENDATIONS_RECEIVED,
    data: recommendationURLsArray,
    html,
  }, '*');
};

const initialize = () => {
  console.log('initializing extension...');

  const isHost = window.location.hash !== `#${HASH_SIGNAL}`;

  if (isHost) {
    initHost();

    const dot = document.createElement('div');
    dot.style.position = 'absolute';
    dot.style.top = '5px';
    dot.style.left = '5px';
    dot.style.width = '15px';
    dot.style.height = '15px';
    dot.style.backgroundColor = 'green';
    dot.style.borderColor = 'yellow';
    dot.style.borderRadius = '50%';
    dot.style.zIndex = 5001;
    document.body.appendChild(dot);
  } else {
    initIFrame();

    const dot = document.createElement('div');
    dot.style.position = 'absolute';
    dot.style.top = '5px';
    dot.style.left = '5px';
    dot.style.width = '15px';
    dot.style.height = '15px';
    dot.style.backgroundColor = 'black';
    dot.style.borderColor = 'yellow';
    dot.style.borderRadius = '50%';
    dot.style.zIndex = 5001;
    document.body.appendChild(dot);
  }
};

if (document.URL.match(/^https:\/\/www\.youtube\.com\/watch\?v=.*/)) {
  initialize();
}