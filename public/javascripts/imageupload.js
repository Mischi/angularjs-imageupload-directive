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


        var loadAsBlob = function(file, callback) {
            var reader = new FileReader();
            reader.onload = function(evt) {
                
                //create Blob from loaded ArrayBuffer
                var blob = new Blob([new Int8Array(evt.target.result)], { type: file.type });
                            
                //attach url to blob
                blob.url = URL.createObjectURL(blob);

                //attach file name to blob
                blob.name = file.name;

                //attach file type to blob
                blob.type = file.type;

                callback(blob);
            };

            // Read in the image file as ArrayBuffer.                       
            reader.readAsArrayBuffer(file);
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
                
                var applyScope = function(imageBlob) {
                    scope.$apply(function() {
                        if(attrs.multiple)
                            scope.image.push(imageBlob);
                        else
                            scope.image = imageBlob; 
                    });
                };

                
                element.bind('change', function (evt) {
                    //when multiple always return an array of images
                    if(attrs.multiple)
                        scope.image = [];

                    var files = evt.target.files;

                    for(var i = 0; i < files.length; i++) {
                        var imageFile = files[i];
                        
                        if(scope.resizeMaxHeight || scope.resizeMaxWidth) { //resize image
                            loadAsBlob(imageFile, function(imageBlob) {
                                //create image
                                createImage(imageBlob.url, function(image) {
                                    resizeImage(image, {
                                        maxHeight: scope.resizeMaxHeight, 
                                        maxWidth: scope.resizeMaxWidth,
                                        quality: scope.resizeQuality
                                    }, function (resizedImageBlob) {
                                        //attach url to resizedImageBlob
                                        resizedImageBlob.url = URL.createObjectURL(resizedImageBlob);

                                        //attach image name to resizedImageBlob
                                        resizedImageBlob.name = imageFile.name;

                                        //attach image type to resizedImageBlob
                                        resizedImageBlob.type = imageFile.type;

                                        imageBlob.resized = resizedImageBlob;
                                        
                                        applyScope(imageBlob);
                                    });
                                });
                            });
                        }
                        else { //no resizing
                            loadAsBlob(imageFile, applyScope);
                        }
                    }
                });
            }
        };
    });
