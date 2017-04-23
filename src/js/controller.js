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
    .controller("MainController", ["$scope", "$stateParams", "toastr", "$state", "$uibModal", "apiService",
        function ($scope, $stateParams, toastr, $state, $uibModal, apiService) {
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
    .controller("NewDocumentController", ["$scope", "toastr", "$state", "docService",
        function ($scope, toastr, $state, docService) {
            var vm = this;
            vm.newDocs = {
                type: 0
            };
            vm.newDocument = function () {
                docService.newDocument(vm.newDocs)
                    .then(function (res) {
                        toastr.success(res);
                        $state.transitionTo("home", {}, {
                            reload: true
                        });
                    }, function (res) {
                        toastr.warning(res);
                    });
            };
        }])
    .controller("AddApiController", ["$scope", "toastr", "$uibModal", "$stateParams", "apiService", "$state",
        function ($scope, toastr, $uibModal, $stateParams, apiService, $state) {
            var vm = this;
            vm.newApi = {
                params: [],
                res: [],
                callbackParams: [],
                method:'POST'
            };
            vm.addSchema = formConfig[0].schema;
            vm.addForm = formConfig[0].form;
            vm.addModel = vm.newApi;
            vm.addApi = function (form) {
                vm.newApi.doc_id = $stateParams.id;
                apiService.addApi({
                    body: $scope.newApi
                }).then(function (res) {
                    toastr.success(res);
                    $state.transitionTo("home.doc", {
                        id: $stateParams.id
                    }, {
                        reload: true
                    });
                }, function (res) {
                    toastr.warning(res);
                })
            };
            vm.showJSONinput = function () {
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
                        if (typeof resObj[key] === 'object') {
                            obj.revalue = JSON.stringify(resObj[key]);
                        }
                        vm.newApi.res.push(obj);
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
    .controller("editApiCtrl", ["$scope", "apiService", "toastr", "$uibModal", "$stateParams", "$state",
        function ($scope, apiService, toastr, $uibModal, $stateParams, $state) {
            var vm = this;
            var aid = $stateParams.aid;
            var did = $stateParams.id;

            function getApi() {
                apiService.getApi(aid, did).then(function (res) {
                    vm.api = res.model[0];
                    vm.documentInfo = res.model.documentInfo;
                    vm.editSchema = formConfig[0].schema;
                    vm.editForm = formConfig[0].form;
                    vm.editModel = vm.api;
                }, function (res) {
                    toastr.warning(res);
                })
            }

            vm.showJSONinput = function () {
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
                        if (typeof resObj[key] === 'object') {
                            obj.revalue = JSON.stringify(resObj[key]);
                        }
                        vm.api.res.push(obj);
                    }
                });
            };
            function isInt(n) {
                return n % 1 === 0;
            }

            vm.submitAdd = function (form) {
                delete vm.api._id;
                apiService.editApi({
                    id: $stateParams.aid,
                    api: vm.api
                }).then(function (res) {
                    toastr.success(res);
                    $state.transitionTo("home.doc", {
                        id: $stateParams.id,
                        aid: $stateParams.aid
                    }, {
                        reload: "home.doc"
                    });
                }, function (res) {
                    toastr.warning(res);
                });
            };
            getApi();
        }])
    .controller("ErrorController", ["$stateParams", "docService", "$scope",
        function ($stateParams, docService, $scope) {
            var vm = this;
            vm.docId = $stateParams.id;
            vm.apiId = $stateParams.aid;
            vm.errors = [];
            docService.getDocument($stateParams.id)
                .then(function (res) {
                    vm.errors = res.documentInfo[0].errorCodeLst || [];
                });
        }])
    .controller("EditErrController", ["$stateParams", "docService", "toastr", "$scope",
        function ($stateParams, docService, toastr, $scope) {
            var vm = this;

            function getError() {
                docService.getDocument($stateParams.id)
                    .then(function (res) {
                        vm.errors = res.documentInfo[0].errorCodeLst || [];
                    });
            }
            vm.addErrs = function () {
                docService.editError({
                    id:$stateParams.id,
                    body:vm.errors
                }).then(function (res) {
                    toastr.success(res);
                    history.go(-1);
                },function (res) {
                    toastr.warning(res);
                });
            };
            vm.addErr=function () {
                vm.errors.push({});
            };
            vm.delErr=function (index) {
                vm.errors.splice(index,1);
            };
            getError();
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
    .controller("editDocInfoCtrl", ["$scope", "$uibModalInstance", "docService", "toastr", "$stateParams",
        function ($scope, $uibModalInstance, docService, toastr, $stateParams) {
            docService.getDocument($stateParams.id)
                .then(function (res) {
                    $scope.documentInfo =res.documentInfo[0];
                    $scope.add_model = $scope.documentInfo;
                },function (res) {
                    toastr.warning(res);
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
                    docService.editDocment({
                        id: $stateParams.id,
                        info: $scope.add_model
                    }).then(function (res) {
                        toastr.success(res);
                        $uibModalInstance.close($scope.add_model);
                    },function (res) {
                        toastr.warning(res);
                        $uibModalInstance.dismiss();
                    })
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