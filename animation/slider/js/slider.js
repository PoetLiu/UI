function Slider(domId, bgId, navDotId, navPageId,
                highlight, stepLen,
                interval, duration, navDuration)
{
    this.domId = domId;
    this.bgId = bgId;
    this.navDotId = navDotId;
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
    this.dir    = 'left';
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

    $(this.navDotId).find("li").each(function () {
        self.navItems.push(this);

        $(this).click(function () {
            self.slideToId(this);
        });
    });
    // console.log(this.items);

    this.navHighlight(this.getNowNav(), true);
};

Slider.prototype.slideToId = function (nav) {
    var id = this.navItems.indexOf(nav);
    if (id === -1) {
        console.log(nav+"doesn't exist!.");
        return;
    }

    var reverse = id < this.nowId;
    if (reverse) {
        this.reverse();
    }

    while (id !== this.nowId) {
        // console.log(id, this);
        this.update('nav');
    }

    // Reverse back.
    // Use default dir.
    if (reverse) {
        this.reverse();
    }
};

Slider.prototype.reverse    = function () {
    this.ChangeDir(this.dir === 'left' ? 'right' : 'left');
};

Slider.prototype.ChangeDir  = function (dir) {
    if (this.dir === dir)
        return;
    console.log("Dir changed from:" + this.dir + " to:" + dir);
    this.dir    = dir;
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
    if (this.dir === 'left') {
        this.nowId++;
    } else {
        this.nowId--;
    }

    if (this.nowId >= this.itemNum) {
        this.nowId = 0;
    } else if (this.nowId < 0) {
        this.nowId  = this.itemNum-1;
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

Slider.prototype.slideItem = function (item, mode) {
    this.nextItemPrepare();
    $(item).animate(
        {
            left: (this.dir === "left" ? "-=" : "+=") + this.stepLen
        },
        (mode && mode === 'nav')? this.navDuration: this.duration
    );
};

Slider.prototype.slide = function (mode) {
    this.slideItem(this.getNowItem(), mode);
    this.slideItem(this.getNextItem(), mode);
};

Slider.prototype.nextItemPrepare = function () {
    var next    = this.getNextItem();
    var nextLeft = parseInt($(next).css('left'));

    if ((this.dir === 'left' && nextLeft === this.stepLen)
        || (this.dir ==='right' && nextLeft === -this.stepLen)) {
        return;
    }

    $(next).animate({
        left: (this.dir === "left" ? "+=" : "-=") + (this.stepLen * 2)
    }, 0);
};

Slider.prototype.getNextId = function () {
    if (this.dir === 'left') {
        return (this.nowId === this.itemNum-1) ? 0 : this.nowId + 1;
    } else {
        return (this.nowId === 0) ? this.itemNum-1 : this.nowId - 1;
    }
};

Slider.prototype.getPrevId = function () {
    if (this.dir === 'left') {
        return (this.nowId === 0) ? this.itemNum - 1 : this.nowId - 1;
    } else {
        return (this.nowId === this.itemNum-1) ? 0 : this.nowId + 1;
    }
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
    this.slide(mode);
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
