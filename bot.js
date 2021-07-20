const Discord = require('discord.js');
const { Client, MessageAttachment, MessageEmbed } = require('discord.js');
const { token } = require('./json_home/token.json');
const prefix = require('./json_home/prefix.json');
const ytdl = require('ytdl-core');
const client = new Client();
client.login(token);




// 連上線時的事件
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

// 當 Bot 接收到訊息時的事件
client.on('message', msg => {
    //只有人打的訊息有用
    try{
        if(!msg.guild || !msg.member) return;
        if(!msg.member.user) return;
        if(msg.member.user.bot) return;
    }catch(err){
        return;
    }
    //回應
    try{
        let tempPrefix = '-1';
        const prefixED = Object.keys(prefix); //前綴符號定義
        prefixED.forEach(element => {
            if (msg.content.substring(0, prefix[element].Value.length) === prefix[element].Value) {
                tempPrefix = element;
            }
        });

        switch (tempPrefix) {
            case '0': //文字回應功能
                const cmd = msg.content.substring(prefix[tempPrefix].Value.length).split(' '); //以空白分割前綴以後的字串
                switch(cmd[0]){
                    case '嗨':
                        msg.channel.send('嗨');
                        break;
                    case '晚安':
                        msg.channel.send('$&*%@晚安 #%&$*再見');
                        break;
                    case '早安':
                        msg.channel.send('早安');
                        break;
                    case '冠廷':
                        msg.channel.send('\\'+'\*'+'躺在沙發上抓肚子'+'\\'+'\*');
                        break;
                    case '好油喔':
                        msg.channel.send('\\'+'\*'+'冠廷發出peko peko的叫聲'+'\\'+'\*');
                        break;
                    case '冠廷幫我買遊戲':
                        msg.channel.send('0');
                        break;
                    case '推薦的漫畫':
                        msg.channel.send('沒有');
                        break;
                    case '拜託別煩我':
                        msg.channel.send('闖進我的生活');
                        break;
                    case '天黑請閉眼':
                        msg.channel.send('我在你身邊');
                        break;
                    case '謝謝^^':
                        msg.channel.send('生日快樂');
                        break;
                    case '打麻將':
                        msg.channel.send('老子直接在留言區跟你打麻將\n       🀙🀚🀛🀜🀝🀞🀟🀠🀡🀢🀣\n🀥       🀗🀐🀏🀎🀍🀌🀋🀊🀉        🀥\n🀖     🀗                                      🀙      🀥\n🀘     🀗                                      🀙      🀔\n🀕     🀡                                      🀁      🀁\n🀖     🀗                                      🀁      🀁\n🀘       🀎🀍🀌🀋🀊🀉🀇🀉🀇        🀁\n      🀐🀏🀎🀍🀌🀋🀊🀉🀇🀆🀅🀁');
                        break;
                    case '貓貓':
                        const attachment_cat = new MessageAttachment('https://i.imgur.com/OwbpzBK.jpeg');
                        msg.channel.send(attachment_cat);
                        break;
                    case 'かわ余':
                        const attachment_oil = new MessageAttachment('https://pbs.twimg.com/media/EnatPS3VQAA2bFK.jpg');
                        msg.channel.send(attachment_oil);
                        break;
                    case '柴柴':
                        const attachment_dog = new MessageAttachment('https://64.media.tumblr.com/ec33ba338c7791c1138e177a2246e3ff/tumblr_psdlsbzpqO1rnbunpo1_1280.jpg');
                        msg.channel.send(attachment_dog);
                        break;
                    case '測試':
                        const embed = new MessageEmbed()
                        // Set the title of the field
                        .setTitle('注意')
                        // Set the color of the embed
                        .setColor(0x3f9fff)
                        // Set the main content of the embed
                        .setDescription('感謝你的注意');
                        // Send the embed to the same channel as the message
                        msg.channel.send(embed);
                    case '冠廷生日快樂':
                        const attachment_birthday = new MessageAttachment('https://pbs.twimg.com/media/EpDHCHOVQAEfw19.jpg');
                        msg.channel.send(attachment_birthday);
                        msg.content = '@play https://www.youtube.com/watch?v=_P2d0Q53I2Q'
                        msg.channel.send('百鬼直接在你的聊天室唱歌\nhttps://www.youtube.com/watch?v=_P2d0Q53I2Q');
                        MusicFunction(msg);
                        break;
                }
                break;
            case '1': //音樂指令
                MusicFunction(msg);
                break;
        }

    }catch(err){
        return;
    }
});

//#region 音樂系統

//歌曲清單
let musicList = new Array();

function MusicFunction(msg) {
    //將訊息內的前綴字截斷，後面的字是我們要的
    const content = msg.content.substring(prefix[1].Value.length);
    //指定我們的間隔符號
    const splitText = ' ';
    //用間隔符號隔開訊息 contents[0] = 指令,contents[1] = 參數
    const contents = content.split(splitText);

    switch (contents[0]) {
        case 'play':
            //點歌&播放歌曲功能
            playMusic(msg, contents);
            break;
        case 'replay':
            //重播當前歌曲
            break;
        case 'np':
            //當前歌曲資訊
            break;
        case 'queue':
            //歌曲清單
            break;
        case 'skip':
            //中斷歌曲
            break;
        case 'disconnect':
            //退出語音頻道並且清空歌曲清單
            disconnectMusic(msg.guild.id, msg.channel.id);
            break;
    }
}

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
                            //msg.reply('來了~');
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

//?play 遞迴函式
async function playMusic2(connection, guildID, channelID) {
    try {
        //播放前歌曲清單不能沒有網址
        if (musicList.length > 0) {
            //設定音樂相關參數
            const streamOptions = {
                seek: 0,
                volume: 0.5,
                Bitrate: 192000,
                Passes: 1,
                highWaterMark: 1
            };
            //讀取清單第一位網址
            const stream = await ytdl(musicList[0], {
                filter: 'audioonly',
                quality: 'highestaudio',
                highWaterMark: 26214400 //25ms
            })

            //播放歌曲，並且存入dispatcher
            const dispatcher = connection.play(stream, streamOptions);
            //監聽歌曲播放結束事件
            dispatcher.on("finish", finish => {
                //將清單中第一首歌清除
                if (musicList.length > 0) musicList.shift();
                //播放歌曲
                playMusic2(connection, guildID, channelID);
            })
        } else disconnectMusic(guildID, channelID); //清空歌單並且退出語音頻道
    } catch (err) {
        console.log(err, 'playMusic2Error');
    }
}

//?disconnect
function disconnectMusic(guildID, channelID) {
    try {
        //判斷bot是否在此群組的語音頻道
        if (client.voice.connections.get(guildID)) {
            //清空歌曲清單
            musicList = new Array();
            //退出語音頻道
            client.voice.connections.get(guildID).disconnect();

            client.channels.fetch(channelID).then(channel => channel.send('晚安~'));
        } else client.channels.fetch(channelID).then(channel => channel.send('可是..我還沒進來:3'))
    } catch (err) {
        console.log(err, 'disconnectMusicError');
    }
}