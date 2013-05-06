angular.module('imageupload', [])
    .directive('image', function() {
        'use strict'
            
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
            var maxHeight = options.resizeMaxHeight || 300;
            var maxWidth = options.resizeMaxWidth || 250;
            var quality = options.resizeQuality || 0.7;

            var canvas = getResizeArea();
            
            var height = origImage.height;
            var width = origImage.width;

            // calculate the width and height, constraining the proportions
            if (width > height) {
                if (width > maxWidth) {
                    height = Math.round(height *= maxWidth / width);
                    width = maxWidth;
                }
            } else {
                if (height > maxHeight) {
                    width = Math.round(width *= maxHeight / height);
                    height = maxHeight;
                }
            }

            canvas.width = width;
            canvas.height = height;

            //draw image on canvas
            var ctx = canvas.getContext("2d");
            ctx.drawImage(origImage, 0, 0, width, height);

            // get the data from canvas as 70% jpg
            canvas.toBlob(callback, "image/jpeg", quality);
        };


        var loadAsBlob = function(imageResult, callback) {
            var reader = new FileReader();
            reader.onload = function(evt) {
                
                //create Blob from loaded ArrayBuffer
                imageResult.blob = new Blob([new Int8Array(evt.target.result)], { type: imageResult.file.type });
                            
                //attach url to blob
                imageResult.url = URL.createObjectURL(imageResult.blob);

                callback(imageResult);
            };

            // Read in the image file as ArrayBuffer.                       
            reader.readAsArrayBuffer(imageResult.file);
        };

        var createImage = function(url, callback) {
            var image = new Image();
            image.onload = function() {
                callback(image);
            };
            image.src = url;
        };

        return {
            restrict: 'A',
            scope: {
                image: '=',
                
                resizeMaxHeight: '@?',
                resizeMaxWidth: '@?',
                resizeQuality: '@?'
            },
            link: function postLink(scope, element, attrs, ctrl) {
                
                var applyScope = function(imageResult) {
                    scope.$apply(function() {
                        if(attrs.multiple)
                            scope.image.push(imageResult);
                        else
                            scope.image = imageResult; 
                    });
                };

                
                element.bind('change', function (evt) {
                    //when multiple always return an array of images
                    if(attrs.multiple)
                        scope.image = [];

                    var files = evt.target.files;

                    for(var i = 0; i < files.length; i++) {
                        //create a result object for each file in files
                        var imageResult = {
                            file: files[i]
                        };
                        
                        if(scope.resizeMaxHeight || scope.resizeMaxWidth) { //resize image
                            loadAsBlob(imageResult, function(imageResult) {
                                //create image
                                createImage(imageResult.url, function(image) {
                                    resizeImage(image, scope, function (resizedImageBlob) {
                                        imageResult.resized = {
                                            blob: resizedImageBlob,
                                            url: URL.createObjectURL(resizedImageBlob)
                                        };

                                        applyScope(imageResult);
                                    });
                                });
                            });
                        }
                        else { //no resizing
                            loadAsBlob(imageResult, applyScope);
                        }
                    }
                });
            }
        };
    });
