Demo AngularJS imageupload Directive
===============================

## Description

imageupload Directive for [AngularJS](http://angularjs.org/)

heavly inspired from [http://www.rubydesigner.com/blog/resizing-images-before-upload-using-html5-canvas](http://www.rubydesigner.com/blog/resizing-images-before-upload-using-html5-canvas).


## Usage

    <imageupload 
        input-id="inputImage"
        original-image="data.imageBig"        
        resize-image="data.image"
        resize-quality="0.7"
        resize-max-height="320"
        resize-max-width="270">
    </imageupload>
    
See [demo.html](demo.html) for an example.

### Optional Parameter: 

- resize-quality
- resize-max-height
- resize-max-width

(INFO: optional resized-image will come soon.)

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
