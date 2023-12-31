﻿var $jscomp = $jscomp || {};
$jscomp.scope = {};
$jscomp.arrayIteratorImpl = function(a) {
    var b = 0;
    return function() {
        return b < a.length ? {
            done: !1,
            value: a[b++]
        } : {
            done: !0
        };
    };
};
$jscomp.arrayIterator = function(a) {
    return {
        next: $jscomp.arrayIteratorImpl(a)
    };
};
$jscomp.makeIterator = function(a) {
    var b = "undefined" != typeof Symbol && Symbol.iterator && a[Symbol.iterator];
    return b ? b.call(a) : $jscomp.arrayIterator(a);
};
$jscomp.getGlobal = function(a) {
    return "undefined" != typeof window && window === a ? a : "undefined" != typeof global && null != global ? global : a;
};
$jscomp.global = $jscomp.getGlobal(this);
$jscomp.ASSUME_ES5 = !1;
$jscomp.ASSUME_NO_NATIVE_MAP = !1;
$jscomp.ASSUME_NO_NATIVE_SET = !1;
$jscomp.SIMPLE_FROUND_POLYFILL = !1;
$jscomp.defineProperty = $jscomp.ASSUME_ES5 || "function" == typeof Object.defineProperties ? Object.defineProperty : function(a, b, d) {
    a != Array.prototype && a != Object.prototype && (a[b] = d.value);
};
$jscomp.polyfill = function(a, b, d, e) {
    if (b) {
        d = $jscomp.global;
        a = a.split(".");
        for (e = 0; e < a.length - 1; e++) {
            var c = a[e];
            c in d || (d[c] = {});
            d = d[c];
        }
        a = a[a.length - 1];
        e = d[a];
        b = b(e);
        b != e && null != b && $jscomp.defineProperty(d, a, {
            configurable: !0,
            writable: !0,
            value: b
        });
    }
};
$jscomp.FORCE_POLYFILL_PROMISE = !1;
$jscomp.polyfill("Promise", function(a) {
    function b() {
        this.batch_ = null
    }

    function d(a) {
        return a instanceof c ? a : new c(function(b, f) {
            b(a)
        })
    }
    if (a && !$jscomp.FORCE_POLYFILL_PROMISE) return a;
    b.prototype.asyncExecute = function(a) {
        if (null == this.batch_) {
            this.batch_ = [];
            var b = this;
            this.asyncExecuteFunction(function() {
                b.executeBatch_()
            })
        }
        this.batch_.push(a)
    };
    var e = $jscomp.global.setTimeout;
    b.prototype.asyncExecuteFunction = function(a) {
        e(a, 0)
    };
    b.prototype.executeBatch_ = function() {
        for (; this.batch_ && this.batch_.length;) {
            var a =
                this.batch_;
            this.batch_ = [];
            for (var b = 0; b < a.length; ++b) {
                var c = a[b];
                a[b] = null;
                try {
                    c()
                } catch (k) {
                    this.asyncThrow_(k)
                }
            }
        }
        this.batch_ = null
    };
    b.prototype.asyncThrow_ = function(a) {
        this.asyncExecuteFunction(function() {
            throw a;
        })
    };
    var c = function(a) {
        this.state_ = 0;
        this.result_ = void 0;
        this.onSettledCallbacks_ = [];
        var b = this.createResolveAndReject_();
        try {
            a(b.resolve, b.reject)
        } catch (h) {
            b.reject(h)
        }
    };
    c.prototype.createResolveAndReject_ = function() {
        function a(a) {
            return function(f) {
                c || (c = !0, a.call(b, f))
            }
        }
        var b = this,
            c = !1;
        return {
            resolve: a(this.resolveTo_),
            reject: a(this.reject_)
        }
    };
    c.prototype.resolveTo_ = function(a) {
        if (a === this) this.reject_(new TypeError("A Promise cannot resolve to itself"));
        else if (a instanceof c) this.settleSameAsPromise_(a);
        else {
            a: switch (typeof a) {
                case "object":
                    var b = null != a;
                    break a;
                case "function":
                    b = !0;
                    break a;
                default:
                    b = !1
            }
            b ? this.resolveToNonPromiseObj_(a) : this.fulfill_(a)
        }
    };
    c.prototype.resolveToNonPromiseObj_ = function(a) {
        var b = void 0;
        try {
            b = a.then
        } catch (h) {
            this.reject_(h);
            return
        }
        "function" == typeof b ? this.settleSameAsThenable_(b, a) : this.fulfill_(a)
    };
    c.prototype.reject_ = function(a) {
        this.settle_(2, a)
    };
    c.prototype.fulfill_ = function(a) {
        this.settle_(1, a)
    };
    c.prototype.settle_ = function(a, b) {
        if (0 != this.state_) throw Error("Cannot settle(" + a + ", " + b + "): Promise already settled in state" + this.state_);
        this.state_ = a;
        this.result_ = b;
        this.executeOnSettledCallbacks_()
    };
    c.prototype.executeOnSettledCallbacks_ = function() {
        if (null != this.onSettledCallbacks_) {
            for (var a = 0; a < this.onSettledCallbacks_.length; ++a) g.asyncExecute(this.onSettledCallbacks_[a]);
            this.onSettledCallbacks_ = null
        }
    };
    var g = new b;
    c.prototype.settleSameAsPromise_ = function(a) {
        var b = this.createResolveAndReject_();
        a.callWhenSettled_(b.resolve, b.reject)
    };
    c.prototype.settleSameAsThenable_ = function(a, b) {
        var c = this.createResolveAndReject_();
        try {
            a.call(b, c.resolve, c.reject)
        } catch (k) {
            c.reject(k)
        }
    };
    c.prototype.then = function(a, b) {
        function d(a, b) {
            return "function" == typeof a ? function(b) {
                try {
                    e(a(b))
                } catch (m) {
                    f(m)
                }
            } : b
        }
        var e, f, l = new c(function(a, b) {
            e = a;
            f = b
        });
        this.callWhenSettled_(d(a, e), d(b, f));
        return l
    };
    c.prototype.catch = function(a) {
        return this.then(void 0, a)
    };
    c.prototype.callWhenSettled_ = function(a, b) {
        function c() {
            switch (d.state_) {
                case 1:
                    a(d.result_);
                    break;
                case 2:
                    b(d.result_);
                    break;
                default:
                    throw Error("Unexpected state: " + d.state_);
            }
        }
        var d = this;
        null == this.onSettledCallbacks_ ? g.asyncExecute(c) : this.onSettledCallbacks_.push(c)
    };
    c.resolve = d;
    c.reject = function(a) {
        return new c(function(b, c) {
            c(a)
        })
    };
    c.race = function(a) {
        return new c(function(b, c) {
            for (var e = $jscomp.makeIterator(a), f = e.next(); !f.done; f = e.next()) d(f.value).callWhenSettled_(b, c)
        })
    };
    c.all = function(a) {
        var b = $jscomp.makeIterator(a),
            e = b.next();
        if (e.done) return d([]);
        return new c(function(a, c) {
            function f(b) {
                return function(c) {
                    g[b] = c;
                    h--;
                    0 == h && a(g)
                }
            }
            var g = [],
                h = 0;
            do g.push(void 0), h++, d(e.value).callWhenSettled_(f(g.length - 1), c), e = b.next(); while (!e.done)
        })
    };
    return c
}, "es6", "es3");
$jscomp.SYMBOL_PREFIX = "jscomp_symbol_";
$jscomp.initSymbol = function() {
    $jscomp.initSymbol = function() {};
    $jscomp.global.Symbol || ($jscomp.global.Symbol = $jscomp.Symbol)
};

