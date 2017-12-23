function Slider(domId, bgId, navDotId,
                pageLeftId, pageRightId,
                highlight, stepLen,
                interval, duration, navDuration)
{
    this.domId = domId;
    this.bgId = bgId;
    this.items = [];
    this.navDotId = navDotId;
    this.navDots    = [];
    this.navLeftId  = pageLeftId;
    this.navRightId = pageRightId;
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
        self.navDots.push(this);

        $(this).click(function () {
            self.slideToDot(this);
        });
    });
    // console.log(this.items);

    $(this.navLeftId).click(function () {
       self.slideDir('right');
    });
    $(this.navRightId).click(function () {
        self.slideDir('left');
    });

    this.navHighlight(this.getNowNav(), true);
};

Slider.prototype.slideDir = function (dir) {
    var reverse = this.dir !== dir, self = this;

    if (reverse) {
        this.reverse();
    }
    this.update('nav', function () {
        // Reverse back.
        // Use default dir.
        if (reverse) {
            self.reverse();
        }
    });
};

Slider.prototype.slideToDot = function (dot) {
    var id = this.navDots.indexOf(dot);
    var self = this;
    if (id === -1) {
        console.log(dot+"doesn't exist!.");
        return;
    }

    var reverse = id < this.nowId;
    if (reverse) {
        this.reverse();
    }

    this.update('nav', function cb() {
        if (id !== self.nowId) {
            self.update('nav', cb);
            return;
        }
        // Reverse back.
        // Use default dir.
        if (reverse) {
            console.log("reverse!");
            self.reverse();
        }
    });
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

Slider.prototype.slideItem = function (item, mode, done) {
    this.nextItemPrepare();
    $(item).animate(
        {
            left: (this.dir === "left" ? "-=" : "+=") + this.stepLen
        },
        (mode && mode === 'nav')? this.navDuration: this.duration,
        function () {
           if (done)  {
               done();
           }
        }
    );
};

Slider.prototype.slide = function (mode, done) {
    this.slideItem(this.getNowItem(), mode);
    this.slideItem(this.getNextItem(), mode, done);
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
    return this.navDots[this.getPrevId()];
};

Slider.prototype.getNowNav = function () {
    return this.navDots[this.nowId];
};

Slider.prototype.update = function (mode, done) {
    this.slide(mode, done);
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
