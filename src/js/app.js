/**
 * Created by zhipu.liao on 2016/3/4.
 */
"use strict";
var app = angular.module("app", ["angular-loading-bar", "ngAnimate",
    'ui.router', "toastr", "ui.bootstrap", "schemaForm", "angularBootstrapNavTree"])
    .run(["$rootScope", "$state", "$timeout", "$location",
        function ($rootScope, $state, $timeout, $location) {
            console.log("app started...");
            $rootScope.isLogin = sessionStorage.isLogin;
            var neeToLogin = $location.search();
            if (neeToLogin.tmethod === "login") {
                $timeout(function () {
                    $state.go("home.login");
                });
            }
        }]);