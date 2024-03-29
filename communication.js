! function (e, t) {
    if ("object" == typeof exports && "object" == typeof module) module.exports = t();
    else if ("function" == typeof define && define.amd) define([], t);
    else {
        var n = t();
        for (var r in n)("object" == typeof exports ? exports : e)[r] = n[r]
    }
}(window, (function () {
    debugger;
    return function (e) {
        var t = {};

        function n(r) {
            if (t[r]) return t[r].exports;
            var i = t[r] = {
                i: r,
                l: !1,
                exports: {}
            };
            return e[r].call(i.exports, i, i.exports, n), i.l = !0, i.exports
        }
        return n.m = e, n.c = t, n.d = function (e, t, r) {
            n.o(e, t) || Object.defineProperty(e, t, {
                enumerable: !0,
                get: r
            })
        }, n.r = function (e) {
            "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
                value: "Module"
            }), Object.defineProperty(e, "__esModule", {
                value: !0
            })
        }, n.t = function (e, t) {
            if (1 & t && (e = n(e)), 8 & t) return e;
            if (4 & t && "object" == typeof e && e && e.__esModule) return e;
            var r = Object.create(null);
            if (n.r(r), Object.defineProperty(r, "default", {
                    enumerable: !0,
                    value: e
                }), 2 & t && "string" != typeof e)
                for (var i in e) n.d(r, i, function (t) {
                    return e[t]
                }.bind(null, i));
            return r
        }, n.n = function (e) {
            var t = e && e.__esModule ? function () {
                return e.default
            } : function () {
                return e
            };
            return n.d(t, "a", t), t
        }, n.o = function (e, t) {
            return Object.prototype.hasOwnProperty.call(e, t)
        }, n.p = "", n(n.s = 0)
    }([function (e, t, n) {
        "use strict";
        var r = this && this.__assign || function () {
            return (r = Object.assign || function (e) {
                for (var t, n = 1, r = arguments.length; n < r; n++)
                    for (var i in t = arguments[n]) Object.prototype.hasOwnProperty.call(
                        t, i) && (e[i] = t[i]);
                return e
            }).apply(this, arguments)
        };
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.Communication = void 0;
        var i = function () {
            function e(e, t) {
                var n = this;
                this.targetInfo = {
                        referer: ""
                    }, this.connected = !1, this.uuid = 1, this.header = {}, this.eventHandler =
                    function (e) {
                        var t = e.data;
                        switch (n.onmessage && n.onmessage(e), t.type) {
                            case "PUT":
                                if (t.header.hasOwnProperty("Reply-UUID"))
                                    for (var r = 0; r < n.pendingList.length; r++) {
                                        if (n.pendingList[r].uuid === t.header["Reply-UUID"]) {
                                            n.pendingList.splice(r, 1)[0].callback(t.data, e);
                                            break
                                        }
                                    } else "function" == typeof n.receiverAction && n.receiverAction(
                                        t.data, e);
                                break;
                            case "GET":
                                "function" == typeof n.providerAction && n.sendMessage({
                                    type: "PUT",
                                    header: {
                                        "Reply-UUID": t.uuid
                                    },
                                    data: n.providerAction(t.data, e)
                                });
                                break;
                            case "OPTIONS":
                                if (!n.connected) {
                                    var i = location.origin + location.pathname;
                                    i === n.targetInfo.referer && (n.connected = !0), n.targetInfo
                                        .referer = i, n.handshake()
                                }
                        }
                    }, this.pendingList = [], this.target = e, this.options = r({
                        targetOrigin: "*"
                    }, t)
            }
            // TODO
            return e.prototype.init = function () {
                addEventListener("message", this.eventHandler), this.handshake()
            }, e.prototype.destroy = function () {
                removeEventListener("message", this.eventHandler), this.connected = !1
            }, e.prototype.setHeader = function (e) {
                this.header = e
            }, e.prototype.put = function (e) {
                this.sendMessage("PUT", e)
            }, e.prototype.get = function (e, t) {
                var n = this.getNewUUID();
                this.pendingList.push({
                    uuid: n,
                    callback: t
                }), this.sendMessage({
                    uuid: n,
                    type: "GET",
                    data: e
                })
            }, e.prototype.handshake = function () {
                this.sendMessage({
                    type: "OPTIONS",
                    header: {
                        Origin: location.origin,
                        Pathname: location.pathname,
                        Referer: this.targetInfo.referer
                    },
                    data: ""
                })
            }, e.prototype.sendMessage = function () {
                for (var e, t = [], n = 0; n < arguments.length; n++) t[n] = arguments[n];
                switch (t.length) {
                    case 1:
                        var i = t[0],
                            o = void 0;
                        o = "string" == typeof i.data ? "text/plain" : "application/json",
                            i.uuid = null !== (e = i.uuid) && void 0 !== e ? e : this.getNewUUID(),
                            i.header = r(r(r({}, this.header), {
                                "Content-Type": o
                            }), i.header), this.target.postMessage(r(r({}, i), {
                                timestamp: (new Date).getTime()
                            }), this.options.targetOrigin);
                        break;
                    case 2:
                        var a = t[0],
                            s = t[1];
                        this.sendMessage({
                            type: a,
                            data: s
                        })
                }
            }, e.prototype.getNewUUID = function () {
                return this.uuid++
            }, e.version = "0.2.2", e
        }();
        t.Communication = i
    }])
}));
//# sourceMappingURL=communication.min.js.map
