function init() {
    var slider = new Slider(
        "#slider",
        225,
        3000,
        500,
        200);

    slider.start();
}

$(document).ready(function () {
    init();
});