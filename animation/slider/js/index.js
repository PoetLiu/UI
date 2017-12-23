function init() {
    var slider = new Slider(
        "#slider",
        "#slider-bg-ul",
        "#slider-nav-dot-ul",
        "#slider-nav-page-left",
        "#slider-nav-page-right",
        "nav-highlight",
        1000,
        3000,
        500,
        200);

    slider.start();
}

$(document).ready(function () {
    init();
});