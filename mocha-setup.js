require('ts-node').register();

const virtualConsole = new (require('jsdom').VirtualConsole)();
require('jsdom-global')('', { virtualConsole });