$jscomp.SymbolClass = function (a, b) {
    this.$jscomp$symbol$id_ = a;
    $jscomp.defineProperty(this, "description", {
        configurable: !0,
        writable: !0,
        value: b
    });
};

$jscomp.SymbolClass.prototype.toString = function () {
    return this.$jscomp$symbol$id_
};

$jscomp.Symbol = function () {
    function a(d) {
        if (this instanceof a) throw new TypeError("Symbol is not a constructor");
        return new $jscomp.SymbolClass($jscomp.SYMBOL_PREFIX + (d || "") + "_" + b++, d)
    }

    var b = 0;
    return a
}();

$jscomp.initSymbolIterator = function () {
    $jscomp.initSymbol();
    var a = $jscomp.global.Symbol.iterator;
    a || (a = $jscomp.global.Symbol.iterator = $jscomp.global.Symbol("Symbol.iterator"));
    "function" != typeof Array.prototype[a] && $jscomp.defineProperty(Array.prototype, a, {
        configurable: !0,
        writable: !0,
        value: function () {
            return $jscomp.iteratorPrototype($jscomp.arrayIteratorImpl(this))
        }
    });
    $jscomp.initSymbolIterator = function () {}
};

$jscomp.initSymbolAsyncIterator = function () {
    $jscomp.initSymbol();
    var a = $jscomp.global.Symbol.asyncIterator;
    a || (a = $jscomp.global.Symbol.asyncIterator = $jscomp.global.Symbol("Symbol.asyncIterator"));
    $jscomp.initSymbolAsyncIterator = function () {}
};

