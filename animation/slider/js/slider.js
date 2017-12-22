function Slider(domId, stepLen, interval, duration) {
    this.domId = domId;
    this.items = [];
    this.itemNum = 0;
    this.nowId  = 0;
    this.stepLen = stepLen;
    this.interval = interval;
    this.duration = duration;
    this.pause  = false;
    this.init();
}

Slider.prototype.init = function () {
    var self    = this;
    $(this.domId).hover(
        this.onMouseHover.bind(this),
        this.onMouseLeave.bind(this)
    );

    $(this.domId+"-bg-ul").find("li").each(function () {
        self.items.push(this);
    });
    this.itemNum    = this.items.length;
    // console.log(this.items);
};


Slider.prototype.onMouseHover   = function () {
    // console.log("On mouse hover!");
    this.pause  = true;
};

Slider.prototype.onMouseLeave  = function () {
    // console.log("On mouse leave!");
    this.pause  = false;
};

Slider.prototype.idNext = function () {
    this.nowId++;
    if (this.nowId >= this.itemNum) {
        this.nowId = 0;
    }
    return this.nowId;
};

Slider.prototype.slide = function (item) {
    var self    = this;
    console.log(this, item);
    $(item).animate(
        {
            left: "-=" + this.stepLen
        },
        this.duration,
        function () {
            self.resetPosition(this);
        }
    );
};

Slider.prototype.resetPosition  = function (item) {
    // console.log(dom);
    if (parseInt($(item).css('left')) !== -this.stepLen) {
        return;
    }
    $(item).animate({
        left: "+=" + (this.stepLen * 2)
    }, 0);
};

Slider.prototype.getNextId = function () {
    return (this.nowId === this.itemNum-1) ? 0 : this.nowId + 1;
};

Slider.prototype.getNextItem    = function () {
    return this.items[this.getNextId()];
};

Slider.prototype.getNowItem = function () {
    return this.items[this.nowId];
};

Slider.prototype.update = function () {
    if (this.pause) {
        return;
    }
    this.slide(this.getNowItem());
    this.slide(this.getNextItem());
    this.idNext();
};

Slider.prototype.start = function () {
    var self    = this;
    window.setInterval(function () {
        self.update();
    }, this.interval);
};
