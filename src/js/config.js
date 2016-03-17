/**
 * Created by zhipu.liao on 2016/3/4.
 */
angular.module("app").config(["$httpProvider","toastrConfig",function($httpProvider,toastrConfig){
    $httpProvider.interceptors.push("authorInterceptor");
    angular.extend(toastrConfig,{
        timeOut:2000
    });
}]);