const Base = require('./base.js');
const jwt = require('jsonwebtoken');
/**
* 用户登录状态下所有控制器都应该要继承此
*/
module.exports = class extends Base {
    /**
     * 判断用户是否登录，所有需要登录的页面继承此类
     */
    async __before() {
        const flag = await super.__before();
        // 如果父级想阻止后续继承执行会返回 false，这里判断为 false 的话不再继续执行了。
        if (flag === false) return false;
        // 其他逻辑代码
        if (!this.header.hasOwnProperty('token') || !this.header['token']) {
            return this.fail(1002, '未定义token');
        }
        //验证token信息
    }
};
