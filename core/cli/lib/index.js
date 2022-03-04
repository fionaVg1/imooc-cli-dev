'use strict';

module.exports = core;
const semver = require('semver');
const colors = require('colors/safe');
const pkg = require('../package.json');
const log = require('@imooc-cli-dev/log');
const constant = require('./const')

function core() {
    try {
        checkPkgVersion();
        checkNodeVersion();
    } catch (e) {
        log.error(e.message);
    }
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