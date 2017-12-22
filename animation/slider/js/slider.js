function Slider(domId, bgId, navId, highlight, stepLen, interval, duration, navDuration) {
    this.domId = domId;
    this.bgId = bgId;
    this.navId = navId;
    this.items = [];
    this.navItems = [];
    this.itemNum = 0;
    this.nowId  = 0;
    this.stepLen = stepLen;
    this.interval = interval;
    this.duration = duration;
    this.navDuration = navDuration;
    this.pause  = false;
    this.highlightName = highlight;
    this.init();
}

Slider.prototype.init = function () {
    var self    = this;
    $(this.domId).hover(
        this.onMouseHover.bind(this),
        this.onMouseLeave.bind(this)
    );

    $(this.bgId).find("li").each(function () {
        self.items.push(this);
    });
    this.itemNum    = this.items.length;

    $(this.navId).find("li").each(function () {
        self.navItems.push(this);

        $(this).click(function () {
            self.slideTo(this);
        });
    });
    // console.log(this.items);

    this.navHighlight(this.getNowNav(), true);
};

Slider.prototype.slideTo = function (nav) {
    var id = this.navItems.indexOf(nav);
    if (id === -1) {
        console.log(nav+"doesn't exist!.");
        return;
    }

    while (id !== this.nowId) {
        // console.log(id, this);
        this.update('nav');
    }
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

Slider.prototype.slide = function (item, mode) {
    var self    = this;
    // console.log(this, item);
    $(item).animate(
        {
            left: "-=" + this.stepLen
        },
        (mode && mode === 'nav')? this.navDuration: this.duration,
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

Slider.prototype.update = function (mode) {
    this.slide(this.getNowItem(), mode);
    this.slide(this.getNextItem(), mode);
    this.idNext();
    this.navUpdate();
};

Slider.prototype.start = function () {
    var self    = this;
    window.setInterval(function () {
        if (self.pause) {
            return;
        }
        self.update();
    }, this.interval);
};
