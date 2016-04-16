/**
 * Created by zhipu.liao on 2016/3/4.
 */
angular.module("app")
    .controller("ListController", ["$rootScope", "$http", "$location", "$stateParams", "$scope", "toastr", "$state", "$uibModal",
        function ($rootScope, $http, $location, $stateParams, $scope, toastr, $state, $uibModal) {
            $scope.docs = [];
            function getLog(){
                $http({
                    url: "getLog",
                    method: "POST"
                }).then(function (data) {
                    if (data.data.status) {
                        $scope.logs = data.data.model.logs.reverse();
                    } else {
                        toastr.warning(data.data.msg);
                    }

                });
            }
            function getAllDocList() {
                $http({
                    url: "getAllDocs",
                    method: "POST"
                }).then(function (data) {
                    $scope.docs = data.data.model;
                    if (data.data.logined) {
                        sessionStorage.setItem("isLogin", true);
                        $rootScope.isLogin = sessionStorage.isLogin;
                    } else {
                        sessionStorage.setItem("isLogin", false);
                        $rootScope.isLogin = undefined;
                    }
                    getDocList();
                }, function (data) {
                });
            }
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
            function isCanShow(){
                if($state.includes("home.edit")||$state.includes("home.doc")||$state.includes("home.newApi")||$state.includes("home.error")||$state.includes("home.editErr")){
                    return true;
                }else{
                    return false;
                }
            }
            $scope.deleteDoc = function () {
                if(!isCanShow()){
                    toastr.warning("请选中要删除的文档");
                    return false;
                }
                var delInstance = $uibModal.open({
                    animation: true,
                    templateUrl: "confirm.html",
                    controller: "delDocumentCtl",
                    keyboard: false,
                    backdrop: "static"
                });
                delInstance.result.then(function (docName) {
                    if (docName) {
                        $http({
                            url: "delDocument",
                            method: "POST",
                            data: {
                                name: docName
                            }
                        }).then(function (data) {
                            if (data.data.status) {
                                getAllDocList();
                                getLog();
                                $state.go("home");
                                toastr.success(data.data.msg);

                            } else {
                                toastr.warning(data.data.msg);
                            }
                        });
                    } else {
                        console.log("dismiss");
                    }
                });
            };
            $scope.editDoc = function () {
                if(!isCanShow()){
                    toastr.warning("请选中要编辑的文档");
                    return false;
                }
                console.log($state.includes("home.doc"));
                var editInstance = $uibModal.open({
                    animation: true,
                    templateUrl: "page/editDoc.html",
                    keyboard: false,
                    controller: "editDocInfoCtrl",
                    backdrop: "static"
                });
                editInstance.result.then(function (data) {
                   location.reload();
                }, function (data) {
                });
            };
            getAllDocList();
            getLog();
            $scope.logout = function () {
                $http({
                    url: "/logout",
                    method: "POST"
                }).then(function (res) {
                    sessionStorage.clear();
                    $rootScope.isLogin = sessionStorage.isLogin;
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
            $scope.addSchema = formConfig[$stateParams.apiIndex].schema;
            $scope.addForm = formConfig[$stateParams.apiIndex].form;
            $scope.addModel = $scope.newApi;
            $scope.docType = $stateParams.apiIndex;
            $scope.addApi = function (form) {
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
            }
        }])
    .controller("delDocumentCtl", ["$uibModalInstance", "$scope", "$stateParams","toastr",
        function ($uibModalInstance, $scope, $stateParams,toastr) {
            if(!$stateParams.docName){
                $uibModalInstance.dismiss();
                toastr.warning("请选中要删除的文档");
                return false;
            }
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
                    $scope.editSchema = formConfig[$scope.documentInfo.type].schema;
                    $scope.editForm = formConfig[$scope.documentInfo.type].form;
                    $scope.editModel = $scope.apis;
                } else {
                    toastr.warning(data.data.msg);
                }
            });
            $scope.submitAdd = function (form) {
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
            };
        }])
    .controller("ErrorController", ["$stateParams", "$http", "$scope",
        function ($stateParams, $http, $scope) {
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
    .controller("LoginController", ["$scope", "$http", "$rootScope", "toastr", "$state",
        function ($scope, $http, $rootScope, toastr, $state) {

            $scope.login = function (form) {
                if (form.$valid) {
                    $http({
                        url: "login",
                        data: $scope.user,
                        method: "POST"
                    }).then(function (res) {
                        console.log(res.data);
                        if (res.data.status) {
                            sessionStorage.setItem("isLogin", true);
                            $rootScope.isLogin = sessionStorage.isLogin;
                            $state.go("home");
                        } else {
                            toastr.warning(res.data.msg);
                        }
                    });
                } else {
                    toastr.warning("请输入完整登录信息");
                }
            };

        }])
    .controller("editDocInfoCtrl", ["$scope", "$uibModalInstance", "$http",  "toastr", "$stateParams",
        function ($scope, $uibModalInstance, $http,  toastr, $stateParams) {
            $http({
                url: "getDocument",
                method: "POST",
                data: {
                    name: $stateParams.docName
                }
            }).then(function (data) {
                if (data.data.status) {
                    $scope.documentInfo = data.data.model.docInfo;
                    $scope.add_model = $scope.documentInfo;
                } else {
                    toastr.warning(data.data.msg);
                }
            });
            $scope.add_schema = {
                type: "object",
                properties: {
                    name: {
                        type: "string",
                        title: "name"
                    },
                    type: {
                        type: "string",
                        title: "docType"
                    },
                    description: {
                        type: "string",
                        title: "description"
                    }
                },
                required: ["name", "type"]
            };
            $scope.add_form = [
                "name", {
                    key: "type",
                    type: "select",
                    titleMap: {
                        "0": "api",
                        "1": "sdk"
                    }
                }, {
                    key: "description",
                    type: "textarea"
                },
                {
                    type: "submit",
                    title: "save"
                }
            ];
            $scope.hideModal = function () {
                $uibModalInstance.dismiss();
            };

            $scope.submitAdd = function (form) {
                $scope.$broadcast('schemaFormValidate');
                if (form.$valid && form.$dirty) {
                    $http({
                        url: "editDocs",
                        method: "POST",
                        data: {
                            name: $stateParams.docName,
                            info: $scope.add_model
                        }
                    }).then(function (data) {
                        if (data.data.status) {
                            toastr.success(data.data.msg);
                            $uibModalInstance.close($scope.add_model);
                        } else {
                            toastr.warning(data.data.msg);
                            $uibModalInstance.dismiss();
                        }
                    });
                } else {
                    toastr.warning("请把表单填完整后在提交")
                }
            }
        }]);