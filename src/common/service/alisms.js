/**
 * Class alisms
 * @package
 * 文件功能描述：阿里云短信
 * 作者：xuliangchd
 * 完成日期：2019/6/14 12:20:18
 */
const Core = require('@alicloud/pop-core');
module.exports = class extends think.Service {
    // 发送验证码
    async send(mobile, msg, callback) {
        var client = new Core({
            accessKeyId: '',
            accessKeySecret: '',
            endpoint: 'https://dysmsapi.aliyuncs.com',
            apiVersion: '2017-05-25'
        });
        var params = {
            'PhoneNumbers': mobile,
            'SignName': 'XXXX',
            'TemplateCode': 'SMS_98100005',
            'TemplateParam': "{ 'code': '" + msg + "' }"
        };
        var requestOption = {
            method: 'POST'
        };
        var ret = await client.request('SendSms', params, requestOption).then((result) => {
            console.log(result);
            if (result.Code === 'OK') {
                console.log('发送成功！！');
                return true;
            }
            return false;
        }, (ex) => {
            console.log('发送失败！！');
            return false;
            // console.log(ex);
        });
        console.error(ret);
        return ret;
    }

    async httpPost(url, data, callback) {
        const rest = await this.fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json());
        console.error(rest);
        if (rest && rest.code === '0') {
            console.error('发送成功');
            return true;
        } else {
            console.error('发送失败');
            return false;
        }
    }
};
