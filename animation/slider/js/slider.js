function Slider(domId, stepLen, interval, duration) {
    this.domId = domId;
    this.items = [];
    this.navItems = [];
    this.itemNum = 0;
    this.nowId  = 0;
    this.stepLen = stepLen;
    this.interval = interval;
    this.duration = duration;
    this.pause  = false;
    this.highlightName = "nav-highlight";
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
    $(this.domId+"-nav-ul").find("li").each(function () {
        self.navItems.push(this);
    });
    this.itemNum    = this.items.length;
    // console.log(this.items);

    this.navHighlight(this.getNowNav(), true);
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

Slider.prototype.navHighlight = function (nav, highlight) {
   if (highlight)  {
       $(nav).addClass(this.highlightName);
   } else {
       $(nav).removeClass(this.highlightName);
    }
};

Slider.prototype.navUpdate = function () {
   this.navHighlight(this.getNowNav(), true);
   this.navHighlight(this.getPrevNav(), false);
};

Slider.prototype.slide = function (item) {
    var self    = this;
    // console.log(this, item);
    $(item).animate(
        {
            left: "-=" + this.stepLen
        },
        this.duration,
        function () {
            self.resetPosition(this);
            self.navUpdate();
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

Slider.prototype.getPrevId = function () {
    return (this.nowId === 0) ? this.itemNum-1 : this.nowId - 1;
};

Slider.prototype.getNextItem    = function () {
    return this.items[this.getNextId()];
};

Slider.prototype.getNowItem = function () {
    return this.items[this.nowId];
};

Slider.prototype.getPrevNav = function () {
    return this.navItems[this.getPrevId()];
};

Slider.prototype.getNowNav = function () {
    return this.navItems[this.nowId];
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
