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
                        $state.transitionTo("home.doc", {
                            docName: $stateParams.docName,
                            apiIndex: 0
                        }, {
                            reload: true
                        });
                    } else {
                        toastr.warning(data.data.msg);
                    }
                }, function (data) {
                });
            };
        }])
    .controller("AddApiController", ["$scope", "toastr", "$stateParams", "$http", "$state",
        function ($scope, toastr, $stateParams, $http, $state) {
            $scope.newApi = {
                params: [],
                res: []
            };
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
        }]
    );