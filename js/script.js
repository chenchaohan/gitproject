

$(document).ready(function() {
	
	// IE 10 only CSS properties
	var ie10Styles = [
	'msTouchAction',
	'msWrapFlow'];
	
	var ie11Styles = [
	'msTextCombineHorizontal'];
	
	/*
	* Test all IE only CSS properties
	*/
	
	var d = document;
	var b = d.body;
	var s = b.style;
	var brwoser = null;
	var property;
	
	// Tests IE10 properties
	for (var i = 0; i <ie10Styles.length; i++) {
		property = ie10Styles[i];
		if (s[property] != undefined) {
			brwoser = "ie10";
		}
	}
	
	// Tests IE11 properties
	for (var i = 0; i <ie11Styles.length; i++) {
		property = ie11Styles[i];
		if (s[property] != undefined) {
			brwoser = "ie11";
		}
	}
	
	 //Grayscale images only on browsers IE10+ since they removed support for CSS grayscale filter
	 if(brwoser == "ie10" || brwoser == "ie11" ){
		$('body').addClass('ie11'); // Fixes marbin issue on IE10 and IE11 after canvas function on images
		$('.thumbnails img').each(function(){
			var el = $(this);
			el.css({"position":"absolute"}).wrap("<div class='img_wrapper' style='display: inline-block'>").clone().addClass('img_grayscale ieImage').css({"position":"absolute","z-index":"5"}).insertBefore(el).queue(function(){
				var el = $(this);
				el.parent().css({"width":this.width,"height":this.height});
				el.dequeue();
			});
			this.src = grayscaleIe(this.src);
		});
	
		// Custom grayscale function for IE10 and IE11
		function grayscaleIe(src){
			var canvas = document.createElement('canvas');
			var ctx = canvas.getContext('2d');
			var imgObj = new Image();
			imgObj.src = src;
			canvas.width = imgObj.width;
			canvas.height = imgObj.height; 
			ctx.drawImage(imgObj, 0, 0); 
			var imgPixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
			for(var y = 0; y <imgPixels.height; y++){
				for(var x = 0; x <imgPixels.width; x++){
					var i = (y * 4) * imgPixels.width + x * 4;
					var avg = (imgPixels.data[i] + imgPixels.data[i + 1] + imgPixels.data[i + 2]) / 3;
					imgPixels.data[i] = avg; 
					imgPixels.data[i + 1] = avg; 
					imgPixels.data[i + 2] = avg;
				}
			}
			ctx.putImageData(imgPixels, 0, 0, 0, 0, imgPixels.width, imgPixels.height);
			return canvas.toDataURL();
		};
	 };
   
	var CT = null;
	var VIDEO_URL = 'videos/Lexus.mp4-SD.mp4';
	var TIMEOUT = 10000;
	var SCREEN_WIDTH = 1920;
	
	/* adjust zoom on page load depending on browser width */
    adJustZoom();
    
    $(window).on("resize", function () {
        adJustZoom();
    });
    
    /* adjusts zoom level on browser resizing depending on aspect ratio */
    function adJustZoom() {
		var windowWidth = window.innerWidth;
		var zoom = (windowWidth)/SCREEN_WIDTH;
		$('.wrapper').css({
			'-moz-transform' : 'scale('+zoom+')',
			'zoom': zoom
		});	
    }
	
	/* gallery plugin */
	(function($) {
		$.extend($.fn,{
			gallery: function(){
				/* default options */
				var active_index = 0;
				var ui = this;				
				//Data
				var data = [
					{
						"title": "Ford",
						"thumb": "thumb-Ford.jpg",
						"logo": "logo-Ford.png",
						"text": "Ford Mustang Friends &amp; Neighbors pricing events"	
					},
					{
						"title": "AMC",
						"thumb": "thumb-TWD.jpg",
						"logo": "logo-AMC.png",
						"text": "The Walking Dead Season 6 Premiere on amc® October 14 Sundays 9P"	
					},
					{
						"title": "Geico",
						"thumb": "thumb-Geico.jpg",
						"logo": "logo-Geico.png",
						"text": "You could save money. Plain and simple.",
						"small": true
					},
					{
						"title": "Phantom drone",
						"thumb": "thumb-Phantom-drone.jpg",
						"logo": "logo-Phantom-drone.png",
						"text": "The New Phantom 3 Professional Flying Drone",
						"small": true	
					},
					{
						"title": "Subway",
						"thumb": "thumb-Subway.jpg",
						"logo": "logo-Subway.png",
						"text": "Save time and order online!",
						"small": true	
					},
					{
						"title": "T-mobile",
						"thumb": "thumb-T-mobile.jpg",
						"logo": "logo-T-mobile.png",
						"text": "This month promo unlimited talk, text &amp; data for $50<span class='sub'>/mo.</span>",
						"small": true	
					},
					{
						"title": "TAGHeuer",
						"thumb": "thumb-tag-heuer.jpg",
						"logo": "logo-tag-heuer.png",
						"text": "The Worldwide Leader in Luxury Sports Watches &amp; Chronographs."	
					}
				];
				//random the data
				var shuffle = function(array) {
					var new_array = array.slice();
					var currentIndex = new_array.length, temporaryValue, randomIndex;
					// While there remain elements to shuffle...
					while (0 !== currentIndex) {
						// Pick a remaining element...
						randomIndex = Math.floor(Math.random() * currentIndex);
						currentIndex -= 1;
						// And swap it with the current element.
						temporaryValue = new_array[currentIndex];
						new_array[currentIndex] = new_array[randomIndex];
						new_array[randomIndex] = temporaryValue;
					}
					return new_array;
				};
				var data_selected_category = shuffle(data);
				var data_recents = shuffle(data);
				var data_my_favories = shuffle(data);
				var data_default = shuffle(data);
				var length = data.length;
				//load data to create gallery
				var build = function(array){
					var row,UL  = $('<ul>'),LI,small_LI,class_name;
					var j = 0;
					$(ui).empty();
					array.forEach(function(val,i){
						val.small ? class_name = 'row-2': class_name = '';
						row = "<div class='thumb-item "+ class_name +"' data-target-role='"+ val.title +"'>"
							  +"<img src='i/"+ val.thumb +"' alt='"+ val.title +"' />"
							  +"<div class='contest'>"
							  +"<div class='table'>"
							  +"<div class='table-cell'>"
							  +"<div class='logo'><img src='i/"+ val.logo +"' alt='"+ val.title +"' /></div>"
							  +"<p>"+ val.text +"</p>"
							  +"<div class='btn btn-default'>View</div>"
							  +"</div>"
                              +"</div>"
                              +"</div>"
                              +"</div>";
						if(val.small){
							j++;
							if(j%2){
								small_LI = $('<li></li>').append(row);	
							}else{
								small_LI.append(row);
								UL.append(small_LI);
							}
						}else{
							LI = $('<li></li>').append(row);
							UL.append(LI);
						}
					});
					$(ui).append(UL);
					$(ui).find('.thumb-item').each(function(i,e){
                       $(e).data('gallery-index',i+1); 
                    });
					reset();
				};
				//set the gallery active
				var setActive = function(index){
					$(ui).find('.thumb-item').removeClass('active');
					$(ui).find('.thumb-item').each(function(i,val){
						if($(this).data('gallery-index') === index){
							$(this).addClass('active');	
						}
					});
				};
				//set active by index
				var setIndex = function(index){
					active_index = index;
					setActive(index);	
				};
				//get the active gallery position
				var getOffsetX = function(item){
					if(item.length){
						return item.offset().left;
					}
				};
				//set the position of gallery
				var setPosition = function(){
					var windowWidth = window.innerWidth;
        			var zoom = (windowWidth)/SCREEN_WIDTH;
					var slider = $(ui).find('ul');
					var slider_active = slider.find('.thumb-item.active');
					var transformX = parseInt(slider.css('transform').split(',')[4]);
					var slider_margin = parseInt(slider.find('.thumb-item').css('margin-right'));
					var slider_active_position = (getOffsetX(slider_active) + slider_active.width() - transformX)*zoom;
					var offsetX = slider_active_position - SCREEN_WIDTH*0.9*zoom;
					if(slider_active_position > windowWidth){
						slider.css({
							'transform' : 'translate('+(-offsetX/zoom)+'px)'
						});
					}else{
						slider.css({
							'transform' : 'translate(0px)'
						});	
					};
				};
				//reset the gallery
				var reset = function(){
					setIndex(0);
					setPosition();
				};
				//accept the keyboard
				var acceptKey = function(key){
					switch(key){
						/* keyboard on enter key */
						case 13:
							var _tagert = $('.gallery .active').data('target-role');
							setTimeout(function(){
								if($('.wrapper[data-role="'+ _tagert +'"]').length){
									$('.wrapper').removeClass('active');
									$('.wrapper[data-role="'+ _tagert +'"]').addClass('active');
									build(data);
								}
							},0);
							break;
						/* keyboard on left key */
						case 37:
							active_index === 0 ? active_index = 1 : active_index > 1 ? active_index = --active_index : active_index = active_index;
							break;
						/* keyboard on up key */
						case 38:
							active_index === 0 ? active_index = 1 : active_index = 0;
							break;
						/* keyboard on right key */
						case 39:
							active_index === 0 ? active_index = 1 : active_index < length ? active_index = ++active_index : active_index = active_index;
							break;
						/* keyboard on down key */
						case 40:
							active_index === 0 ? active_index = 1 : active_index = 0;
							break;
					}
					setIndex(active_index);
					setPosition();
				};
				//bind keyboard keydown
				$('body').bind('keydown', function(e) {
					var key = e.which;
					/* handlekeys called only when A/B/C/D keys are pressed */
					if($('.wrapper[data-role="Index"]').hasClass('active')){
						switch(key){
							case 65:
								e.preventDefault();
								build(data_selected_category);
								$('.gallery-title').text('Selected Category');
								break;
							case 66:
								e.preventDefault();
								build(data_recents);
								$('.gallery-title').text('Recents');
								break;
							case 67:
								e.preventDefault();
								build(data_my_favories);
								$('.gallery-title').text('My Favories');
								break;
							case 68:
								e.preventDefault();
								build(data_default);
								$('.gallery-title').text('Defalut');
								break;	
						}
						/* handlekeys called only when left/right keys are pressed */
						if(key === 13 || key === 37 || key === 38 || key === 39 || key === 40) {
							e.preventDefault();
							acceptKey(key);
						}
					}
				}); 
				build(data);
			}
		});
	})(jQuery);
	
	//init gallery on index page
	$('.gallery').gallery();
	
	//deal with the keyboard for Ford
	(function($) {
		$.extend($.fn,{
			fordKeyboard: function(){
				var ui = this;
				var martix = [0,0];
				//set focus when user key press left/right/up/down
				var setFocus = function(){
					$(ui).find('[data-matrix]').each(function(i,e) {
						$(e).removeClass('focus');
                        if($($(e).data('matrix')).not(martix).length === 0 && $(martix).not($(e).data('matrix')).length === 0){
							$(e).addClass('focus');
						}
                    });
				};
				//reset the plugin
				var reset = function(){
					martix = [0,0];
					$(ui).find('.focus').removeClass('focus');
				};
				//accept the keyboard
				var acceptKey = function(key) {
					switch(key){
						/* keyboard on enter key */
						case 13:
							var _tagert = $(ui).find('.focus').data('target-role');
							setTimeout(function(){
								if($('.wrapper[data-role="'+ _tagert +'"]').length){
									$('.wrapper').removeClass('active');
									$('.wrapper[data-role="'+ _tagert +'"]').addClass('active');
									reset();
								}
							},0);
							break;
						/* keyboard on left key */
						case 37:
							(martix[0] === 0 && martix[1] === 0) ? martix = [1,0] : martix[0] <= 1 ? martix : martix[1] !== 0 ? martix : --martix[0];
							break;
						/* keyboard on up key */
						case 38:
							(martix[0] === 0 && martix[1] === 0) ? martix = [1,0] : martix[1] === -1 ? martix  : --martix[1];
							martix[0] = 1;
							break;
						/* keyboard on right key */
						case 39:
							(martix[0] === 0 && martix[1] === 0) ? martix = [1,0] : martix[0] >= 2 ? martix : martix[1] !== 0 ? martix : ++martix[0];
							break;
						/* keyboard on down key */
						case 40:
							(martix[0] === 0 && martix[1] === 0) ? martix = [1,0] : martix[1] === 1 ? martix : ++martix[1];
							martix[0] = 1;
							break;	
					}
					setFocus();
				};
				//bind keyboard keydown
				$('body').bind('keydown', function(e) {
					var key = e.which;
					if($('.wrapper[data-role="Ford"]').hasClass('active')){
						/* handlekeys called only when A/B/C/D keys are pressed */
						switch(key){
							case 65:
								e.preventDefault();
								var _target = $(ui).find('.icon-btn-a').data('target-role');
								setTimeout(function(){
									$('.wrapper').removeClass('active');
									$('.wrapper[data-role="'+ _target +'"]').addClass('active');
									reset();
								},0);
								break;
							case 66:
								e.preventDefault();
								var _target = $(ui).find('.icon-btn-b').data('target-role');
								setTimeout(function(){
									$('.wrapper').removeClass('active');
									$('.wrapper[data-role="'+ _target +'"]').addClass('active');
									reset();
								},0);
								break;
							case 67:
								e.preventDefault();
								if($('.wrapper.active').find('.links-favor').hasClass('on')){
									$('.wrapper.active').find('.links-favor').removeClass('on');
								}else{
									$('.wrapper.active').find('.links-favor').addClass('on');	
								}
								break;
							case 68:
								e.preventDefault();
								var _target = $(ui).find('.icon-btn-d').data('target-role');
								setTimeout(function(){
									$('.wrapper').removeClass('active');
									$('.wrapper[data-role="'+ _target +'"]').addClass('active');
									reset();
								},0);
								break;	
						}
						/* handlekeys called only when left/right keys are pressed */
						if(key === 13 || key === 37 || key === 38 || key === 39 || key === 40) {
							e.preventDefault();
							acceptKey(key);
						}
					}
				}); 	
			}
		});
	})(jQuery);
	//ford section
	$('[data-role="Ford"]').fordKeyboard();
	
	//deal with the keyboard for AMC
	(function($) {
		$.extend($.fn,{
			amcKeyboard: function(){
				var ui = this;
				var martix = [0,0];
				//set focus when user key press left/right/up/down
				var setFocus = function(){
					$(ui).find('[data-matrix]').each(function(i,e) {
						$(e).removeClass('focus');
                        if($($(e).data('matrix')).not(martix).length === 0 && $(martix).not($(e).data('matrix')).length === 0){
							$(e).addClass('focus');
						}
                    });
				};
				//reset the plugin
				var reset = function(){
					martix = [0,0];
					$(ui).find('.focus').removeClass('focus');
				};
				//accept the keyboard
				var acceptKey = function(key) {
					switch(key){
						/* keyboard on enter key */
						case 13:
							var _tagert = $(ui).find('.focus').data('target-role');
							setTimeout(function(){
								if($('.wrapper[data-role="'+ _tagert +'"]').length){
									$('.wrapper').removeClass('active');
									$('.wrapper[data-role="'+ _tagert +'"]').addClass('active');
									reset();
								}
							},0);
							break;
						/* keyboard on left key */
						case 37:
							(martix[0] === 0 && martix[1] === 0) ? martix = [1,0] : martix[0] <= 1 ? martix : martix[1] !== 0 ? martix : --martix[0];
							break;
						/* keyboard on up key */
						case 38:
							(martix[0] === 0 && martix[1] === 0) ? martix = [1,0] : martix[1] === -1 ? martix  : --martix[1];
							martix[0] = 1;
							break;
						/* keyboard on right key */
						case 39:
							(martix[0] === 0 && martix[1] === 0) ? martix = [1,0] : martix[0] >= 2 ? martix : martix[1] !== 0 ? martix : ++martix[0];
							break;
						/* keyboard on down key */
						case 40:
							(martix[0] === 0 && martix[1] === 0) ? martix = [1,0] : martix[1] === 1 ? martix : ++martix[1];
							martix[0] = 1;
							break;	
					}
					setFocus();
				};
				//bind keyboard keydown
				$('body').bind('keydown', function(e) {
					var key = e.which;
					if($('.wrapper[data-role="AMC"]').hasClass('active')){
						/* handlekeys called only when A/B/C/D keys are pressed */
						switch(key){
							case 65:
								e.preventDefault();
								var _target = $(ui).find('.icon-btn-a').data('target-role');
								setTimeout(function(){
									$('.wrapper').removeClass('active');
									$('.wrapper[data-role="'+ _target +'"]').addClass('active');
									reset();
								},0);
								break;
							case 66:
								e.preventDefault();
								var _target = $(ui).find('.icon-btn-b').data('target-role');
								setTimeout(function(){
									$('.wrapper').removeClass('active');
									$('.wrapper[data-role="'+ _target +'"]').addClass('active');
									reset();
								},0);
								break;
							case 67:
								e.preventDefault();
								if($('.wrapper.active').find('.links-favor').hasClass('on')){
									$('.wrapper.active').find('.links-favor').removeClass('on');
								}else{
									$('.wrapper.active').find('.links-favor').addClass('on');	
								}
								break;
							case 68:
								e.preventDefault();
								var _target = $(ui).find('.icon-btn-d').data('target-role');
								setTimeout(function(){
									$('.wrapper').removeClass('active');
									$('.wrapper[data-role="'+ _target +'"]').addClass('active');
									reset();
								},0);
								break;	
						}
						/* handlekeys called only when left/right keys are pressed */
						if(key === 13 || key === 37 || key === 38 || key === 39 || key === 40) {
							e.preventDefault();
							acceptKey(key);
						}
					}
				}); 	
			}
		});
	})(jQuery);
	//AMC section
	$('[data-role="AMC"]').amcKeyboard();
	
	//deal with the keyboard for Subway
	(function($) {
		$.extend($.fn,{
			subwayKeyboard: function(){
				var ui = this;
				var martix = [0,0];
				var VIDEO = $(ui).find('video');
				var NEXTADS = $(ui).find('.next-ads');
				//set focus when user key press left/right/up/down
				var setFocus = function(){
					$(ui).find('[data-matrix]').each(function(i,e) {
						$(e).removeClass('focus');
                        if($($(e).data('matrix')).not(martix).length === 0 && $(martix).not($(e).data('matrix')).length === 0){
							$(e).addClass('focus');
						}
                    });
					if(martix[0] < 2){
						$('.thumbnails li:first-child').addClass('focus');
					}
				};
				//reset the plugin
				var reset = function(){
					martix = [0,0];
					$(ui).find('.focus').removeClass('focus');
					setFocus();
				};
				//accept the keyboard
				var acceptKey = function(key) {
					switch(key){
						/* keyboard on enter key */
						case 13:
							var _tagert = $(ui).find('.focus').data('target-role');
							setTimeout(function(){
								if($('.wrapper[data-role="'+ _tagert +'"]').length){
									$('.wrapper').removeClass('active');
									$('.wrapper[data-role="'+ _tagert +'"]').addClass('active');
									reset();
								}
							},0);
							break;
						/* keyboard on left key */
						case 37:
							(martix[0] === 0 && martix[1] === 0) ? martix = [1,0] : martix[0] <= 1 ? martix : martix[1] !== 0 ? martix : --martix[0];
							if(martix[0] > 1 && martix[0] < 6){
								VIDEO.get(0).src  = VIDEO_URL;
								VIDEO.get(0).load();
								VIDEO.get(0).play();
							}
							break;
						/* keyboard on up key */
						case 38:
							(martix[0] === 0 && martix[1] === 0) ? martix = [1,0] : martix[1] === -1 ? martix  : --martix[1];
							martix[0] = 1;
							break;
						/* keyboard on right key */
						case 39:
							(martix[0] === 0 && martix[1] === 0) ? martix = [1,0] : martix[0] >= 5 ? martix : martix[1] !== 0 ? martix : ++martix[0];
							if(martix[0] > 1 && martix[0] < 6){
								VIDEO.get(0).src  = VIDEO_URL;
								VIDEO.get(0).load();
								VIDEO.get(0).play();
							}
							break;
						/* keyboard on down key */
						case 40:
							(martix[0] === 0 && martix[1] === 0) ? martix = [1,0] : martix[1] === 0 ? martix : ++martix[1];
							martix[0] = 1;
							break;	
					}
					setFocus();
				};
				//bind keyboard keydown
				$('body').bind('keydown', function(e) {
					var key = e.which;
					if($('.wrapper[data-role="Subway"]').hasClass('active')){
						/* handlekeys called only when A/B/C/D keys are pressed */
						switch(key){
							case 65:
								e.preventDefault();
								var _target = $(ui).find('.icon-btn-a').data('target-role');
								setTimeout(function(){
									$('.wrapper').removeClass('active');
									$('.wrapper[data-role="'+ _target +'"]').addClass('active');
									reset();
								},0);
								break;
							case 66:
								e.preventDefault();
								var _target = $(ui).find('.icon-btn-b').data('target-role');
								setTimeout(function(){
									$('.wrapper').removeClass('active');
									$('.wrapper[data-role="'+ _target +'"]').addClass('active');
									reset();
								},0);
								break;
							case 67:
								e.preventDefault();
								if($('.wrapper.active').find('.links-favor').hasClass('on')){
									$('.wrapper.active').find('.links-favor').removeClass('on');
								}else{
									$('.wrapper.active').find('.links-favor').addClass('on');	
								}
								break;
							case 68:
								e.preventDefault();
								var _target = $(ui).find('.icon-btn-d').data('target-role');
								setTimeout(function(){
									$('.wrapper').removeClass('active');
									$('.wrapper[data-role="'+ _target +'"]').addClass('active');
									reset();
								},0);
								break;	
						}
						/* handlekeys called only when left/right keys are pressed */
						if(key === 13 || key === 37 || key === 38 || key === 39 || key === 40) {
							e.preventDefault();
							acceptKey(key);
						}
					}
				}); 	
			}
		});
	})(jQuery);
	//AMC section
	$('[data-role="Subway"]').subwayKeyboard();
	
	//deal with the keyboard for Ford Alternative
	(function($) {
		$.extend($.fn,{
			alternativeKeyboard: function(){
				var ui = this;
				var martix = [0,0];
				//set focus when user key press left/right/up/down
				var setFocus = function(){
					$(ui).find('[data-matrix]').each(function(i,e) {
						$(e).removeClass('focus');
                        if($($(e).data('matrix')).not(martix).length === 0 && $(martix).not($(e).data('matrix')).length === 0){
							$(e).addClass('focus');
						}
                    });
				};
				//reset the plugin
				var reset = function(){
					martix = [0,0];
					$(ui).find('.focus').removeClass('focus');
				};
				//accept the keyboard
				var acceptKey = function(key) {
					switch(key){
						/* keyboard on enter key */
						case 13:
							var _tagert = $(ui).find('.focus').data('target-role');
							setTimeout(function(){
								if($('.wrapper[data-role="'+ _tagert +'"]').length){
									$('.wrapper').removeClass('active');
									$('.wrapper[data-role="'+ _tagert +'"]').addClass('active');
									reset();
								}
							},0);
							break;
						/* keyboard on left key */
						case 37:
							(martix[0] === 0 && martix[1] === 0) ? martix = [1,0] : martix[0] <= 1 ? martix : martix[1] !== 0 ? martix : --martix[0];
							break;
						/* keyboard on up key */
						case 38:
							(martix[0] === 0 && martix[1] === 0) ? martix = [1,0] : martix[1] === -1 ? martix  : --martix[1];
							martix[0] = 1;
							break;
						/* keyboard on right key */
						case 39:
							(martix[0] === 0 && martix[1] === 0) ? martix = [1,0] : martix[0] >= 2 ? martix : martix[1] !== 0 ? martix : ++martix[0];
							break;
						/* keyboard on down key */
						case 40:
							(martix[0] === 0 && martix[1] === 0) ? martix = [1,0] : martix[1] === 0 ? martix : ++martix[1];
							break;	
					}
					setFocus();
				};
				//bind keyboard keydown
				$('body').bind('keydown', function(e) {
					var key = e.which;
					if($('.wrapper[data-role="Ford-Alternative"]').hasClass('active')){
						/* handlekeys called only when A/B/C/D keys are pressed */
						switch(key){
							case 65:
								e.preventDefault();
								var _target = $(ui).find('.icon-btn-a').data('target-role');
								setTimeout(function(){
									$('.wrapper').removeClass('active');
									$('.wrapper[data-role="'+ _target +'"]').addClass('active');
									reset();
								},0);
								break;
							case 67:
								e.preventDefault();
								if($('.wrapper.active').find('.links-favor').hasClass('on')){
									$('.wrapper.active').find('.links-favor').removeClass('on');
								}else{
									$('.wrapper.active').find('.links-favor').addClass('on');	
								}
								break;
							case 68:
								e.preventDefault();
								var _target = $(ui).find('.icon-btn-d').data('target-role');
								setTimeout(function(){
									$('.wrapper').removeClass('active');
									$('.wrapper[data-role="'+ _target +'"]').addClass('active');
									reset();
								},0);
								break;	
						}
						/* handlekeys called only when left/right keys are pressed */
						if(key === 13 || key === 37 || key === 38 || key === 39 || key === 40) {
							e.preventDefault();
							acceptKey(key);
						}
					}
				}); 	
			}
		});
	})(jQuery);
	//ford section
	$('[data-role="Ford-Alternative"]').alternativeKeyboard();
	
	//deal with the keyboard for Find Out More
	(function($) {
		$.extend($.fn,{
			moreKeyboard: function(){
				var ui = this;
				var martix = [0,0];
				//set focus when user key press left/right/up/down
				var setFocus = function(){
					$(ui).find('[data-matrix]').each(function(i,e) {
						$(e).removeClass('focus');
                        if($($(e).data('matrix')).not(martix).length === 0 && $(martix).not($(e).data('matrix')).length === 0){
							$(e).addClass('focus');
							if($(e).hasClass('links-close')){
								$('html,body').scrollTop({
									scrollTop: 0
								},100);
							}else{
								$('html,body').animate({
									scrollTop: $(e).offset().top
								},100);
							}
						}
                    });
				};
				//reset the plugin
				var reset = function(){
					martix = [0,0];
					$(ui).find('.focus').removeClass('focus');
				};
				//accept the keyboard
				var acceptKey = function(key) {
					switch(key){
						/* keyboard on enter key */
						case 13:
							var _tagert = $(ui).find('.focus').data('target-role');
							setTimeout(function(){
								if($('.wrapper[data-role="'+ _tagert +'"]').length){
									$('.wrapper').removeClass('active');
									$('.wrapper[data-role="'+ _tagert +'"]').addClass('active');
									reset();
								}
							},0);
							break;
						/* keyboard on left key */
						case 37:
							(martix[0] === 0 && martix[1] === 0) ? martix = [1,0] : martix[0] <= 1 ? martix : martix[1] !== 0 ? martix : --martix[0];
							break;
						/* keyboard on right key */
						case 39:
							(martix[0] === 0 && martix[1] === 0) ? martix = [1,0] : martix[0] >= 6 ? martix : martix[1] !== 0 ? martix : ++martix[0];
							break;
					}
					setFocus();
				};
				//bind keyboard keydown
				$('body').bind('keydown', function(e) {
					var key = e.which;
					if($('.wrapper[data-role="Find-Out-More"]').hasClass('active')){
						/* handlekeys called only when left/right keys are pressed */
						if(key === 13 || key === 37 || key === 39) {
							e.preventDefault();
							acceptKey(key);
						}
					}
				}); 	
			}
		});
	})(jQuery);
	//ford section
	$('[data-role="Find-Out-More"]').moreKeyboard();
	
	//add listener to wrapper element
	var $div = $(".wrapper");
	var observer = new MutationObserver(function(mutations) {
		mutations.forEach(function(mutation) {
			var VIDEO = $(mutation.target).find('video');
			if(mutation.attributeName === 'class'){
				//stop video
				if(VIDEO.length){
					VIDEO.get(0).src = '#';
				}
				//play video when screen is visiable
				if($(mutation.target).hasClass('active')){
					if(VIDEO.length && VIDEO.get(0).src !== VIDEO_URL){
						VIDEO.get(0).src  = VIDEO_URL;
						VIDEO.get(0).load();
						VIDEO.get(0).play();
					}
					if($(mutation.target).find('.next-ads').length){
						if(CT){
							clearTimeout(CT);	
						}
						$(mutation.target).find('.next-ads').removeClass('visible');
						CT = setTimeout(function(){
							$(mutation.target).find('.next-ads').addClass('visible');
							VIDEO.get(0).pause();
						},TIMEOUT);
					}
				}
			}
		});
	});
	
	$.each($div,function(i,v){
		observer.observe(v, {
			attributes: true,
			attributeOldValue: true
		});	
	});
    
});

