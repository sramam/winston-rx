"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
var base_1 = require("./base");
exports.Transport = base_1.Transport;
var console_1 = require("./console");
exports.ConsoleTransport = console_1.ConsoleTransport;
var file_1 = require("./file");
exports.FileTransport = file_1.FileTransport;
exports.coreTransports = {
    'file': index_1.FileTransport,
    'console': index_1.ConsoleTransport
};
