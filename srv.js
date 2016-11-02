/*
 *********************************************************************************
 *                     Copyright (C) 2016 wystan
 *
 *       filename: srv.js
 *    description: 
 *        created: 2016-10-31 18:00:02
 *         author: wystan
 *
 *********************************************************************************
 */


function main() {
    var express = require('express');
    var app = express();
    var process = require('child_process');
    var log = require("log4js").getLogger("ci");

    app.get("/adb/:cmd", function(req, res) {
        var cmd = "adb " + req.params.cmd;
        log.info("=>"+cmd);
        process.exec(cmd, function (err, stdout, stderr) {
            res.send(stdout);
        });
        log.info("=>DONE");
    });

    app.get("/build/:prod", function(req, res) {
        var cur_dir = "/Users/winner/usr/project/le/" + req.params.prod + "/script";
        var opts = {
            cwd: cur_dir,
            stdio: [0, 1, 2],
        };

        if (req.params.prod != "x10" && req.params.prod != "turbo") {
            res.send("invalid product " + req.params.prod + "\n");
            log.error("invalid product " + req.params.prod);
            return;
        }
        res.send("build " + req.params.prod + "\n");
        log.info("=>product " + req.params.prod);
        log.info("=>do get.sh");
        var cmd = process.spawnSync("./get.sh", opts);
        if (cmd.status != 0) {
            return;
        }
        log.info("=>do flash.sh");
        cmd = process.spawnSync("./flash.sh", opts);
        if (cmd.status != 0) {
            return;
        }
        log.info("=>do first.sh");
        cmd = process.spawnSync("./first.sh", opts);
        if (cmd.status != 0) {
            return;
        }
        log.info("=>DONE");
    });

    log.info("ci server started");
    app.listen(8080);
}

main();

/************************************* END **************************************/
