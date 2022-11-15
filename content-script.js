const EXTENSION_ROOT_ID = 'djfm-extension-root';

const initialize = () => {
  console.log('initializing extension...');

  const div = document.createElement('div');
  div.id=EXTENSION_ROOT_ID;
  div.style.position = 'fixed';
  div.style.bottom = '10px';
  div.style.right = '10px';
  div.style.width = '100px';
  div.style.height = '100px';
  div.style.zIndex = 5000;
  div.style.backgroundColor = 'red';
  div.style.textAlign = 'center';
  div.innerHTML='djfm test ext;';

  document.body.appendChild(div);
};

if (document.URL.match(/^https:\/\/www\.youtube\.com\/watch\?v=.*/)) {
  initialize();
}