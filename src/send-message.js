import call from './pcall'

export default function(messageData) {
  return call(chrome.runtime.sendMessage, messageData);
}
