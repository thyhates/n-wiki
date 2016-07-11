/**
 * Created by zhipu.liao on 2016/3/10.
 */
"use strict";
var express = require("express");
var body_parser = require("body-parser");
var app = express();
var fs = require("fs");
var session = require("express-session");
var crypto = require("crypto");
app.use(express.static("node_modules"));
app.use(express.static("src"));
app.use(express.static("dist"));
app.use(body_parser.json());
app.use(body_parser.urlencoded({extended: true}));


app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});
app.get("/favicon.ico",function(req,res){
    res.sendFile(__dirname + "/favicon.ico");
});
/*fs.readFile("doc/document.json", function (err, data) {
 if (err) {
 console.log(err);
 } else {
 console.log(JSON.parse(data).api);
 }
 });*/
function getAllFiles() {
    var file = fs.readdirSync("doc");
    return file;
}

var hs = crypto.createHash("md5").update("abcdefg").digest("hex");
app.use(session({
    secret: hs
}));
function addLog(action,target,user,apiName,apiIndex){
    var logs=JSON.parse(fs.readFileSync("log.json"));
    var time=new Date();
    if(apiIndex===0){
        apiIndex="0";
    }
    var log={
        action:action,
        time:time.toLocaleString(),
        target:target,
        user:user,
        apiName:apiName||"",
        apiIndex:apiIndex||""
    };
    if(logs.logs.length>30){
        logs.logs.shift();
    }
    logs.logs.push(log);
    var errs;
    fs.writeFile("log.json",JSON.stringify(logs),function(err){
        if(err){
            errs=err;
        }else{
            errs=false;
        }
    });
    return errs;
}
app.post("/getAllDocs", function (req, res) {
    var logined=true;
    if(!isLogin(req)){
        logined=false;
    }
    var files = getAllFiles();
    var body = [];
    for (let i = 0; i < files.length; i++) {
        var buffer = JSON.parse(fs.readFileSync("doc/" + files[i]));
        body.push(buffer.docInfo);
    }
    res.status(200).send({status: true, model: body,logined:logined});
});
app.post("/getDocument", function (req, res) {
    var name = req.body.name;
    fs.readFile("doc/" + name + ".json", function (err, data) {
        if (err) {
            res.status(200).send({status: false, msg: "文档读取失败，或不存在"});
        } else {
            res.status(200).send({status: true, model: JSON.parse(data), msg: "文档读取成功"});
        }
    });

});
app.post("/newDocument", function (req, res) {
    if (!isLogin(req)) {
        res.status(401).send({msg: "请先登录"});
        return false;
    }
    var name = req.body.name,
        type = req.body.type,
        description = req.body.description;
    var body = {
        docInfo: {
            name: name,
            type: type,
            description: description
        },
        apis: []
    };
    fs.readFile("doc/" + name + ".json", function (err, data) {
        if (err) {
            fs.writeFile("doc/" + name + ".json", JSON.stringify(body), function (err) {
                if (err) {
                    res.status(400).send({
                        status: false,
                        msg: err
                    });
                } else {
                    var errs=addLog("创建文档",name,req.session.username);
                    if(!errs){
                        res.status(200).send({status: true, msg: "文档创建成功"});
                    }else{
                        console.log(errs);
                        res.status(200).send({status:false,msg:"添加操作日志失败",model:errs})
                    }
                }
            });
        } else {
            res.status(200).send({status: false, msg: "该文档已存在"});
        }
    });
});
app.post("/editDocs", function (req, res) {
    if (!isLogin(req)) {
        res.status(401).send({msg: "请先登录"});
        return false;
    }
    var name = req.body.name;
    var info = JSON.parse(fs.readFileSync("doc/" + name + ".json"));
    var newInfo = req.body.info;
    if (name != newInfo.name) {
        fs.unlink("doc/" + info.docInfo.name + ".json", function (err) {
            if (err) {
                res.status(200).send({status: false, msg: err});
                return false;
            }
        });
    }
    info.docInfo = newInfo;
    fs.writeFile("doc/" + newInfo.name + ".json", JSON.stringify(info), function (err) {
        if (err) {
            res.status(200).send({status: false, msg: "修改失败。"})
        } else {
            var errs=addLog("修改文档",newInfo.name,req.session.username);
            if(!errs){
                res.status(200).send({status: true, msg: "修改成功"});
            }else{
                console.log(errs);
                res.status(200).send({status:false,msg:"添加操作日志失败",model:errs})
            }
        }
    });

});
app.post("/delDocument", function (req, res) {
    if (!isLogin(req)) {
        res.status(401).send({msg: "请先登录"});
        return false;
    }
    var name = req.body.name;
    fs.unlink("doc/" + name + ".json", function (err) {
        if (err) {
            res.status(200).send({status: false, msg: err});
        } else {
            var errs=addLog("删除文档",name,req.session.username);
            if(!errs){
                res.status(200).send({status: true, msg: "文档删除成功"});
            }else{
                console.log(errs);
                res.status(200).send({status:false,msg:"添加操作日志失败",model:errs})
            }
        }
    });
});
app.post("/editErrorCode",function(req,res){
    if (!isLogin(req)) {
        res.status(401).send({msg: "请先登录"});
        return false;
    }
    var name = req.body.name;
    var body = req.body.body;
    var errInfo = JSON.parse(fs.readFileSync("doc/" + name + ".json"));
    errInfo.errorCodeLst=body;
    fs.writeFile("doc/" + name + ".json", JSON.stringify(errInfo), function (err) {
        if (err) {
            res.status(200).send({status: false, msg: "编辑失败"});
        } else {
            var errs=addLog("编辑错误码",name,req.session.username);
            if(!errs){
                res.status(200).send({status: true, msg: "编辑成功"});
            }else{
                res.status(200).send({status:false,msg:"添加操作日志失败",model:errs});
            }
        }
    })
});
app.post("/addApi", function (req, res) {
    if (!isLogin(req)) {
        res.status(401).send({msg: "请先登录"});
        return false;
    }
    var apiName = req.body.name;
    var api = req.body.body;
    api.createUser=req.session.username;
    api.createTime=new Date();
    var json = JSON.parse(fs.readFileSync("doc/" + apiName + ".json"));
    json.apis.push(api);
    fs.writeFile("doc/" + apiName + ".json", JSON.stringify(json), function (err) {
        if (err) {
            res.status(200).send({status: false, msg: "Api添加失败"});
        } else {
            var errs=addLog("添加API",apiName,req.session.username,api.name,json.apis.length-1);
            if(!errs){
                res.status(200).send({status: true, msg: "Api添加成功"});
            }else{
                res.status(200).send({status:false,msg:"添加操作日志失败",model:errs})
            }
        }
    })
});
app.post("/delApi", function (req, res) {
    if (!isLogin(req)) {
        res.status(401).send({msg: "请先登录"});
        return false;
    }
    var name = req.body.name;
    var index = req.body.index;
    var body = fs.readFile("doc/" + name + ".json", function (err, data) {
        if (err) {
            res.status(200).send({status: false, msg: "api删除失败。"});
        } else {
            var info = JSON.parse(data);
            var apiName=info.apis[index].name;
            info.apis.splice(index, 1);
            fs.writeFile("doc/" + name + ".json", JSON.stringify(info), function (err) {
                if (err) {
                    res.status(200).send({status: false, msg: "api写入失败"});
                } else {
                    var errs=addLog("删除API",name,req.session.username,apiName);
                    if(!errs){
                        res.status(200).send({status: true, msg: "api删除成功"});
                    }else{
                        res.status(200).send({status:false,msg:"添加操作日志失败",model:errs})
                    }
                }
            });
        }
    });
});
app.post("/editApi", function (req, res) {
    if (!isLogin(req)) {
        res.status(401).send({msg: "请先登录"});
        return false;
    }
    var name = req.body.name;
    var newInfo = req.body.api;
    newInfo.update=req.session.username;
    newInfo.lastTime=new Date();
    var index = req.body.index;
    var apiInfo = JSON.parse(fs.readFileSync("doc/" + name + ".json"));
    apiInfo.apis[index] = newInfo;
    fs.writeFile("doc/" + name + ".json", JSON.stringify(apiInfo), function (err) {
        if (err) {
            res.status(200).send({status: false, msg: "编辑失败"});
        } else {
            var errs=addLog("编辑API",name,req.session.username,newInfo.name,index);
            if(!errs){
                res.status(200).send({status: true, msg: "编辑成功"});
            }else{
                res.status(200).send({status:false,msg:"添加操作日志失败",model:errs})
            }
        }
    })
});
app.post("/getLog",function(req,res){
    fs.readFile("log.json",function(err,data){
       if(err){
           console.log(err);
           res.status(200).send({status:false,msg:"日志读取失败"});
       } else{
           res.status(200).send({status:true,msg:"日志读取成功",model:JSON.parse(data)});
       }
    });
});
app.post("/login", function (req, res) {
    fs.readFile("config.json", function (err, data) {
        var users = JSON.parse(data).user;
        var reqName = req.body.name;
        var psd = crypto.createHash("md5").update(req.body.password).digest("hex");
        var isRight = false;
        users.forEach(function (user) {
            if (reqName === user.name && psd === user.password) {
                isRight = true;
            }
        });
        if (isRight) {
            req.session.isLogin = true;
            req.session.username=reqName;
            res.status(200).send({status: true, msg: "登录成功"});
        } else {
            res.status(401).send({status: false, msg: "用户名或密码不正确！"});
        }
    });
});
app.post("/logout", function (req, res) {
    req.session.isLogin = false;
    req.session.username=null;
    console.log(req.session.isLogin);
    res.status(200).send({msg: "退出成功"});
});
function isLogin(req) {
    if (!req.session.isLogin) {
        return false;
    }
    return true;
}
app.use(function (req, res) {
    res.sendFile(__dirname + "/index.html");
});
app.listen(8084, function () {
    console.log("It's express,welcome!  127.0.0.1:8084");
});

