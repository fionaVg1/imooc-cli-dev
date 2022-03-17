'use strict';

module.exports = core;
const path = require('path');
const fs = require('fs');
const semver = require('semver');
const colors = require('colors/safe');
const userHome = require('user-home');
const pkg = require('../package.json');
const log = require('@imooc-cli-dev/log');
const constant = require('./const');


let args, config;

function core() {
    try {
        checkPkgVersion();
        checkNodeVersion();
        checkRoot();
        checkUserHome();
        checkInputArgs();
        log.verbose('debug', 'test debug log');
        checkEnv();
        checkGlobalUpdate();
    } catch (e) {
        log.error(e.message);
    }
}

async function checkGlobalUpdate() {
    //1. 获取当前版本号和模块名
    const currentVersion = pkg.version;
    const npmName = pkg.name;
    //2. 调用npm API,获取所有版本号
    const { getNpmSemverVersion } = require('@imooc-cli-dev/get-npm-info');
    const version = await getNpmSemverVersion(currentVersion, npmName);
    console.log(version)
    if (version && semver.gt(version, currentVersion)) {
        log.warn(colors.yellow(`请手动更新${npmName}，当前版本：${currentVersion}，最新版本：${version}
        更新命令：npm install -g ${npmName}`));
    }
    //3. 提取所有版本号，对比哪些版本号是大于当前版本号
    //4. 获取最新的版本号，提示用户更新到该版本
}


function checkEnv() {
    const dotenv = require('dotenv');
    const dotenvPath = path.resolve(userHome, '.env');
    if (fs.existsSync(dotenvPath)) {
        config = dotenv.config({
            path: dotenvPath
        });
    }
    config = createDefaultConfig();
    log.verbose('环境变量', process.env.CLI_HOME_PATH);
}

function createDefaultConfig() {
    const cliConfig = {
        home: userHome,
    };
    if (process.env.CLI_HOME) {
        cliConfig['cliHome'] = path.join(userHome, process.env.CLI_HOME);
    } else {
        cliConfig['cliHome'] = path.join(userHome, constant.DEFAULT_CLI_HOME)
    }
    process.env.CLI_HOME_PATH = cliConfig.cliHome;
}

function checkInputArgs() {
    const minimist = require('minimist');
    args = minimist(process.argv.slice(2));
    console.log(args);
    checkArgs();
}

function checkArgs() {
    if (args.debug) {
        process.env.LOG_LEVEL = 'verbose';
    } else {
        process.env.LOG_LEVEL = 'info';
    }
    log.level = process.env.LOG_LEVEL;
}

function checkUserHome() {
}

function checkRoot() {
}

function checkNodeVersion() {
    //第一步，获取当前Node版本号
    const currentVersion = process.version;
    //第二步，对比最低版本号
    const lowestVersion = constant.LOWEST_NODE_VERSION;
    if (!semver.gte(currentVersion, lowestVersion)) {
        throw new Error(colors.red(`imooc-cli 需要安装 v${lowestVersion} 以上版本的 Node.js`));
    }
}

function checkPkgVersion() {
    log.success('test', 'success');
    log.notice('cli', pkg.version);
}
