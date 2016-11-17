﻿app.controller("MapController", function ($scope, DataService) {
    $scope.addingNewDestino = false;
    $scope.addingNewArista = false;
    $scope.selectingDestinoFinal = false;
    $scope.destinations = [];
    $scope.Destination = {};
    $scope.Arista = {};
    $scope.selectMap = function ($option) {
        if ($option === "destino") {
            $scope.addingNewDestino = true;
        } else {
            $scope.addingNewArista = true;
        }
    };
    $scope.openDestinoModal = function ($val) {
        if ($val) {
            $("#destinoModal").modal();
        } else {
            $scope.addingNewDestino = false;
            $("#destinoModal").modal("toggle");
            $scope.Destination = {};
        }
    };
    $scope.openAristaModal = function ($val) {
        if ($val) {
            $("#aristaModal").modal();
        } else {
            $scope.addingNewArista = false;
            $("#aristaModal").modal("toggle");
            $scope.Arista = {};
        }
    };
    $scope.addNewDestino = function(){
        $scope.Destination.Tipo = 1;
        $scope.Destination.IdUsuarioAgrega = 1;
        DataService.addNewDestino($scope.Destination).then(function (response) {
            if (response.data && response.data.success) {
                var destino = response.data.destino;
                $scope.drawPolygon(destino.Coordenada_X, destino.Coordenada_Y, destino.Id);
            } else {
                alert(response.data.message);
            }
            $scope.openDestinoModal(false);
        });
        $scope.addingNewDestino = false;
    };
    $scope.addNewArista = function () {
        DataService.addNewArista($scope.Arista).then(function (response) {
            if (response.data && response.data.success) {
                var arista = response.data.arista;
                $scope.drawLine(arista.x1, arista.y1, arista.x2, arista.y2, arista.Id);
            } else {
                alert(response.data.message);
            }
            $scope.openAristaModal(false);
        });
        $scope.addingNewArista = false;
    };
    $scope.getDestinationById = function (id) {
        DataService.getDestinoById(id).then(function (response) {
            if (response.data && response.data.success) {
                $scope.Destination = response.data.destino;
                $scope.openDestinoModal(true);
            } else {
                alert(response.data.message);
            }
        });
    };
    $scope.init = function () {
        $scope.loadDestinations();
        $scope.loadAristas();
    };
    $scope.loadAristas = function(){
        DataService.getAllAristas().then(function(response){
            $.each(response.data.aristas, function(i, arista){
                $scope.drawLine(arista.x1, arista.y1, arista.x2, arista.y2, arista.Id);
            });
        });
    }
    $scope.loadDestinations = function(){
        DataService.getAllDestinos().then(function (response) {
            $.each(response.data.destinos, function (i, destino) {
                $scope.drawPolygon(destino.Coordenada_X, destino.Coordenada_Y, destino.Id);
            })
        });
    };
    $scope.canvasClick = function ($event) {
        if ($scope.addingNewDestino) {
            $scope.Destination.Coordenada_X = $event.offsetX;
            $scope.Destination.Coordenada_Y = $event.offsetY;
            $scope.openDestinoModal(true);
        }
    };
    $scope.drawLine = function (x1, y1, x2, y2, id) {
        $('canvas').drawLine({
            strokeStyle: '#000',
            strokeWidth: 10,
            x1: x1, y1: y1,
            x2: x2, y2: y2,
            layer: true,
            name: id + "",
            click: function (layer) {
                var IdArista = layer.name;
                alert(IdArista);
            },
            mouseover: function (layer) {
               
            }
        });
    }
    $scope.drawPolygon = function (x, y, id) {
        $('canvas').drawPolygon({
            layer: true,
            fillStyle: '#c33',
            x: x, y: y,
            radius: 50,
            sides: 5,
            name: id + "",
            concavity: 0.5,
            click: function (layer) {
                var IdDestino = layer.name;
                $scope.$apply(function () {
                    if ($scope.addingNewArista) {
                        if (!$scope.selectingDestinoFinal) {
                            $scope.Arista.IdDestinoInicial = IdDestino;
                            $scope.selectingDestinoFinal = true;
                        } else {
                            $scope.Arista.IdDestinoFinal = IdDestino;
                            $scope.selectingDestinoFinal = false;
                            $scope.openAristaModal(true);
                        }
                    } else {
                        $scope.getDestinationById(IdDestino);
                    }
                });
                $(this).animateLayer(layer, {
                    rotate: '+=144'
                });
            },
            mouseover: function (layer) {
                $(this).animateLayer(layer, {
                    rotate: '-=144'
                }, 500);
            }
        });
    }

});