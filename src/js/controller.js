/**
 * Created by zhipu.liao on 2016/3/4.
 */
angular.module("app")
    .controller("ListController", ["$http", "$anchorScroll", "$location", "$stateParams", "$scope", "toastr", "$state", "$uibModal",
        function ($http, $anchorScroll, $location, $stateParams, $scope, toastr, $state, $uibModal) {
            $scope.docs = [];
            $scope.goto = function (id) {
                $location.hash(id);
                $anchorScroll();
            };
            function getAllDocList() {
                $http({
                    url: "getAllDocs",
                    method: "POST"
                }).then(function (data) {
                    $scope.docs = data.data.model;
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

            getAllDocList();
            $scope.addApi = function (apiName) {
                var addInstance = $uibModal.open({
                    animation: true,
                    templateUrl: "src/page/form.html",
                    controller: "AddApiController",
                    keyboard: false,
                    backdrop: "static",
                    resolve: {
                        apiName: function () {
                            return apiName;
                        }
                    }
                });
                addInstance.result.then(function (data) {
                    getAllDocList();
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
            };
            $scope.editApi = function (index) {
                var editApiInstance = $uibModal.open({
                    animation: true,
                    templateUrl: "src/page/form.html",
                    keyboard: false,
                    controller: "editApiCtrl",
                    backdrop: "static",
                    resolve: {
                        infos: function () {
                            return $scope.apis[index];
                        },
                        indexs: function () {
                            return index;
                        }

                    }
                });
            };

        }])
    .controller("MainController", ["$http", "$scope", "$stateParams", "toastr","$state",
        function ($http, $scope, $stateParams, toastr,$state) {
            $scope.apis = [];
            $http({
                url: "getDocument",
                method: "POST",
                data: {
                    name: $stateParams.docName
                }
            }).then(function (data) {
                if (data.data.status) {
                    console.log(data.data.model.apis[$stateParams.apiIndex]);
                    $scope.apis.push(data.data.model.apis[$stateParams.apiIndex]);
                    //console.log($scope.apis);
                    $scope.documentInfo = data.data.model.docInfo;
                    //$scope.titles = getDocList($scope.apis);
                    //console.log(getApiList($scope.apis));
                } else {
                    toastr.warning(data.data.msg);
                }
            });
            $scope.delApi = function (index, apiName) {
                console.log($stateParams);
                $http({
                    url: "delApi",
                    method: "POST",
                    data: {
                        index: $stateParams.apiIndex,
                        name: apiName
                    }
                }).then(function (data) {
                    toastr.success(data.data.msg);
                    $state.go("home");
                }, function (data) {
                    toastr.warning(data.data.msg);
                })
            };
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
    .controller("AddApiController", ["schemaForm", "apiName", "$scope", "toastr", "$uibModalInstance", "$stateParams", "$http",
        function (schemaForm, apiName, $scope, toastr, $uibModalInstance, $stateParams, $http) {
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
                            name: apiName,
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
    .controller("delDocumentCtl", ["$uibModalInstance", "$scope", "$stateParams",
        function ($uibModalInstance, $scope, $stateParams) {
            $scope.ok = function () {
                $uibModalInstance.close($stateParams.docName);
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
        }])
    .controller("editApiCtrl", ["$scope", "$http", "toastr","$uibModal", "$stateParams", "schemaForm","$state",
        function ($scope, $http, toastr,$uibModal, $stateParams, schemaForm,$state) {
            console.log($stateParams);
            $http({
                url: "getDocument",
                method: "POST",
                data: {
                    name: $stateParams.docName
                }
            }).then(function (data) {
                if (data.data.status) {
                    $scope.add_model = data.data.model.apis[$stateParams.apiIndex];
                } else {
                    toastr.warning(data.data.msg);
                }
            });
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
                },{
                    type:"button",
                    title:"preview"
                }
            ];
            $scope.submitAdd = function (form) {
                $scope.$broadcast('schemaFormValidate');
                if (form.$valid && form.$dirty) {
                    $http({
                        url: "editApi",
                        method: "POST",
                        data: {
                            index: $stateParams.apiIndex,
                            name: $stateParams.docName,
                            api: $scope.add_model
                        }
                    }).then(function (data) {
                        if (data.data.status) {
                            toastr.success(data.data.msg);
                            $state.go("home");
                        } else {
                            toastr.warning(data.data.msg);
                        }
                    });
                } else {
                    toastr.warning("请把表单填完整后在提交")
                }
            };
            $scope.preview=function(){
                var previewInstance=$uibModal.open({
                   templateUrl:"src/page/preview.html",
                    animation:true,
                    backdrop:"static"
                });

            };
        }]);