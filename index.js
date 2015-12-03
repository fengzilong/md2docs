var marked = require('marked');
var glob = require('glob');
var _ = require('lodash');
var jetpack = require('fs-jetpack');
var path = require('path');
var express = require('express');
var template = require('art-template');
var util = require('./lib/util');

var app = express();
var router = express.Router();
var cwd = process.cwd();
var renderer = new marked.Renderer();
var cwd = process.cwd();

var docsMap = {};

var DOCS_BASE_PATH = 'docs';

var files = glob.sync('**/*.md', {
	cwd: path.resolve( cwd, DOCS_BASE_PATH )
});

_.each(files, function(file) {
	var content = jetpack.read(path.resolve(cwd, DOCS_BASE_PATH, file));
	var rendered = marked(content, {});
	docsMap[file] = rendered;
});

var treeObj = [];
var cache = {};
_.each(files, function( file ) {
	var directories = path.dirname( file );
	var filename = path.basename( file );
	var root = {};
	var tmp = root;

	if( directories !== '.' ){
		var directoriesArr = directories.split( '/' );
		directoriesArr.forEach(function( directory, i ){
			//如果是根目录下的文件夹，加入treeObj中
			if( i === 0 && !( directoriesArr.slice( 0, i + 1 ).join('/') in cache ) ){
				treeObj.push( tmp );
			}

			if( i === 0 ){
				//如果是根目录文件夹，直接在root上创建
				tmp.type = 'folder';
				tmp.text = directory;
				if( typeof cache[ directoriesArr.slice( 0, i + 1 ).join('/') ] === 'undefined' ){
					tmp.children = [];
					cache[ directoriesArr.slice( 0, i + 1 ).join('/') ] = tmp.children;
				} else {
					tmp.children = cache[ directoriesArr.slice( 0, i + 1 ).join('/') ];
				}
				tmp = tmp.children;
			} else {
				//寻找上一级children
				var tmp2 = {
					type: 'folder',
					text: directory
				};
				if( typeof cache[ directoriesArr.slice( 0, i + 1 ).join('/') ] === 'undefined' ){
					//如果无记录，push到上一级文件夹的children中
					tmp2.children = [];
					cache[ directoriesArr.slice( 0, i + 1 ).join('/') ] = tmp2.children;
					tmp.push( tmp2 );
				} else {
					//已存在记录的情况下，直接引用该数组
					tmp2.children = cache[ directoriesArr.slice( 0, i + 1 ).join('/') ];
				}
				tmp = tmp2.children;
			}
		});
			
		tmp.push({
			type: 'file',
			text: filename,
			link: '/' + file
		});
		console.log('=========', file);
		console.log(JSON.stringify(treeObj));
	} else {
		treeObj.push({
			type: 'file',
			text: filename,
			link: '/' + file
		});
	}
});

jetpack.write('nav.json', treeObj);

_.each(docsMap, function(v, k) {
	router.get('/' + k, function(req, res) {
		if (req.headers['x-pjax'] === 'true') {
			res.send(docsMap[k]);
		} else {
			res.send(renderIndex());
		}
	});
	router.get('/' + encodeURI( k ), function(req, res) {
		if (req.headers['x-pjax'] === 'true') {
			res.send(docsMap[k]);
		} else {
			res.send(renderIndex());
		}
	});
});

router.get('/*.md', function( req, res ){
	res.send('')
});

function renderNavFolder( node ) {
	var rendered =
		'<li class="nav-tree-folder J_folder">' +
		'<div class="nav-tree-text J_text">' +
		'<i class="iconfont arrow">&#xe602;</i>' +
		'<i class="iconfont">&#xe601;</i>' +
		'<a href="javascript:;">' + node.text + '</a>' +
		'</div>';

	rendered += renderNavTree( node.children );

	rendered += '</li>';

	return rendered;
}

function renderNavFile( node ) {
	var rendered =
		'<li class="nav-tree-file">' +
		'<div class="nav-tree-text">' +
		'<i class="iconfont arrow">&#xe602;</i>' +
		'<i class="iconfont">&#xe600;</i>' +
		'<a href="' + node.link + '">' + node.text + '</a>' +
		'</div>' +
		'</li>';

	return rendered;
}

function renderNavTree( tree ) {
	var rendered = '<ul class="nav-tree">';
	_.each(tree, function(node) {
		if (node.type === 'folder') {
			rendered += renderNavFolder(node);
		} else {
			rendered += renderNavFile(node);
		}
	});

	rendered += '</ul>'

	return rendered;
}

template.config('base', __dirname);

function renderIndex() {
	return template('index', {
		nav: renderNavTree( treeObj )
	});
}

router.get('/', function(req, res) {
	res.send(renderIndex());
});

app.use('/', router);
app.use(express.static(__dirname));

var server = app.listen('3000', function() {
	console.log('listening ', server.address().port);
});