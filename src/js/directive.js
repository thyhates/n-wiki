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
                        type: "",
                        require: "是",
                        defaultValue: ""
                    };
                    scope.apis.params.push(api);
                };
                scope.addRes = function ($event) {
                    var api = {
                        key: "",
                        revalue: "",
                        type: "",
                        require: "否"
                    };
                    scope.apis.res.push(api);
                };
                scope.delParam = function (index) {
                    scope.apis.params.splice(index, 1);
                };
                scope.delRes = function (index) {
                    scope.apis.res.splice(index, 1);
                };
                scope.addCallbackParam = function ($event) {
                    console.log($event);
                    var callbackParam = {
                        apiName: "",
                        apiValue: "",
                        type: "",
                        require: "是",
                        defaultValue: ""
                    };
                    scope.apis.callbackParams.push(callbackParam);
                };
                scope.delCallbackParam = function (index) {
                    scope.apis.callbackParams.splice(index, 1);
                };
            }
        }
    }])
    .directive("onNewFormReady", ["$timeout", function ($timeout) {
        return {
            restrict: "A",
            link: function (scope, element, attr) {
                scope.addParams = function ($event) {
                    var api = {
                        apiName: "",
                        apiValue: "",
                        type: "",
                        require: "是",
                        defaultValue: ""
                    };
                    scope.newApi.params.push(api);
                };
                scope.addRes = function ($event) {
                    var api = {
                        key: "",
                        revalue: "",
                        type: "",
                        require: "否"
                    };
                    scope.newApi.res.push(api);
                };
                scope.delParam = function (index) {
                    scope.newApi.params.splice(index, 1);
                };
                scope.delRes = function (index) {
                    scope.newApi.res.splice(index, 1);
                };
                scope.addCallbackParam = function ($event) {
                    console.log($event);
                    var callbackParam = {
                        apiName: "",
                        apiValue: "",
                        type: "",
                        require: "是",
                        defaultValue: ""
                    };
                    scope.newApi.callbackParams.push(callbackParam);
                };
                scope.delCallbackParam = function (index) {
                    scope.newApi.callbackParams.splice(index, 1);
                };
            }
        }
    }])
    .directive("onErrReady", ["$timeout", function ($timeout) {
        return {
            "restrict": "A",
            link: function (scope) {
                scope.addErr = function () {
                    var err = {
                        name: "",
                        res: "",
                        description: ""
                    };
                    scope.errors.push(err);
                };
                scope.delErr = function (index) {
                    console.log(scope.errors);
                    //scope.errors.splice(index, 1);
                }
            }
        }
    }]);