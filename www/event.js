$(document).ready(function () {
    $('.drawer').drawer();

    /* test! */
    $("#testform").submit(function (event) {
        alert("Handler for .submit() called.");
        event.preventDefault();
        formData = new FormData();
        formData.append('file', $('input[type=file]')[0].files[0]);
        console.log('inputed data');

        $.ajax({
            async: true,
            crossDomain: true,
            url: "https://excite-us.herokuapp.com/external/stories/evt-666b7be3-8010-4a58-8ead-31d995cdac2a",
            processData: false,
            contentType: false,
            type: 'POST',
            mimeType: "multipart/form-data",
            data: formData,

            success: function (data) {
                alert(data);
                $('body').prepend('<p>formdata sended</p>');
                console.log(data);
            },

            error: function (request, error) {


                alert(" error: Can't do because: " + request.responseText);
            }
        });

    });
    /* array with preloaded images */
    var PreloadedImages = [];
    var storiesAvailable = false;
    var id = getQueryStringValue('id');
    var htmlstring = "";
    var output = document.getElementById("events");
    var urll = "https://excite-us.herokuapp.com/external/events/" + id;
    console.log(urll);

    /*
    var story1;
    var story2;
    var story3;
    var n = 1;
    var clickcounter = 1;
    */

    /* get id from query string */
    function getQueryStringValue(key) {
        return decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
    }

    function gohome() {
        location.href = "overview.html"
    }



    /* get data with json for detail screen */
    $.ajax({
        type: 'GET',
        crossOrigin: true,
        url: "https://excite-us.herokuapp.com/external/events/" + id,

        dataType: "json",
        success: function (data) {

            let storyString ="";
            let promoString="";
            let iconString = "";
            let moreInfo ="";

            if (data.detailLink !=null && data.detailLink !== ""){
                moreInfo = "<p style='margin-top: 15px'><a class='link' href=" + data.detailLink + ">More info...</a></p>";
            }

            if (data.stories.length > 0) {
                storiesAvailable = true;
                iconString = "<img class='icon stories' src= '" + data.icon + "'/>";
                storyString = " <h5>Pictures</h5> <div class='photo-container'>";

                for (let b = 0; b < data.stories.length; b++) {
                    if (b === 0) {
                        storyString = storyString + "<img class='photo-list' style='margin-left: 0px' src=" + data.stories[b] + " />";
                    } else {
                        storyString = storyString + "<img class='photo-list' src=" + data.stories[b] + " />";
                    }
                }
                storyString = storyString + "</div>";

            } else {
                storiesAvailable = false;
                iconString = "<img class='icon' src= '" + data.icon + "'/>";
            }


            if (data.promotion != null && data.promotion !== "") {
                 promoString = "<h4 class='promo' style='padding-top: 10px'> " + data.promotion.name + "</h4> <hr>";
            }

                nextstring = " <div>" +
                    "            <div>" +
                    iconString +
                    "                <div class='inline-block main-info'>" +
                    "                    <h3 class='title-event'>" + data.title + "</h3>" +
                    "                    <h4 class='inline-block'>@" + data.place.name + "</h4>" +
                    "                    <h4>" + data.place.address + "</h4>" +
                    "                </div>" +
                    "            </div>" +
                    "            <div id='addstory'>" +
                    "                <h7>CHECK-IN</h7>" +
                    "            </div>" +
                    "            <div>" +
                    "                <h5 style='margin-bottom: 8px'>DESCRIPTION</h5>" +
                    "<h4><i class='material-icons icon-small'>date_range</i> WHEN  &nbsp&nbsp&nbsp" + OnlyDateConverter(data.startTime) + "</h4>" +
                    "<h4><i class='material-icons icon-small'>access_time</i> START &nbsp&nbsp " + OnlyTimeConverter(data.startTime) + "</h4>" +
                    promoString + "<section class='description-twoo'><p>" + data.description + "</p>" +
                    storyString  +
                    moreInfo +
                     "                </div>" +
                    "            </div>" +
                    "        </div>";

            var story_url_load_array = data.stories;

            htmlstring += nextstring;
            output.innerHTML = htmlstring;

            setTimeout(function () {
                $('#preloader').fadeOut('slow', function () {
                    $(this).remove();
                    $('#back-arrow').click(function () {
                        window.location.href = 'overview.html';
                    });
                });
            }, 0);

            $(".stories").click(function () {
                console.log("open stories");

                if (storiesAvailable) {


                    /* show stories */

                    var htmloutput = '<div id="confirm-image"><img id="back-arrow" class="noSelect" src="img/back-arrow.svg"><div id="send-image"><h7>Next</h7></div><img id="story-image" src=""> </div>';
                    $('body').prepend(htmloutput);

                    $('#back-arrow').click(function () {
                        location.reload();
                    });


                    /* input first story image */
                    var i = 0;


                    if (data.stories.length >= PreloadedImages.length) {
                        /* if image is not loaded yet */
                        document.getElementById('story-image').src = data.stories[i];
                        console.log("not loaded");
                    } else {
                        /* if image is loaded */
                        document.getElementById('story-image').src = (PreloadedImages[i].src);
                        console.log("ready");
                    }


                    $('#send-image').click(function () {
                        console.log("next");
                        console.log(data.stories[i]);
                        if (data.stories.length == 1) {
                            $('#confirm-image').remove();
                        } else {
                            i = i + 1;


                            if (data.stories.length > PreloadedImages.length) {
                                /* if image is not loaded yet */
                                var newsrc = (data.stories[i]);

                                $("#story-image").attr("src", newsrc);



                            } else if (story_url_load_array.length <= i) {
                                /* all storys seen */
                                $('#confirm-image').remove();

                            } else if (data.stories.length <= PreloadedImages.length) {
                                /* if image is loaded */
                                document.getElementById('story-image').src = PreloadedImages[i].src;
                                console.log("ready2: " + PreloadedImages[i].src);

                            }
                        }




                    });

                }

            });

            /* preloader */

            preload(story_url_load_array);


        }
    });

    /* unix time to human read time */
    function timeConverter(UNIX_timestamp) {
        str = UNIX_timestamp.toString();

        str = str.slice(0, -3);
        str = parseInt(str);



        // Months array
        var months_arr = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];

        // Convert timestamp to milliseconds
        var date = new Date(str * 1000);

        // Year
        var year = date.getFullYear();
       
        // Month
        var month = months_arr[date.getMonth()];

        // Day
        var day = date.getDate();

        // Hours
        var hours = date.getHours();
        

        // Minutes
        var minutes = "0" + date.getMinutes();

            var timestr = '    ' + day.toString() + '/' + month + /*+ year.toString();*/'  -  ' + hours.toString() + ':'  + minutes.substr(-2)
       

        // Display date time in MM-dd-yyyy h:m:s format
       /*
        var convdataTime = month + '-' + day + '-' + year + '  ' + hours + ':' + minutes.substr(-2);
        var lowercase = convdataTime;
        */
        return timestr;

    }

    function OnlyTimeConverter(UNIX_timestamp) {
        var date = new Date(UNIX_timestamp * 1000);
        var hours = date.getHours();

        // Minutes
        var minutes = "0" + date.getMinutes();
        var conv = hours + ':' + minutes.substr(-2);
        return conv;
    }

    function OnlyDateConverter(UNIX_timestamp) {
        // Convert timestamp to milliseconds
        var date = new Date(UNIX_timestamp );
        var months_arr = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

        // Year
        var year = date.getFullYear();

        // Month
        var month = months_arr[date.getMonth()];

        // Day
        var day = date.getDate();

        var conv = day + ' ' + month +  ' ' + year;
        return conv;
    }




    function preload(arrayOfImages) {
        $(arrayOfImages).each(function () {
            var story = new Image();
            story.src = this;
            PreloadedImages.push(story);

        });
    }

    function gohome() {
        location.href = "overview.html"
    }

    let app = {
        init: function () {
            $("#addstory").click(function () {
                app.takephoto();
            })
        },

        takephoto: function () {
            let opts = {
                quality: 20,
                x: 0,
                y: 0,
                width: window.screen.width,
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.CAMERA,
                mediaType: Camera.MediaType.PICTURE,
                encodingType: Camera.EncodingType.JPEG,
                cameraDirection: Camera.Direction.BACK,
                mediaType: Camera.MediaType.ALLMEDIA,
                targetWidth: 1080,
                targetHeight: 1920,
            };

            navigator.camera.getPicture(app.ftw, app.wtf, opts);


        },
        ftw: function (imageData) {
            $('body').prepend('<div id="preloader"></div>');

            var htmloutput = '<div id="confirm-image"><div id="send-image"><h7>Send image to event storys</h7></div><img id="story-image" src="data:image/jpeg;base64,' + imageData + '"></div>';
            $('body').prepend(htmloutput);
            setTimeout(function () {
                $('#preloader').fadeOut('slow', function () {
                    $(this).remove();
                });
            }, 500);

            document.addEventListener('deviceready', app.init);

            $('#confirm-image').click(function () {
                $('#send-image h7').html('Sending data...');

                // Get the form element withot jQuery
                var form = document.getElementById("myAwesomeForm");

                var ImageURL = "data:image/jpeg;base64," + imageData;
                // Split the base64 string in data and contentType
                var block = ImageURL.split(";");
                // Get the content type of the image
                var contentType = block[0].split(":")[1]; // In this case "image/gif"
                // get the real base64 content of the file
                var realData = block[1].split(",")[1]; // In this case "R0lGODlhPQBEAPeoAJosM...."

                // Convert it to a blob to upload
                var blob = b64toBlob(realData, contentType);

                // Create a FormData and append the file with "image" as parameter name
                var formDataToUpload = new FormData(form);
                formDataToUpload.append("file", blob);

                $.ajax({
                    async: true,
                    crossDomain: true,
                    url: "https://excite-us.herokuapp.com/external/stories/" + id ,
                    data: formDataToUpload, // Add as Data the Previously create formData
                    type: "POST",
                    contentType: false,
                    processData: false,
                    cache: false,
                    mimeType: "multipart/form-data", // Change this according to your response from the server.
                    error: function (err) {
                        console.error(err);
                    },
                    success: function (data) {
                        console.log(data);
                        console.log("succesfull image sended");


                        $('#confirm-image').remove();
                        window.location.reload(true);
                    },
                    complete: function () {
                        console.log("Request finished.");
                    }
                });

                /* test */

                function b64toBlob(b64Data, contentType, sliceSize) {
                    contentType = contentType || '';
                    sliceSize = sliceSize || 512;

                    var byteCharacters = atob(b64Data);
                    var byteArrays = [];

                    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
                        var slice = byteCharacters.slice(offset, offset + sliceSize);

                        var byteNumbers = new Array(slice.length);
                        for (var i = 0; i < slice.length; i++) {
                            byteNumbers[i] = slice.charCodeAt(i);
                        }

                        var byteArray = new Uint8Array(byteNumbers);

                        byteArrays.push(byteArray);
                    }

                    var blob = new Blob(byteArrays, {
                        type: contentType
                    });
                    return blob;
                }

            });
        },
        wtf: function (msg) {
            document.getElementById('msg').textContent = msg;
        }
    };

    function dataURItoBlob(dataURI) {
        // convert base64/URLEncoded data component to raw binary data held in a string
        var byteString;

        if (dataURI.split(',')[0].indexOf('base64') >= 0)
            byteString = atob(dataURI.split(',')[1]);
        else
            byteString = unescape(dataURI.split(',')[1]);

        // separate out the mime component
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

        // write the bytes of the string to a typed array
        var ia = new Uint8Array(byteString.length);

        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }

        return new Blob([ia], {
            type: mimeString
        });
    }

    document.addEventListener('deviceready', app.init);

});