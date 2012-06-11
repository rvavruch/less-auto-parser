/**
 * Will not:
 * find .less files in subdirectories (working on this)
 * follow @import etc., only converts modified files (working on this)
 * delete/rename .css file if the corresponding .less file is deleted/renamed
 */

var Inotify = require('inotify-plusplus'), // should be 'inotify++', but npm has issues with the ++
    fs = require('fs'),
    less = require('less'),
    path = require('path'),
    inotify,
    directive,
    options,
    lessdir = path.join(__dirname, 'less/'),
    cssdir = path.join(__dirname, 'css/')
    ;

inotify = Inotify.create(true); // stand-alone, persistent mode, runs until you hit ctrl+c

var watchLessFiles = function (err, files)
{
    if (err)
        throw new Error(err);
    
    console.log("Watching:");
    if (err == null)
    {
        files.forEach(function (elem){
            lessfile = path.join(lessdir, elem);
            if(elem.match(/\.less$/) && fs.statSync(lessfile).isFile())
            {
                console.log(lessfile);
                inotify.watch(directive, lessfile);
            }
        });
    }
}

directive = {
    // note this can sometimes be called twice
    modify: function (ev) {
        var parser = new less.Parser({paths: [ lessdir ]});
        var lessSrc = fs.readFile(ev.watch, function (err, data) {
            if (err)
                throw new Error(err);
            
            parser.parse(data.toString(), function(err, tree) {
                if (err)
                {
                    console.log("Parsing failed for: " + ev.watch);
                }
                else
                {
                    filename = ev.watch.replace(lessdir, ""); // filename relative to lessDir
                    var cssFilename = filename.replace(/less$/, 'css');
                    fs.writeFileSync(path.join(cssdir, cssFilename), tree.toCSS()); // sync because this may get called twice
                    console.log("Parsed: " + filename + " => " + cssFilename);
                }
            });
        });
    },
    //moved_from: true
}

changedDir = {
    all_events: function (ev) {
        console.log("++ Watched directory changed ++");
        fs.readdir(__dirname + lessdir, watchLessFiles);
    },
    moved_from: true,
    deleted: true
}
/*
options = {
    all_events_is_catchall: true // by default (false) "all_events" only catches events already listened for.
                                 // this option tells "all_events" to catch all events, period.
}
*/
//inotify.watch(changedDir, __dirname + '/less_files');

inotify.watch(changedDir, lessdir);
fs.readdir(lessdir, watchLessFiles); // initialise watching of all less files



//inotify.watch(directive, __dirname + lessdir + 'test.less');
//console.log("hello");

/*
var lessDir = __dirname + '/less_files'
  , cssDir = __dirname + '/css_files';

var less = require('less')
  , LessParser = less.Parser

  , path = require('path')
  , join = path.join

  , fs = require('fs')
  , onModify
  , relations = {}
  , watch;


onModify = function(filename){
  console.log('Changed', filename);
  if(relations[filename])
    filename = relations[filename];
  console.log('Which relate on', filename);
  var path, lessParser, contents;

  path = join(lessDir, filename);
  if(!filename.match(/\.less$/) || !fs.statSync(path).isFile())
    return;

  lessParser = new LessParser({
    paths: [ lessDir ],
    filename: filename
  });

  contents = fs.readFileSync(path).toString();
  lessParser.parse(contents, function(err, tree){
    if(err)
      throw new Error(err);

    var cssFilename = filename.replace(/less$/, 'css');
    fs.writeFileSync(join(cssDir, cssFilename), tree.toCSS());
    // Relations
    tree.rules.forEach(function(rule){
      if(rule.path){
        watch(rule.path);
        relations[rule.path] = filename;
      }
    });
  });

}

watch = function(filename){
  if(relations[filename])
    return;

  var path;
  if(filename.charAt(0) == '/')
    path = filename;
  else
    path = join(lessDir, filename);

  fs.watch(path, function(){
    onModify(filename);
  });
}

fs.readdirSync(lessDir).forEach(onModify);
watch(lessDir);
*/

  