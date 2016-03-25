/**
 * Created by zhipu.liao on 2016/3/4.
 */
angular.module("app")
    .directive("onFormReady", ["$timeout", function ($timeout) {
        return {
            restrict: "A",
            link: function (scope, element, attr) {
                scope.addParams = function ($event) {
                    var api = {
                        apiName: "",
                        apiValue: "",
                        type: ""
                    };
                    scope.apis.params.push(api);
                };
                scope.addRes = function ($event) {
                    var api = {
                        key: "",
                        revalue: "",
                        type: ""
                    };
                    scope.apis.res.push(api);
                };
                scope.delParam = function (index) {
                    scope.apis.params.splice(index, 1);
                };
                scope.delRes = function (index) {
                    scope.apis.res.splice(index, 1);
                };
            }
        }
    }])
    .directive("onNewFormReady",["$timeout",function($timeout){
        return {
            restrict: "A",
            link: function (scope, element, attr) {
                scope.addParams = function ($event) {
                    var api = {
                        apiName: "",
                        apiValue: "",
                        type: ""
                    };
                    scope.newApi.params.push(api);
                };
                scope.addRes = function ($event) {
                    var api = {
                        key: "",
                        revalue: "",
                        type: ""
                    };
                    scope.newApi.res.push(api);
                };
                scope.delParam = function (index) {
                    scope.newApi.params.splice(index, 1);
                };
                scope.delRes = function (index) {
                    scope.newApi.res.splice(index, 1);
                };
            }
        }
    }]);