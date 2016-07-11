/**
 * Created by zhipu.liao on 2016/3/4.
 */
angular.module("app").factory("authorInterceptor", ["$log", "$injector","$q","$rootScope", "$location",
    function ($log,$injector, $q,$rootScope, $location) {
        var myInterceptor = {
            request: function (config) {
                return config;
            },
            response: function (res) {


                return res || $q.when(res);
            },
            responseError: function (err) {
                /*if(!$rootScope.isLogin){
                 $injector.get('$state').go("home");
                 }*/
                return err;
            }
        };
        return myInterceptor;
    }]);