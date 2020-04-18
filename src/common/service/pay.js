/**
 * Class wxpay
 * @package
 * 文件功能描述：微信支付
 * 作者：xuliangchd
 * 完成日期：2019/8/10 12:20:18
 */
module.exports = class extends think.Service {
    // 微信app支付
    async wxappPay(data) {
        const Tenpay = require('tenpay');
        const cf = '';// 微信app支付支付配置
        const notifyurl = '';//  微信app支付回调地址
        const config = {
            appid: cf['appid'],
            mchid: cf['mch_id'],
            partnerKey: cf['key'],
            notify_url: notifyurl,
            spbill_create_ip: this.ip
        };
        // console.error(config);
        const api = new Tenpay(config);
        const result = await api.getAppParams({
            out_trade_no: data['order_number'], // 订单内容
            body: '支付', // 订单内容
            total_fee: data['price'] // 订单金额(分)
        });
        return result;
    }
    // 微信小程序支付
    async wxappletPay(data) {
        const Tenpay = require('tenpay');
        const cf = '';// 小程序支付配置
        const notifyurl = '';//  小程序回调地址
        const refundurl = '';//  小程序退款回调地址
        const config = {
            appid: cf['appid'],
            mchid: cf['mch_id'],
            partnerKey: cf['key'],
            notify_url: notifyurl,
            refund_url: refundurl,
            spbill_create_ip: this.ip
        };
        // console.error(config);
        const api = new Tenpay(config);
        const result = await api.getPayParams({
            out_trade_no: data['order_number'], // 订单内容
            body: '支付', // 订单内容
            total_fee: data['price'], // 订单金额(分)
            openid: data['openid'] // 用户OPENID
        });
        return result;
    }
    // 微信小程序退款
    async wxappletRefund(orderNumber, orderMoney, orderRefundNumber) {
        const Tenpay = require('tenpay');
        const cf = '';// 小程序支付配置
        const pfx = require('fs').readFileSync('pem/apiclient_cert.p12');// 小程序证书路径
        const notifyurl = '';//  小程序回调地址
        const refundurl = '';//  小程序退款回调地址
        const config = {
            appid: cf['appid'],
            mchid: cf['mch_id'],
            partnerKey: cf['key'],
            pfx: pfx,
            notify_url: notifyurl,
            refund_url: refundurl,
            spbill_create_ip: this.ip
        };
        // console.error(config);
        // 方式一
        const api = new Tenpay(config);
        // 'refund_account': 'REFUND_SOURCE_RECHARGE_FUNDS',// 退款方式：余额退款
        const result = await api.refund({
            'out_trade_no': orderNumber,
            'out_refund_no': orderRefundNumber,
            'total_fee': orderMoney,
            'refund_fee': orderMoney
        });
        return result;
    }
    // 微信app退款
    async wxappRefund(orderNumber, orderMoney, orderRefundNumber) {
        const Tenpay = require('tenpay');
        const cf = '';// 微信app支付支付配置
        const notifyurl = '';//  微信app支付回调地址
        const pfx = require('fs').readFileSync('pem/wxappapiclient_cert.p12');// app证书路径
        const refundurl = '';//  微信app退款回调地址
        const config = {
            appid: cf['appid'],
            mchid: cf['mch_id'],
            partnerKey: cf['key'],
            pfx: pfx,
            notify_url: notifyurl,
            refund_url: refundurl,
            spbill_create_ip: this.ip
        };
        // console.error(config);
        const api = new Tenpay(config);
        // 'refund_account': 'REFUND_SOURCE_RECHARGE_FUNDS',// 退款方式：余额退款
        const result = await api.refund({
            'out_trade_no': orderNumber,
            'out_refund_no': orderRefundNumber,
            'total_fee': orderMoney,
            'refund_fee': orderMoney
        });
        return result;
    }
};
