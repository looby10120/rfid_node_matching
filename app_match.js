var app = require('express')();
var port = process.env.PORT || 7777;
var mysql =  require('mysql');
var path = require('path');
var dateFormat = require('dateformat');
var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "gasgasgas",
        database: "kmutnb_running"
    });

// localhost:7777/command
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

//////////// show by matching users_events and users_events_tag @ running_no ////////////
app.get('/name/select', function(req, res) {
    var tag = req.params.Tagdata;
    var sql = "SELECT * FROM users_events";
    con.query(sql, function(err, result) {
        if (!err && res.statusCode == 200) {
            res.status(200);
            res.json(result);
        } else {
            res.status(404);
            throw err
        }
        console.log(res.statusCode, res.statusMessage);
    });
});

//////////// users_events_tag ////////////
app.post('/name/insert', function(req, res) {
    var id = req.body.event_id;
    var run_no = req.body.running_no;
    var tag = req.body.Tagdata;
    var sql = "SELECT * FROM users_events_tag WHERE running_no='" + run_no + "'";
    con.query(sql, function(err, result) {
        // console.log(result, err)
        if (run_no.length == 0 || tag.length == 0 || id.length == 0) {
            res.status(204);
            res.send('No Content');
        } else if (result.length > 0) {
            sql = "UPDATE users_events_tag SET ? WHERE running_no=?"
            var data = { "Tagdata" : tag }
            con.query(sql, [data, run_no], function(err, result){
                if (!err && res.statusCode == 200) {
                    res.status(200);
                    res.send('Data Update Successful');
                } else {
                    res.status(404);
                    res.send('Data Update Not Successful');
                    throw err;
                }
            });
        } else if (!err && res.statusCode == 200){
            var data = { event_id: id, running_no: run_no, Tagdata: tag }
            sql = "INSERT INTO users_events_tag SET ?"
            con.query(sql, data, function(err, result){
                if (!err && res.statusCode == 200) {
                    res.status(200);
                    res.send('Data Create Successful');
                } else {
                    res.status(404);
                    res.send('Data Create Not Successful');
                    throw err;
                }
            });
        }
        // console.log(res.statusCode, res.statusMessage);
    });
});

// app.get('/select/:Tagdata', function(req, res) {
//     var tag = req.params.Tagdata;
//     var sql = "SELECT * FROM users_events_tag WHERE Tagdata='"+tag+"'";
//     con.query(sql, function(err, result) {
//         //console.log(result)
//         if (result.length == 0) {
//             //throw err
//             res.status(404);
//             res.send('Not Found');
//         }
//         else if (!err && res.statusCode == 200){
//             //res.json(result);
//             res.status(200);
//             res.json(result);
//         }
        
//         console.log(res.statusCode,res.statusMessage)
//     });
// });

// app.get('/select_all', function(req, res) {
//     var sql = "SELECT * FROM users_events_tag";
//     con.query(sql, function(err, result) {
//         if (!err && res.statusCode == 200){
//             res.status(200);
//             res.json(result);
//         }
//         else {
//             //throw err
//             res.status(404);
//             res.send('Not Found');
//         }
//         //res.send('OK');
//         console.log(res.statusCode,res.statusMessage)
//     });
// });

// app.put('/update', function(req, res) {
//     var id = req.body.event_id;
//     var run_no = req.body.running_no;
//     var tag = req.body.Tagdata;
//     var data = { event_id: id, running_no: run_no, Tagdata: tag }
//     var sql = "SELECT * FROM users_events_tag WHERE Tagdata='"+tag+"'";
//     con.query(sql, data, function(err, result) {
//         //console.log(result,err)
//         if (result.length == 0) {
//             //throw err
//             res.status(404);
//             res.send('Not Found');
//         }
//         else if (run_no.length == 0 || tag.length == 0) {
//             //throw err
//             res.status(204);
//             res.send('No Content');
//         }
//         else if (!err && res.statusCode == 200){
//             //res.json(result);
//             sql = "UPDATE users_events_tag SET event_id = ? WHERE Tagdata = ?";
//             con.query(sql, [id,tag], function(err, result){
//                 console.log([id,tag])
//                 if (!err && res.statusCode == 200){
//                     res.status(200);
//                     res.send('Data Update Successful');
//                 }  
//             });
//         }

//         console.log(res.statusCode,res.statusMessage)
//     });
// });

// app.delete('/delete/:Tagdata', function(req, res) {
//     var tag = req.params.Tagdata;
//     var sql = "SELECT * FROM users_events_tag WHERE Tagdata='"+tag+"'";
//     con.query(sql, function(err, result) {
//         console.log(result,err)
//         if (result.length == 0) {
//             //throw err
//             res.status(404);
//             res.send('Not Found');
//         }
//         else if (!err && res.statusCode == 200){
//             //res.json(result);
//             sql = "DELETE FROM users_events_tag WHERE Tagdata='"+tag+"'";
//             con.query(sql, function(err, result){
//                 res.status(200);
//                 res.send('Data Delete Successful');
//             });
//         }

//         console.log(res.statusCode,res.statusMessage)
//     });
// });

app.listen(port, function() {
    console.log('Starting node.js on port ' + port);
});