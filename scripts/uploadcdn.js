// /scripts/upcdn.js
const qiniu = require('qiniu');
const glob = require('glob');
const mime = require('mime');
const path = require('path');

const isWindow = /^win/.test(process.platform);

let pre = path.resolve(__dirname, '../dist/') + (isWindow ? '\\' : '');

const files = glob.sync(
    `${path.join(__dirname, '../dist/**/*.?(js|css|png|jpg|svg|woff|woff2|ico|ttf|eot)')}`,
);

pre = pre.replace(/\\/g, '/');

const options = {
    scope: 'development', // 空间对象名称
};
const config = {
    qiniu: {
        accessKey: '4MRXlFW3PVeWCQ9z6X2GxN-kPGsnE5viP-OoiGNO', // 个人中心 秘钥管理里的 AccessKey
        secretKey: 'J1A0AfG7uKzcW51pETgnBS2mPKERvoMCy1SNq8h8', // 个人中心 秘钥管理里的 SecretKey
        bucket: options.scope,
        domain: 'http://dev.biubiupiu.cn',
    },
};
const { accessKey } = config.qiniu;
const { secretKey } = config.qiniu;

const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
const putPolicy = new qiniu.rs.PutPolicy(options);
const uploadToken = putPolicy.uploadToken(mac);
const cf = new qiniu.conf.Config({
    zone: qiniu.zone.Zone_z2,
});

const formUploader = new qiniu.form_up.FormUploader(cf);

async function uploadFIle(key, localFile) {
    const extname = path.extname(localFile);
    const mimeName = mime.getType(extname);
    const putExtra = new qiniu.form_up.PutExtra({ mimeType: mimeName });
    return new Promise((resolve, reject) => {
        formUploader.putFile(
            uploadToken,
            key,
            localFile,
            putExtra,
            (respErr, respBody, respInfo) => {
                if (respErr) {
                    reject(respErr);
                }
                resolve({ respBody, respInfo });
            },
        );
    });
}

function getFileKey(prev, file) {
    if (file.indexOf(prev) > -1) {
        const key = file.split(prev)[1];
        return key.startsWith('/') ? key.substring(1) : key;
    }
    return file;
}

async function uploadFileCDN(selfFiles) {
    // eslint-disable-next-line no-restricted-syntax
    for (const file of selfFiles) {
        const key = `ygw/${getFileKey(pre, file)}`;
        try {
            // eslint-disable-next-line no-await-in-loop
            await uploadFIle(key, file);
            console.log(`上传成功 key: ${key}`);
        } catch (err) {
            console.log('error', err);
        }
    }
}

(async () => {
    console.time('上传文件到cdn');
    await uploadFileCDN(files);
    console.timeEnd('上传文件到cdn');
})();
