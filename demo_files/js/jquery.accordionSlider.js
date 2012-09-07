/**
 * jQuery.accordionSlider - Drop-in plugin to create an carousel that has accordion-like functionality
 * Copyright (c) 2012 Yury Tilis - ytilis(at)gmail(dot)com | http://ytilis.com
 * Dual licensed under MIT and GPL.
 * Date: 05/23/2012
 * @author      Yury Tilis w/ Matt Lein
 * @employer    LBi
 * @version     1.0
**/

;(function( $ ){

    var defaults = {
        defaultSlide     : 0,
        openWidth        : 680,
        closedWidth   	 : 240,
        collapsedVisible : 150,
        shiftValue       : 25,
		shiftSpeed       : 225,
        shade            : true,
        shadeClass       : 'shade',
		shadeOpacity	 : 0.7, 
        activeClass      : 'active',
        fadeInClass      : 'content-inner',
        speed            : 350,
        fadeSpeed        : 350
    };

    var AccordionSlider = function(element, options){

        this.element = element;
        this.$element = $(element);
        this.options = $.extend( {}, defaults, options );

        this.init();

    };

    AccordionSlider.prototype = {

        init : function( options ) {

            var that = this;
            var opts = that.options;

            var $lis = that.$element.find('li');

            // Initialize the object data
            $.data( this.element, 'accordionSlider', {
                'that'     : that,
                'settings'  : that.options
            });			
			
            $lis
                .each(function(index, ele){

                    $(ele).css({
                        position:   'absolute',
                        top     :   0,
                        left    :   (index * that.options.collapsedVisible) + 'px'
                    }).append("<div class='" + opts.shadeClass + "'></div>");
					
					// Bug fix to prevent it from scrolling the parent to a slide on load
					if(location.hash == '#' + ele.id){		window.scrollTo(0, 0);		}
					
					ele.id = 'as_' + ele.id;
					
                    if( that.$element.find(that.options.activeClass).length === 0 && index == that.options.defaultSlide ){
                        that.showPanel( index );
                    }

                });

            that.$element
                .on('click.accordionSlider', 'li', function(e){

                    var idx = $(this).index();

                    that.showPanel( idx );

                    e.preventDefault();

                })
                .on('mouseenter.accordionSlider', 'li', function(e) {

                    var $hovered = $(this);
                    var active = $hovered.siblings('.' + that.options.activeClass);

                    if( !$hovered.hasClass( that.options.activeClass ) ){
                        if (active.index() > $hovered.index()){
                            active.animate({
                                marginLeft: that.options.shiftValue
                            }, { duration: that.options.shiftSpeed, queue: false });
                        }
                        else {	
                            $hovered.animate({
                                marginLeft: that.options.openWidth - that.options.collapsedVisible - that.options.shiftValue
                            }, { duration: that.options.shiftSpeed, queue: false });
                        }
                    }

                })
                .on('mouseleave.accordionSlider', 'li', function(e) {

                    var $hovered = $(this);
                    var active = $hovered.siblings('.' + that.options.activeClass);
					
                    if ( !$hovered.hasClass(  that.options.activeClass ) ){

                        if(active.index() > $hovered.index()){
                            active.animate({
                                marginLeft: 0
                            }, { duration: that.options.shiftSpeed, queue: false });
                        }
                        else {
                            $hovered.animate({
                                marginLeft: that.options.openWidth - that.options.collapsedVisible
                            }, { duration: that.options.shiftSpeed, queue: false });
                        }

                    }

                });

        },

        destroy : function( ) {

            this.$element.unbind('.accordionSlider');
            $.removeData(this.element, 'accordionSlider');

        },

        showPanel : function( idx ) {

            var settings = this.options;
            var $lis = this.$element.find('li');
            var $this = $lis.eq(idx);

            if( !$($this).hasClass( settings.activeClass ) ){

                var active = $this.siblings('.' + settings.activeClass);
				
                active.find('.' + settings.fadeInClass).stop().fadeOut( settings.fadeSpeed );
                active.children('.' + settings.shadeClass).stop().fadeTo(settings.speed, settings.shadeOpacity);

				$this.siblings().removeClass( settings.activeClass );
                $this.addClass( settings.activeClass );

				parentShift = -( ( $this.index() - 1 ) * settings.collapsedVisible ) - 5;
				
				if( $this.index() == 0 ){
					parentShift = 0;
				} else if( $this.index() == ($lis.length - 1) ){ 
					parentShift += settings.collapsedVisible;
				}
				
                $this.stop().animate({
                    width : settings.openWidth, marginLeft : 0
                }, { duration: settings.speed, queue: false })
					.parent().stop().animate({
						marginLeft : parentShift
					}, { duration: settings.speed, queue: false }).end()
					.nextAll().stop().animate({
						width : settings.closedWidth, marginLeft : settings.openWidth - settings.collapsedVisible
					}, { duration: settings.speed, queue: false }).end()
					.prevAll().stop().animate({
						width : settings.closedWidth, marginLeft : 0
					}, { duration: settings.speed, queue: false });

                $this.find('.' + settings.fadeInClass).stop().fadeIn( settings.fadeSpeed );
                $this.children('.' + settings.shadeClass).stop().fadeOut( settings.speed );

            }
        }

    };



    $.fn.accordionSlider = function(args){

        return this.each(function() {

            // if it doesn't have an existing accordion instance, make a new one
            if ( !$.data(this, 'accordionSlider') ) {
                new AccordionSlider(this, args);

            // if its a number, slide to that panel
            } else if ( typeof args === 'number' ) {
			
                $.data(this, 'accordionSlider').that.showPanel.call( $.data(this, 'accordionSlider').that, args );

            // if its a string, call that method
            } else if ( typeof args === 'string' ) {
                $.data(this, 'accordionSlider').that[args].call( $.data(this, 'accordionSlider').that, args );

            // or error
            } else {
                $.error( 'Method ' +  args + ' does not exist on jQuery.accordionSlider' );
            }

        });

    };


})( jQuery );