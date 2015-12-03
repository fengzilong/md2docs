var _ = {};


_.isPlainObject = function( v ){
	return !!v && typeof v === 'object' && v.__proto__ === Object.prototype;
};

_.getObject = function( target, path ){
	if( typeof path !== 'undefined' ){
		var keys = path.split('.');
		var keyLen = keys.length;
		var obj = target;

		if( typeof path === 'undefined' || path === '' ){
			return target;
		}
		
		for( var i = 0; i < keyLen; i++ ){
			if( typeof obj[ keys[ i ] ] !== 'undefined' ){
				obj = obj[ keys[ i ] ];
			} else {
				return void 0;
			}
		}

		return obj;
	} else {
		return target;
	}
};

_.setObject = function( target, path, value ){
	var obj = target;
	var keys = path.split('.');
	var keyLen = keys.length;
	
	for( var i = 0; i < keyLen; i++ ){
		if( _.isPlainObject( obj[ keys[ i ] ] ) ){
			obj = obj[ keys[ i ] ];
		} else if( !_.isPlainObject( obj[ keys[ i ] ] ) && i < keyLen - 1 ) {
			obj[ keys[ i ] ] = {};
			obj = obj[ keys[ i ] ];
		} else if( i === keyLen - 1 ){
			obj[ keys[ i ] ] = value;
		}
	}
};

module.exports = _;