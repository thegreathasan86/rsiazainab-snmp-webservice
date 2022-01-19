const express = require("express");
const FCM = require("fcm-node");
const path = require('path');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cron = require('node-cron');
const snmp = require('net-snmp');


// const { Client } = require('ssh2');
// const sshClient = new Client();


var mysql2 = require('mysql2');
var SSH2Client = require('ssh2').Client;

//new
const http = require('http');

const {
    Client,
    HTTPAgent,
    HTTPSAgent
} = require('ssh2');
//new

const sshConfig = {
    host: '103.172.205.157',
    port: 22,
    username: 'sismo_setiawan',
    password: 'Ahayyy123#'
};

// Use `HTTPSAgent` instead for an HTTPS request
const agent = new HTTPAgent(sshConfig);
http.get({
    host: '103.172.205.157',
    agent,
    headers: {
        Connection: 'close'
    }
}, (res) => {
    console.log(res.statusCode);
    console.dir(res.headers);
    res.resume();
});


// const monitor = require('ping-monitor');

const session = require('express-session');
var random = require("random");
const MySQLStore = require('express-mysql-session')(session);

const {
    forEach
} = require("async");
const {
    connect
} = require("http2");

// const agentsnmp = require('./snmp_agent');

const SERVER_KEY = 'AAAAW5akEUo:APA91bEk_No2FZuUcgv_E5DMeGPwb_qYVtbi9C96yzOqyWbv6G_EtjGoSuoZa595UTEuZzOdtXd5CRgPaftt28cops1nAmWVXW5US9b5cNODZaY0r8p7APgrNl4p8L2rF1rhrPXpfoo8';


var app = express();

var port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log('listening on port ', port);
});


// scheduler
//# ┌────────────── second (optional 0-59)
//# │ ┌──────────── minute (0-59)
//# │ │ ┌────────── hour (0-23)
//# │ │ │ ┌──────── day of month (1-31)
//# │ │ │ │ ┌────── month (1-12 or names)
//# │ │ │ │ │ ┌──── day of week (0-7)
//# │ │ │ │ │ │
//# │ │ │ │ │ │
//# * * * * * *
// cron.schedule('* * * * *', () => {
//     console.log('running a task every minute');
// });


