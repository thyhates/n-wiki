/**
 * Created by zhipu.liao on 2016/3/4.
 */
"use strict";
angular.module("app").config(["$stateProvider", "$urlRouterProvider",
    function ($stateProvider, $urlRouterProvider) {
        var mystate = $stateProvider
            .state("home", {
                url: "/",
                templateUrl: "src/page/list.html",
                controller: "ListController"
            })
            .state("home.doc", {
                url: ":docName/:apiIndex",
                views: {
                    "apiContent": {
                        templateUrl: "src/page/document.html",
                        controller: "MainController"
                    }
                }
            })
            .state("home.edit", {
                url: ":docName/:apiIndex/edit",
                views: {
                    "apiContent": {
                        templateUrl: "src/page/form.html",
                        controller: "editApiCtrl"
                    }
                }
            })
            .state("home.new", {
                url: "new",
                views: {
                    "main-container": {
                        templateUrl: "src/page/newDocument.html",
                        controller: "NewDocumentController"
                    }
                }
            })
            .state("home.newApi",{
                url:":docName/:apiIndex/newApi",
                views:{
                    "apiContent":{
                        templateUrl:"src/page/newApi.html",
                        controller:"AddApiController"
                    }
                }
            })
            .state("home.login",{
                url:"login",
                views:{
                    "main-container":{
                        templateUrl:"src/page/login.html",
                        controller:"LoginController"
                    }
                }
            });
        $urlRouterProvider.otherwise("/");
    }]);