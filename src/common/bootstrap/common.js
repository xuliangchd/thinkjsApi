//公共方法
/**
* 参数：无
* 获取当前时间戳
* 作者 xuliangchd
*/
global.time = function() {
    var time = Date.parse(new Date());
    time = time / 1000;
    return time;
};
/**
* 参数：timestamp
* 时间戳格式化（2018-6-27 10:24:03）
* 作者 xuliangchd
*/
global.date = function(timestamp, type) {
    var date = new Date(timestamp * 1000); // 时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = date.getDate();
    var h = date.getHours();
    var m = date.getMinutes();
    var s = date.getSeconds();
    if (type === 1) {
        return Y + M + D + ' ' + h + ':' + m + ':' + s;// 2018-6-27 10:24:03
    } else if (type === 2) {
        return Y + M + D;// 2018-6-27
    } else {
        return Y + M + D + ' ' + h + ':' + m;// 2018-6-27 10:24
    }
};
/**
* 参数：num
* 指定个数随机数
* 作者 xuliangchd
*/
global.number = function(num) {
    // 0-9的随机数
    var arr = ''; // 容器
    for (var i = 0; i < num; i++) { // 循环num次
        var number = Math.random() * 9; // Math.random();每次生成(0-1)之间的数;
        number = parseInt(number, 10);
        arr = arr + number;
    }
    return arr;
};