var task = cron.schedule('*/20 * * * * *', () => {
    console.log('running every 20 second');

    //datetime
    // var datetime = new Date();
    // console.log(datetime.toISOString().slice(0,19));
    var d = new Date,
        dformat = [d.getFullYear(), d.getMonth() + 1, d.getDate()].join('-') + ' ' + [d.getHours(),
            d.getMinutes(),
            d.getSeconds()
        ].join(':');
    console.log(dformat);




    // create all the things objects
    // let things = data.array.map(i => new Thing(i.id));

    let sql = "SELECT * FROM perangkat";
    let query = conn.query(sql, (err, results) => {
        if (err) throw err;

        const myObject = results.map(item => item.ip_perangkat)

        // initialize them all asynchronously
        // Promise.all(myObject.map(item => {
        //         return item.init();
        //     })).then(function (item) {
        // // all things are asynchronously initialized here
        //     console.log(item);    

        // });
        // console.log(myObject);
        var myArray = myObject;

        myArray.forEach(function (ipdevice) {
            // console.log('ip dari database:' + ipdevice);

            var session = snmp.createSession(ipdevice, "public");

            var oids = ["1.3.6.1.2.1.2.2.1.8.3", "1.3.6.1.2.1.2.2.1.16.3", "1.3.6.1.2.1.2.2.1.16.8", "1.3.6.1.2.1.2.2.1.16.18", "1.3.6.1.2.1.2.2.1.10.3", "1.3.6.1.2.1.2.2.1.10.8", "1.3.6.1.2.1.2.2.1.10.18"];


            // var oidss = ["1.3.6.1.2.1.2.2.1.8.3"];
            session.get(oids, function (error, varbinds) {
                // console.log('list: '+oids);

                if (error) {
                    console.error('======================');
                    console.error('ipdevice :' + ipdevice + ' ' + error);

                    //INSERT KE DB  
                    let dataoid2 = {
                        idperangkat: ipdevice,
                        status: 'Down',
                        transmitte_upload: 0,
                        receive_download: 0,
                        timestamp: dformat,
                    };

                    let sql = "INSERT INTO traffic SET ?";
                    let query = conn.query(sql, dataoid2, (err, results) => {
                        if (err) throw err
                        console.log("from_savedataoid2 " + results);
                    });

                } else {
                    if (snmp.isVarbindError(varbinds)) {
                        console.error('varbindError :' + snmp.varbindError(varbinds));
                    } else {
                        // console.log('varbind adalah '+ varbinds);

                        let statusOID = varbinds[0].value;
                        switch (statusOID) {
                            case 0:
                                statusDevice = "Down";
                                break;
                            case 1:
                                statusDevice = "Up";
                                break;
                            case 2:
                                statusDevice = "Up";
                                break;
                            case 3:
                                statusDevice = "Up";
                                break;
                            case 4:
                                statusDevice = "Up";
                                break;
                            case 5:
                                statusDevice = "Up";
                                break;
                            case 6:
                                statusDevice = "Up";
                                break;
                            case 7:
                                statusDevice = "Up";
                                break;
                            case 8:
                                statusDevice = "Up";
                                break;
                            case 9:
                                statusDevice = "Up";
                                break;
                            default:
                                statusDevice = "Unknown";
                        }
                        // let upload = varbinds[1].value / 1024 / 1024; //convert bytes to megabytes
                        let upload = varbinds[1].value / 1024 / 1024 + varbinds[2].value / 1024 / 1024 + varbinds[3].value / 1024 / 1024; //convert bytes to megabytes

                        // let download = varbinds[3].value / 1024 / 1024; //convert bytes to megabytes
                        let download = varbinds[4].value / 1024 / 1024 + varbinds[5].value / 1024 / 1024 + varbinds[6].value / 1024 / 1024; //convert bytes to megabytes

                        console.log(ipdevice, ':', statusOID, upload, download, statusDevice);

                        //INSERT KE DB  
                        let dataoid = {
                            idperangkat: ipdevice,
                            status: statusDevice,
                            transmitte_upload: upload,
                            receive_download: download,
                            timestamp: dformat,
                        };

                        let sql = "INSERT INTO traffic SET ?";
                        let query = conn.query(sql, dataoid, (err, results) => {
                            if (err) throw err
                            console.log("from_savedataoid " + results);
                        });
                    }


                }
                session.close();
            });

        });

    });


    var session = snmp.createSession("127.0.0.1", "public");

    var oids = ["1.3.6.1.2.1.2.2.1.8.3", "1.3.6.1.2.1.2.2.1.16.3", "1.3.6.1.2.1.2.2.1.10.3"];

    session.get(oids, function (error, varbinds) {

        if (error) {
            console.error('======================');
            console.error('ipdevice :' + ipdevice + ' ' + error);

            //INSERT KE DB  
            let dataoid2 = {
                idperangkat: '127.0.0.1',
                status: 'Down',
                transmitte_upload: 0,
                receive_download: 0,
                timestamp: dformat,
            };

            let sql = "INSERT INTO traffic SET ?";
            let query = conn.query(sql, dataoid2, (err, results) => {
                if (err) throw err
                // console.log("from_savedataoid2 " + results);
            });

        } else {
            if (snmp.isVarbindError(varbinds)) {
                console.error('varbindError :' + snmp.varbindError(varbinds));
            } else {
                let statusOID = varbinds[0].value;
                switch (statusOID) {
                    case 0:
                        statusDevice = "Down";
                        break;
                    case 1:
                        statusDevice = "Up";
                        break;
                    case 2:
                        statusDevice = "Up";
                        break;
                    case 3:
                        statusDevice = "Up";
                        break;
                    case 4:
                        statusDevice = "Up";
                        break;
                    case 5:
                        statusDevice = "Up";
                        break;
                    case 6:
                        statusDevice = "Up";
                        break;
                    case 7:
                        statusDevice = "Up";
                        break;
                    case 8:
                        statusDevice = "Up";
                        break;
                    case 9:
                        statusDevice = "Up";
                        break;
                    default:
                        statusDevice = "Unknown";
                }
                // let upload = varbinds[1].value / 1024 / 1024; //convert bytes to megabytes
                let upload = varbinds[1].value / 1024 / 1024; //convert bytes to megabytes

                // let download = varbinds[3].value / 1024 / 1024; //convert bytes to megabytes
                let download = varbinds[2].value / 1024 / 1024; //convert bytes to megabytes

                //INSERT KE DB  
                let dataoid = {
                    idperangkat: '127.0.0.1',
                    status: statusDevice,
                    transmitte_upload: upload,
                    receive_download: download,
                    timestamp: dformat,
                };

                let sql = "INSERT INTO traffic SET ?";
                let query = conn.query(sql, dataoid, (err, results) => {
                    if (err) throw err
                    console.log("from_savedataoid " + results);
                });
            }
        }
        session.close();
    });


    //// end function snmp
    // var session = snmp.createSession("192.168.195.10", "public");
    // status (up atau down, value nya integer 1 true 0 false)  1.3.6.1.2.1.2.2.1.8.3
    // nilai Int undefined In, bytes 1.3.6.1.2.1.2.2.1.16.3
    // nilai Int undefined Out, bytes1.3.6.1.2.1.2.2.1.10.3



    session.trap(snmp.TrapType.LinkDown, function (error) {
        if (error) {
            console.error(error);
        }
    });

    //// end function snmp 

    //// function pinger


    /// end 




}, {
    scheduled: true,
    timezone: "Asia/Jakarta"
});

