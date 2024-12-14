import { exec } from 'node:child_process';
import fs from 'fs';
import path from 'path';
import axios from 'axios';

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
export function postToShare(ctx, fileId) {
    let filepath = path.join(
        process.env.SHARE_PATH,
        ctx.message.document.file_name
    );

    ctx.telegram.getFileLink(fileId).then((link) => {
        let linkStr = link.href;

        axios({
            url: linkStr,
            method: 'get',
            responseType: 'stream'
        }).then(response => {
            return new Promise((resolve, reject) => {
                response.data.pipe(fs.createWriteStream(filepath))
                    .on('finish', () => {
                        ctx.reply(`Document is saved at ${filepath}`);
                        resolve();
                    })
                    .on('error', (err) => {
                        reject(err);
                    });
            });
        }).catch(error => {
            console.error('Axios request error: ', error);
            ctx.reply('Failed to download the file.');
        });
    }).catch(err => {
        console.error('Get file link error: ', err);
        ctx.reply('Failed to retrieve the file link.');
    });
}
