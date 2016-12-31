$(document).ready(function () {
    $('#about-div').hide();
    $('#edit-div').hide();

    $('#posts').addClass('active');

    $('#about').click(function () {
        $('#posts').removeClass('active');
        $('#edit').removeClass('active');
        $('#about').addClass('active');
        $('#posts-div').hide();
        $('#edit-div').hide();
        $('#about-div').show();
    });

    $('#posts').click(function () {
        $('#about').removeClass('active');
        $('#edit').removeClass('active');
        $('#posts').addClass('active');
        $('#about-div').hide();
        $('#edit-div').hide();
        $('#posts-div').show();
    });

    $('#edit').click(function () {
        $('#about').removeClass('active');
        $('#posts').removeClass('active');
        $('#edit').addClass('active');
        $('#about-div').hide();
        $('#posts-div').hide();
        $('#edit-div').show();
    });
    var unsaved = false;
    var unclicked = true;
    $(":input").change(function () { //trigers change in all input fields including text type
        unsaved = true;
    });

    function unloadPage() {
        if (unsaved && unclicked) {
            return "You have unsaved changes on this page. Do you want to leave this page and discard your changes or stay on this page?";
        }
    }

    window.onbeforeunload = unloadPage;

    $("#edit-form").submit(function () {
        unclicked = false;
        if (document.getElementById('profile-picture').files.length == 0)
            return true;
        var formData = new FormData();
        formData.append("profilePicture", document.getElementById('profile-picture').files[0]);
        var request = new XMLHttpRequest();
        request.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                return true;
            }
        };
        request.open("POST", '/users/upload', false);
        request.send(formData);
    });

    $("#post-form").submit(function () {
        unclicked = false;
        var formData = new FormData();
        formData.append('postPicture', document.getElementById('post-picture').files[0]);
        var request = new XMLHttpRequest();
        request.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                $("#post-form").append("<input type='hidden' name='postId' value=" + request.responseText + "/>");
                return true;
            }
        };
        request.open("POST", '/posts/upload', false);
        request.send(formData);
    });
});