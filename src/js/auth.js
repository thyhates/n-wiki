/**
 * Created by zhipu.liao on 2016/3/4.
 */
angular.module("app")
    .service("authService", ["$log", "$injector", "$q",'$http','$cookies',
        function ($log, $injector, $q,$http,$cookies) {
            var authService=this;
            authService.login=login;
            function login(params){
                var deferred=$q.defer();
                var promise=deferred.promise;
                $http.post('login',params)
                    .then(function (res) {
                        if(res.data.status){
                            $cookies.put('token',res.data.token);
                            deferred.resolve(true)
                        }else{
                            deferred.reject(res.data.msg)
                        }
                    });
                return promise;
            }
            function logout() {

            }
            function checkLogin() {
            }

        }]);