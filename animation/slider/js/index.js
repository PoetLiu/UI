function init() {
    window.setInterval(function () {
        $("#slider ul li:first-child").addClass("slide-right");
    }, 1000);
}

$(document).ready(function () {
    init();
});