/**
 * Created by zhipu.liao on 2016/3/4.
 */
angular.module("app").config(["$httpProvider", "toastrConfig", "$locationProvider",
    function ($httpProvider, toastrConfig, $locationProvider) {
        $httpProvider.interceptors.push("authorInterceptor");
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: true
        });
        angular.extend(toastrConfig, {
            timeOut: 2000
        });
    }]);