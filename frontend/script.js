const root = document.getElementById('root');

const container = document.createElement('div');
container.style.fontFamily = 'sans-serif';
container.style.textAlign = 'center';
container.style.paddingTop = '50px';

const title = document.createElement('h1');
title.textContent = 'SimpleSecScan';

const message1 = document.createElement('p');
message1.textContent = 'React application successfully loaded.';

const message2 = document.createElement('p');
message2.textContent = 'Next step: Build the UI components.';

container.appendChild(title);
container.appendChild(message1);
container.appendChild(message2);

root.appendChild(container);