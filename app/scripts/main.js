'use strict';
$(document).ready(function () {
	$('[data-toggle=offcanvas]').click(function () {
		$('.row-offcanvas').toggleClass('active');
	});
	
	/** Use the below line, in case the steps form is maller than the steps list on the left side **/
	//$('body').height($(document).height());


	$( document.body ).on( 'click', '.dropdown-menu li', function( event ) {
		var $target = $( event.currentTarget );
		$('.glyphicon.glyphicon-ok.pull-right.selected').remove();
		$target.find('a').prepend('<span class="glyphicon glyphicon-ok pull-right selected">&nbsp;</span>');
		$target.closest( '.btn-group' ).find( '[data-bind="label"]' ).text( $target.text() ).end().children( '.dropdown-toggle' ).dropdown( 'toggle' );
		$('#selectedSite strong').text($target.text());
		return false;
	});


	$('#filter-list').on('keyup', function () {
		var srcText = $.trim($(this).val());
		$('.filter-list li').each(function () {
			if($(this).text().toLowerCase().indexOf(srcText) >= 0 )
			{
				$(this).show();
			}
			else
			{
				$(this).hide();
			}
		});
	});
});