$jscomp.iteratorPrototype = function (a) {
    $jscomp.initSymbolIterator();
    a = {
        next: a
    };
    a[$jscomp.global.Symbol.iterator] = function () {
        return this
    };
    return a
};

$jscomp.underscoreProtoCanBeSet = function () {
    var a = {
        a: !0
    }, b = {};
    try {
        return b.__proto__ = a, b.a
    } catch (d) {}
    return !1
};

$jscomp.setPrototypeOf = "function" == typeof Object.setPrototypeOf ? Object.setPrototypeOf : $jscomp.underscoreProtoCanBeSet() ? function (a, b) {
    a.__proto__ = b;
    if (a.__proto__ !== b) throw new TypeError(a + " is not extensible");
    return a
} : null;

$jscomp.generator = {};

$jscomp.generator.ensureIteratorResultIsObject_ = function (a) {
    if (!(a instanceof Object)) throw new TypeError("Iterator result " + a + " is not an object");
};

$jscomp.generator.Context = function () {
    this.isRunning_ = !1;
    this.yieldAllIterator_ = null;
    this.yieldResult = void 0;
    this.nextAddress = 1;
    this.finallyAddress_ = this.catchAddress_ = 0;
    this.finallyContexts_ = this.abruptCompletion_ = null
};

$jscomp.generator.Context.prototype.start_ = function () {
    if (this.isRunning_) throw new TypeError("Generator is already running");
    this.isRunning_ = !0
};

$jscomp.generator.Context.prototype.stop_ = function () {
    this.isRunning_ = !1
};

$jscomp.generator.Context.prototype.jumpToErrorHandler_ = function () {
    this.nextAddress = this.catchAddress_ || this.finallyAddress_
};

$jscomp.generator.Context.prototype.next_ = function (a) {
    this.yieldResult = a
};

$jscomp.generator.Context.prototype.throw_ = function (a) {
    this.abruptCompletion_ = {
        exception: a,
        isException: !0
    };
    this.jumpToErrorHandler_()
};

$jscomp.generator.Context.prototype.return = function (a) {
    this.abruptCompletion_ = {
        return: a
    };
    this.nextAddress = this.finallyAddress_
};

$jscomp.generator.Context.prototype.jumpThroughFinallyBlocks = function (a) {
    this.abruptCompletion_ = {
        jumpTo: a
    };
    this.nextAddress = this.finallyAddress_
};

$jscomp.generator.Context.prototype.yield = function (a, b) {
    this.nextAddress = b;
    return {
        value: a
    }
};

$jscomp.generator.Context.prototype.yieldAll = function (a, b) {
    a = $jscomp.makeIterator(a);
    var d = a.next();
    $jscomp.generator.ensureIteratorResultIsObject_(d);
    if (d.done) this.yieldResult = d.value, this.nextAddress = b;
    else return this.yieldAllIterator_ = a, this.yield(d.value, b)
};

$jscomp.generator.Context.prototype.jumpTo = function (a) {
    this.nextAddress = a
};

$jscomp.generator.Context.prototype.jumpToEnd = function () {
    this.nextAddress = 0
};

$jscomp.generator.Context.prototype.setCatchFinallyBlocks = function (a, b) {
    this.catchAddress_ = a;
    void 0 != b && (this.finallyAddress_ = b)
};

$jscomp.generator.Context.prototype.setFinallyBlock = function (a) {
    this.catchAddress_ = 0;
    this.finallyAddress_ = a || 0
};

$jscomp.generator.Context.prototype.leaveTryBlock = function (a, b) {
    this.nextAddress = a;
    this.catchAddress_ = b || 0
};

