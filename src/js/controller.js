/**
 * Created by zhipu.liao on 2016/3/4.
 */
angular.module("app")
    .controller("ListController", ["$rootScope","$http",  "$location", "$stateParams", "$scope", "toastr", "$state",
        function ($rootScope,$http,  $location, $stateParams, $scope, toastr, $state) {
            $scope.docs = [];

            function getAllDocList() {
                $http({
                    url: "getAllDocs",
                    method: "POST"
                }).then(function (data) {
                    $scope.docs = data.data.model;
                    getDocList();
                }, function (data) {
                });
            };
            function getDocList() {
                $scope.docs.forEach(function (doc) {
                    $http({
                        url: "getDocument",
                        method: "POST",
                        data: {
                            name: doc.name
                        }
                    }).then(function (data) {
                        if (data.data.status) {
                            $scope.apis = data.data.model.apis;
                            doc.apiList = getApiList($scope.apis);
                        } else {
                            toastr.warning(data.data.msg);
                        }
                    });
                });

            }

            function getApiList(doc) {
                var titls = [];
                for (var i = 0; i < doc.length; i++) {
                    titls.push({idx: i, name: doc[i].name});
                }
                return titls;
            }
            getAllDocList();
            $scope.logout=function(){
                $http({
                    url:"login/logout",
                    method:"POST"
                }).then(function(res){
                    sessionStorage.clear();
                    $rootScope.isLogin=sessionStorage.isLogin;
                    $state.go("home");
                })
            };
        }])
    .controller("MainController", ["$http", "$scope", "$stateParams", "toastr", "$state", "$uibModal",
        function ($http, $scope, $stateParams, toastr, $state, $uibModal) {
            $scope.apis = [];
            $http({
                url: "getDocument",
                method: "POST",
                data: {
                    name: $stateParams.docName
                }
            }).then(function (data) {
                if (data.data.status) {
                    $scope.apis.push(data.data.model.apis[$stateParams.apiIndex]);
                    $scope.documentInfo = data.data.model.docInfo;
                    $scope.documentInfo.index = $stateParams.apiIndex;
                } else {
                    toastr.warning(data.data.msg);
                }
            });
            $scope.delApi = function (index, apiName) {
                var delApiInstance = $uibModal.open({
                    animation: true,
                    templateUrl: "confirm.html",
                    controller: "delDocumentCtl",
                    keyboard: false,
                    backdrop: "static"
                });
                delApiInstance.result.then(function (docName) {
                    if (docName) {
                        $http({
                            url: "delApi",
                            method: "POST",
                            data: {
                                index: $stateParams.apiIndex,
                                name: apiName
                            }
                        }).then(function (data) {
                            toastr.success(data.data.msg);
                            $state.transitionTo("home.doc", {
                                docName: $stateParams.docName,
                                apiIndex: 0
                            }, {
                                reload: true
                            });
                        }, function (data) {
                            toastr.warning(data.data.msg);
                        })
                    } else {
                        console.log("dismiss");
                    }
                });

            };
        }])
    .controller("NewDocumentController", ["$scope", "$http", "toastr", "$state",
        function ($scope, $http, toastr, $state) {
            $scope.newDocument = function () {
                $http({
                    url: "newDocument",
                    method: "POST",
                    data: $scope.newDocs
                }).then(function (data) {
                    if (data.data.status) {
                        toastr.success(data.data.msg);
                        $state.transitionTo("home", {}, {
                            reload: true
                        });
                    } else {
                        toastr.warning(data.data);
                    }
                }, function (data) {
                });
            };
        }])
    .controller("AddApiController", ["$scope", "toastr", "$stateParams", "$http", "$state",
        function ($scope, toastr, $stateParams, $http, $state) {
            $scope.newApi = {
                params: [],
                res: [],
                callbackParams: []
            };
            $scope.docType = $stateParams.apiIndex;
            $scope.addApi = function (form) {
                if (form.$valid) {
                    $http({
                        url: "addApi",
                        method: "POST",
                        data: {
                            name: $stateParams.docName,
                            body: $scope.newApi
                        }
                    }).then(function (data) {
                        if (data.data.status) {
                            toastr.success(data.data.msg);
                            $state.transitionTo("home.doc", {
                                docName: $stateParams.docName,
                                apiIndex: 0
                            }, {
                                reload: true
                            });
                        } else {
                            toastr.warning(data.data.msg);
                        }
                    });
                } else {
                    toastr.warning("请把表单填完整后在提交")
                }
            }
        }])
    .controller("delDocumentCtl", ["$uibModalInstance", "$scope", "$stateParams",
        function ($uibModalInstance, $scope, $stateParams) {
            $scope.ok = function () {
                $uibModalInstance.close($stateParams.docName);
            };
            $scope.cancel = function () {
                $uibModalInstance.dismiss();
            }
        }])
    .controller("editApiCtrl", ["$scope", "$http", "toastr", "$uibModal", "$stateParams", "$state",
        function ($scope, $http, toastr, $uibModal, $stateParams, $state) {
            $http({
                url: "getDocument",
                method: "POST",
                data: {
                    name: $stateParams.docName
                }
            }).then(function (data) {
                if (data.data.status) {
                    $scope.apis = data.data.model.apis[$stateParams.apiIndex];
                    $scope.documentInfo = data.data.model.docInfo;
                } else {
                    toastr.warning(data.data.msg);
                }
            });
            $scope.submitAdd = function (form) {
                if (form.$valid) {
                    $http({
                        url: "editApi",
                        method: "POST",
                        data: {
                            index: $stateParams.apiIndex,
                            name: $stateParams.docName,
                            api: $scope.apis
                        }
                    }).then(function (data) {
                        if (data.data.status) {
                            toastr.success(data.data.msg);
                            $state.transitionTo("home.doc", {
                                docName: $stateParams.docName,
                                apiIndex: 0
                            }, {
                                reload: true
                            });
                        } else {
                            toastr.warning(data.data.msg);
                        }
                    });
                } else {
                    toastr.warning("请把表单填完整后在提交")
                }
            };
        }])
    .controller("ErrorController", ["$stateParams", "$http", "$scope", function ($stateParams, $http, $scope) {
        $scope.docname = $stateParams.docName;
        $scope.errors = [];
        $http({
            url: "getDocument",
            method: "POST",
            data: {
                name: $stateParams.docName
            }
        }).then(function (data) {
            if (data.data.status) {
                //if (typeof data.data.model.errorCodeLst!="undefined") {
                //    $scope.errors = data.data.model.errorCodeLst;
                //} else {
                //    $scope.errors = [];
                //}
                $scope.errors = data.data.model.errorCodeLst || [];
            }
        });
    }])
    .controller("EditErrController", ["$stateParams", "$http", "toastr", "$scope",
        function ($stateParams, $http, toastr, $scope) {
            $http({
                url: "getDocument",
                method: "POST",
                data: {
                    name: $stateParams.docName
                }
            }).then(function (data) {
                if (data.data.status) {
                    //if (typeof data.data.model.errorCodeLst!="undefined") {
                    //    $scope.errors = data.data.model.errorCodeLst;
                    //} else {
                    //    $scope.errors = [];
                    //}
                    $scope.errors = data.data.model.errorCodeLst || [];
                }
            });

            $scope.addErrs = function () {
                console.log($scope.errors);
                $http({
                    url: "editErrorCode",
                    method: "POST",
                    data: {
                        name: $stateParams.docName,
                        body: $scope.errors
                    }
                }).then(function (data) {
                    if (data.data.status) {
                        toastr.success("res", data);
                        history.go(-1);
                    } else {
                        toastr.warning("服务器异常");
                    }
                });
            };
        }])
    .controller("LoginController", ["$scope", "$http","$rootScope", "toastr","$state",
        function ($scope, $http,$rootScope, toastr,$state) {

            $scope.login = function (form) {
                if (form.$valid) {
                    $http({
                        url: "login/checkLogin",
                        data: $scope.user,
                        method: "POST"
                    }).then(function (res) {
                        if(res.data.status){
                            sessionStorage.setItem("isLogin",true);
                            $rootScope.isLogin=sessionStorage.isLogin;
                            $state.go("home");
                        }else{
                            toastr.warning(res.data.msg);
                        }
                    });
                } else {
                    toastr.warning("请输入完整登录信息");
                }
            };

        }]);