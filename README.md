Demo AngularJS imageupload Directive
===============================

## Description

imageupload Directive for [AngularJS](http://angularjs.org/)

heavly inspired from [http://www.rubydesigner.com/blog/resizing-images-before-upload-using-html5-canvas](http://www.rubydesigner.com/blog/resizing-images-before-upload-using-html5-canvas).

See [demo.html](demo.html) for an example.

INFO: No Backend for demo.html so you can't test it at the moment -_-


    <imageupload 
        input-id="inputImage"
        original-image="data.imageBig"        
        resize-image="data.image"
        resize-quality="0.7"
        resize-max-height="320"
        resize-max-width="270">
    </imageupload>

Optional Parameter: input-id, resize-quality, resize-max-height, resize-max-width

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
