# Snapshot report for `build/utils/logger/test/console.js`

The actual snapshot is saved in `console.js.snap`.

Generated by [AVA](https://ava.li).

## clone

> {
  "stdoutCache": "\u001b[32m[info]\u001b[39m Just an info message 1\n\u001b[32m[info]\u001b[39m[app] App message  {\"extra\":\"extra info\"}\n\u001b[32m[info]\u001b[39m Just an info message 2\n"
}

    `[32m[info][39m Just an info message 1␊
    [32m[info][39m[app] App message  {"extra":"extra info"}␊
    [32m[info][39m Just an info message 2␊
    `

## explicitly set logger in transport

> {
  "stdoutCache": "\u001b[32m[info]\u001b[39m Just an info message\n"
}

    `[32m[info][39m Just an info message␊
    `

## logger - console transport - info

> {
  "stdoutCache": "\u001b[32m[info]\u001b[39m Just an info message\n\u001b[31m[error]\u001b[39m this is a mock error for testing\n"
}

    `[32m[info][39m Just an info message␊
    [31m[error][39m this is a mock error for testing␊
    `

## logger - console transport - silly

> {
  "stdoutCache": "\u001b[32m[info]\u001b[39m Just an info message\n\u001b[31m[error]\u001b[39m this is a mock error for testing\n\u001b[35m[silly]\u001b[39m It' silly how much information one can log  {\"a\":1}\n\u001b[35m[silly]\u001b[39m It' silly how much information one can log  {\"b\":2}\n"
}

    `[32m[info][39m Just an info message␊
    [31m[error][39m this is a mock error for testing␊
    [35m[silly][39m It' silly how much information one can log  {"a":1}␊
    [35m[silly][39m It' silly how much information one can log  {"b":2}␊
    `

## pause/resume

> {
  "stdoutCache": "\u001b[32m[info]\u001b[39m Just an info message 1\n\u001b[32m[info]\u001b[39m Just an info message 3\n"
}

    `[32m[info][39m Just an info message 1␊
    [32m[info][39m Just an info message 3␊
    `

## reuse transport stream

> {
  "stdoutCache": "\u001b[32m[info]\u001b[39m Just an info message\n"
}

    `[32m[info][39m Just an info message␊
    

## loglevels - syslogLevels

> {
  "stdoutCache": "\u001b[33m[alert]\u001b[39m this is a mock alert for testing\n"
}

    `[33m[alert][39m this is a mock alert for testing␊
    

## init with externally created log

> {
  "stdoutCache": "\u001b[32m[info]\u001b[39m[otherLogger] Just a info log\n"
}

    `[32m[info][39m[otherLogger] Just a info log␊
    

## loglevels - syslogLevels - direct initialization

> {
  "stdoutCache": "\u001b[33m[alert]\u001b[39m this is a mock alert for testing\n"
}

    `[33m[alert][39m this is a mock alert for testing␊
    `

## loglevels - syslogLevels - init()

> {
  "stdoutCache": "\u001b[33m[alert]\u001b[39m this is a mock alert for testing\n"
}

    `[33m[alert][39m this is a mock alert for testing␊
    `