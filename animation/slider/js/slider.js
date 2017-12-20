function Slider(domId, itemId, itemNum, stepLen, interval, duration) {
    this.domId = domId;
    this.itemDomId = itemId;
    this.itemNum = itemNum;
    this.nowId = 0;
    this.stepLen = stepLen;
    this.interval = interval;
    this.duration = duration;

}

Slider.prototype.idNext = function () {
    this.nowId++;
    if (this.nowId > this.itemNum) {
        this.nowId = 0;
        return false;
    }
    return true;
};

Slider.prototype.slide = function (id) {
    var self = this;
    $(this.itemDomId + id).animate({
        left: "-=" + this.stepLen
    }, this.duration, function () {
        var left = parseInt($(this).css('left'));
        if (left === -self.stepLen) {
            $(this).animate({
                left: "+=" + (self.stepLen * 2)
            }, 0);
        }
    });
};

Slider.prototype.getNextId = function () {
    return (this.nowId === this.itemNum) ? 0 : this.nowId + 1;
};

Slider.prototype.slideNext = function () {
    var self = this;
    window.setTimeout(function () {
        self.slide(self.nowId);
        self.slide(self.getNextId());
        self.idNext();

        self.slideNext();
    }, this.interval);
};

Slider.prototype.start = function () {
    this.slideNext();
};
