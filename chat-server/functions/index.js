const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

// Firebase Functions SDKとFirebase Admin SDKモジュールのインポート
const admin = require('firebase-admin'); // Firebase Admin SDKでRealtime Databaseの処理及び認証をするために使用
admin.initializeApp(functions.config().firebase); // adminインスタンスの初期化

const express = require ('express'); // Expressモジュールをインポート
const app = express(); // appとしてインスタンス化

const cors = require('cors')({origin: true}); //CORSモジュールをインポートして
app.use(cors); //appにロード


// チャンネルの作成
function createChannel(cname){ //引数cnameでReatime Databaseのパスchannels/:cnameにデータを挿入する
    let channelsRef = admin.database().ref('channels'); //AdminSDKによるRealtime Databaseの操作はadmin.database()　特定のノードを参照するには.ref()
    let date1 = new Date();
    let date2 = new Date();
    date2.setSeconds(date2.getSeconds() + 1);
    const defaultData = `{
        "messages" : {
            "1" : {
                "body" : "welcome to #${cname} channel!",
                "date" : "${date1.toJSON()}",
                "user" : {
                    "avatar" : "",
                    "id" : "robot",
                    "name" : "Robot"
                }
            },
            "2" : {
                "body" : "はじめてのメッセージを投稿してみましょう。",
                "date" : "${date2.toJSON()}",
                "user" : {
                    "avatar" : "",
                    "id" : "robot",
                    "name" : "Robot"
                }
            }
        }
    }`;
    channelsRef.child(cname).set(JSON.parse(defaultData)); //参照先の子ノードの参照.child()、データの挿入は.set()
}

app.post('/channels', (req, res) => { // app.post()は第1引数のパスへPOSTリクエストが行われた際の処理を記述
    let cname = req.body.cname; // "/channels"にPOSTリクエストが行われたときにリクエストBody内のcname値をcreateChannelに渡し…
    createChannel(cname); //チャンネルの作成を行っている
    res.header('Content-Type', 'application/json; charset=utf-8');
    res.status(201).json({result: 'ok'});
});

// チャンネル一覧の取得
app.get('/channels', (req,res) => { // app.get()は第1引数のパスへGETリクエストが行われた際の処理を記述
    let channelsRef = admin.database().ref('channels'); ///channelsにGETリクエストが行われたときに、Realtime Datastoreからチャンネル名を取得し、一覧をJSONデータで返す
    channelsRef.once('value', function(snapshot){ //Realtime Databaseはデータ読み出しを行うときにvalueイベントを使う　.onceを使うことで1回だけコールバックを実行
        let items =new Array();
        snapshot.forEach(function(childSnapshot){
            let cname = childSnapshot.key;
            items.push(cname);
        });
        res.header('Content-Type', 'application/json; charset=utf-8');
        res.send({channels: items});
    });
})

// メッセージの追加
app.post('/channels/:cname/messages', (req, res) => { // パス/channels/:cname/messages内に、
    let cname = req.params.cname; // POSTリクエストが行われたときにこのパス位置にある値をreq.params.cnameにセットする
    let message = {
        date: new Date().toJSON(),
        body: req.body.body,
        user: req.user
    };
    let messagesRef = admin.database().ref('channels/${cname}/messages');
    messagesRef.push(message); // .push()メソッドでmessageオブジェクトをchannels/${cname}/messageパスにセットする
    res.header('Content-Type', 'application/json; charset=utf-8');
    res.status(201).send({result: "ok"});
});

// チャンネル内メッセージ一覧を取得するAPI
app.get('/channels/:cname/messages', (req, res) => {
    let cname = req.params.cname;
    let messagesRef = admin.database().ref(`channels/${cname}/messages`).orderByChild('date').limitToLast(20); // .orderByChild()で子キーdateによる並べ替え、.limitToLast()で最後から20件を取得
    messagesRef.once('value', function(snapshot){
        let items = new Array();
        snapshot.forEach(function(childSnapshot) {
            let message = childSnapshot.val();
            message.id = childSnapshot.key;
            items.push(message);
        });
        items.reverse();
        res.header('Content-Type', 'application/json; charset=utf-8');
        res.send({messages: items});
    });
});

// 初期状態に戻すAPI
app.post('/reset', (req, res) => {
    createChannel('general');
    createChannel('random'); // createChannel関数を2回実行してgeneral, randomのチャンネルを作成する
    res.header('Content-Type', 'application/json; charset=utf-8');
    res.status(201).send({result: "ok"});
});

// RESTful APIを利用可能にする
// appオブジェクトを外部から呼び出せるようにする
exports.v1 = functions.https.onRequest(app); // functions.http.onRequest()を使うことでHTTPリクエストのイベント処理を行うことができる
//引数にappを指定し、v1関数からappを利用できるようにしている
