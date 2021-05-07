# Handy-Image-Processor

A handy, simple & useful Image Processor for NodeJS with very simple API.

# Requirements
1. [gm](http://aheckmann.github.io/gm/)

# Install

First install.

```bash
# with npm
npm install handy-image-processor

# or with Yarn
yarn add handy-image-processor
```

# Usage

```javascript
// Import
const Processor = require('handy-image-processor')

// For processing
Processor.ProcessImage(options:Object):Promise
options = {
    srcFile,    // Image source      [eg. './src/image.gif']
    width,      // width you want    [eg. 100]
    height,     // height you want   [eg. 100]
    destFile:   // Image destination [eg. './dest/'+ new Date().getTime() +'.png']
}

// For deleting all the files of any given folder
Processor.DeleteFolder(folder:String):Promise
```
