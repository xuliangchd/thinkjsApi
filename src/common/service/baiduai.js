const APPID = '';
const APIKEY = '';
const SECRETKEY = '';
const AipImageClassifyClient = require('baidu-aip-sdk').imageClassify;
module.exports = class extends think.Service {
    /**
     * 图片识别
     */
    async imageClassify(imgUrl) {
        var client = new AipImageClassifyClient(APPID, APIKEY, SECRETKEY);
        var image = await this.imgurl2Base64(imgUrl);
        return new Promise(function (resolve, reject) {
            // 调用通用物体识别
            var options = {};
            options['baike_num'] = '5';
            client.advancedGeneral(image, options).then(function (ret) {
                resolve(ret);
            }).catch(function (err) {
                // 如果发生网络错误
                reject(err);
            });
        });
    }
    async imgurl2Base64(imgUrl) {
        var superagent = require('superagent');
        const img2Base64 = await new Promise(async function (resolve, reject) {
            await superagent.get(imgUrl).buffer(true).parse((res) => {
                var buffer = [];
                res.on('data', (chunk) => {
                    buffer.push(chunk);
                });
                res.on('end', () => {
                    const data = Buffer.concat(buffer);
                    const base64Img = data.toString('base64');
                    resolve(base64Img);
                });
            });
        });
        return img2Base64;
    }
};
