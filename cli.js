#!/usr/bin/env node

const program = require('commander');
const api = require('./index')
program
    .option('-c, --cui', 'cui lei')

program
    .command('add')
    .description('add is name')
    .action((...args) => {
        const arg = args.slice(0, args.length - 1).join(' ')
        api.add(arg)
    })
program
    .command('clear')
    .description('clear')
    .action(() => {
        api.clear()
    })
program.parse(process.argv);

if (process.argv.length === 2) {
    // 说明用户 输入的是 node cli.js
    api.showAll()
}
