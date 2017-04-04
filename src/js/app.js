/**
 * Created by zhipu.liao on 2016/3/4.
 */
"use strict";
var app = angular.module("app", ["angular-loading-bar", "ngAnimate",
    'ui.router', "toastr", "ui.bootstrap", "schemaForm", "angularBootstrapNavTree"])
    .run(function () {
            console.log("app started...");
        });