task.start();





// var sshConf = {
//     host: '103.172.205.157',
//     port: 22,
//     username: 'sismo_setiawan',
//     password: 'Ahayyy123#'
// };

// var sqlConf = {
//     user: 'sismo',
//     database: 'sismo',
//     password: 'Ahayyy123#',
//     port: '3306',
//     timeout: 500000
// };

// var ssh = new SSH2Client();
// ssh.on('ready', function () {
//     ssh.forwardIn(
//         // source IP the connection would have came from. this can be anything since we
//         // are connecting in-process
//         //   '127.0.0.1',
//         '103.172.205.157',
//         // source port. again this can be randomized and technically should be unique
//         //   24000,
//         // 5000,
//            22, 
//         // 3306,
//         // destination IP on the remote server
//         // '127.0.0.1',
//         '103.172.205.157',
//         // destination port at the destination IP
//         //   3306,
//         80,
//         function (err, stream) {
//             // you will probably want to handle this better,
//             // in case the tunnel couldn't be created due to server restrictions
//             if (err) throw err;
//             console.log('error here :');

//             // if you use `sqlConf` elsewhere, be aware that the following will
//             // mutate that object by adding the stream object for simplification purposes
//             sqlConf.stream = stream;
//             var db = mysql.createConnection(sqlConf);

//             // now use `db` to make your queries

//             //route untuk homepage
//             app.get('/', (req, res) => {
//                 let sql = "SELECT * FROM perangkat";
//                 let query = db.query(sql, (err, results) => {
//                     console.log(err);
//                     res.render('home_view', {
//                         results: results
//                     });
//                 });
//             });


//             //route untuk homepage
//             app.get('/ip_perangkat', (req, res) => {
//                 let sql = "SELECT * FROM perangkat";
//                 let query = db.query(sql, (err, results) => {
//                     if (err) throw err;

//                     const myObject = results.map(item => item.ip_perangkat)
//                     res.json(results);

//                 });


//             });


//             //route input data
//             app.post('/save_perangkat', (req, res) => {
//                 let data = {
//                     nama_perangkat: req.body.nama_perangkat,
//                     ip_perangkat: req.body.ip_perangkat,
//                     lantai: req.body.lantai
//                 };

//                 let sql = "INSERT INTO perangkat SET ?";
//                 let query = db.query(sql, data, (err, results) => {
//                     if (err) throw err;
//                     res.redirect('/');
//                 });
//             });



//             //route update data
//             app.post('/update_perangkat', (req, res) => {
//                 let sql = "UPDATE perangkat SET nama_perangkat='" + req.body.nama_perangkat + "', ip_perangkat='" + req.body.ip_perangkat + "', lantai='" + req.body.lantai + "' WHERE idperangkat=" + req.body.id;
//                 let query = db.query(sql, (err, results) => {
//                     if (err) throw err;
//                     res.redirect('/');
//                 });
//             });

//             //route delete data
//             app.post('/delete_perangkat', (req, res) => {

//                 let sql = "DELETE FROM sismo.perangkat WHERE idperangkat='" + req.body.id + "'";
//                 let query = db.query(sql, (err, results) => {
//                     if (err) throw err;
//                     res.redirect('/');

//                 });
//             });



//         }
//     );
// });
// ssh.connect(sshConf);



// connect ke db//
const conn = mysql.createConnection({
    host: 'localhost',
    user: 'sismo',
    password: 'Ahayyy123#',
    database: 'sismo',
    insecureAuth: true
});



// connect ke db//
conn.connect((err) => {
    if (err) throw err;
    console.log('Connection to mysql success...');
});



