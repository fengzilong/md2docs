(function(){
	var $texts = $('.J_text');
	$texts.on('click', function(){
		var $parent = $(this).parent();
		if( $parent.hasClass( 'J_folder' ) ){
			$parent.toggleClass( 'open' );
		} else {
			$texts.removeClass('active');
			$(this).addClass( 'active' );
		}
	});

	$(document).pjax('a', {
		container: '#content'
	});

	$(document).on('pjax:complete', function() {
		$('pre code').each(function( i, block ) {
			hljs.highlightBlock(block);
		});
	});

	if( location.pathname !== '/' ){
		$.pjax.reload( '#content' );
	}

	$('#content').perfectScrollbar();
})();