$jscomp.generator.Context.prototype.enterCatchBlock = function (a) {
    this.catchAddress_ = a || 0;
    a = this.abruptCompletion_.exception;
    this.abruptCompletion_ = null;
    return a
};

$jscomp.generator.Context.prototype.enterFinallyBlock = function (a, b, d) {
    d ? this.finallyContexts_[d] = this.abruptCompletion_ : this.finallyContexts_ = [this.abruptCompletion_];
    this.catchAddress_ = a || 0;
    this.finallyAddress_ = b || 0
};

$jscomp.generator.Context.prototype.leaveFinallyBlock = function (a, b) {
    b = this.finallyContexts_.splice(b || 0)[0];
    if (b = this.abruptCompletion_ = this.abruptCompletion_ || b) {
        if (b.isException) return this.jumpToErrorHandler_();
        void 0 != b.jumpTo && this.finallyAddress_ < b.jumpTo ? (this.nextAddress = b.jumpTo, this.abruptCompletion_ = null) : this.nextAddress = this.finallyAddress_
    } else this.nextAddress = a
};

$jscomp.generator.Context.prototype.forIn = function (a) {
    return new $jscomp.generator.Context.PropertyIterator(a)
};

$jscomp.generator.Context.PropertyIterator = function (a) {
    this.object_ = a;
    this.properties_ = [];
    for (var b in a) this.properties_.push(b);
    this.properties_.reverse()
};

$jscomp.generator.Context.PropertyIterator.prototype.getNext = function () {
    for (; 0 < this.properties_.length;) {
        var a = this.properties_.pop();
        if (a in this.object_) return a
    }
    return null
};

$jscomp.generator.Engine_ = function (a) {
    this.context_ = new $jscomp.generator.Context;
    this.program_ = a
};

$jscomp.generator.Engine_.prototype.next_ = function (a) {
    this.context_.start_();
    if (this.context_.yieldAllIterator_) return this.yieldAllStep_(this.context_.yieldAllIterator_.next, a, this.context_.next_);
    this.context_.next_(a);
    return this.nextStep_()
};

$jscomp.generator.Engine_.prototype.return_ = function (a) {
    this.context_.start_();
    var b = this.context_.yieldAllIterator_;
    if (b) return this.yieldAllStep_("return" in b ? b["return"] : function (a) {
        return {value: a, done: !0}
    }, a, this.context_.return);
    this.context_.return(a);
    return this.nextStep_()
};

$jscomp.generator.Engine_.prototype.throw_ = function (a) {
    this.context_.start_();
    if (this.context_.yieldAllIterator_) return this.yieldAllStep_(this.context_.yieldAllIterator_["throw"], a, this.context_.next_);
    this.context_.throw_(a);
    return this.nextStep_()
};

$jscomp.generator.Engine_.prototype.yieldAllStep_ = function (a, b, d) {
    try {
        var e = a.call(this.context_.yieldAllIterator_, b);
        $jscomp.generator.ensureIteratorResultIsObject_(e);
        if (!e.done) return this.context_.stop_(), e;
        var c = e.value
    } catch (g) {
        return this.context_.yieldAllIterator_ = null, this.context_.throw_(g), this.nextStep_()
    }
    this.context_.yieldAllIterator_ = null;
    d.call(this.context_, c);
    return this.nextStep_()
};

$jscomp.generator.Engine_.prototype.nextStep_ = function () {
    for (; this.context_.nextAddress;) try {
        var a = this.program_(this.context_);
        if (a) return this.context_.stop_(), {value: a.value, done: !1}
    } catch (b) {
        this.context_.yieldResult = void 0, this.context_.throw_(b)
    }
    this.context_.stop_();
    if (this.context_.abruptCompletion_) {
        a = this.context_.abruptCompletion_;
        this.context_.abruptCompletion_ = null;
        if (a.isException) throw a.exception;
        return {value: a.return, done: !0}
    }
    return {value: void 0, done: !0}
};

$jscomp.generator.Generator_ = function (a) {
    this.next = function (b) {
        return a.next_(b)
    };
    this.throw = function (b) {
        return a.throw_(b)
    };
    this.return = function (b) {
        return a.return_(b)
    };
    $jscomp.initSymbolIterator();
    this[Symbol.iterator] = function () {
        return this
    }
};

