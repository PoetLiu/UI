function init() {
    var i = 0;
    const maxId = 2;
    const slideItem = "slider-item";
    const slideStep = 225;
    const slideDuration = 1000;
    const slideInterval = 3000;

    function idNext() {
       i++;
       if (i > maxId) {
           i    = 0;
           return false;
       }
       return true;
    }

    function slide(id) {
        $("#"+slideItem+id).animate({
            left: "-="+slideStep
        }, slideDuration, function () {
            var left = parseInt($(this).css('left'));
            if (left === -slideStep) {
                $(this).animate({
                    left: "+=" + (slideStep * 2)
                }, 0);
            }
        });
    }

    function getNextId() {
        return (i === maxId) ? 0 : i+1;
    }

    function slideNext() {
        window.setTimeout(function () {
            var now = i, next = getNextId();
            slide(now);
            slide(next);
            idNext();

            slideNext();
        }, slideInterval);
    }

    slideNext();
}

$(document).ready(function () {
    init();
});