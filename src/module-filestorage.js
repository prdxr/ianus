import { exec } from "node:child_process";
import fs from "fs";
import path from "path";

// list share command
export function listShare(ctx) {
    exec(`ls ${process.env.SHARE_PATH}`, (err, stdout) => {
        if (err) {
            return ctx.reply('Error getting share folder: ' + err.message);
        }
        ctx.reply(`result:\n${stdout}`);
    });
}

// get file command
export function getFromShare(ctx, filename) {
    let filepath = path.join(process.env.SHARE_PATH, filename);
    console.log(filepath);
    fs.readFile(filepath, (err, data) => {
        if (!err) {
            console.log('received data: ' + data);
            ctx.telegram.sendDocument(ctx.from.id, {
                source: data,
                filename: filename
            }).catch(function (err) { console.log(err); });
        } else {
            console.log(err)
        }
    })
}

// post file command
