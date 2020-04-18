const view = require('think-view');
const model = require('think-model');
const cache = require('think-cache');
const session = require('think-session');
const fetch = require('think-fetch');
const websocket = require('think-websocket');

module.exports = [
    view, // make application support view
    model(think.app),
    cache,
    fetch,
    session,
    websocket(think.app)
];
