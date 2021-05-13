importScripts('diff.js');
importScripts('diverged.js');
self.addEventListener('message', (e) => {
  self.postMessage(diverged(...e.data.divergedInput));
  self.close();
}, false);
