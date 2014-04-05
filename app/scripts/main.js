'use strict';


/************ temperory code for micro-templating *************/
// Simple JavaScript Templating
// John Resig - http://ejohn.org/ - MIT Licensed
var tmpl;
(function(){
  var cache = {};
 
  tmpl = function tmpl(str, data){
    // Figure out if we're getting a template, or if we need to
    // load the template - and be sure to cache the result.
    var fn = !/\W/.test(str) ?
      cache[str] = cache[str] ||
        tmpl(document.getElementById(str).innerHTML) :
     
      // Generate a reusable function that will serve as a template
      // generator (and which will be cached).
      new Function("obj",
        "var p=[],print=function(){p.push.apply(p,arguments);};" +
       
        // Introduce the data as local variables using with(){}
        "with(obj){p.push('" +
       
        // Convert the template into pure JavaScript
        str
          .replace(/[\r\t\n]/g, " ")
          .split("<%").join("\t")
          .replace(/((^|%>)[^\t]*)'/g, "$1\r")
          .replace(/\t=(.*?)%>/g, "',$1,'")
          .split("\t").join("');")
          .split("%>").join("p.push('")
          .split("\r").join("\\'")
      + "');}return p.join('');");
   
    // Provide some basic currying to the user
    return data ? fn( data ) : fn;
  };
})();

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

	// in index.html, functionality for the 'info' link available against product names
	$('.productInfoLink').on('click', function(){
		$('#myModal').modal();
		$('#myModal .modal-body').html(tmpl('loadingTmpl'));
		
		var prodId = this.id;
		/* temp delay to let user know that there is some communication with server */
		setTimeout(function(){
			$.ajax({
				'url': 'data/licenses.json',
				'content-type': 'json',
				'success': function(resp){
					$('#myModal .modal-title').html(resp.product_name);
					$('#myModal .modal-body').html(tmpl('productInfoTmpl', {
						resp: resp
					}));
				}
			});
		}, 1000);
	});
});



