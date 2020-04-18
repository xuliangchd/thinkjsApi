/**
 * Class alipay
 * @package
 * 文件功能描述：支付宝支付
 * 作者：xulaingchd
 * 完成日期：2019/8/5 12:20:18
 */
const path = require('path');
const Alipay = require('alipay-node-sdk');
// var outTradeId = Date.now().toString();
module.exports = class extends think.Service {
    /**
     *
     * @param {Object} opts
     * @param {String} opts.appId  支付宝的appId
     * @param {String} opts.notifyUrl  支付宝服务器主动通知商户服务器里指定的页面http/https路径
     * @param {String} opts.rsaPrivate  商户私钥pem文件路径
     * @param {String} opts.rsaPublic  支付宝公钥pem文件路径
     * @param {String} opts.signType   签名方式, 'RSA' or 'RSA2'
     * @param {Boolean} [opts.sandbox] 是否是沙盒环境
     * @constructor
     */
    constructor() {
        super();
        this.cf = '';
        this.alipayNotifyUrl = '';
        this.ali = new Alipay({
            appId: this.cf.appid,
            notifyUrl: this.alipayNotifyUrl,
            rsaPrivate: path.resolve('pem/rsa_private_key.pem'),
            rsaPublic: path.resolve('pem/rsa_public_key.pem'),
            sandbox: false,
            signType: 'RSA2'
        });
    }
    /**
     * 生成支付参数供客户端使用
     * @param {Object} opts
     * @param {String} opts.subject              商品的标题/交易标题/订单标题/订单关键字等
     * @param {String} [opts.body]               对一笔交易的具体描述信息。如果是多种商品，请将商品描述字符串累加传给body
     * @param {String} opts.outTradeId           商户网站唯一订单号
     * @param {String} [opts.timeout]            设置未付款支付宝交易的超时时间，一旦超时，该笔交易就会自动被关闭。
                                                  当用户进入支付宝收银台页面（不包括登录页面），会触发即刻创建支付宝交易，此时开始计时。
                                                  取值范围：1m～15d。m-分钟，h-小时，d-天，1c-当天（1c-当天的情况下，无论交易何时创建，都在0点关闭）。
                                                  该参数数值不接受小数点， 如 1.5h，可转换为 90m。
     * @param {String} opts.amount               订单总金额，单位为元，精确到小数点后两位，取值范围[0.01,100000000]
     * @param {String} [opts.sellerId]           收款支付宝用户ID。 如果该值为空，则默认为商户签约账号对应的支付宝用户ID
     * @param {String} opts.goodsType            商品主类型：0—虚拟类商品，1—实物类商品 注：虚拟类商品不支持使用花呗渠道
     * @param {String} [opts.passbackParams]     公用回传参数，如果请求时传递了该参数，则返回给商户时会回传该参数。支付宝会在异步通知时将该参数原样返回。本参数必须进行UrlEncode之后才可以发送给支付宝
     * @param {String} [opts.promoParams]        优惠参数(仅与支付宝协商后可用)
     * @param {String} [opts.extendParams]       业务扩展参数 https://doc.open.alipay.com/docs/doc.htm?spm=a219a.7629140.0.0.3oJPAi&treeId=193&articleId=105465&docType=1#kzcs
     * @param {String} [opts.enablePayChannels]  可用渠道，用户只能在指定渠道范围内支付。当有多个渠道时用“,”分隔。注：与disable_pay_channels互斥
     * @param {String} [opts.disablePayChannels] 禁用渠道，用户不可用指定渠道支付。当有多个渠道时用“,”分隔。 注：与enable_pay_channels互斥
     * @param {String} [opts.storeId]            商户门店编号
     */
    async alipayAppPay(orderNumber, name, money) {
        var params = this.ali.appPay({
            subject: name,
            body: name,
            outTradeId: orderNumber,
            timeout: '10m',
            amount: money,
            goodsType: '0'
        });
        return params;
    }
    /**
 * 生成支付参数供电脑网站使用
 * @param {Object} opts
 * @param {String} opts.outTradeId           商户网站唯一订单号
 * @param {String} opts.subject              商品的标题/交易标题/订单标题/订单关键字等
 * @param {String} opts.amount               订单总金额，单位为元，精确到小数点后两位，取值范围[0.01,100000000]
 * @param {String} [opts.body]               对一笔交易的具体描述信息。如果是多种商品，请将商品描述字符串累加传给body
 * @param {String} [opts.timeout]            设置未付款支付宝交易的超时时间，一旦超时，该笔交易就会自动被关闭。
 *                                           当用户进入支付宝收银台页面（不包括登录页面），会触发即刻创建支付宝交易，此时开始计时。
 *                                           取值范围：1m～15d。m-分钟，h-小时，d-天，1c-当天（1c-当天的情况下，无论交易何时创建，都在0点关闭）。
 *                                           该参数数值不接受小数点， 如 1.5h，可转换为 90m。
 * @param {String} [opts.goodsType]          商品主类型：0—虚拟类商品，1—实物类商品 注：虚拟类商品不支持使用花呗渠道
 * @param {String} [opts.goodsDetail]        订单包含的商品列表信息，JSON格式，例如：{"show_url":"https://example/good/id"}
 * @param {String} [opts.passbackParams]     公用回传参数，如果请求时传递了该参数，则返回给商户时会回传该参数。支付宝会在异步通知时将该参数原样返回。本参数必须进行UrlEncode之后才可以发送给支付宝
 * @param {String} [opts.extendParams]       业务扩展参数 https://doc.open.alipay.com/docs/doc.htm?spm=a219a.7629140.0.0.3oJPAi&treeId=193&articleId=105465&docType=1#kzcs
 * @param {String} [opts.enablePayChannels]  可用渠道，用户只能在指定渠道范围内支付。当有多个渠道时用“,”分隔。注：与disable_pay_channels互斥
 * @param {String} [opts.disablePayChannels] 禁用渠道，用户不可用指定渠道支付。当有多个渠道时用“,”分隔。 注：与enable_pay_channels互斥
 * @param {String} [opts.qrPayMode]          PC扫码支付的方式，支持前置模式和跳转模式。前置模式是将二维码前置到商户的订单确认页的模式，需要商户在自己的页面中以 iframe 方式请求支付宝页面。
 *                                           具体分为以下几种：
 *                                              0，订单码-简约前置模式，对应 iframe 宽度不能小于600px，高度不能小于300px
 *                                              1，订单码-前置模式，对应 iframe 宽度不能小于300px，高度不能小于600px
 *                                              3，订单码-迷你模式，对应 iframe 宽度不能小于75px，高度不能小于75px
 *                                              4，订单码-可定义宽度的嵌入式二维码，商户可根据需要设定二维码的大小
 *                                           跳转模式下，用户的扫码界面是由支付宝生成的，不存在商户的域名下，具体为：
 *                                              2，订单码-跳转模式
 * @param {String} [opts.qrcodeWidte]        商户自定义二维码宽度。注：qrPayMode = 4 时该参数生效
 * @param {String} [opts.return_url]         客户端回调地址，HTTP/HTTPS开头字符串
 */
    async alipayPagePay(orderNumber, name, returnUrl, money) {
        var params = this.ali.pagePay({
            subject: name,
            body: name,
            outTradeId: orderNumber,
            return_url: returnUrl,
            timeout: '10m',
            amount: money,
            goodsType: '0',
            qrPayMode: 2
        });
        return params;
    }
    async sig(data) {
        var ok = this.ali.signVerify(data);
        return ok;
    }
    async aliRefund(orderNumber, orderMoney) {
        var rets = await this.ali.refund({
            outTradeId: orderNumber,
            refundAmount: orderMoney,
            refundReason: '订单退款'
        });
        var body = JSON.parse(rets.body);
        return body.alipay_trade_refund_response.code;
    }
};
