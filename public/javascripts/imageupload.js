angular.module('imageupload', [])
    .directive('image', function($q) {
        'use strict'

        var URL = window.URL || window.webkitURL;

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

        var resizeImage = function (origImage, options) {
            var maxHeight = options.resizeMaxHeight || 300;
            var maxWidth = options.resizeMaxWidth || 250;
            var quality = options.resizeQuality || 0.7;
            var cover = options.cover || false;
            var coverHeight = options.coverHeight || 300;
            var coverWidth = options.coverWidth || 250;
            var coverX = options.coverX || 'left';
            var coverY = options.coverY || 'top';
            var type = options.resizeType || 'image/jpg';

            var canvas = getResizeArea();

            var height = origImage.height;
            var width = origImage.width;

            var imgX = 0;
            var imgY = 0;

            if(!cover){
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

	          }else{
	          	// Logic for calculating size when in cover-mode
	          	canvas.width = coverHeight;
					    canvas.height = coverWidth;
					    // Resize image to fit canvas and keep original proportions
					    var ratio = 1;
					    if(height < canvas.height)
					    {
					      ratio = canvas.height / height;
					      height = height * ratio;
					      width = width * ratio;
					    }
					    if(width < canvas.width)
					    {
					      ratio = canvas.width / width;
					      height = height * ratio;
					      width = width * ratio;
					    }

					    // Check if both are too big -> downsize
					    if(width > canvas.width && height > canvas.height)
					    {
					      ratio = Math.max(canvas.width/width, canvas.height/height);
					      height = height * ratio;
					      width = width * ratio;
					    }

					    // place img according to coverX and coverY values
					    if(width > canvas.width){
					    	if(coverX === 'right'){ imgX = canvas.width - width; }
					    	else if (coverX === 'center'){ imgX = (canvas.width - width) / 2; }
					    }else if(height > canvas.height){
					    	if(coverY === 'bottom'){ imgY = canvas.height - height; }
					    	else if (coverY === 'center'){ imgY = (canvas.height - height) / 2; }
					    }

	          }

            //draw image on canvas
            var ctx = canvas.getContext("2d");
            ctx.drawImage(origImage, imgX, imgY, width, height);

            // get the data from canvas as 70% jpg (or specified type).
            return canvas.toDataURL(type, quality);
        };

        var createImage = function(url, callback) {
            var image = new Image();
            image.onload = function() {
                callback(image);
            };
            image.src = url;
        };

        var fileToDataURL = function (file) {
            var deferred = $q.defer();
            var reader = new FileReader();
            reader.onload = function (e) {
                deferred.resolve(e.target.result);
            };
            reader.readAsDataURL(file);
            return deferred.promise;
        };


        return {
            restrict: 'A',
            scope: {
                image: '=',
                resizeMaxHeight: '@?',
                resizeMaxWidth: '@?',
                resizeQuality: '@?',
                resizeType: '@?',
                cover: '@?',
                coverHeight: '@?',
                coverWidth: '@?',
                coverX: '@?',
                coverY: '@?',
            },
            link: function postLink(scope, element, attrs, ctrl) {

                var doResizing = function(imageResult, callback) {
                    createImage(imageResult.url, function(image) {
                        var dataURL = resizeImage(image, scope);
                        imageResult.resized = {
                            dataURL: dataURL,
                            type: dataURL.match(/:(.+\/.+);/)[1],
                        };
                        callback(imageResult);
                    });
                };

                var applyScope = function(imageResult) {
                    scope.$apply(function() {
                        //console.log(imageResult);
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
                            file: files[i],
                            url: URL.createObjectURL(files[i])
                        };

                        fileToDataURL(files[i]).then(function (dataURL) {
                            imageResult.dataURL = dataURL;
                        });

                        if(scope.resizeMaxHeight || scope.resizeMaxWidth || scope.cover) { //resize image
                            doResizing(imageResult, function(imageResult) {
                                applyScope(imageResult);
                            });
                        }
                        else { //no resizing
                            applyScope(imageResult);
                        }
                    }
                });
            }
        };
    });
