/**
 * Created by zhipu.liao on 2016/3/10.
 */
"use strict";
var express = require("express");
var app = express();
var body_parser = require("body-parser");
var fs = require("fs");

app.use(express.static(__dirname));
app.use(body_parser.json());
app.use(body_parser.urlencoded({extended: true}));

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
app.post("/getAllDocs", function (req, res) {
    var files = getAllFiles();
    var body = [];
    for (let i = 0; i < files.length; i++) {
        var buffer = JSON.parse(fs.readFileSync("doc/" + files[i]));
        body.push(buffer.docInfo);
    }
    res.status(200).send({status: true, model: body});
});
app.post("/editDocs", function (req, res) {
    var name = req.body.name;
    var info = JSON.parse(fs.readFileSync("doc/" + name + ".json"));
    var newInfo = req.body.info;
    if (name != newInfo.name) {
        fs.unlink("doc/" + info.docInfo.name + ".json", function (err) {
            if (err) {
                res.status(200).send({status: false, msg: err});
            }
        });
    }
    info.docInfo = newInfo;
    fs.writeFile("doc/" + newInfo.name + ".json", JSON.stringify(info), function (err) {
        if (err) {
            res.status(200).send({status: false, msg: "应用信息修改失败。"})
        } else {
            res.status(200).send({status: true, msg: "应用信息修改成功"});
        }
    });

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
                    res.status(200).send({status: true, msg: "文档创建成功"});
                }
            });
        } else {
            res.status(200).send({status: false, msg: "该文档已存在"});
        }
    });
});
app.post("/delDocument", function (req, res) {
    var name = req.body.name;
    fs.unlink("doc/" + name + ".json", function (err) {
        if (err) {
            res.status(200).send({status: false, msg: err});
        } else {
            res.status(200).send({status: true, msg: "文档删除成功"});
        }
    });
});
app.post("/addApi", function (req, res) {
    var apiName = req.body.name;
    var api = req.body.body;
    var json = JSON.parse(fs.readFileSync("doc/" + apiName + ".json"));
    json.apis.push(api);
    fs.writeFile("doc/" + apiName + ".json", JSON.stringify(json), function (err) {
        if (err) {
            res.status(200).send({status: false, msg: "Api添加失败"});
        } else {
            res.status(200).send({status: true, msg: "Api添加成功"});
        }
    })
});
app.post("/delApi",function(req,res){
    var name=req.body.name;
    var index=req.body.index;
    var body=fs.readFile("doc/"+name+".json",function(err,data){
        if(err){
            res.status(200).send({status:false,msg:"api删除失败。"});
        }else{
            var info=JSON.parse(data);
            info.apis.splice(index,1);
            fs.writeFile("doc/"+name+".json",JSON.stringify(info), function(err){
                if(err){
                    res.status(200).send({status:false,msg:"api写入失败"});
                }else{
                    res.status(200).send({status:true,msg:"api删除成功"});
                }
            });
        }
    });
});
app.post("/editApi",function(req,res){
    var name=req.body.name;
    var newInfo=req.body.api;
    var index=req.body.index;
    var apiInfo=JSON.parse(fs.readFileSync("doc/"+name+".json"));
    apiInfo.apis[index]=newInfo;
    fs.writeFile("doc/"+name+".json",JSON.stringify(apiInfo),function(err){
        if(err){
            console.log(err);
            res.status(200).send({status:false,msg:"编辑失败"});
        }else{
            res.status(200).send({status:true,msg:"编辑成功"} );
        }
    })
});
app.listen(8083, function () {
    console.log("It's express,welcome!  127.0.0.1:8083");
});

