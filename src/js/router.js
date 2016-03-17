/**
 * Created by zhipu.liao on 2016/3/4.
 */
"use strict";
angular.module("app").config(["$stateProvider", "$urlRouterProvider",
    function ($stateProvider, $urlRouterProvider) {
        var mystate = $stateProvider
            .state("home", {
                url: "",
                templateUrl: "src/page/list.html"
            })
            .state("home.doc",{
                url:"/doc/:docName",
                views:{
                    "main-container":{
                        templateUrl:"src/page/document.html",
                        controller:"ListController"
                    }
                }
            })
            .state("home.new",{
                url:"/new",
                views:{
                    "main-container":{
                        templateUrl:"src/page/newDocument.html",
                        controller:"NewDocumentController"
                    }
                }
            });
        $urlRouterProvider.otherwise("");
    }]);