Demo AngularJS imageupload Directive
===============================

## Description

imageupload Directive for [AngularJS](http://angularjs.org/)

heavly inspired from [http://www.rubydesigner.com/blog/resizing-images-before-upload-using-html5-canvas](http://www.rubydesigner.com/blog/resizing-images-before-upload-using-html5-canvas).


## Usage

### Single image 

```html
<input type="file" accept="image/*" image="image"/>
<img ng-show="image" ng-src="{{image.url}}" type="{{image.file.type}}" />
```

The image object has the following properties:

- file
- url
- dataURL

### Single image with resizing

```html
<input type="file" accept="image/*" image="image2"
    resize-max-height="300"
    resize-max-width="250"
    resize-quality="0.7" />
Original <img ng-show="image2" ng-src="{{image2.url}}" type="{{image2.file.type}}" />
Resized <img ng-show="image2" ng-src="{{image2.resized.dataURL}}" />
```

The image object has the following properties:

- file
- url
- dataURL
- resized
    - dataURL
    - type

### Multiple images with resizing

```html
<input type="file" accept="image/*" multiple
    image="images"
    resize-max-height="300"
    resize-max-width="250"
    resize-quality="0.7" />
Originals <img ng-repeat="img in images" ng-src="{{img.url}}" type="{{img.file.type}}" />
Resized <img ng-repeat="img in images" ng-src="{{img.resized.dataURL}}" />
```

When used with multiple the image object is always an array of objects with the following properties:

- file
- url
- dataURL
- resized
    - dataURL
    - type

See [demo.html](demo.html) for more concrete examples.

### Optional Parameter: 

- resize-quality (default is 0.7)
- resize-type (default is 'image/jpg')
- resize-max-height (default is 300)
- resize-max-width (default is 250)


## Features

- Upload Image with FileReader
- Resize Image via canvas
- Send Image Data URL (base64) to whatever you want.

## How to run the Demo?

```Shell
git clone https://github.com/Mischi/angularjs-imageupload-directive.git
cd angularjs-imageupload-directive
npm install

node app.js
open http://localhost:8080
```

## Depends on

- angular-1.1.4

## Tested in following browsers:

Testimage: 4320x3240 4.22 MB, Resized (70% jpg): 320x270   

- Chrome 24 (Windows 8), Size: 9.3 KB
- Chrome Canary 27 (Windows 8), Size: 9.3 KB
- Firefox 18 (Windows 8), Size: 23.5 KB
- Internet Explorer 10 (Windows 8), Size: 9.06 KB

## Known Issues

- filesize can vary from Browser to Browser.


## TODO's

- Use NgModelController instead of image attribute
- Create [bower](http://bower.io/) compatible repository (component.json, tags, etc.)
- Match [angular-component-spec](https://github.com/PascalPrecht/angular-component-spec) when it becomes available
- Clear image property when Form has been reset
- Create Unit Tests
