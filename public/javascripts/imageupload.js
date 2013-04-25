angular.module('imageuploadDemo')
    .directive('imageupload',
        function () {
            'use strict';

            var getResizeArea = function () {
                var resizeAreaId = 'fileupload-resize-area';

                var resizeArea = document.getElementById(resizeAreaId);

                if (!resizeArea) {
                    resizeArea = document.createElement('canvas');
                    resizeArea.id = resizeAreaId;
                    resizeArea.style.visibility = 'hidden';
                    document.body.appendChild(resizeArea);
                }

                return resizeArea;
            };

            var resizeImage = function (origImage, options, callback) {
                options.maxHeight = options.maxHeight || 300;
                options.maxWidth = options.maxWidth || 250;
                options.quality = options.quality || 0.7;

                var canvas = getResizeArea();
                var height = origImage.height;
                var width = origImage.width;

                // calculate the width and height, constraining the proportions
                if (width > height) {
                    if (width > options.maxWidth) {
                        //height *= options.maxWidth / width;
                        height = Math.round(height *= options.maxWidth / width);
                        width = options.maxWidth;
                    }
                } else {
                    if (height > options.maxHeight) {
                        //width *= options.maxHeight / height;
                        width = Math.round(width *= options.maxHeight / height);
                        height = options.maxHeight;
                    }
                }

                canvas.width = width;
                canvas.height = height;

                //draw image on canvas
                var ctx = canvas.getContext("2d");
                ctx.drawImage(origImage, 0, 0, width, height);

                // get the data from canvas as 70% jpg
                canvas.toBlob(callback, "image/jpeg", options.quality);
            };


            return {
                restrict: 'AE',
                replace: true,
                scope: {
                    inputId: '@',
                    originalImage: '=',
                    resizeImage: '=',
                    showError: "@",
                    errorMessage: "@",
                    resizeMaxHeight: '@',
                    resizeMaxWidth: '@'
                },
                template: '<div>' +
                            '<input id="{{inputId}}" type="file">' +
                            '<a id="removeButton" ng-show="resizeImage">x</a>' +
                            '<div ng-show="!showError">' +
                                '<img ng-show="resizeImage" ng-src="{{resizeImage.url}}" type="{{image.type}}">' +
                            '</div>' +
                            '<div style="color:#ef3e42;">' +
                              '<span ng-show="showError">{{errorMessage}}</span>' +
                            '</div>' +
                          '</div>',
                link: function postLink(scope, element, attrs) {
                    element.children('#removeButton').bind('click', function() {
                        element.children('#' + scope.inputId).val('');
                        scope.$apply(function(){
                          scope.originalImage = scope.image = scope.resizeImage = null;
                        });
                    });
                    element.bind('change', function (evt) {
                        var image = scope.image = evt.target.files[0];

                        if (!image) {
                            return;
                        }

                        // Only process image files.
                        if (!image.type.match('image.*')) {
                            scope.$apply(function() {
                                scope.showError = true;
                                scope.errorMessage = "It must be an image (it will be ignored).";
                            });
                            return;
                        }else{
                            scope.$apply(function() {
                                scope.showError = false;
                            });
                        }

                        var reader = new FileReader();

                        reader.onload = function (e) {

                            //create Blob from loaded ArrayBuffer
                            var origImageBlob = new Blob([new Int8Array(e.target.result)], { type: image.type });
                            //attach url to origImageBlob
                            origImageBlob.url = URL.createObjectURL(origImageBlob);

                            //attach image name to origImageBlob
                            origImageBlob.name = image.name;

                            //create image
                            var origImage = new Image();
                            origImage.onload = function () {
                                resizeImage(origImage, {
                                    maxHeight: scope.resizeMaxHeight,
                                    maxWidth: scope.resizeMaxWidth,
                                    quality: scope.resizeQuality
                                }, function (resizedImageBlob) {
                                    //attach url to resizedImageBlob
                                    resizedImageBlob.url = URL.createObjectURL(resizedImageBlob);

                                    //attach image name to resizedImageBlob
                                    resizedImageBlob.name = image.name;

                                    scope.$apply(function () {
                                        scope.originalImage = origImageBlob;
                                        scope.resizeImage = resizedImageBlob;
                                    });
                                });
                            };

                            //load origImage into image element
                            origImage.src = origImageBlob.url;
                        };

                        // Read in the image file as ArrayBuffer.                       
                        reader.readAsArrayBuffer(image);
                    });
                }
            };
        }
    );
