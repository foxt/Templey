# Templey

## [on npm for some reason](https://www.npmjs.com/package/tempely)

### Using as a standalone script

```node templey.js file```
creates file.templeybuild.txt

### Using as a module

```require("templey")("input text")```

returns processed string

## Syntax

|file:name| -- Import from a file

|http:address| and |https:address| -- response from http request

|procarg:all| and |procarg:number| -- process arguments, all is space joined

|command:command| -- run a process and return output

|filename:| -- files filename

### Example 

```hello, this is a test of |file:name.txt|, you can escape things too, watch \|file:name.txt|!

the ip address that built this is |http:api.ipify.org|

the arguments when building this were |procarg:all| and the nodejs executable is stored at |procarg:0|

the nodejs version is |command:node -v|
this files name on disk is |filename:|

|file:layers.txt|```

would produce

```hello, this is a test of templey, you can escape things too, watch |file:name.txt|!

the ip address that built this is 0.0.0.0

the arguments when building this were /usr/local/bin/node /Users/thelmgn/Documents/pinghost2/Templey/index.js hello.txt and the nodejs executable is stored at /usr/local/bin/node

the nodejs version is v10.9.0

this files name on disk is hello.txt

you can put tags in other templey scripts like this, we're running from layers.txt and we've got things!
```
