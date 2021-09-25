const snmp = require ("net-snmp");



/////////////////

var session = snmp.createSession ("10.42.0.1", "public");
// status (up atau down, value nya integer 1 true 0 false)  1.3.6.1.2.1.2.2.1.8.3
// nilai Int undefined In, bytes 1.3.6.1.2.1.2.2.1.16.3
// nilai Int undefined Out, bytes1.3.6.1.2.1.2.2.1.10.3

var oids = ["1.3.6.1.2.1.2.2.1.8.3","1.3.6.1.2.1.2.2.1.16.3", "1.3.6.1.2.1.2.2.1.10.3"];


session.get (oids, function (error, varbinds) {
    if (error) {
        console.error (error);
    } else {
        for (var i = 0; i < varbinds.length; i++) {
            if (snmp.isVarbindError (varbinds[i])) {
                console.error (snmp.varbindError (varbinds[i]));
            } else {
                console.log (varbinds[i].oid + " = " + varbinds[i].value);
            }
        }
    }
    session.close ();
});

session.trap (snmp.TrapType.LinkDown, function (error) {
    if (error) {
        console.error (error);
    }
});
////////////////


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


// var task = cron.schedule('*/1 * * * *', () =>  {
//     console.log('running every 1 minutes');
//   }, {
//     scheduled: true,
//     timezone: "Asia/Jakarta"
// });
  
// task.start();
