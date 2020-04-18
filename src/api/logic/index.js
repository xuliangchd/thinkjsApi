module.exports = class extends think.Logic {
    __before() {

    }

    indexAction() {
    // console.log('Logic_index');
    }
    upNameAction() {
        this.allowMethods = 'post';
        this.rules = {
            username: {
                required: true,
                length: { min: 2 }
            }
        };
    }
};
