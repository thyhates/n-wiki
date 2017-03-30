/**
 * Created by zhipu.liao on 2016/3/10.
 */
"use strict";
const express = require("express");
const body_parser = require("body-parser");
const app = express();
const fs = require("fs");
const assert = require("assert");
const crypto = require("crypto");
const mongo = require("mongodb");
const dbopt = require("./dbopt");
const compression = require('compression');
const expressJwt = require('express-jwt');
const jwt = require('jsonwebtoken');
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


const hs = crypto.createHash("md5").update("abcdefg").digest("hex");

app.use(expressJwt({
    secret: hs,
    credentialsRequired: false,
    getToken: function fromHeaderOrQuerystring (req) {
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            console.log(req.headers.authorization.split(' ')[1]);
            return req.headers.authorization.split(' ')[1];
        } else if (req.query && req.query.token) {
            return req.query.token;
        }
        return null;
    }
}).unless({
    path: ['/login', '/getAllDocs', '/getLog', '/getDocument', '/selectApi']
}));
app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401).send('invalid token');
    }
});
function addLog(action, user, docName, docId, apiName, apiId, del) {
    let time = new Date();
    if (!apiId) {
        apiId = "";
    }
    let log = {
        action: action,
        time: time.toLocaleString(),
        user: user,
        apiName: apiName || "",
        apiId: apiId || "",
        docId: docId || "",
        docName: docName || "",
        del: del || false
    };
    let errs;
    dbopt.insert("logs", log, function (result) {
        if (result.result.ok === 1) {
            errs = true;
        } else {
            errs = false;
        }
    });
}
app.post("/getAllDocs", function (req, res) {
    dbopt.find("docs", {}, function (result) {
        res.status(200).send({
            status: 1,
            model: result
        });
    });
});
app.post("/getDocument", function (req, res) {
    let query = {
        doc_id: req.body.id
    };
    let docQuery = {
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
    let label = req.body.label,
        type = req.body.type,
        description = req.body.description;
    let body = {
        label: label,
        type: type,
        description: description
    };
    dbopt.insert("docs", body, function (result) {
        // console.log(result.insertedId);
        if (result.result.ok === 1) {
            addLog("创建文档", req.user.username, label, result.insertId);
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
    let doc_id = req.body.id;
    let newInfo = req.body.info;
    let query = {
        _id: new mongo.ObjectId(doc_id)
    };
    let newData = {$set: newInfo};
    dbopt.update("docs", query, newData, function (result) {
        // console.log(newInfo);
        addLog("编辑文档", req.user.username, newInfo.label, doc_id);
        res.status(200).send({
            status: true,
            model: result,
            msg: "修改成功"
        });
    });
});
app.post("/delDocument", function (req, res) {
    let doc_id = req.body.doc_id;
    let query = {
        _id: new mongo.ObjectId(doc_id)
    };
    let apiQuery = {
        doc_id: doc_id
    };
    let docName;
    dbopt.find("docs", query, function (res1) {
        docName = res1[0].label;
        dbopt.delete("docs", query, function (result) {
            if (result.result.ok === 1) {
                dbopt.delete("apis", apiQuery, function (results) {
                    // console.log(result);
                    if (result.result.ok === 1) {
                        addLog("删除文档", req.user.username, docName, doc_id, false, false, true);
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
    let id = req.body.id;
    let body = req.body.body;

    let query = {
        _id: new mongo.ObjectId(id)
    };
    let newData = {$set: {errorCodeLst: body}};
    dbopt.update("docs", query, newData, function (result) {
        res.status(200).send({
            status: true,
            model: result,
            msg: "修改成功"
        });
    });
});
app.post("/addApi", function (req, res) {
    let api = req.body.body;
    api.createUser = req.user.username;
    api.createTime = new Date();
    dbopt.insert("apis", api, function (result) {
        if (result.result.ok === 1) {
            dbopt.find("docs", {_id: new mongo.ObjectId(api.doc_id)}, function (res1) {
                addLog("创建接口", req.user.username, res1[0].label, res1[0]._id, api.label, result.insertId);
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
    let id = req.body.id;
    let query = {
        _id: new mongo.ObjectId(id)
    };
    let apiName, docName, docId;
    dbopt.find("apis", query, function (res11) {
        apiName = res11[0].label;
        docId = res11[0].doc_id;
        dbopt.find("docs", {_id: new mongo.ObjectId(docId)}, function (res1) {
            docName = res1[0].label;
            dbopt.delete("apis", query, function (results) {
                addLog("删除接口", req.user.username, docName, docId, apiName, id, true);
                res.status(200).send({
                    status: true,
                    msg: "删除成功"
                });
            });
        });
    });

});
app.post("/selectApi", function (req, res) {
    let id = req.body.id;
    if (id) {
        var query = {
            _id: new mongo.ObjectId(id)
        };
    }
    let docQuery = {
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
    let id = req.body.id;
    let newInfo = req.body.api;
    newInfo.update = req.user.username;
    newInfo.lastTime = new Date();
    let query = {
        _id: new mongo.ObjectId(id)
    };
    let newData = {$set: newInfo};
    let docName, docId;
    try {
        dbopt.find("docs", {_id: new mongo.ObjectId(newInfo.doc_id)}, function (res1) {
            docName = res1[0].label;
            docId = res1[0]._id;
            dbopt.update("apis", query, newData, function (result) {
                addLog("修改接口", req.user.username, docName, docId, newInfo.label, id);
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
        let users = JSON.parse(data).user;
        let reqName = req.body.name;
        let psd = crypto.createHash("md5").update(req.body.password).digest("hex");
        let isRight = false;
        users.forEach(function (user) {
            if (reqName === user.name && psd === user.password) {
                isRight = true;
            }
        });
        if (isRight) {
            let authToken = jwt.sign({username: reqName}, hs);
            res.status(200).send({status: true, msg: "登录成功", token: authToken});
        } else {
            res.status(400).send({status: false, msg: "用户名或密码不正确！"});
        }
    });
});
app.post("/logout", function (req, res) {
    res.status(200).send({msg: "退出成功"});
});
app.use(function (req, res) {
    res.sendFile(__dirname + "/index.html");
});
app.listen(8089, function () {
    console.log("It's express,welcome!  http://127.0.0.1:8089");
});

