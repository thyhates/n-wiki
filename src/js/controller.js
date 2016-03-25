/**
 * Created by zhipu.liao on 2016/3/4.
 */
angular.module("app")
    .controller("DocIndexController", ["$stateParams", "$scope", function ($stateParams, $scope) {
        //console.log($stateParams);
    }])
    .controller("ListController", ["$http", "$anchorScroll", "$location", "$stateParams", "$scope", "toastr", "$state", "$uibModal",
        function ($http, $anchorScroll, $location, $stateParams, $scope, toastr, $state, $uibModal) {
            //console.log($stateParams)
            console.log("21324534");
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
            /*$scope.addApi = function (apiName) {
             var addInstance = $uibModal.open({
             animation: true,
             templateUrl: "/front/form.html",
             controller: "AddApiController",
             keyboard: true,
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
             };*/
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
                console.log($scope);
                var editInstance = $uibModal.open({
                    animation: true,
                    templateUrl: "/front/form.html",
                    keyboard: false,
                    controller: "editDocInfoCtrl",
                    backdrop: "static"
                    //resolve: {
                    //    info: function () {
                    //        return $scope.documentInfo;
                    //    }
                    //}
                });
                editInstance.result.then(function (data) {

                }, function (data) {
                    getDocument();
                });
            };
            $scope.editApi = function (index) {
                var editApiInstance = $uibModal.open({
                    animation: true,
                    templateUrl: "/front/form.html",
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
                    console.log($scope.documentInfo);
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
                            $state.transitionTo("home.doc",{
                                docName:$stateParams.docName,
                                apiIndex:0
                            },{
                                reload:true
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
                        $state.transitionTo("home.doc",{
                            docName:$stateParams.docName,
                            apiIndex:0
                        },{
                            reload:true
                        });
                    } else {
                        toastr.warning(data.data.msg);
                    }
                }, function (data) {
                });
            };
        }])
    .controller("AddApiController", [ "$scope", "toastr","$stateParams", "$http","$state",
        function ($scope, toastr,  $stateParams, $http,$state) {
            //console.log($scope.apis);
            $scope.newApi={
                params:[],
                res:[]
            }
            $scope.addApi = function (form) {
                console.log($scope.newApi);
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
                            $state.transitionTo("home.doc",{
                                docName:$stateParams.docName,
                                apiIndex:0
                            },{
                                reload:true
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
    .controller("editDocInfoCtrl", ["$scope", "$uibModalInstance", "$http", "toastr", "$stateParams",
        function ($scope, $uibModalInstance, $http, toastr, $stateParams) {
            $http({
                url: "getDocument",
                method: "POST",
                data: {
                    name: $stateParams.docName
                }
            }).then(function (data) {
                if (data.data.status) {
                    $scope.info = data.data.model;
                    //console.log($scope.documentInfo);
                    $scope.add_model = $scope.info;
                } else {
                    toastr.warning(data.data.msg);
                }
            });
            //console.log($scope);
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
                            $state.go("home");
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
    .controller("editApiCtrl", ["$scope", "$http", "toastr", "$uibModal", "$stateParams", "$state",
        function ($scope, $http, toastr, $uibModal, $stateParams, $state) {
            //console.log($scope)
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
                    console.log($scope.apis);
                } else {
                    toastr.warning(data.data.msg);
                }
            });
            /*            $scope.add_schema = {
             type: "object",
             properties: {
             name: {
             type: "string",
             required: true,
             title: "接口名"
             },
             description: {
             type: "string",
             title: "接口描述"
             },
             api: {
             type: "string",
             title: "接口地址",
             required: true
             },
             method: {
             type: "string",
             title: "请求方法"
             },
             params: {
             type: "array",
             items: {
             type: "object",
             properties: {
             apiName: {
             type: "string",
             title: "参数名"
             },
             apiValue: {
             type: "string",
             title: "默认值"
             },
             type: {
             type: "string",
             title: "类型"
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
             title: "参数名"
             },
             revalue: {
             type: "string",
             title: "说明"
             },
             type: {
             type: "string",
             title: "类型"
             }
             }
             }
             },
             demo: {
             type: "string",
             title: "JSON返回示例"
             }
             },
             required: ["name", "api"]
             };
             $scope.add_form = [
             {
             "type": "section",
             "htmlClass": "row",
             "items": [
             {
             "type": "section",
             "items": ["name"],
             htmlClass: "col-xs-5"
             }]
             }, {
             "type": "section",
             "htmlClass": "row",
             "items": [
             {
             "type": "section",
             "items": ["description"],
             htmlClass: "col-xs-5"
             }]
             }, "api", {
             key: "method",
             type: "select",
             titleMap: {
             "GET": "GET",
             "POST": "POST"
             }
             },
             "params", "res",
             {
             key: "demo",
             type: "textarea",
             width: "50%"
             },
             {
             type: "submit",
             title: "save"
             }
             ];*/
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
                            $state.transitionTo("home.doc",{
                                docName:$stateParams.docName,
                                apiIndex:0
                            },{
                                reload:true
                            });
                        } else {
                            toastr.warning(data.data.msg);
                        }
                    });
                } else {
                    toastr.warning("请把表单填完整后在提交")
                }
            };
            $scope.preview = function () {
                var previewInstance = $uibModal.open({
                    templateUrl: "/front/preview.html",
                    animation: true,
                    backdrop: "static"
                });

            };
        }]);