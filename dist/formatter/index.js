"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const json_1 = require("./json");
const index_1 = require("./index");
var string_1 = require("./string");
exports.stringFormatter = string_1.stringFormatter;
exports.formatters = {
    'json': json_1.jsonFormatter,
    'string': index_1.stringFormatter
};