$jscomp.generator.createGenerator = function (a, b) {
    b = new $jscomp.generator.Generator_(new $jscomp.generator.Engine_(b));
    $jscomp.setPrototypeOf && $jscomp.setPrototypeOf(b, a.prototype);
    return b
};

$jscomp.asyncExecutePromiseGenerator = function (a) {
    function b(b) {
        return a.next(b)
    }

    function d(b) {
        return a.throw(b)
    }

    return new Promise(function (e, c) {
        function g(a) {
            a.done ? e(a.value) : Promise.resolve(a.value).then(b, d).then(g, c)
        }

        g(a.next())
    })
};

$jscomp.asyncExecutePromiseGeneratorFunction = function (a) {
    return $jscomp.asyncExecutePromiseGenerator(a())
};

$jscomp.asyncExecutePromiseGeneratorProgram = function (a) {
    return $jscomp.asyncExecutePromiseGenerator(new $jscomp.generator.Generator_(new $jscomp.generator.Engine_(a)))
};

function pixelate_post() {
    var a, b, d, e;
    return $jscomp.asyncExecutePromiseGeneratorProgram(function (c) {
        switch (c.nextAddress) {
            case 1:
                a = new FormData;
                if (!file || !check_format()) {
                    c.jumpTo(0);
                    break;
                }
                c.setCatchFinallyBlocks(3);
                a.append("file", file);
                return c.yield(fetch(document.location.origin + "/upload-servlet", {
                    method: "POST",
                    body: a,
                    enctype: "multipart/form-data",
                    headers: {
                        range: range.value,
                        format: fformat
                    }
                }), 5);
            case 5:
                return b = c.yieldResult, c.yield(b.blob(), 6);
            case 6:
                blob = c.yieldResult;
                d = new FileReader;
                d.onloadend = function () {
                    document.querySelector("img").src = d.result
                };
                d.readAsDataURL(blob);
                c.leaveTryBlock(0);
                break;
            case 3:
                e = c.enterCatchBlock(), console.log(e), c.jumpToEnd()
        }
    })
}

function check_format() {
    fformat = file.name.substr(file.name.lastIndexOf(".", file.name.length) + 1);
    fname = file.name.slice(file.name.start, file.name.lastIndexOf("."));
    fformat = fformat.toLowerCase();
    var a = document.getElementById("error-text"),
        b = document.getElementById("file-size"),
        d = document.getElementById("file-name-label"),
        e = document.getElementById("file-format");
    if ("png" === fformat || "bmp" === fformat || "jpeg" === fformat || "jpg" === fformat) {
        if (1024 < fsize) return a.textContent = "", b.textContent = "File size: " + bytesToSize(fsize), d.textContent = "Name: " + fname, e.textContent = "Format: " + fformat, !0;
        a.textContent = "File corrupted.";
        return !1
    }
    a.textContent = "Wrong file format. Choose other.";
    return !1
}

function preview_file() {
    document.getElementById("range-num").value = 1;
    document.getElementById("range").value = 1;
    document.getElementById("error-text").textContent = "";
    document.getElementById("file-size").textContent = "";
    document.getElementById("file-name-label").textContent = "";
    document.getElementById("file-format").textContent = "";
    if (file = document.querySelector("input[type=file]").files[0]) fsize = document.querySelector("input[type=file]").files[0].size;
    var a = document.querySelector("img"),
        b = new FileReader;
    b.onloadend = function () {
        a.src = b.result
    };
    file && check_format() ? b.readAsDataURL(file) : a.src = ""
}

function range_changed(a) {
    range = document.getElementById("range");
    range_num = document.getElementById("range-num");
    "range" === a ? (range_num.value = range.value, range.oninput = function () {
        range_num.innerHTML = this.value
    }, pixelate_post()) : 100 >= range_num.value && 1 <= range_num.value && (range.value = range_num.value, range_num.oninput = function () {
        range.innerHTML = this.value
    }, pixelate_post())
}

function download_image(a) {
    if (file && check_format()) {
        var b = document.createElement("a");
        b.setAttribute("download", "pixelate." + a);
        b.setAttribute("href", document.getElementById("image-res").src);
        b.click();
        b.remove()
    }
}

function bytesToSize(a) {
    var b = parseInt(Math.floor(Math.log(a) / Math.log(1024)));
    return Math.round(a / Math.pow(1024, b), 2) + " " + ["Bytes", "KB", "MB", "GB", "TB"][b]
};
