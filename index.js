
const db = require('./db.js')
const inquirer = require('inquirer');
module.exports.add = async function (title) {
    // 读取之前的任务
    const list = await db.read()
    // 添加 title 任务
    list.push({
        title,
        done: false
    })
    // 存储 任务 到文件
    db.write(list)
}

module.exports.clear = async (title) => {
    await db.write([])
}
function markAsDone(list,index){
    list[index].done = true
    db.write(list)
     
}
function markAsUndone(list,index){
    list[index].done = false
    db.write(list)
     
}
function updateTitle(list,index){
    inquirer.prompt({
        title: 'input',
        name: 'title',
        message: '新的标题',
        default: list[index].title
    }).then(answer => {
        list[index].title = answer.title
        db.write(list)
    })
     
}
function remove(list,index){
    list.splice(index, 1)
    db.write(list)
     
}
function askForAction(list, index) {
    const actions = {
        markAsDone,
        markAsUndone,
        updateTitle,
        remove
    }
    inquirer.prompt({
        type: 'list',
        name: 'action',
        choices: [
            { name: '退出', value: 'quit' },
            { name: '已完成', value: 'markAsDone' },
            { name: '未完成', value: 'markAsUndone' },
            { name: '改标题', value: 'updateTitle' },
            { name: '删除', value: 'remove' }
        ]
    }).then((answer2) => {
        const action = actions[answer2.action]
        action && action(list,index)
    })
}
function askForCreateTask(list) {
    inquirer.prompt({
        type: 'input',
        name: 'title',
        message: '创建任务'
    }).then(answer => {
        list.push({
            title: answer.title,
            done: false
        })
        db.write(list)
    })
}
function printTask(list) {
    inquirer
        .prompt(
            {
                type: 'list',
                name: 'index',
                message: '你要操作什么?',
                choices: [
                    { name: '退出', value: '-1' },
                    ...list.map((task, index) => {
                        return { name: `${task.done ? '[x]' : '[_]'} ${index + 1} - ${task.title}`, value: index.toString() }
                    }),
                    { name: '创建', value: '-2' }
                ],
            },
        )
        .then((answer) => {
            const index = parseInt(answer.index)
            if (index >= 0) {
                // 选中任务
                askForAction(list, index)
            } else if (index === -2) {
                // 创建任务
                askForCreateTask(list)
            }
        });
}

module.exports.showAll = async () => {
    // 读取之前的文件
    let list = await db.read()
    printTask(list)
}