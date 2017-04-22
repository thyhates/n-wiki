/**
 * Created by zhipu.liao on 2016/3/4.
 */
angular.module("app")
    .factory("authorInterceptor", ["$log", "$injector", "$q", "$rootScope", "$location","$cookies",
        function ($log, $injector, $q, $rootScope, $location,$cookies) {
            var myInterceptor = {
                request: function (config) {
                    if (config.data) {
                        var token = $cookies.get('token');
                        config.headers["authorization"] = 'Bearer ' + token || '';
                    }

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
        }])
    .factory("logService", ['$q', '$http', function ($q, $http) {
        return {
            getLog:function () {
                var deferred=$q.defer();
                var promise=deferred.promise;
                var params={

                };
                $http.post('getLog',params).then(function (res) {
                    if(res.data.status){
                        deferred.resolve(res.data.model||[])
                    }else{
                        deferred.reject(res.data.msg)
                    }
                });
                return promise;
            }
        }
    }])
    .factory("docService",["$q","$http",function ($q, $http) {
        var docService={
            getAllDoc:getAllDoc,
            getDocument:getDocument,
            getApiList:getApiList,
            delDocument:delDocument
        };
        function getAllDoc() {
            var deferred=$q.defer();
            var promise=deferred.promise;
            $http.post('getAllDocs',{})
                .then(function (res) {
                    deferred.resolve(res.data.model||[]);
                });
            return promise;
        }
        function getDocument(id) {
            var deferred=$q.defer();
            var promise=deferred.promise;
            $http.post('getDocument',{id:id})
                .then(function (res) {
                    deferred.resolve(res.data);
                });
            return promise;
        }
        function getApiList(apis) {
            var titls = [];
            for (var i = 0; i < apis.length; i++) {
                var doc_id = apis[i].doc_id;
                var api_id = apis[i]._id;
                var label=apis[i].label;
                titls.push({
                    label: label,
                    doc_id: doc_id,
                    api_id: api_id
                });
            }
            return titls;
        }
        function delDocument(id) {
            /**
             * @id 文档id
             *
             */
            var deferred=$q.defer();
            var promise=deferred.promise;
            $http.post('delDocument',{doc_id:id})
                .then(function (res) {
                    if(res.data.status){
                        deferred.resolve(res.data.msg);
                    }else{
                        deferred.reject(res.data.msg||'删除失败');
                    }

                });
            return promise;
        }
        return docService;
    }])
    .factory("apiService",["$q","$http",function ($q, $http) {
        var apiService={
            getApi:getApi,
            deleteApi:deleteApi
        };
        function getApi(id, did) {
            /**
             * @id api id
             * @did document id
             */
            var deferred=$q.defer();
            var promise=deferred.promise;
            $http.post('selectApi',{
                id:id,
                doc_id:did
            })
                .then(function (res) {
                    if(res.data.status){
                        deferred.resolve(res.data);
                    }else{
                        deferred.reject(res.data.msg||'接口获取失败');
                    }
                },function (res) {
                    deferred.reject(res.data.msg||'接口获取失败');
                });
            return promise;
        }
        function deleteApi(id) {
            var deferred=$q.defer();
            var promise=deferred.promise;

            $http.post('delApi',{
                id:id,
                doc_id:did
            })
                .then(function (res) {
                    if(res.data.status){
                        deferred.resolve(res.data);
                    }else{
                        deferred.reject(res.data.msg||'接口删除失败');
                    }
                },function (res) {
                    deferred.reject(res.data.msg||'接口删除失败');
                });
            return promise;
        }
        return apiService;
    }]);