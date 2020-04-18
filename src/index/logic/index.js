module.exports = class extends think.Logic {
    indexAction() {
        // console.error('Logic');
    }
    baiduimgAction() {
        this.allowMethods = 'post';
        this.rules = {
            url: {
                required: true
            }
        };
    }
};
