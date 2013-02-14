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
            }

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
                    resizeMaxHeight: '@',
                    resizeMaxWidth: '@',
                },
                template: '<div>' +
                            '<input id="{{inputId}}" type="file">' +
                            '<div>' +
                                '<img ng-show="resizeImage" ng-src="{{resizedImageUrl}}" type="{{image.type}}">' +
                            '</div>' +
                          '</div>',
                link: function postLink(scope, element, attrs) {
                    element.bind('change', function (evt) {
                        var image = scope.image = evt.target.files[0];

                        if (!image) {
                            return;
                        }

                        // Only process image files.
                        if (!image.type.match('image.*')) {
                            return;
                        }

                        var reader = new FileReader();

                        reader.onload = function (e) {

                            //create Blob from loaded ArrayBuffer
                            var origImageBlob = new Blob([new Int8Array(e.target.result)], { type: image.type });
                            var origImageUrl = URL.createObjectURL(origImageBlob);

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
                                    var resizedImageUrl = URL.createObjectURL(resizedImageBlob);

                                    //attach image name to resizedImageBlob
                                    resizedImageBlob.name = image.name;

                                    scope.$apply(function () {
                                        scope.resizedImageUrl = resizedImageUrl;
                                                        
                                        scope.originalImage = origImageBlob;
                                        scope.resizeImage = resizedImageBlob;
                                    });
                                });
                            };

                            //load origImage into image element
                            origImage.src = origImageUrl;
                        };

                        // Read in the image file as ArrayBuffer.                       
                        reader.readAsArrayBuffer(image);
                    });
                }
            };
        }
    );