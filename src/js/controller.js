/**
 * Created by zhipu.liao on 2016/3/4.
 */
angular.module("app")
    .controller("ListController", ["$rootScope", "$http", "$location", "$stateParams", "$scope", "toastr", "$state", "$uibModal",
        function ($rootScope, $http, $location, $stateParams, $scope, toastr, $state, $uibModal) {
            $scope.docs = [];
            $scope.my_tree = {};
            let temArray = [];
            $scope.search = {
                key: ""
            };
            function getLog() {
                $http({
                    url: "getLog",
                    method: "POST"
                }).then(function (data) {
                    if (data.data.status) {
                        $scope.logs = data.data.model;
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
                    console.log('dos',$scope.docs);
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
                            id: doc._id
                        }
                    }).then(function (data) {
                        if (data.data.status) {
                            $scope.apis = data.data.model;
                            doc.children = getApiList($scope.apis);
                            temArray = angular.copy($scope.docs);
                        } else {
                            toastr.warning(data.data.msg);
                        }
                    });
                });

            }

            function getApiList(doc) {
                var titls = [];
                for (var i = 0; i < doc.length; i++) {
                    var doc_id = doc[i].doc_id;
                    var api_id = doc[i]._id;
                    titls.push({
                        label: doc[i].label,
                        doc_id: doc_id,
                        api_id: api_id
                    });
                }
                return titls;
            }

            function isCanShow() {
                if ($state.includes("home.edit") || $state.includes("home.doc") || $state.includes("home.newApi") || $state.includes("home.error") || $state.includes("home.editErr")) {
                    return true;
                } else {
                    return false;
                }
            }

            $scope.filterByName = function () {
                $scope.docs = angular.copy(temArray);
                if ($scope.docs.length > 0) {
                    $scope.docs.forEach(function (item) {
                        item.expand = true;
                        if (item.children.length > 0) {
                            item.children.forEach(function (childItem, j) {
                                console.log(childItem.label, $scope.search.key);
                                if (childItem.label.indexOf($scope.search.key) == -1) {
                                    console.log(item.children);
                                    item.children.splice(j, 1);
                                }
                            });
                        }
                    });
                }
                if (!$scope.search.key) {
                    $scope.docs = angular.copy(temArray);
                }
            };
            $scope.deleteDoc = function () {
                if (!isCanShow()) {
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
                                doc_id: docName
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
                if (!isCanShow()) {
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
            $scope.docId = $stateParams.id;
            $scope.apiId = $stateParams.aid;
            $http({
                url: "selectApi",
                method: "POST",
                data: {
                    id: $stateParams.aid,
                    doc_id: $stateParams.id
                }
            }).then(function (data) {
                if (data.data.status) {
                    if (data.data.model) {
                        $scope.api = data.data.model[0];
                    }
                    if ($scope.apis.length == 0) {
                        $scope.apis = false;
                    }
                    $scope.documentInfo = data.data.documentInfo[0];
                } else {
                    if ($scope.apiId) {
                        toastr.warning(data.data.msg);
                    }
                }
            });
            $scope.delApi = function () {
                var delApiInstance = $uibModal.open({
                    animation: true,
                    templateUrl: "confirm.html",
                    controller: "delDocumentCtl",
                    keyboard: false,
                    backdrop: "static"
                });
                delApiInstance.result.then(function (aid) {
                    if (aid) {
                        $http({
                            url: "delApi",
                            method: "POST",
                            data: {
                                id: aid
                            }
                        }).then(function (data) {
                            toastr.success(data.data.msg);
                            $state.transitionTo("home.doc", {
                                id: aid,
                                aid: ""
                            }, {
                                reload: "home.doc"
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
    .controller("delDocumentCtl", ["$uibModalInstance", "$scope", "$stateParams", "toastr",
        function ($uibModalInstance, $scope, $stateParams, toastr) {
            if (!$stateParams.id) {
                $uibModalInstance.dismiss();
                toastr.warning("请选中要删除的文档");
                return false;
            }
            $scope.ok = function () {
                if ($stateParams.aid) {
                    $uibModalInstance.close($stateParams.aid);
                } else {
                    $uibModalInstance.close($stateParams.id);
                }
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
    .controller("LoginController", ["$scope", "$http", "$rootScope", "toastr", "$state","authService",
        function ($scope, $http, $rootScope, toastr, $state,authService) {

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
                            sessionStorage.setItem("token", res.data.token);
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