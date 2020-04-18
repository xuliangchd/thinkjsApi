const BaseRest = require('./rest.js');

module.exports = class extends BaseRest {
    async indexAction() {
        const data = await this.model('customer').select();
        return this.success(data, 'ok');
    }
};
