# less-auto-parser
Node.js script to convert LESS to CSS as you work.

## Required
1. [Node.js](http://nodejs.org/)
2. [Less for Node](http://lesscss.org/#-server-side-usage)
3. inotify
3. [inotify-plusplus](https://github.com/coolaj86/node-inotify-plusplus) 

## Setup

1. Install [Node.js](http://nodejs.org/)
2. Run the following command from the commandline: `npm install less inotify inotify-plusplus`
3. Download `watch.js` and place it in the root directory of your website

## Usage
Place `watch.js` in your root web directory and run:

    node watch.js

Leave it running and go back to your editor. As you modify .less files they will be converted to .css files.

## Take note!
* Assumes all your .less files are in ./less/
* Assumes all your .css files are in ./css/
* Currently it will not:
    * find .less files in subdirectories
    * follow @import etc., only converts modified files
    * delete/rename .css file if the corresponding .less file is deleted/renamed
    
## License
Copyright 2012 Rudolf Vavruch

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

<http://www.apache.org/licenses/LICENSE-2.0>

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

