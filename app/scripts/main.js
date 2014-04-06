'use strict';


/************ micro-templating *************/
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
/************ micro-templating *************/

//selected product
var selProd = {id : 0, qty : 0, selected : 0}, handleSteps, bindEvents;
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
		$(".list_sel").hide().removeClass('shown');
		$('.list_'+$($target).attr("class").split(' ')[0]).show().addClass('shown');
		$('#filter-list').prop('disabled', false).val('');
		return false;
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
	bindEvents = function (argument) {
		$('.next-step').click(function () {		
			handleSteps(this);
		});	
		/** step 2 selecting machines from list **/
		if($('.sel_system'))
		{
			$('.alert.alert-danger.done,.alert.alert-danger.incomplete').hide();
			$('.sel_system').on('click', function () {
				$('.alert.alert-danger.done,.alert.alert-danger.incomplete').hide();
				if($(this).prop('checked') && parseInt(selProd.qty) === parseInt(selProd.selected))
				{
					$('.alert.alert-danger.done').show();
					return false;
				}
				
				if(!$(this).prop('checked'))
				{
					selProd.selected -= 1;	
					updateSelectedCount();
					($($('[data-id='+$(this).data('id')+']').get(1)).parent().remove());
				}
				else
				{
					var obj = {};
					obj.systemName = $(this).parent().find('label').text().trim();
					obj.id = $(this).data('id');
					$("#selectedList").append(tmpl('selectedTmpl', obj));
					selProd.selected += 1;
					updateSelectedCount();

					// delete selected
					$(".remove-item").on('click', function() {
						var id = $(this).data('id');
						$(this).parent().remove();
						$('[data-id='+id+']').prop('checked', false);	
						selProd.selected -= 1;
						updateSelectedCount();					
					});
				}
			});			

		}
		/*** Step 2 - FIlter functionality ***/
		$('#filter-list').on('keyup', function () {
			var srcText = $.trim($(this).val());
			$('.filter-list li.shown').each(function () {
				if($(this).text().toLowerCase().indexOf(srcText.toLowerCase()) >= 0 )
				{
					$(this).show();
				}
				else
				{
					$(this).hide();
				}
			});
		});

		var updateSelectedCount = function () {
			$("#selCount").text(selProd.selected);
		};

	}
	bindEvents();

	handleSteps = function (argument) {
		var tmplId = typeof argument === 'object' ?  $(argument).data("nextid") : argument.replace('#',''),
		jsonURL;	
		if(tmplId === 'step2')
		{
			// validation if needed & return false if fails
			jsonURL = 'data/systems.json';
			$($("#sidebar a").get(1)).addClass('active');
		}
		else if(tmplId === 'step3'){
			// validation if needed & return false if fails
			$('.alert.alert-danger.incomplete').hide();
			if(parseInt(selProd.qty) !== parseInt(selProd.selected))
			{
				$('.alert.alert-danger.incomplete').show();
				return false;
			}
			jsonURL = 'data/licenses.json';
			$($("#sidebar a").get(2)).addClass('active');
		}

		$('.steps-data').hide();
		$('#wrapper').html(tmpl('loadingTmpl')).show();
		selProd.qty = $(".qty-to-act-picker").not(":disabled").val();
		selProd.id = $(".qty-to-act-picker").not(":disabled").data("prodid");		
		/** update the active step in the side bar **/
		$("#sidebar a").removeClass('active');

		
		/* temp delay to let user know that there is some communication with server */
		setTimeout(function(){
			$.ajax({
				'url': jsonURL,
				'content-type': 'json',
				'success': function(resp){		
					console.log(resp);				
					$('#wrapper').hide();			
					resp.selProdQty = selProd.qty;
					$('#'+tmplId+'-contents').show().html(tmpl(tmplId, {
						resp: resp
					}));
					$(location).attr("hash", "#"+tmplId);// url hashing
					bindEvents();
				}
			});
		}, 999);
	}

	
 
	/** URL hashing across pages for bookmarking and controlling steps via url **/
	if($(location).attr('pathname').indexOf("wizard.html") > 0)
	{
		var hash = $(location).attr("hash");
		
		if (!hash) { $(location).attr("hash", "#step1"); window.location.reload(true); }
		else if(hash === '#step2' || hash === '#step3') handleSteps(hash);
	}
});



