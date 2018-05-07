"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk = require("chalk");
function stringFormatter(data) {
    let { level, timestamp, name, color, msg } = data, rest = __rest(data, ["level", "timestamp", "name", "color", "msg"]);
    level = color ? chalk[color](`[${level}]`) : `[${level}]`;
    timestamp = timestamp ? `[${timestamp}]` : ``;
    name = !name || name === 'default' ? `` : `[${name}]`;
    const rest_ = Object.keys(rest).length ? `  ${JSON.stringify(rest)}` : ``;
    return `${level}${timestamp}${name} ${msg}${rest_}\n`;
}
exports.stringFormatter = stringFormatter;
