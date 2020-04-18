// default config
module.exports = {
    workers: 1,
    port: 8360,
    // host: '127.0.0.1',
    host: '192.168.2.88',
    md5_prefix: '',
    stickyCluster: true,
    download_upload: {
        maxSize: 1 * 1024 * 1024, // 上传的文件大小限制 (0-不做限制)
        exts: 'jpg,gif,png,jpeg,zip,rar,tar,gz,7z,doc,docx,txt,xml,xls,xlsx,mp3,wma,wav,amr,pem', // 允许上传的文件类型
        rootPath: 'www/upload'// 保存根路径
    }
};
