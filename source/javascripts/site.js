// This is where it all goes :)

var s,
    contact_mod = {

    settings: {
        contact_form: document.querySelector('.contact-form'),
        formspree: 'https://formspree.io/tylerre95@gmail.com'
    },

    init: function() {
        s = this.settings;
        this.bind_ui();
    },

    bind_ui: function() {
        console.log(s);
        s.contact_form.addEventListener('submit', this.parse_post);
    },

    // validates that name and email have been filled out. Bootstrap will validate email automatically
    validate_name: function(nomen, email) {
        var valid = false;

        if (nomen && email) {
            valid = true;
            return valid;
        }

        return valid;
    },

    // parse contents of form. calls validate_name and clear_form
    parse_post: function(e) {
        e.preventDefault();

        // define vars
        var s_name = this.querySelector('input[name="Name"]').value,
            s_email = this.querySelector('input[name="Email"]').value,
            s_reason = this.querySelector('select[name="Reason"]').value,
            s_body = this.querySelector('textarea[name="Body"]').value,
            data = {
                "Name": s_name.trim(),
                "Email": s_email.trim(),
                "Reason": s_reason.trim(),
                "Body": s_body.trim()
            };

        // validate inputs
        if (!contact_mod.validate_name(s_name, s_email)) {
            this.querySelector('label[for="Name"]').style.color = 'red';
            this.querySelector('label[for="Email"]').style.color = 'red';
            this.querySelector('.sent').innerHTML = '<h4 style="color: red;">Please make sure you include your name and email!</h4>';
            return;
        }

        $.ajax({
            url: s.formspree,
            method: "POST",
            data: data,
            dataType: "json",

            beforeSend: function() {
                $('.contact-form .sent').html('<h4 style="color: yellow;>Sending...</h4>');
            },
            success: function() {
                $('.contact-form .sent').html('<h4 style="color: green;">Email sent! We\'ll get back to you shortly.</h4>');
                contact_mod.clear_form(s_name, s_email, s_body);
            },
            error: function(){
                $('.contact-form .sent').html('<h4 style="color: red;">Sorry, we couldn\'t complete your request. Please give us a call or send an email to carla@danceformationinc.com.')
            }
        });
    },

    clear_form: function(a, b, c) {
        console.log('clearing form');
        for(var i = 0; i < arguments.length; i++) {
            console.log(arguments[i]);
        }
    }
}

contact_mod.init();


$(document).ready(function() {

    $('.active-modal').on('click', function() {
        if (window.innerWidth >= 600) {
            $('.imagepreview').attr('src', $(this).find('img').attr('src'));
            $('#image-modal').modal('show');

        } else {
            return;
        }
    });

});


// get calendar start time
function getCalendarStart(counter) {
    var start = new Date(calendar.items[counter].start.dateTime).getTime();
    return start;
}

// compare dates
function compareDates(counter) {
    var calendarDate = getCalendarStart(counter);
    calendarDate = calendarDate - now;

    if (calendarDate < startComparison) {
        targetCounter = counter;
    }

    return targetCounter;
}

// create array
function getSixEvents(target) {
    var datesArr = [];
    var counter = 5;

    for (var i = target + 5; i >= target; i--) {
        datesArr[counter] = calendar.items[i];
        counter--;
    }

    return datesArr;
}

// empty list
function listIsEmpty(arr) {
    if (arr.length == 0) {
        return true;
    } else {
        return false;
    }
}


// api request
var xhr = new XMLHttpRequest;
xhr.open('GET', 'https://www.googleapis.com/calendar/v3/calendars/5t29fhnt2r3e1m9dmo7u5htpsc@group.calendar.google.com/events?key=AIzaSyDoxTSC199npNAhCOgHMlD5sCkQzzLZxbA&orderBy=startTime&singleEvents=true', false);
xhr.send();

// parse JSON
var calendar = JSON.parse(xhr.response);


// get today's time
var now = new Date();
now = now.getTime();

var months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
var calendarLength = calendar.items.length - 1;
var startComparison = getCalendarStart(calendarLength);
startComparison = startComparison - now;
var targetCounter = calendarLength;

// find the next event
for (var i = calendarLength; i > -1; i--) {
    if (getCalendarStart(i) > now) {
        var target = compareDates(i);
    }
}

// get the following six events
datesArr = getSixEvents(target);

// add the next six events
count = 0;

$('.event').each(function() {

    if (listIsEmpty(datesArr)) {
        $('.no-events').text('Sorry, no upcoming events. Check back soon!');
    } else {
        $(this).removeClass('hidden');

        if (datesArr[count] == undefined) {
            $(this).addClass('hidden');
        } else {
            var meridiem,
                start = new Date(datesArr[count].start.dateTime),
                day = start.getDate(),
                month = start.getMonth(),
                month = months[month],
                hour = start.getHours(),
                minute = start.getMinutes();

            if (minute <= 9) {
                minute = String(minute) + '0';
            }

            if (hour > 12) {
                hour = String(hour % 12);
                meridiem = 'PM';
            } else {
                hour = String(hour);
                meridiem = 'AM';
            }

            $(this).find('h2').text(datesArr[count].summary);
            $(this).find('h3').text(month);
            $(this).find('h1').text(day);
            $(this).find('p').text(hour + ":" + minute + " " + meridiem);
        }

        count++;
    }
});

