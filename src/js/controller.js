/**
 * Created by zhipu.liao on 2016/3/4.
 */
angular.module("app")
    .controller("ListController", ["$http", "$anchorScroll", "$location", "$stateParams", "$scope", "toastr", "$state", "$uibModal",
        function ($http, $anchorScroll, $location, $stateParams, $scope, toastr, $state, $uibModal) {
            $scope.goto = function (id) {
                $location.hash(id);
                $anchorScroll();
            };
            function getDocument() {
                $http({
                    url: "getDocument",
                    method: "POST",
                    data: {
                        name: $stateParams.docName
                    }
                }).then(function (data) {
                    if (data.data.status) {
                        $scope.apis = data.data.model.apis;
                        $scope.documentInfo = data.data.model.docInfo;
                        $scope.titles = getDocList($scope.apis);
                        //console.log($scope.titles);
                    } else {
                        toastr.warning(data.data.msg);
                    }
                });
            }

            function getDocList(lists) {
                var titls = [];
                for (var i = 0; i < lists.length; i++) {
                    titls.push({idx: i, name: lists[i].name});
                    console.log(titls);
                }
                console.log(titls);
                return titls;
            }

            getDocument();
            $scope.addApi = function () {
                var addInstance = $uibModal.open({
                    animation: true,
                    templateUrl: "src/page/form.html",
                    controller: "AddApiController",
                    keyboard: false,
                    backdrop: "static"
                });
                addInstance.result.then(function (data) {
                    getDocument();
                }, function () {
                });
            };
            $scope.deleteDoc = function () {
                var delInstance = $uibModal.open({
                    animation: true,
                    templateUrl: "confirm.html",
                    controller: "delDocumentCtl",
                    keyboard: false,
                    backdrop: "static"
                });
                delInstance.result.then(function (data) {
                    if (data) {
                        $http({
                            url: "delDocument",
                            method: "POST",
                            data: {
                                name: $stateParams.docName
                            }
                        }).then(function (data) {
                            if (data.data.status) {
                                toastr.success(data.data.msg);
                                $state.go("home");
                            } else {
                                toastr.warning(data.data.msg);
                            }
                        });
                    }
                });

            };
            $scope.editDoc = function () {
                var editInstance = $uibModal.open({
                    animation: true,
                    templateUrl: "src/page/form.html",
                    keyboard: false,
                    controller: "editDocInfoCtrl",
                    backdrop: "static",
                    resolve: {
                        info: function () {
                            return $scope.documentInfo;
                        }
                    }
                });
                editInstance.result.then(function (data) {

                }, function (data) {
                    getDocument();
                });
            }
        }])
    .controller("MainController", ["$http", "$scope", function ($http, $scope) {
        $scope.docs = [];
        $http({
            url: "getAllDocs",
            method: "POST"
        }).then(function (data) {
            $scope.docs = data.data.model;
        }, function (data) {
        });

    }])
    .controller("NewDocumentController", ["$scope", "$http", "toastr", "$state", function ($scope, $http, toastr, $state) {
        $scope.newDocument = function () {
            $http({
                url: "newDocument",
                method: "POST",
                data: $scope.newDocs
            }).then(function (data) {
                if (data.data.status) {
                    toastr.success(data.data.msg);
                    $state.go("home");
                } else {
                    toastr.warning(data.data.msg);
                }
            }, function (data) {
            });
        };
    }])
    .controller("AddApiController", ["schemaForm", "$scope", "toastr", "$uibModalInstance", "$stateParams", "$http",
        function (schemaForm, $scope, toastr, $uibModalInstance, $stateParams, $http) {
            $scope.add_schema = {
                type: "object",
                properties: {
                    name: {
                        type: "string",
                        required: true,
                        title: "Name",
                        description: "name for doc"
                    },
                    description: {
                        type: "string",
                        description: "description"
                    },
                    api: {
                        type: "string",
                        title: "Api",
                        required: true,
                        description: "api"
                    },
                    params: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                apiName: {
                                    type: "string",
                                    title: "apiName"
                                },
                                apiValue: {
                                    type: "string",
                                    title: "apiVlaue"
                                }
                            }
                        }
                    },
                    res: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                key: {
                                    type: "string",
                                    title: "key"
                                },
                                revalue: {
                                    type: "string",
                                    title: "revalue"
                                }
                            }
                        }
                    },
                    demo: {
                        type: "string",
                        title: "demo"
                    }
                },
                required: ["name", "api"]
            };
            $scope.add_form = [
                "*",
                {
                    type: "submit",
                    title: "save"
                }
            ];
            $scope.add_model = {};
            $scope.hideModal = function () {
                $uibModalInstance.dismiss();
            };
            $scope.submitAdd = function (form) {
                $scope.$broadcast('schemaFormValidate');
                if (form.$valid && form.$dirty) {
                    $http({
                        url: "addApi",
                        method: "POST",
                        data: {
                            name: $stateParams.docName,
                            body: $scope.add_model
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
    .controller("delDocumentCtl", ["$uibModalInstance", "$scope", function ($uibModalInstance, $scope) {
        $scope.ok = function () {
            $uibModalInstance.close(true);
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss();
        }
    }])
    .controller("editDocInfoCtrl", ["$scope", "$uibModalInstance", "$http", "info", "toastr", "$stateParams",
        function ($scope, $uibModalInstance, $http, info, toastr, $stateParams) {
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
            $scope.add_model = info;
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