var marked = require('marked');
var glob = require('glob');
var _ = require('lodash');
var jetpack = require('fs-jetpack');
var path = require('path');
var express = require('express');

var app = express();
var router = express.Router();
var cwd = process.cwd();
var renderer = new marked.Renderer();

var docsMap = {};
var files = glob.sync('docs/**/*.md');

_.each(files, function( file ){
    var content = jetpack.read( path.resolve( cwd, file ) );
    var rendered = marked( content, {} );

    docsMap[ file ] = rendered;
});

_.each(docsMap, function( v, k ){
	console.log( path.relative( 'docs', k ) );
    router.get('/' + path.relative( 'docs', k ), function( req, res ){
        res.send( docsMap[ k ] );
    });
});

router.get('/', function( req, res ){
    res.sendfile( path.resolve( __dirname, 'index.html' ) );
});

app.use( '/', router );
app.use( express.static( __dirname ) );

var server = app.listen('3000', function(){
    console.log( 'listening ', server.address().port );
});
