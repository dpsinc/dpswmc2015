var Layout = function () {
    var isMobileDevice = function() {
        return  ((
            navigator.userAgent.match(/Android/i) ||
            navigator.userAgent.match(/BlackBerry/i) ||
            navigator.userAgent.match(/iPhone|iPad|iPod/i) ||
            navigator.userAgent.match(/Opera Mini/i) ||
            navigator.userAgent.match(/IEMobile/i)
        ) ? true : false);
    }

    var WindowWidth = $(window).width();
    var WindowHeight = $(window).height();



    var handleParallax = function () {
        $(window).load(function(){
            if (isMobileDevice() === false) {
                $('#contest').parallax("50%", 0.2);
                $('.cutout_people').parallax("50%", 0.4);
                $('#poolparty').parallax("50%", 0.4);
                $('.poolparty_caustics').parallax("50%", -0.1);
                $('.poolparty_beachball').parallax("50%", 0.2);

            }
        });
    }

    var handleScrolling = function () {
        $(".scroll").on("click", function(event) {
            event.preventDefault();//the default action of the event will not be triggered
            $("html, body").animate({scrollTop:($("#"+this.href.split("#")[1]).offset().top)}, 600);
        });
    }

    /* Smooth scrolling and smart navigation when user scrolls on one-page sites */
    var handleNavItemCurrent = function () {
        $(".header-navigation").onePageNav({
            currentClass: "current",
            scrollThreshold: 0,
            filter: ':not(".noNav")'
        });
    }

    var handleHeaderPosition = function () {
        var CurrentHeaderPosition = $(".header").offset().top;// current header's vertical position
        
        var headerFix = function(){
            var CurrentWindowPosition = $(window).scrollTop();// current vertical position
            if (CurrentWindowPosition > CurrentHeaderPosition) {
                $(".header").addClass("fixNav");
            } else {
                $(".header").removeClass("fixNav");
            }
        };

        headerFix();// call headerFix() when the page was loaded
        if (navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
            $(window).bind("touchend touchcancel touchleave", function(e){
                headerFix();
            });
        } else {
            $(window).scroll(function() {
                headerFix();
            });
        }
    }

    var handleGo2Top = function () {       
        var Go2TopOperation = function(){
            var CurrentWindowPosition = $(window).scrollTop();// current vertical position
            if (CurrentWindowPosition > 300) {
                $(".go2top").show();
            } else {
                $(".go2top").hide();
            }
        };

        Go2TopOperation();// call headerFix() when the page was loaded
        if (navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
            $(window).bind("touchend touchcancel touchleave", function(e){
                Go2TopOperation();
            });
        } else {
            $(window).scroll(function() {
                Go2TopOperation();
            });
        }
    }

    var handleMobiToggler = function () {
        $(".mobi-toggler").on("click", function(event) {
            event.preventDefault();//the default action of the event will not be triggered
            
            $(".header").toggleClass("menuOpened");
            $(".header").find(".header-navigation").toggle(300);            
        });

        function SlideUpMenu () {
            $(".header-navigation a").on("click", function(event) {
                if ($(window).width()<1024) {
                    event.preventDefault();//the default action of the event will not be triggered
                    $(".header-navigation").slideUp(100);
                    $(".header").removeClass("menuOpened");
                }
            });
            $(window).scroll(function() {
                if (($(window).width()>480)&&($(window).width()<1024)) {
                    $(".header-navigation").slideUp(100);
                    $(".header").removeClass("menuOpened");
                }
            });
        }
        SlideUpMenu();
        $(window).resize(function() {
            SlideUpMenu();
        });
    }

    var handleMobile = function () {
        var video = $("#hero video"),
            img = $("#hero .video_wrap img");
        if (isMobileDevice() === true) {
                video.hide();
                img.show();

                content = "Game play is not supported on Mobile Devices";

                var modalBody = $("#loginModal .modal-body");
                modalBody.empty();
                modalBody.append("<h1 class='content-center'>"+ content + "</h1>");

        } else {
            img.remove();
        }
    }

    var handleTwitter = function () {
        !function(d,s,id) {
                var js,
                    fjs=d.getElementsByTagName(s)[0],
                    p=/^http:/.test(d.location)?'http':'https';
                if(!d.getElementById(id)){
                    js=d.createElement(s);
                    js.id=id;
                    js.src=p+"://platform.twitter.com/widgets.js";
                    fjs.parentNode.insertBefore(js,fjs);
                }
            }(document,"script","twitter-wjs");
    }  
        
    function valignCenterMessageFunction () {
         MessageCurrentElemHeight = $(".message-block .valign-center-elem").height();

        $(".message-block .valign-center-elem").css("position", "absolute")
            .css ("top", "50%")
            .css ("margin-top", "-"+MessageCurrentElemHeight/2+"px")
            .css ("width", "100%")
            .css ("height", MessageCurrentElemHeight);
    }

    function valignCenterPortfolioFunction () {
         PortfolioCurrentElemHeight = $(".portfolio-block .valign-center-elem").height();

        $(".portfolio-block .valign-center-elem").css("position", "absolute")
            .css ("top", "50%")
            .css ("margin-top", "-"+PortfolioCurrentElemHeight/2+"px")
            .css ("width", "100%")
            .css ("height", PortfolioCurrentElemHeight);
    }

    var valignCenterMessage = function () {
        valignCenterMessageFunction();
        $(window).resize(function() {
            valignCenterMessageFunction();
        });
    }
    var valignCenterPortfolio = function () {
        valignCenterPortfolioFunction();
        $(window).resize(function() {
            valignCenterPortfolioFunction();
        });
    }


    var nextNav = function () {
        $('body').on('click', '[data-anchor-role]', function() {
            var anchorRole = $(this).data('anchor-role');
            if (anchorRole = "next") {
                var href = $(this).data('anchor-dest');
                var listItem = $('a[href="#' + href + '"]');
                listItem.click();
                return false;
            }
        });
    }

    var resize = function (){

        if (isMobileDevice() === false) {
            resizeAll();

            $(window).bind("resize", function() {
              resizeAll();
            });

            function resizeAll () {
                var WindowHeight = $(window).height();
                var WindowWidth = $(window).width();
                $("#hero, #hero .background_wrap, #contest, #poolparty").each(function () {
                    $(this).height(WindowHeight);
                });

                $("#contest, #poolparty, .poolparty_caustics, .poolparty_beachball, .cutout_people").each(function () {
                    image  = $(this).css('background-image');
                    $(this).ezBgResize({
                        img     : image,
                        width   : $(this).data("bkg-width"),
                        height   : $(this).data("bkg-height"),
                        target  : $(this)
                    });
                });
            }
        };
    }

    return {
        init: function () {
            handleMobile();
            resize();
            nextNav();
            handleParallax();
            handleScrolling();
            handleNavItemCurrent();
            handleHeaderPosition();
            handleGo2Top();
            handleMobiToggler();
            handleTwitter();
            valignCenterMessage();
            valignCenterPortfolio();
        },
    };
}();