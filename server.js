/**
 * Created by zhipu.liao on 2016/3/10.
 */
"use strict";
var express = require("express");
var body_parser = require("body-parser");
var app = express();
var fs = require("fs");
var assert = require("assert");
var session = require("express-session");
var crypto = require("crypto");
const mongoClient = require("mongodb").MongoClient;
const mongo = require("mongodb");
var dbopt = require("./dbopt");
app.use(express.static(__dirname + "/node_modules"));
app.use(express.static(__dirname + "/src"));
app.use(express.static(__dirname + "/dist"));
app.use(body_parser.json());
app.use(body_parser.urlencoded({extended: true}));


app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});
app.get("/favicon.ico", function (req, res) {
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
    secret: hs,
    saveUninitialized: true,
    resave: false
}));
function addLog(action, target, user, apiName, apiIndex) {
    var time = new Date();
    if (apiIndex === 0) {
        apiIndex = "0";
    }
    var log = {
        action: action,
        time: time.toLocaleString(),
        target: target,
        user: user,
        apiName: apiName || "",
        apiIndex: apiIndex || ""
    };
    var errs;
    dbopt.insert("logs", log, function (result) {
        if (result.result.ok === 1) {
            errs = true;
        } else {
            errs = false;
        }
    });
    return errs;
}
app.post("/getAllDocs", function (req, res) {
    var logined = true;
    if (!isLogin(req)) {
        logined = false;
    }
    dbopt.find("docs", {}, function (result) {
        res.status(200).send({
            status: 1,
            model: result,
            logined: logined
        });
    });
});
app.post("/getDocument", function (req, res) {
    var query = {
        doc_id: req.body.id
    };
    var docQuery = {
        _id: new mongo.ObjectId(req.body.id)
    };
    dbopt.find("docs", docQuery, function (result1) {
        dbopt.find("apis", query, function (result) {
            res.status(200).send({
                status: true,
                model: result,
                documentInfo: result1
            });
        });
    });

});
app.post("/newDocument", function (req, res) {
    if (!isLogin(req)) {
        res.status(401).send({msg: "请先登录"});
        return false;
    }
    var label = req.body.label,
        type = req.body.type,
        description = req.body.description;
    var body = {
        label: label,
        type: type,
        description: description
    };
    dbopt.insert("docs", body, function (result) {
        if (result.result.ok === 1) {
            var errs = addLog("创建文档", label, req.session.username);
            if (!errs) {
                res.status(200).send({status: true, msg: "文档创建成功"});
            } else {
                console.log(errs);
                res.status(200).send({status: false, msg: "添加操作日志失败", model: errs})
            }
        } else {
            res.status(200).send({
                status: -1,
                msg: "未知错误，请重试", model: result
            });
        }
    });
});
app.post("/editDocs", function (req, res) {
    if (!isLogin(req)) {
        res.status(401).send({msg: "请先登录"});
        return false;
    }
    var doc_id = req.body.id;
    var newInfo = req.body.info;
    var query = {
        _id: new mongo.ObjectId(doc_id)
    };
    var newData = {$set: newInfo};
    dbopt.update("docs", query, newData, function (result) {
        res.status(200).send({
            status: true,
            model: result,
            msg: "修改成功"
        });
    });
});
app.post("/delDocument", function (req, res) {
    if (!isLogin(req)) {
        res.status(401).send({msg: "请先登录"});
        return false;
    }
    var doc_id = req.body.doc_id;
    var query = {
        _id: new mongo.ObjectId(doc_id)
    };
    var apiQuery = {
        doc_id: doc_id
    };
    dbopt.delete("docs", query, function (result) {
        if (result.result.ok === 1) {
            dbopt.delete("apis", apiQuery, function (results) {
                if (result.result.ok === 1) {
                    res.status(200).send({
                        status: true,
                        msg: "删除成功"
                    });
                } else {
                    res.status(200).send({
                        status: -1,
                        msg: "服务器异常",
                        model: result
                    });
                }
            });

        }
    });
});
app.post("/editErrorCode", function (req, res) {
    if (!isLogin(req)) {
        res.status(401).send({msg: "请先登录"});
        return false;
    }
    var id = req.body.id;
    var body = req.body.body;

    var query = {
        _id: new mongo.ObjectId(id)
    };
    var newData = {$set: {errorCodeLst: body}};
    dbopt.update("docs", query, newData, function (result) {
        res.status(200).send({
            status: true,
            model: result,
            msg: "修改成功"
        });
    });
});
app.post("/addApi", function (req, res) {
    if (!isLogin(req)) {
        res.status(401).send({msg: "请先登录"});
        return false;
    }
    var api = req.body.body;
    api.createUser = req.session.username;
    api.createTime = new Date();
    dbopt.insert("apis", api, function (result) {
        if (result.result.ok === 1) {
            var errs = addLog("创建接口", api.label, req.session.username);
            if (!errs) {
                res.status(200).send({status: true, msg: "Api添加成功"});
            } else {
                console.log(errs);
                res.status(200).send({status: false, msg: "添加操作日志失败", model: errs})
            }
        } else {
            res.status(200).send({
                status: -1,
                msg: "Api添加失败", model: result
            });
        }
    });
});
app.post("/delApi", function (req, res) {
    if (!isLogin(req)) {
        res.status(401).send({msg: "请先登录"});
        return false;
    }
    var id = req.body.id;
    var query = {
        _id: new mongo.ObjectId(id)
    };
    dbopt.delete("apis", query, function (results) {
        res.status(200).send({
            status: true,
            msg: "删除成功"
        });
    });
});
app.post("/selectApi", function (req, res) {
    var id = req.body.id;
    if (id) {
        var query = {
            _id: new mongo.ObjectId(id)
        };
    }
    var docQuery = {
        _id: new mongo.ObjectId(req.body.doc_id)
    };
    dbopt.find("docs", docQuery, function (result1) {
        if (id) {
            dbopt.find("apis", query, function (results) {
                res.status(200).send({
                    status: true,
                    model: results,
                    documentInfo: result1
                });
            });
        } else {
            res.status(200).send({
                status: true,
                documentInfo: result1
            });
        }
    });

});
app.post("/editApi", function (req, res) {
    if (!isLogin(req)) {
        res.status(401).send({msg: "请先登录"});
        return false;
    }
    var id = req.body.id;
    var newInfo = req.body.api;
    newInfo.update = req.session.username;
    newInfo.lastTime = new Date();
    var query = {
        _id: new mongo.ObjectId(id)
    };
    var newData = {$set: newInfo};
    console.log("1", query, newInfo);
    try {
        dbopt.update("apis", query, newData, function (result) {
            console.log(result);
            res.status(200).send({
                status: true,
                model: result,
                msg: "修改成功"
            });
        });
    } catch (err) {
        console.log("err", err);
    }

});
app.post("/getLog", function (req, res) {
    dbopt.find("logs", {}, function (result) {
        res.status(200).send({
            status: true,
            model: result
        });
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
            req.session.username = reqName;
            res.status(200).send({status: true, msg: "登录成功"});
        } else {
            res.status(401).send({status: false, msg: "用户名或密码不正确！"});
        }
    });
});
app.post("/logout", function (req, res) {
    req.session.isLogin = false;
    req.session.username = null;
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
app.listen(8086, function () {
    console.log("It's express,welcome!  127.0.0.1:8084");
});

