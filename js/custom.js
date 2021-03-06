(function ($) {

    new WOW().init();

    jQuery(window).load(function() {
        jQuery("#preloader").delay(100).fadeOut("slow");
        jQuery("#load").delay(100).fadeOut("slow");
    });


    //jQuery to collapse the navbar on scroll
    $(window).scroll(function() {
        if ($(".navbar").offset().top > 50) {
            $(".navbar-fixed-top").addClass("top-nav-collapse");
        } else {
            $(".navbar-fixed-top").removeClass("top-nav-collapse");
        }
    });

    //jQuery for page scrolling feature - requires jQuery Easing plugin
    $(function() {
        $('.navbar-nav li a').bind('click', function(event) {
            var $anchor = $(this);
            $('html, body').stop().animate({
                scrollTop: $($anchor.attr('href')).offset().top
            }, 1500, 'easeInOutExpo');
            event.preventDefault();
        });
        $('.page-scroll a').bind('click', function(event) {
            var $anchor = $(this);
            $('html, body').stop().animate({
                scrollTop: $($anchor.attr('href')).offset().top
            }, 1500, 'easeInOutExpo');
            event.preventDefault();
        });
        jQuery.getFeed({
            url: 'http://oscar.education/news/?feed=rss2',
            success: function(feed) {
                console.log(feed);
                target = $("#nouvelles")
                feed.items.forEach(function(item) {
                    console.log(item);
                    item.title;
                    item.link;
                    item.description;
                    var date = new Date(item.updated);
                    var month = date.getMonth() + 1;
                    if (month < 10) {
                        var month = "0" + month;
                    }
                    target.append('<h4>' + date.getDate() + '/' + month + ' - <a href="' + item.link + '">' + item.title + '</a></h4><p><i>' + item.description + '</i></p>');
                })
            }
        });
        $("#newsletter-form button").click(function(event) {
            $("#newsletter-form .form-group").removeClass("has-error");
            $("#newsletter-email-errors").html("");

            event.preventDefault();
            var email = $("#newsletter-email").val();
            if (!email || email.indexOf("@") == -1) {
                $("#newsletter-form .form-group").addClass("has-error");
                $("#newsletter-email-errors").html("<p>Erreur: email invalide</p>");
                return;
            }
            $("#newsletter-loader").show();
            $("#newsletter-email-group").hide();
            $.post("news/wp-content/plugins/newsletter/do/subscribe.php", {ne: email})
                .always(function() {
                    $("#newsletter-loader").hide();
                })
                .success(function(data) {
                    console.log(data);
                    if (data == "Wrong email") {
                        $("#newsletter-email-group").show();
                        $("#newsletter-form .form-group").addClass("has-error");
                        $("#newsletter-email-errors").html("<p>Erreur: email invalide</p>");
                    } else {
                        $("#newsletter-email-answer").show().html('<p>Un email de confirmation vous a été envoyé.</p>');
                        $("#newsletter-form button").attr("disabled", "");
                    }
                }).error(function() {
                    $("#newsletter-email-group").show();
                    $("#newsletter-form .form-group").addClass("has-error");
                    $("#newsletter-email-errors").html("<p>Oups, une erreur s'est produite.</p>");
                })
        });
        $("#contact-form button").click(function(event) {
            event.preventDefault();

            ["name", "email", "subject", "message"].forEach(function(i) {
                $("#" + i).parent().removeClass("has-error");
            });


            $("#contact-result").html('');

            get_all_required_fields = true;

            // validation
            ["name", "email", "subject", "message"].forEach(function(i) {
                element = $("#" + i);
                if (element.val()) {
                    // we've got data!
                    return;
                }

                element.parent().addClass("has-error");
                get_all_required_fields = false;
            })

            if (!get_all_required_fields) {
                return;
            }

            var name = $("#name").val();
            var email = $("#email").val();
            var subject = $("#subject").val();
            var message = $("#message").val();

            var data = new FormData();
            data.append(name="cntctfrm_contact_name", name);
            data.append(name="cntctfrm_contact_email", email);
            data.append(name="cntctfrm_contact_subject", subject);
            data.append(name="cntctfrm_contact_message", message);
            data.append(name="cntctfrm_contact_action", "send");
            data.append(name="cntctfrm_language", "en");
            data.append(name="cntctfrm_form_submited", "1");

            $.ajax({
                url: "news/?page_id=2",
                data: data,
                cache: false,
                contentType: false,
                processData: false,
                type: 'POST',
                error: function(data) {
                    console.log("error:");
                    console.log(data);
                    $("#contact-result").html('<div class="alert alert-danger">Oups, une erreur s\'est produite.</div>');
                },
                success: function(data) {
                    console.log("succes!");
                    console.log(data);
                    $("#contact-result").html('<div class="alert alert-success">Votre message nous a été transmit, merci !</div>');
                    $("#message").val('');
                }
            })
        })
    });

})(jQuery);
