const path = require('path');
const cors = require('kcors');
const wechat = require('think-wechat');
const qs = require('think-qs');
const isDev = think.env === 'development';

module.exports = [
    {
        handle: 'meta',
        options: {
            logRequest: isDev,
            sendResponseTime: isDev
        }
    },
    {
        handle: 'resource',
        enable: isDev,
        options: {
            root: path.join(think.ROOT_PATH, 'www'),
            publicPath: /^\/(static|favicon\.ico)/
        }
    },
    {
        handle: wechat,
        match: '/wechat/wechat',
        options: {
            token: '',
            appid: '',
            encodingAESKey: '',
            checkSignature: true // 可选，默认为true。由于微信公众平台接口调试工具在明文模式下不发送签名，所以如要使用该测试工具，请将其设置为false
        }
    },
    {
        handle: 'payload',
        options: {
            keepExtensions: true,
            limit: '5mb'
        }
    },
    {
        handle: 'router',
        options: {
            defaultModule: 'index',
            defaultController: 'index',
            defaultAction: 'index',
            prefix: [],
            suffix: ['.html'],
            enableDefaultRouter: true,
            subdomainOffset: 2,
            subdomain: {},
            denyModules: []
        }
    },
    {
        handle: cors,
        options: {
            origin: '*',
            credentials: true,
            allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH'
        }
    },
    {
        handle: qs,
        options: {

        }
    },
    'logic',
    'controller'
];
