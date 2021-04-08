/**
 * 测试 new Promise(executor) 的参数校验
 *
 * new Promise()
 *    TypeError: Promise resolver undefined is not a function
 */
const Promise = require('./promise');

new Promise();
