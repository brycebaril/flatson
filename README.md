# flatson

[![NPM](https://nodei.co/npm/flatson.png)](https://nodei.co/npm/flatson/)

flatson is a command-line tool to help make newline-delimited json greppable.

## Usage

`npm -g install flatson`

```
$ cat input.ndjson 
{"this": "is a line of json"}
{"a": ["b", 2, {"cat": "dog"}], "b": {"c": []}}
this is not json
"this is json"

$ cat input.ndjson | flatson
[0].this: "is a line of json"
[1].a[0]: "b"
[1].a[1]: 2
[1].a[2].cat: "dog"
[1].b.c[]: null
JSON parse error on line [2]
[2].: "this is json"
[3].so: "is this"
[3].is: 124

$ tail -3 data.ndjson
{"time":1472109391577,"id":"3b99deea5251ab7542e9c2bd43aea615f39c8b72","widgets":32}
{"time":1472109391729,"id":"bfaaf1634137d9bc77d055582c059428b1ceef7e","widgets":512}
{"time":1472109391809,"id":"66d84428c79301cb6f9af23afe5a283ee61b68b3","widgets":32352}

$ cat data.ndjson | flatson | grep widgets
...
[231].widgets: 19
[232].widgets: 55
[233].widgets: 692
[234].widgets: 32
[235].widgets: 512
[236].widgets: 32352

$ cat data.ndjson | flatson | grep widgets | unflat
...
{"widgets":19}
{"widgets":692}
{"widgets":32}
{"widgets":512}
{"widgets":32352}
```

Each line starts with the row number in the original `ndjson` input (0 indexed) and then each nested value inside each row is expanded to a single row in the output.

This installs two commands:
* `flatson` which will flatten ndjson for easy grepping
* `unflat` which will unflatten the flatson output into objects again

Both tools do their best to ignore errors, though they may warn about errors to STDERR.

# LICENSE

MIT