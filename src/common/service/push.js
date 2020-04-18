
module.exports = class extends think.Service {
    /**
     * 参数：deviceid alert title extras
     * 通知栏推送
     * 作者 xuliangchd
     */
    async push(deviceid, alert = '', title = '', extras = { 'key': 'value' }) {
        var device = await think.model('device').where({ 'id': deviceid }).find();
        if (think.isEmpty(device)) {
            return false;
        }
        switch (device.model) {
            case 'huawei':
                return this.huaweiPush(device, alert, title, extras);
            case 'xiaomi':
                return this.xiaomiPush(device, alert, title, extras);
            default:
                return this.jPush(device, alert, title, extras);
        }
    }
    /**
     * 参数：device alert title extras
     * 极光推送
     * 作者 xuliangchd
     */
    jPush(device, alert, title, extras) {
        var jpushConfig = '';
        var that = this;
        const JPush = require(think.ROOT_PATH + '/node_modules/jpush-sdk/lib/JPush/JPush.js');
        const client = JPush.buildClient(jpushConfig.AppKey, jpushConfig.MasterSecret);
        client.push().setPlatform(JPush.ALL)
            .setAudience(JPush.registration_id(device.cid_jpush))
            .setOptions(null, null, null, true)//true为生产环境，false为开发环境
            .setNotification(JPush.android(alert, title, 1, extras), JPush.ios(alert, 'sound', null, false, extras))
            .setMessage(title, title, alert, extras)
            .send(function (err, res) {
                if (err) {
                    console.error(err.message);
                    that.writeLog(device.deviceid, jpushConfig, 'jpush', device.cid_jpush, { 'title': title, 'alert': alert, 'extras': extras }, err.message);
                    return false;
                } else {
                    console.error(res);
                    that.writeLog(device.deviceid, jpushConfig, 'jpush', device.cid_jpush, { 'title': title, 'alert': alert, 'extras': extras }, res);
                    return true;
                }
            });
        return true;
    }
    /**
     * 参数：device alert title extras
     * 小米推送
     * 作者 xuliangchd
     */
    xiaomiPush(device, alert, title, extras) {
        var that = this;
        var mipushConfig = '';
        var MiPush = require(think.ROOT_PATH + '/node_modules/xiaomi-push/lib');
        var Message = MiPush.Message;
        var Notification = MiPush.Notification;
        var config = require(think.ROOT_PATH + '/node_modules/xiaomi-push/example/config');
        var msg = new Message();
        msg.title(title)
            .description(alert)
            .payload(JSON.stringify(extras))
            .passThrough(0)
            .notifyType(-1)
            .extra('badge', 6);

        var notification = new Notification({
            production: config.production,
            appSecret: mipushConfig.AppSecret
        });
        var regid = device.cid_xiaomi;
        notification.send(regid, msg).then(function (res) {
            that.writeLog(device.deviceid, mipushConfig, 'xiaomi', device.cid_xiaomi, { 'title': title, 'alert': alert, 'extras': extras }, res);
            return true;
        }, function (err) {
            that.writeLog(device.deviceid, mipushConfig, 'xiaomi', device.cid_xiaomi, { 'title': title, 'alert': alert, 'extras': extras }, err);
            return false;
        });

        // notification.sendToAll(msg).then(console.log, console.log);

        // notification.sendToUserAccount('ua', msg).then(console.log, console.log);

        // notification.sendToAlias('testAlias', msg).then(console.log, console.log);

        // notification.sendToTopic('testTopoc', msg).then(console.log, console.log);
        return true;
    }
    /**
     * 参数：device alert title extras
     * 华为推送
     * 作者 xuliangchd
     */
    async huaweiPush(device, alert, title, extras) {
        var hwpushConfig = '';
        const appSecret = hwpushConfig.appsecret; // 获取appSecret
        const appId = hwpushConfig.appid; // appId
        const tokenUrl = 'https://login.cloud.huawei.com/oauth2/v2/token'; // 获取认证Token的URL
        const apiUrl = 'https://api.push.hicloud.com/pushsend.do?nsp_ctx=%7b%22ver%22%3a%221%22%2c+%22appId%22%3a%22' + appId + '%22%7d'; // 应用级消息下发API
        // console.error(tokenUrl);
        const rest = await this.fetch(tokenUrl, {
            method: 'POST',
            body: 'grant_type=client_credentials&client_secret=' + appSecret + '&client_id=' + appId,
            headers: {
                'Host': 'Login.cloud.huawei.com',
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(res => res.json());
        // console.error(rest);
        var payload = {
            'hps': {
                'msg': {
                    'type': 3,
                    'body': {
                        'content': alert,
                        'title': title
                    },
                    'action': {
                        'type': 1,
                        'param': {
                            'intent': extras
                        }
                    }
                },
                'ext': {
                    'biTag': 'Trump',
                    'customize': [extras]
                }
            }
        };
        var data = 'access_token=' + encodeURIComponent(rest.access_token) + '&nsp_svc=openpush.message.api.send&nsp_ts=' +
            global.time() + '&device_token_list=' + JSON.stringify([device.cid_huawei]) + '&payload=' + JSON.stringify(payload);
        console.error(data);
        const ret = await this.fetch(apiUrl, {// 通知栏消息
            method: 'POST',
            body: data,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded '
            }
        }).then(res => res.json());

        payload = {
            'hps': {
                'msg': {
                    'type': 1,
                    'body': extras
                }
            }
        };
        data = 'access_token=' + encodeURIComponent(rest.access_token) + '&nsp_svc=openpush.message.api.send&nsp_ts=' +
            global.time() + '&device_token_list=' + JSON.stringify([device.cid_huawei]) + '&payload=' + JSON.stringify(payload);
        await this.fetch(apiUrl, {// 透传消息
            method: 'POST',
            body: data,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded '
            }
        }).then(res => res.json());
        return ret;
    }
};
