/******************************************************
    * jQuery plug-in
    * Easy Background Image Resizer
    * Developed by J.P. Given (http://johnpatrickgiven.com)
    * Useage: anyone so long as credit is left alone
******************************************************/

/******************************************************
    * Heavily Edited by Tom Huston
******************************************************/

(function($) {
	// Global Namespace
    var jqez = {};

    // Define the plugin
    $.fn.ezBgResize = function(options) {
		
		// Set global to obj passed
		jqez = options;
		
		// If img option is string convert to array.
		// This is in preparation for accepting an slideshow of images.
		if (!$.isArray(jqez.img)) {
			var tmp_img = jqez.img;
			jqez.img = [tmp_img]
		}
		// console.log(jqez.target);
		
/*
		****** Removed Object Creation ****** - TH

		$("<img/>").attr("src", jqez.img).load(function() {
			jqez.width = this.width;
			jqez.height = this.height;
			
			// Create a unique div container
			$("body").append('<div id="jq_ez_bg"></div>');

			// Add the image to it.
			$("#jq_ez_bg").html('<img src="' + jqez.img[0] + '" width="' + jqez.width + '" height="' + jqez.height + '" border="0">');

			// First position object
	        $("#jq_ez_bg").css("visibility","hidden");

			// Overflow set to hidden so scroll bars don't mess up image size.
	        $("body").css({
	            "overflow":"hidden"
	        });
*/
	resizeImage();

    };

	$(window).bind("resize", function() {
		resizeImage();
	});
	
	// Actual resize function
    function resizeImage() {
	
   //      $("#jq_ez_bg").css({
   //          "position":"fixed",
   //          "top":"0px",
   //          "left":"0px",
   //          "z-index":"-1",
   //          "overflow":"hidden",
   //          "width":$(window).width() + "px",
   //          "height":$(window).height() + "px",
   // 		   "opacity" : jqez.opacity
   //      });
		
		// Image relative to its container
	//	$("#jq_ez_bg").children('img').css("position", "relative");

        // Resize the img object to the proper ratio of the window.
        var iw = jqez.width;
        var ih = jqez.height;
        
        if ($(window).width() > $(window).height()) {
            //console.log(iw, ih);
            if (iw > ih) {
                var fRatio = iw/ih;
                
                var imgH = Math.round($(window).width() * (1/fRatio));
                var imgW = $(window).width();

                jqez.target.css({
                	"background-size": imgW + "px " + imgH + "px"
                });

                var newIh = Math.round($(window).width() * (1/fRatio));

                if(newIh < $(window).height()) {
                    var fRatio = ih/iw;
                    var imgH = $(window).height();
                    var imgW = Math.round($(window).height() * (1/fRatio));

                    jqez.target.css({
	                	"background-size": imgW + "px " + imgH + "px"
	                });
                }
            } else {
                var fRatio = ih/iw;
                var imgH = $(window).height();
                var imgW = Math.round($(window).height() * (1/fRatio));

                jqez.target.css({
                	"background-size": imgW + "px " + imgH + "px"
                });
            }
        } else {
            var fRatio = ih/iw;
            var imgH = $(window).height();
            var imgW = Math.round($(window).height() * (1/fRatio));

            jqez.target.css({
	        	"background-size": imgW + "px " + imgH + "px"
	        });
        }
		
		// // Center the image
		// if (typeof(jqez.center) == 'undefined' || jqez.center) {
		// 	if (iw > $(window).width()) {
		// 		var this_left = (iw - $(window).width()) / 2;

		// 		jqez.target.css({
		//         	"background-size": imgW + "px " + imgH + "px"
		//         });

		// 		$("#jq_ez_bg").children('img').css({
		// 			"top"  : 0,
		// 			"left" : -this_left
		// 		});
		// 	}
		// 	if (ih > $(window).height()) {
		// 		var this_height = (ih - $(window).height()) / 2;
		// 		$("#jq_ez_bg").children('img').css({
		// 			"left" : 0,
		// 			"top" : -this_height
		// 		});
		// 	}
		// }

		
        
    }
})(jQuery);