/**
 * Created by zhipu.liao on 2016/3/4.
 */
angular.module("app").factory("authorInterceptor", ["$log", "$q", "$location",
    function ($log, $q, $location) {
        var myInterceptor = {
            request: function (config) {
                return config;
            },
            response: function (res) {
                return res || $q.when(res);
            },
            responseError: function (err) {

                return err;
            }
        };
        return myInterceptor;
    }]);