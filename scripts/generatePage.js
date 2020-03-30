// generateComponent.js`
const chalk = require('chalk');
const path = require('path');
const fs = require('fs');

const resolve = (...file) => path.resolve(__dirname, ...file);
const log = message => console.log(chalk.green(`${message}`));
const successLog = message => console.log(chalk.blue(`${message}`));
const errorLog = error => console.log(chalk.red(`${error}`));
const { vueTemplate, cssTemplate, routerTemplate } = require('./template');

const generateFile = (inPath, data) => new Promise((_resolve, _reject) => {
    if (fs.existsSync(inPath)) {
        errorLog(`${path}文件已存在`);
        _reject(new Error(`${path}文件已存在`));
    }
    fs.writeFile(inPath, data, 'utf8', (err) => {
        if (err) {
            errorLog(err.message);
            _reject(err);
        } else {
            _resolve(true);
        }
    });
});

// 递归创建目录
function mkdirs(directory, callback) {
    const exists = fs.existsSync(directory);
    if (exists) {
        callback();
    } else {
        mkdirs(path.dirname(directory), () => {
            fs.mkdirSync(directory);
            callback();
        });
    }
}

function dotExistDirectoryCreate(directory) {
    return new Promise((_resolve) => {
        mkdirs(directory, () => {
            _resolve(true);
        });
    });
}

log('请输入要生成的页面名称');
let componentName = '';

process.stdin.on('data', async (chunk) => {
    let inputName = String(chunk)
        .trim()
        .toString();
    inputName = inputName.replace(/./, m => m.toUpperCase());
    /**
     * 组件目录路径
     */
    const componentDirectory = resolve('../src/views', inputName);
    const routerDirectory = resolve('../src/router', inputName);

    console.log(componentDirectory, routerDirectory);
    const hasComponentDirectory = fs.existsSync(componentDirectory);
    const hasRouterDirectory = fs.existsSync(componentDirectory);
    if (hasComponentDirectory || hasRouterDirectory) {
        errorLog(`${inputName}页面目录已存在，请重新输入`);
        return;
    }
    log(`正在生成 view 目录 ${componentDirectory}`);
    await dotExistDirectoryCreate(componentDirectory);
    log(`正在生成 router 目录 ${componentDirectory}`);
    await dotExistDirectoryCreate(routerDirectory);
    // fs.mkdirSync(componentDirectory);

    try {
        componentName = inputName;

        /**
         * vue组件路径
         */
        const componentVueName = resolve(componentDirectory, `${componentName}.vue`);
        /**
         * css路径
         */
        const scssComponentName = resolve(componentDirectory, `${componentName}.scss`);

        /**
         * router 路径
         */
        const routerJs = resolve(routerDirectory, 'index.js');

        log(`正在生成 vue 文件 ${componentVueName}`);
        await generateFile(componentVueName, vueTemplate(componentName));
        log(`正在生成 scss 文件 ${scssComponentName}`);
        await generateFile(scssComponentName, cssTemplate(componentName));

        log(`正在生成 router 文件 ${routerJs}`);
        await dotExistDirectoryCreate(componentDirectory);
        await generateFile(routerJs, routerTemplate(componentName));
        successLog('生成成功');
    } catch (e) {
        errorLog(e.message);
    }

    process.stdin.emit('end');
});
process.stdin.on('end', () => {
    log('exit');
    process.exit();
});
