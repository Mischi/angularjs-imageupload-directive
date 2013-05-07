Demo AngularJS imageupload Directive
===============================

## Description

imageupload Directive for [AngularJS](http://angularjs.org/)

heavly inspired from [http://www.rubydesigner.com/blog/resizing-images-before-upload-using-html5-canvas](http://www.rubydesigner.com/blog/resizing-images-before-upload-using-html5-canvas).


## Usage

### Single image 

    <input type="file" accept="image/*" image="image"/>
    <img ng-show="image" ng-src="{{image.url}}" type="{{image.blob.type}}" />

The image object has the following properties:

- file
- url

### Single image with resizing

    <input type="file" accept="image/*" image="image2"
        resize-max-height="300"
        resize-max-width="250"
        resize-quality="0.7" />
    Original <img ng-show="image2" ng-src="{{image2.url}}" type="{{image2.blob.type}}" />
    Resized <img ng-show="image2" ng-src="{{image2.resized.url}}" type="{{image2.resized.blob.type}}" />
    
The image object has the following properties:

- file
- url
- resized
    - blob
    - url

### Multiple images with resizing

    <input type="file" accept="image/*" multiple
        image="images"
        resize-max-height="300"
        resize-max-width="250"
        resize-quality="0.7" />
    Originals <img ng-repeat="img in images" ng-src="{{img.url}}" type="{{img.blob.type}}" />
    Resized <img ng-repeat="img in images" ng-src="{{img.resized.url}}" type="{{img.resized.blob.type}}" />
        
When used with multiple the image object is always an array of objects with the following properties:

- file
- url
- resized
    - blob
    - url

See [demo.html](demo.html) for more concrete examples.

### Optional Parameter: 

- resize-quality
- resize-max-height
- resize-max-width


## Features

- Upload Image with FileReader
- Resize Image via canvas
- Send Image Blob with FormData and $http

## How to run the Demo?

    git clone https://github.com/Mischi/angularjs-imageupload-directive.git
    cd angularjs-imageupload-directive
    npm install

    node app.js
    open http://localhost:8080

## Depends on

- angular-1.1.4
- [blueimp/JavaScript-Canvas-to-Blob](https://github.com/blueimp/JavaScript-Canvas-to-Blob)

## Tested in following browsers:

Testimage: 4320x3240 4.22 MB, Resized (70% jpg): 320x270   

- Chrome 24 (Windows 8), Size: 9.3 KB
- Chrome Canary 27 (Windows 8), Size: 9.3 KB
- Firefox 18 (Windows 8), Size: 23.5 KB
- Internet Explorer 10 (Windows 8), Size: 9.06 KB

## Known Issues

- Firefox 18 (Windows 8) / BUG: filename gets lost and file is just called "blob", working on that...
- filesize can vary from Browser to Browser.
