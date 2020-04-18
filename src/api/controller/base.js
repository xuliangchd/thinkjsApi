const BaseRest = require('./rest.js');
// 接口请求验证
module.exports = class extends BaseRest {
    /**
     * 基本action，用于接口的真实性验证，主要处理安全相关逻辑，基本所有的控制器都需要继承于此
     */
    async __before() {
        // 验证签名
    }

    __call() {
        return this.fail(1, '页面未找到');
    }
};
