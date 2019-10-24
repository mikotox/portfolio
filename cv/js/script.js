(function($) {
    "use strict";

    // Windows load

    $(window).on("load", function() {

        // Site loader 

        $(".loader-inner").fadeOut();
        $(".loader").delay(200).fadeOut("slow");

    });


    // Gradient animation

    var granimInstance = new Granim({
        element: '.gradient-hero',
        direction: 'diagonal',
        opacity: [.7, .7, .7],
        isPausedWhenNotInView: true,
        states: {
            "default-state": {
                gradients: [
                    ['#4e93e6', '#864be3'],
                    ['#864be3', '#4e93e6']
                ],
                transitionSpeed: 2000
            }
        }
    });


    var granimInstance = new Granim({
        element: '.gradient-footer',
        direction: 'diagonal',
        opacity: [.7, .7, .7],
        isPausedWhenNotInView: true,
        states: {
            "default-state": {
                gradients: [
                    ['#4e93e6', '#864be3'],
                    ['#864be3', '#4e93e6']
                ],
                transitionSpeed: 2000
            }
        }
    });


    // Site hero setup

    function mainHeroResize() {
        $(".hero.index").css('height', $(window).height());
    }

    $(function() {
            mainHeroResize()
        }),
        $(window).resize(function() {
            mainHeroResize()
        });


    // Append images as css background

    $('.background-img').each(function() {
        var path = $(this).children('img').attr('src');
        $(this).css('background-image', 'url("' + path + '")').css('background-position', 'initial');
    });


    // Site slider 

    $("#testimonial-carousel, #services-carousel").owlCarousel({
        navigation: false,
        slideSpeed: 300,
        paginationSpeed: 400,
        responsiveRefreshRate: 200,
        responsiveBaseWidth: window,
        pagination: true,
        autoPlay: true,
        singleItem: true
    });


    $("#client-carousel").owlCarousel({
        items: 6,
        itemsDesktop: [1199, 4],
        itemsDesktopSmall: [979, 4],
        itemsTablet: [768, 3],
        itemsTabletSmall: [550, 1],
        itemsMobile: [480, 2],
        pagination: false,
        autoPlay: true
    });


    // Skills bar 

    $(".percentage").each(function() {
        var height = $(this).text();
        $(this).css("height", height);

    });


    // Scroll top

    $('a.scroll').smoothScroll({
        speed: 800,
        offset: 0
    });


    // Portfolio setup 

    $('.venobox').venobox({
        titleattr: 'data-title',
        numeratio: true
    });


    $('.filter').on("click", "li a", function() {

        $(this).addClass('active');
        $(this).parent().siblings().find('a').removeClass('active');

        var filters = $(this).attr('data-filter');
        $(this).closest('.works').find('.box.work').removeClass('disable');

        if (filters !== 'all') {
            var selected = $(this).closest('.works').find('.box.work');
            for (var i = 0; i < selected.length; i++) {

                if (!selected.eq(i).hasClass(filters)) {
                    selected.eq(i).addClass('disable');
                }

            }

        }

        return false;

    });


    // Form validation 

    var inputName = $('input#name');
    var inputEmail = $('input#email');
    var textArea = $('textarea#message');
    var contactForm = $('.contact-form');


    $('.submit').on("click", function() {

        inputName.removeClass("errorForm");
        textArea.removeClass("errorForm");
        inputEmail.removeClass("errorForm");

        var error = false;
        var name = inputName.val();
        if (name === "" || name === " ") {
            error = true;
            inputName.addClass("errorForm");
        }


        var msg = textArea.val();
        if (msg === "" || msg === " ") {
            error = true;
            textArea.addClass("errorForm");

        }

        var email_compare = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i;
        var email = inputEmail.val();
        if (email === "" || email === " ") {
            inputEmail.addClass("errorForm");
            error = true;
        } else if (!email_compare.test(email)) {
            inputEmail.addClass("errorForm");
            error = true;
        }

        if (error === true) {
            return false;
        }

        var data_string = contactForm.serialize();

        $.ajax({
            type: "POST",
            url: contactForm.attr('action'),
            data: data_string,

            success: function(message) {
                if (message === 'SENDING') {
                    $('.success').fadeIn('slow');
                } else {
                    $('.error').fadeIn('slow');
                }
            }

        });

        return false;
    });



    // Map Location

    var styles = [{
            stylers: [{
                    saturation: -100
                }

            ]
        }, {
            featureType: 'road',
            elementType: 'geometry',
            stylers: [{
                hue: "#74b7b0"
            }, {
                visibility: 'simplified'
            }]
        }, {
            featureType: 'road',
            elementType: 'labels',
            stylers: [{
                visibility: 'on'
            }]
        }],

        lat = -33.867490,
        lng = 151.20699,




        customMap = new google.maps.StyledMapType(styles, {
            name: 'Styled Map'
        }),


        mapOptions = {
            zoom: 14,
            scrollwheel: false,
            disableDefaultUI: true,
            center: new google.maps.LatLng(lat, lng),
            mapTypeControlOptions: {
                mapTypeIds: [google.maps.MapTypeId.ROADMAP]
            }
        },
        map = new google.maps.Map(document.getElementById('block-map'), mapOptions),
        myLatlng = new google.maps.LatLng(lat, lng),

        marker = new google.maps.Marker({
            position: myLatlng,
            map: map,
            icon: {
                url: 'img/marker.png',
                scaledSize: new google.maps.Size(90, 90)
            }
        });


    map.mapTypes.set('map_style', customMap);
    map.setMapTypeId('map_style');



})(jQuery);