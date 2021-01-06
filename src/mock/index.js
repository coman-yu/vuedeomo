const fs = require('fs')
const path = require('path')
const JSON5 = require('json5')
const Mock = require('mockjs')

function getJsonFile(filePath){
    var json = fs.readFileSync(path.resolve(__dirname,filePath),'utf-8')
    return JSON5.parse(json)
}
module.exports = function(app){
    app.get('/user/userinfo',function(req,res){
        var json = getJsonFile('./user.json5')
        console.log('json',json);
        res.json(Mock.mock(json))
    })
}
