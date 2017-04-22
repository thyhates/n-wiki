/**
 * Created by zhipu.liao on 2016/3/4.
 */
"use strict";
angular.module("app")
    .controller("ListController", ["docService", "authService", "logService", "$location", "$stateParams", "$scope", "toastr", "$state", "$uibModal",
        function (docService, authService, logService, $location, $stateParams, $scope, toastr, $state, $uibModal) {
            var vm = this;
            vm.docs = [];
            $scope.isLogin = authService.checkLogin();
            vm.logout = function () {
                authService.logout().then(function (res) {
                    $state.go("home");
                })
            };
            vm.deleteDoc = function () {
                var did = $stateParams.id;
                if (!did) {
                    toastr.warning('请选中要删除的文档');
                    return;
                }
                var delInstance = $uibModal.open({
                    animation: true,
                    templateUrl: "confirm.html",
                    controller: "delDocumentCtl",
                    keyboard: false,
                    backdrop: "static"
                });
                delInstance.result.then(function () {
                    docService.delDocument(did).then(function (res) {
                        getAllDocList();
                        getLog();
                        $state.go("home");
                        toastr.success(res);
                    }, function (res) {
                        toastr.warning(res);
                    })
                }, function () {
                    console.log("delete document rejected");
                });
            };
            vm.editDoc = function () {
                var did = $stateParams.id;
                if (!did) {
                    toastr.warning('请选中要编辑的文档');
                }
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
            function getLog() {
                logService.getLog().then(function (res) {
                    vm.logs = res;
                }, function (res) {
                    toastr.warning(res);
                });
            }

            function getAllDocList() {
                docService.getAllDoc().then(function (res) {
                    vm.docs = res;
                    vm.docs.forEach(function (doc) {
                        docService.getDocument(doc._id).then(function (res) {
                            doc.children = docService.getApiList(res.model || []);
                        })
                    });
                }, function (res) {
                    toastr.warning(res || '文档获取失败');
                })
            }

            getAllDocList();
            getLog();

        }])
    .controller("MainController", [ "$scope", "$stateParams", "toastr", "$state", "$uibModal", "apiService",
        function ( $scope, $stateParams, toastr, $state, $uibModal, apiService) {
            var vm = this;
            vm.docId = $stateParams.id;
            vm.apiId = $stateParams.aid;
            vm.delApi = function () {
                var delApiInstance = $uibModal.open({
                    animation: true,
                    templateUrl: "confirm.html",
                    controller: "delDocumentCtl",
                    keyboard: false,
                    backdrop: "static"
                });
                delApiInstance.result.then(function () {
                    apiService.deleteApi(vm.apiId).then(function () {
                        toastr.success("删除成功");
                        $state.transitionTo("home.doc", {
                            id: vm.docId,
                            aid: ""
                        }, {
                            reload: "home.doc"
                        });
                    }, function (res) {
                        toastr.warning(res);
                    })
                }, function () {
                    console.log('delete api rejected');
                });

            };
            function getApi() {
                if (!vm.apiId) {
                    return;
                }
                apiService.getApi(vm.apiId, vm.docId).then(function (res) {
                    vm.api = res.model[0];
                    vm.documentInfo = res.documentInfo[0];
                }, function (res) {
                    toastr.warning(res);
                })
            }
            getApi();
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
    .controller("AddApiController", ["$scope", "toastr", "$uibModal", "$stateParams", "$http", "$state",
        function ($scope, toastr, $uibModal, $stateParams, $http, $state) {
            $scope.newApi = {
                params: [],
                res: [],
                callbackParams: []
            };
            $scope.addSchema = formConfig[0].schema;
            $scope.addForm = formConfig[0].form;
            $scope.addModel = $scope.newApi;
            $scope.docType = $stateParams.apiIndex;
            $scope.addApi = function (form) {
                $scope.newApi.doc_id = $stateParams.id;
                console.log($scope.newApi);
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
                            id: $stateParams.id
                        }, {
                            reload: true
                        });
                    } else {
                        toastr.warning(data.data.msg);
                    }
                });
            };
            $scope.showJSONinput = function () {
                var inputJson = $uibModal.open({
                    animation: true,
                    templateUrl: "page/jsonInput.html",
                    controller: "JsonInputController",
                    keyboard: false,
                    backdrop: "static"
                });
                inputJson.result.then(function (res) {
                    try {
                        var resObj = JSON.parse(res);
                    } catch (err) {
                        toastr.warning("非法的JSON字符串!");
                    }
                    for (var key in resObj) {
                        var obj = {
                            key: key,
                            require: "是",
                            type: typeof resObj[key]
                        };
                        if (typeof resObj[key] === 'number') {
                            if (!isInt(resObj[key])) {
                                obj.type = "float";
                            } else {
                                obj.type = 'int';
                            }
                        }
                        $scope.newApi.res.push(obj);
                    }
                });
            };
            function isInt(n) {
                return n % 1 === 0;
            }
        }])
    .controller("delDocumentCtl", ["$uibModalInstance", "$scope",
        function ($uibModalInstance, $scope) {
            $scope.ok = function () {
                $uibModalInstance.close(true);
            };
            $scope.cancel = function () {
                $uibModalInstance.dismiss();
            }
        }])
    .controller("editApiCtrl", ["$scope", "$http", "toastr", "$uibModal", "$stateParams", "$state",
        function ($scope, $http, toastr, $uibModal, $stateParams, $state) {

            $http({
                url: "selectApi",
                method: "POST",
                data: {
                    id: $stateParams.aid
                }
            }).then(function (data) {
                if (data.data.status) {
                    $scope.api = data.data.model[0];
                    console.log('form model', $scope.apis);
                    $scope.documentInfo = data.data.model.documentInfo;
                    $scope.editSchema = formConfig[0].schema;
                    $scope.editForm = formConfig[0].form;
                    $scope.editModel = $scope.api;
                } else {
                    toastr.warning(data.data.msg);
                }
            });

            $scope.showJSONinput = function () {
                var inputJson = $uibModal.open({
                    animation: true,
                    templateUrl: "page/jsonInput.html",
                    controller: "JsonInputController",
                    keyboard: false,
                    backdrop: "static"
                });
                inputJson.result.then(function (res) {
                    try {
                        var resObj = JSON.parse(res);
                    } catch (err) {
                        toastr.warning("非法的JSON字符串!");
                    }
                    for (var key in resObj) {
                        var obj = {
                            key: key,
                            require: "是",
                            type: typeof resObj[key]
                        };
                        if (typeof resObj[key] === 'number') {
                            if (!isInt(resObj[key])) {
                                obj.type = "float";
                            } else {
                                obj.type = 'int';
                            }
                        }
                        $scope.api.res.push(obj);
                    }
                });
            };
            function isInt(n) {
                return n % 1 === 0;
            }

            $scope.submitAdd = function (form) {
                delete $scope.api._id;
                $http({
                    url: "editApi",
                    method: "POST",
                    data: {
                        id: $stateParams.aid,
                        api: $scope.api
                    }
                }).then(function (data) {
                    if (data.data.status) {
                        toastr.success(data.data.msg);
                        $state.transitionTo("home.doc", {
                            id: $stateParams.id,
                            aid: ""
                        }, {
                            reload: "home.doc"
                        });
                    } else {
                        toastr.warning(data.data.msg);
                    }
                });
            };
        }])
    .controller("ErrorController", ["$stateParams", "$http", "$scope",
        function ($stateParams, $http, $scope) {
            $scope.docId = $stateParams.id;
            $scope.apiId = $stateParams.aid;
            $scope.errors = [];
            $http({
                url: "getDocument",
                method: "POST",
                data: {
                    id: $stateParams.id
                }
            }).then(function (data) {
                if (data.data.status) {
                    //if (typeof data.data.model.errorCodeLst!="undefined") {
                    //    $scope.errors = data.data.model.errorCodeLst;
                    //} else {
                    //    $scope.errors = [];
                    //}
                    $scope.errors = data.data.documentInfo[0].errorCodeLst || [];
                }
            });
        }])
    .controller("EditErrController", ["$stateParams", "$http", "toastr", "$scope",
        function ($stateParams, $http, toastr, $scope) {
            $http({
                url: "getDocument",
                method: "POST",
                data: {
                    id: $stateParams.id
                }
            }).then(function (data) {
                if (data.data.status) {
                    //if (typeof data.data.model.errorCodeLst!="undefined") {
                    //    $scope.errors = data.data.model.errorCodeLst;
                    //} else {
                    //    $scope.errors = [];
                    //}
                    $scope.errors = data.data.documentInfo[0].errorCodeLst || [];
                }
            });

            $scope.addErrs = function () {
                console.log($scope.errors);
                $http({
                    url: "editErrorCode",
                    method: "POST",
                    data: {
                        id: $stateParams.id,
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
    .controller("LoginController", ["$scope", 'toastr', "$state", "authService",
        function ($scope, toastr, $state, authService) {
            $scope.login = function (form) {
                if (form.$valid) {
                    authService.login($scope.user).then(function (res) {
                        $state.go("home", {}, {
                            reload: "home"
                        });
                    }, function (res) {
                        toastr.warning(res);
                    });
                } else {
                    toastr.warning("请输入完整登录信息");
                }
            };

        }])
    .controller("editDocInfoCtrl", ["$scope", "$uibModalInstance", "$http", "toastr", "$stateParams",
        function ($scope, $uibModalInstance, $http, toastr, $stateParams) {
            $http({
                url: "getDocument",
                method: "POST",
                data: {
                    id: $stateParams.id
                }
            }).then(function (data) {
                if (data.data.status) {
                    $scope.documentInfo = data.data.documentInfo[0];
                    $scope.add_model = $scope.documentInfo;
                } else {
                    toastr.warning(data.data.msg);
                }
            });
            $scope.add_schema = {
                type: "object",
                properties: {
                    label: {
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
                required: ["label", "type"]
            };
            $scope.add_form = [
                "label", {
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
                delete $scope.add_model._id;
                if (form.$valid && form.$dirty) {
                    $http({
                        url: "editDocs",
                        method: "POST",
                        data: {
                            id: $stateParams.id,
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
        }])
    .controller("JsonInputController", ["$scope", "$uibModalInstance", function ($scope, $uibModalInstance) {
        $scope.ok = function () {
            $uibModalInstance.close($scope.jsonInput);
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss();
        };
    }]);