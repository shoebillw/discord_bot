//?play
async function playMusic(msg, contents) {
    //定義我們的第一個參數必需是網址
    const urlED = contents[1];
    try {
        //第一個參數不是連結就要篩選掉
        if (urlED.substring(0, 4) !== 'http') return msg.reply('The link is not working.1');

        //透過library判斷連結是否可運行
        const validate = await ytdl.validateURL(urlED);
        if (!validate) return msg.reply('The link is not working.2');

        //獲取歌曲資訊
        const info = await ytdl.getInfo(urlED);
        //判斷資訊是否正常
        if (info.videoDetails) {
            //指令下達者是否在語音頻道
            if (msg.member.voice.channel) {
                //判斷bot是否已經連到語音頻道 是:將歌曲加入歌單 不是:進入語音頻道並且播放歌曲
                if (!client.voice.connections.get(msg.guild.id)) {
                    //將歌曲加入歌單
                    musicList.push(urlED);
                    //進入語音頻道
                    msg.member.voice.channel.join()
                        .then(connection => {
                            msg.reply('來了~');
                            const guildID = msg.guild.id;
                            const channelID = msg.channel.id;
                            //播放歌曲
                            playMusic2(connection, guildID, channelID);
                        })
                        .catch(err => {
                            msg.reply('bot進入語音頻道時發生錯誤，請再試一次');
                            console.log(err, 'playMusicError2');
                        })
                } else {
                    //將歌曲加入歌單
                    musicList.push(urlED);
                    msg.reply('已將歌曲加入歌單!');
                }
            } else return msg.reply('請先進入頻道:3...');
        } else return msg.reply('The link is not working.3');
    } catch (err) {
        console.log(err, 'playMusicError');
    }
}