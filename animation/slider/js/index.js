function init() {
    var slider = new Slider(
        "#slider",
        "#slider-item",
        2,
        225,
        3000,
        500);

    slider.start();
}

$(document).ready(function () {
    init();
});