const tmi = require('tmi.js');
const TwitchClient = require('twitch').default;
const PubSubClient = require('twitch-pubsub-client').default;
const BasicPubSubClient = require('twitch-pubsub-client').BasicPubSubClient;
const readline = require('readline');
const channel="doflamingoh2";//kamet0    kotei_zousa

const opts = {
    identity: {
        username: "BonjourBot",
        password: "i9f3ec7d39isnffpt1np5nlr5icswc"
    },
    channels: [
        channel// Legeekdulundi kotei_zousa
    ]
};
// Create a client with our options
const client = new tmi.client(opts);
var MessageHello=[];
MessageHello.push("bonjour");
MessageHello.push("bjr");
MessageHello.push("BONJOUR");
var Busy=false;
var OutOfTimeTimeOut;
var Between1=5000;
var Between2=15000;
var Participants=[];
var TempsLoose=10800;//Temps du timeout après une loose
//En millisecondes

var myVar;

//access token wtwb26gfp8nhf3241wgkgwtaw7301c
// 5s14ndsb7techm8a8p6na0znrl42gffmq6xugbkfzi827i45wo
(async () => {
    const clientID= "euo83dirbyp1rtzbjpufy0xts50196";//euo83dirbyp1rtzbjpufy0xts50196
    const clientSecret= "t7q9yhtg3db1iny3qmmmsq8cycpwzj";//t7q9yhtg3db1iny3qmmmsq8cycpwzj
    const twitchClient = TwitchClient.withCredentials(clientID, 'wtwb26gfp8nhf3241wgkgwtaw7301c', undefined, {
        clientSecret,
        refreshToken: '5s14ndsb7techm8a8p6na0znrl42gffmq6xugbkfzi827i45wo',
        onRefresh: async ({ accessToken, refreshToken, expiryDate }) => {
            const newTokenData = {
                accessToken,
                refreshToken,
                expiryTimestamp: expiryDate === null ? null : expiryDate.getTime()
            };
        }
    });
    const uID = '47681832';
    const pubSubClient = new PubSubClient(new BasicPubSubClient(5));
    await pubSubClient.registerUserListener(twitchClient, uID);
    const listener = await pubSubClient.onRedemption(uID, (message) => {
        console.log(message.rewardName == "Jeu du DERNIER A DIRE BONJOUR ")
        if(message.rewardName == "Jeu du DERNIER A DIRE BONJOUR ") // ATTENTION UN ESPACE LA FIN...
        {
            if(!Busy)
            {
                Busy=true;
                OutOfTimeTimeOut=entierAleatoire(Between1, Between2)
                PrintClient( "DITES BONJOUR A " + message.userDisplayName.toLowerCase())
                console.log("to in : " + OutOfTimeTimeOut)
                setTimeout(function() {
                    if(Participants[Participants.length-1] !=undefined)
                    {
                        PrintClient(Participants[Participants.length-1] + " tu es le dernier à dire bonjour... AU REVOIR ")
                        TimeOut(Participants[Participants.length-1],TempsLoose)
                    }
                    else
                    {
                        PrintClient("Personne n'a participé, dommage!")
                    }
                    ResetPlayer();
                },OutOfTimeTimeOut)
            }
        }
    });
})();

function entierAleatoire(min, max)
{
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
client.addListener('chat', async function ( channel,tags,message, self) {
        if (self) { return; } // Ignore messages from the bot
        
        if(Busy)//If someone is playing
        {
            message=message.toLowerCase()
            if(isHello(message))
                Participants.push(tags['display-name'].toLowerCase())//Get the name of the user who send the message
            return;
        }
});

function isHello(MessageUser)
{
    console.log("isHello message " + MessageUser)
    var i=0;
    while(i<MessageHello.length)
    {
        if(MessageUser.indexOf(MessageHello[i])!=-1)
            return true;
        i++;
    }
    return false;
}
function TimeOut(User,Time)
{
    PrintClient("/timeout "+User+ " " + Time );
}
function ResetPlayer()
{
    Busy=false;//Personne n'est dans la liste donc tous le monde peut jouer
    Participants=[];
}
client.on('connected', onConnectedHandler);
client.connect();
// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
    console.log(`* Connected to ${addr}:${port}`);
}

function PrintClient(Message)
{
    if(Message.indexOf("timeout")!=-1)
        client.say("#"+channel, Message);
    else
        client.say("#"+channel, "/me " + Message);
}

