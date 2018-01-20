var app = angular.module('myWikiApp', ['ngMaterial']); //injects ngMaterial directive
app.controller('myWikiController', function($scope, $http) {
    $scope.showSearch = false; //necessary to set search as false at the beginning
    $scope.form = $('#searchform');
    $scope.res = $('#res');
    $scope.query = '';
    $scope.result = [];
    $scope.geturl = '';
    $scope.serachURL = function() {
        this.geturl = "https://en.wikipedia.org/w/api.php?format=json&action=query&generator=search&gsrnamespace=0&gsrlimit=10&callback=JSON_CALLBACK&prop=pageimages|extracts&pilimit=max&exintro&explaintext&exsentences=1&exlimit=max&gsrsearch=" + this.query;
        angular.element($('#res')).html('');
        $http.jsonp(this.geturl).success(function(data) { //jsonp --> json with padding --> more safe, bypasses cross domain policies.. look for CORS 
            this.result = data.query.pages; //loads all the response data from the server which is in json format
            console.log(this.result);
            angular.forEach(this.result, function(item, k) { //iterate over all the results
                $scope.h = "<a class='md-list-item-text' target='_blank' href='http://en.wikipedia.org/?curid=" + item.pageid + "'><h3>" + item.title + "</h3><p>" + item.extract + "</p></a>";
                $scope.tag = document.createElement('md-list-item');
                $scope.tag.innerHTML = $scope.h; //add the item to md-list-item
                angular.element($('#res')).append($scope.tag); //append tag to result
            });
        });
    };
});