// const dbServer = {
//     host: 'localhost',
//     port: 3306,
//     user: 'sismo',
//     password: 'Ahayyy123#',
//     database: 'sismo'
// }
// const tunnelConfig = {
//     host: '103.172.205.157',
//     port: 22,
//     username: 'sismo_setiawan',
//     password: 'Ahayyy123#'
// }
// const forwardConfig = {
//     srcHost: '103.172.205.157',
//     srcPort: 22,
//     dstHost: dbServer.host,
//     dstPort: dbServer.port
// };
// const SSHConnection = new Promise((resolve, reject) => {
//     sshClient.on('ready', () => {
//         sshClient.forwardOut(
//         forwardConfig.srcHost,
//         forwardConfig.srcPort,
//         forwardConfig.dstHost,
//         forwardConfig.dstPort,
//         (err, stream) => {
//              if (err) reject(err);
//              console.log('error ssh ' + err);
//              const updatedDbServer = {
//                  ...dbServer,
//                  stream
//             };

//             const connection =  mysql.createConnection(updatedDbServer);
//            connection.connect((error) => {
//             if (error) {
//                 reject(error);
//                 console.log('Connection to mysql error...');
//             }
//             resolve(connection);
//             });
// });
// }).connect(tunnelConfig);
// });


//connect ke db//
// connection.connect((err) => {
//     if (err) throw err;
//     console.log('Connection to mysql success...');
// });


//session start
// const sessionStore = new MySQLStore(conn);

// app.use(
//     session({
//         secret: 'cookie_secret',
//         resave: false,
//         saveUninitialized: false,
//         store: sessionStore,      // assigning sessionStore to the session
//     })
// );


// app.get('/set_session',function(req,res){
//     sessionData = req.session;
//     sessionData.ipperangkat = [];

//     let username = "adam";
//     sessionData.user.username = username;
//     sessionData.user.salary = random.int(55, 956);
//      console.log("Setting session data:username=%s and salary=%s", username, sessionData.user.salary)

//    // res.end('Saved session and salary : ' + sessionData.username);
//    res.json(sessionData.user)
//   });
//session 



/////////////////////
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));

//fcm end point
app.post('/fcm', async (req, res, next) => {
    try {

        let fcm = new FCM(SERVER_KEY);
        let message = {
            to: '/topics/' + req.body.topic,

            notification: {
                title: req.body.title,
                body: req.body.body,
                sound: 'default',
                "click_action": "FCM_PLUGIN_ACTIVITY",
                "icon": "fcm_push_icon",

            }
        }

        fcm.send(message, (err, response) => {
            if (err) {
                next(err);
            } else {
                res.json(response);
            }
        });

    } catch (error) {
        next(error);
    }
});



//set views file
app.set('views', path.join(__dirname, 'views'));

//set view engine
app.set('view engine', 'hbs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

//set folder public as static folder untuk static file
app.use('/assets', express.static(__dirname + '/public'));


// //route untuk homepage
app.get('/', (req, res) => {
    let sql = "SELECT * FROM perangkat";
    let query = conn.query(sql, (err, results) => {
        res.render('home_view', {
            results: results
        });
    });

});


// //route untuk homepage
app.get('/ip_perangkat', (req, res) => {
    let sql = "SELECT * FROM perangkat";
    let query = conn.query(sql, (err, results) => {
        if (err) throw err;

        const myObject = results.map(item => item.ip_perangkat)
        res.json(results);

    });


});


// //route input data
app.post('/save_perangkat', (req, res) => {
    let data = {
        nama_perangkat: req.body.nama_perangkat,
        ip_perangkat: req.body.ip_perangkat,
        lantai: req.body.lantai
    };

    let sql = "INSERT INTO perangkat SET ?";
    let query = conn.query(sql, data, (err, results) => {
        if (err) throw err;
        res.redirect('/');
    });
});



// //route update data
app.post('/update_perangkat', (req, res) => {
    let sql = "UPDATE perangkat SET nama_perangkat='" + req.body.nama_perangkat + "', ip_perangkat='" + req.body.ip_perangkat + "', lantai='" + req.body.lantai + "' WHERE idperangkat=" + req.body.id;
    let query = conn.query(sql, (err, results) => {
        if (err) throw err;
        res.redirect('/');
    });
});

// //route delete data
app.post('/delete_perangkat', (req, res) => {


    // var sql = `DELETE FROM perangkat WHERE idperangkat=${req.body.idperangkat}`;
    // DELETE FROM sismo.perangkat WHERE idperangkat='2';

    let sql = "DELETE FROM sismo.perangkat WHERE idperangkat='" + req.body.id + "'";
    let query = conn.query(sql, (err, results) => {
        if (err) throw err;
        res.redirect('/');

    });
});