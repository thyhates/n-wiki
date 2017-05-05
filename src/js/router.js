/**
 * Created by zhipu.liao on 2016/3/4.
 */
"use strict";
angular.module("app").config(["$stateProvider", "$urlRouterProvider",
    function ($stateProvider, $urlRouterProvider) {
        var mystate = $stateProvider
            .state("home", {
                url: "/",
                templateUrl: function () {
                  return  "page/list.html?"+Math.random();
                }
            })
            .state("home.doc", {
                /**
                 * @id 文档id
                 * @aid api id
                 */

                url: ":id/:aid",
                views: {
                    "apiContent": {
                        templateUrl:function () {
                            return  "page/document.html?"+Math.random();
                        },
                        controller: "MainController"
                    }
                }
            })
            .state("home.edit", {
                url: ":id/:aid/edit",
                views: {
                    "apiContent": {
                        templateUrl: function () {
                            return  "page/form.html?"+Math.random();
                        },
                        controller: "editApiCtrl"
                    }
                }
            })
            .state("home.new", {
                url: "new",
                views: {
                    "main-container": {
                        templateUrl: function () {
                            return  "page/newDocument.html?"+Math.random();
                        }
                    }
                }
            })
            .state("home.login", {
                url: "login",
                views: {
                    "main-container": {
                        templateUrl: function () {
                            return  "page/login.html?"+Math.random();
                        },
                        controller: "LoginController"
                    }
                }
            })
            .state("home.newApi", {
                url: ":id/:apiId/newApi",
                views: {
                    "apiContent": {
                        templateUrl: function () {
                            return  "page/newApi.html?"+Math.random();
                        }
                    }
                }
            })
            .state("home.error", {
                url: ":id/:aid/errCode",
                views: {
                    "apiContent": {
                        templateUrl: function () {
                            return  "page/errorCode.html?"+Math.random();
                        }
                    }
                }
            })
            .state("home.editErr", {
                url: ":id/:aid/edit/err",
                views: {
                    "apiContent": {
                        templateUrl: function () {
                            return  "page/errorForm.html?"+Math.random();
                        }
                    }
                }
            });
        $urlRouterProvider.otherwise("/");
    }]);