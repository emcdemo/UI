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
//selected product
var selProd = {id : 0, qty : 0}, handleSteps, bindClick;
$(document).ready(function () {
	/*** Off canvas menu for Tablet potrait & Mobiles ***/
	$('[data-toggle=offcanvas]').click(function () {
		$('.row-offcanvas').toggleClass('active');
	});
	
	/** Use the below line, in case the steps form is maller than the steps list on the left side **/
	//$('body').height($(document).height());

	/*** Custom select drop down ***/
	$( document.body ).on( 'click', '.dropdown-menu li', function( event ) {
		var $target = $( event.currentTarget );
		$('.glyphicon.glyphicon-ok.pull-right.selected').remove();
		$target.find('a').prepend('<span class="glyphicon glyphicon-ok pull-right selected">&nbsp;</span>');
		$target.closest( '.btn-group' ).find( '[data-bind="label"]' ).text( $target.text() ).end().children( '.dropdown-toggle' ).dropdown( 'toggle' );
		$('#selectedSite strong').text($target.text());
		// toggle classes for displaying list
		$(".list_sel").hide();
		$('.list_'+$($target).attr("class").split(' ')[0]).show();
		return false;
	});

	/*** Step 2 - FIlter functionality ***/
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
		$('#infoModal').modal();
		$('#infoModal .modal-body').html(tmpl('loadingTmpl'));
		
		var prodId = this.id;
		/* temp delay to let user know that there is some communication with server */
		setTimeout(function(){
			$.ajax({
				'url': 'data/licenses.json',
				'content-type': 'json',
				'success': function(resp){
					$('#infoModal .modal-title').html(resp.product_name);
					$('#infoModal .modal-body').html(tmpl('productInfoTmpl', {
						resp: resp
					}));
				}
			});
		}, 999);
	});

	/** Step 1 - checked radio boxes == enabled qty to activate **/
	$('.prod-sel').on('change', function () {
		$('.qty-to-act-picker').prop('disabled', true);
		$(this).closest('tr').find('.qty-to-act-picker').prop('disabled', false);
	});


	/** logic for loading pages via ajax **/
	bindClick = function (argument) {
		$('.next-step').click(function () {		
			handleSteps(this);
		});	
	}
	bindClick();

	handleSteps = function (argument) {
		$('.steps-data').hide();
		$('#wrapper').html(tmpl('loadingTmpl')).show();
		selProd.qty = $(".qty-to-act-picker").not(":disabled").val();
		selProd.id = $(".qty-to-act-picker").not(":disabled").data("prodid");
		var tmplId = typeof argument === 'object' ?  $(argument).data("nextid") : argument.replace('#','');			
		/* temp delay to let user know that there is some communication with server */
		setTimeout(function(){
			$.ajax({
				'url': 'data/systems.json',
				'content-type': 'json',
				'success': function(resp){	
				$('#wrapper').hide();			
				resp.selProdQty = selProd.qty;
				console.log(resp);
					$('#'+tmplId+'-contents').show().html(tmpl(tmplId, {
						resp: resp
					}));
					$(location).attr("hash", "#"+tmplId);// url hashing
					bindClick();
				}
			});
		}, 999);
	}

	/** step 2 selecting machines from list **/
	$('.sel_system').on('click', function () {
		
	});
 
	/** URL hashing across pages for bookmarking and controlling steps via url **/
	if($(location).attr('pathname').indexOf("wizard.html") > 0)
	{
		var hash = $(location).attr("hash");
		
		if (!hash) { $(location).attr("hash", "#step1"); window.location.reload(true); }
		else if(hash === '#step2' || hash === '#step3') handleSteps(hash);
	}
});



