/**
 * Created by thyhates on 2016/10/9.
 */
"use strict";
var fs = require("fs");
var assert = require("assert");
var session = require("express-session");
var crypto = require("crypto");
const mongoClient = require("mongodb").MongoClient;
const mongo = require("mongodb");
const mongoUrl = "mongodb://127.0.0.1:27017/wiki";
const mongoUser = "thyhates";
const mongoPwd = "123";
let dbopt = {
    find: function (co, query, callback) {
        mongoClient.connect(mongoUrl, function (err, db) {
            assert.equal(null, err);
            db.authenticate(mongoUser, mongoPwd, function (err, result) {
                assert.equal(true, result);
                let collection = db.collection(co);
                collection.find(query).toArray().then(function (docs) {
                    assert.equal(null, err);
                    db.close();
                    callback(docs);
                });
            });
        });
    },
    insert: function (co, query, callback) {
        mongoClient.connect(mongoUrl, function (err, db) {
            assert.equal(null, err);
            db.authenticate(mongoUser, mongoPwd, function (err, result) {
                assert.equal(true, result);
                let collection = db.collection(co);
                collection.insertOne(query).then(function (items) {
                    assert.equal(1, items.insertedCount);
                    db.close();
                    callback(items);
                });
            });
        });
    },
    update: function (co, query, newData, callback) {
        mongoClient.connect(mongoUrl, function (err, db) {
            assert.equal(null, err);
            db.authenticate(mongoUser, mongoPwd, function (err, result) {
                assert.equal(true, result);
                let collection = db.collection(co);
                collection.updateOne(query, newData).then(function (items) {
                    db.close();
                    callback(items);
                });
            });
        });
    },
    delete: function (co, query, callback) {
        mongoClient.connect(mongoUrl, function (err, db) {
            assert.equal(null, err);
            db.authenticate(mongoUser, mongoPwd, function (err, result) {
                assert.equal(true, result);
                let collection = db.collection(co);
                collection.deleteOne(query).then(function (items) {
                    db.close();
                    callback(items);
                });
            });
        });
    }
};
module.exports=dbopt;