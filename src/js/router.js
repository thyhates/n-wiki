/**
 * Created by zhipu.liao on 2016/3/4.
 */
"use strict";
angular.module("app").config(["$stateProvider", "$urlRouterProvider",
    function ($stateProvider, $urlRouterProvider) {
        var mystate = $stateProvider
            .state("home", {
                url: "/",
                templateUrl: "page/list.html",
                controller: "ListController"
            })
            .state("home.doc", {
                url: ":docName/:apiIndex",
                views: {
                    "apiContent": {
                        templateUrl: "page/document.html",
                        controller: "MainController"
                    }
                }
            })
            .state("home.edit", {
                url: ":docName/:apiIndex/edit",
                views: {
                    "apiContent": {
                        templateUrl: "page/form.html",
                        controller: "editApiCtrl"
                    }
                }
            })
            .state("home.new", {
                url: "new",
                views: {
                    "main-container": {
                        templateUrl: "page/newDocument.html",
                        controller: "NewDocumentController"
                    }
                }
            })
            .state("home.login", {
                url: "login",
                views: {
                    "main-container": {
                        templateUrl: "page/login.html",
                        controller: "LoginController"
                    }
                }
            })
            .state("home.newApi", {
                url: ":docName/:apiIndex/newApi",
                views: {
                    "apiContent": {
                        templateUrl: "page/newApi.html",
                        controller: "AddApiController"
                    }
                }
            })
            .state("home.error", {
                url: ":docName/:apiIndex/errCode",
                views: {
                    "apiContent": {
                        templateUrl: "page/errorCode.html",
                        controller: "ErrorController"
                    }
                }
            })
            .state("home.editErr", {
                url: ":docName/edit/err",
                views: {
                    "apiContent": {
                        templateUrl: "page/errorForm.html",
                        controller: "EditErrController"
                    }
                }
            });
        $urlRouterProvider.otherwise("/");
    }]);