/**
 * Created by zhipu.liao on 2016/3/10.
 */
"use strict";
const express = require("express");
const body_parser = require("body-parser");
const app = express();
const fs = require("fs");
const assert = require("assert");
const session = require("express-session");
const crypto = require("crypto");
const compression = require('compression');
const mongo = require("mongodb");
const dbopt = require("./dbopt");
app.use(compression());
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
function addLog(action, user, docName, docId, apiName, apiId, del) {
    var time = new Date();
    if (!apiId) {
        apiId = "";
    }
    var log = {
        action: action,
        time: time.toLocaleString(),
        user: user,
        apiName: apiName || "",
        apiId: apiId || "",
        docId: docId || "",
        docName: docName || "",
        del: del || false
    };
    var errs;
    dbopt.insert("logs", log, function (result) {
        if (result.result.ok === 1) {
            errs = true;
        } else {
            errs = false;
        }
    });
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
        // console.log(result.insertedId);
        if (result.result.ok === 1) {
            addLog("创建文档", req.session.username, label, result.insertId);
            res.status(200).send({status: true, msg: "文档创建成功"});
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
        // console.log(newInfo);
        addLog("编辑文档", req.session.username, newInfo.label, doc_id);
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
    var docName;
    dbopt.find("docs", query, function (res1) {
        docName = res1[0].label;
        dbopt.delete("docs", query, function (result) {
            if (result.result.ok === 1) {
                dbopt.delete("apis", apiQuery, function (results) {
                    // console.log(result);
                    if (result.result.ok === 1) {
                        addLog("删除文档", req.session.username, docName, doc_id, false, false, true);
                        res.status(200).send({
                            status: true,
                            msg: "删除成功", result: result
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
            dbopt.find("docs", {_id: new mongo.ObjectId(api.doc_id)}, function (res1) {
                addLog("创建接口", req.session.username, res1[0].label, res1[0]._id, api.label, result.insertId);
                res.status(200).send({status: true, msg: "Api添加成功"});
            });
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
    var apiName, docName, docId;
    dbopt.find("apis", query, function (res11) {
        apiName = res11[0].label;
        docId = res11[0].doc_id;
        dbopt.find("docs", {_id: new mongo.ObjectId(docId)}, function (res1) {
            docName = res1[0].label;
            dbopt.delete("apis", query, function (results) {
                addLog("删除接口", req.session.username, docName, docId, apiName, id, true);
                res.status(200).send({
                    status: true,
                    msg: "删除成功"
                });
            });
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
    var docName, docId;
    try {
        dbopt.find("docs", {_id: new mongo.ObjectId(newInfo.doc_id)}, function (res1) {
            docName = res1[0].label;
            docId = res1[0]._id;
            dbopt.update("apis", query, newData, function (result) {
                addLog("修改接口", req.session.username, docName, docId, newInfo.label, id);
                res.status(200).send({
                    status: true,
                    model: result,
                    msg: "修改成功"
                });
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
app.listen(8089, function () {
    console.log("It's express,welcome!  http://127.0.0.1:8089");
});

