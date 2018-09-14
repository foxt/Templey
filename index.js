const fs = require("fs")
const path = require('path')
function httpPromise(url) {
    return new Promise(function(a,r) {
        require("http").get(url,function(res) {
            let rawData = '';
            res.on('data', (chunk) => { rawData += chunk; });
            res.on('end', () => {
                a(rawData)
            });
        })
    })
}
async function template(text,filename,a) {
    console.log(a + "Building " + filename)
    var split = text.toString().split("|");
    var out = ""
    var textual = true
    var escaped = false
    for (var s of split) {
        if (textual == true) {
            if (s.endsWith("\\")) {
                out = out + s.substring(0, s.length - 1)
                escaped = true
            } else {
                out = out + s
            }
            
            textual = false
        } else {
            if (escaped) {
                out = out + "|" + s + "|"
            } else {
                var schemepathsplit = s.split(":");
                if (schemepathsplit.length == 2) {
                    if (schemepathsplit[0] == "file") {
                        console.log(a+"   Reading file at " + schemepathsplit[1])
                        if (schemepathsplit[1] == filename) {
                            console.log(a + "       !!!! DETECTED RECURSION, NOT READING !!!!")
                        } else {
                            out = out + await template(fs.readFileSync(path.join(filename,"..",schemepathsplit[1])),schemepathsplit[1], a + "      ")
                        }
                        
                    } else if (schemepathsplit[0] == "http") {
                        console.log(a+"   Sending HTTP request to " + schemepathsplit[1])
                        out = out + await httpPromise("http://" + schemepathsplit[1])
                    } else if (schemepathsplit[0] == "https") {
                        console.log(a+"   Sending HTTPS request to " + schemepathsplit[1])
                        out = out + await httpPromise("https://" + schemepathsplit[1])
                    } else if (schemepathsplit[0] == "procarg") {
                        if (schemepathsplit[1] == "all") {
                            out = out + require("process").argv.join(" ")
                        } else {
                            out = out + require("process").argv[new Number(schemepathsplit[1])]
                        }
                    } else if (schemepathsplit[0] == "filename") {
                        out = out + filename
                    } else if (schemepathsplit[0] == "command") {
                        out = out + require('child_process').execSync(schemepathsplit[1])
                    } else {
                        throw new Error("Unknown scheme " + schemepathsplit[0] + ", known schemes are file:, http:, https:, procarg:, filename:, command:. Tag: " + s + " Filename:" + filename)
                    }
                } else {
                    throw new Error("More than 1 : in a template. There can only be one. Try this: '|file:hello.txt|'.")
                }
            }
            textual = true
            escaped = false
        }
    }
    return out
}
async function pFile(file) {
    if (fs.existsSync(file)) {
        var templated = await template(fs.readFileSync(file),file,"")
        var ext = path.extname(file)
        var name = path.basename(file, ext);
        fs.writeFileSync(name + ".templeybuild"+ext,templated)
    } else {
        throw new Error("File doesn't exist: " + file);
    }
}

module.exports = template
if (require.main === module) {
    pFile(require("process").argv[2])
}