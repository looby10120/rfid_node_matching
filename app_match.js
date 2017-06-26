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
    
app.get('/select_run/:txt_running_no', function(req, res) {
    var running_no = req.params.txt_running_no;
    var sql = "SELECT user_name, txt_running_no FROM users_events WHERE txt_running_no='"+ running_no + "'"
    con.query(sql, function(err, result) {
        if (!err && res.statusCode == 200) {
            res.status(200);
            res.json(result);
        } else {
            res.status(404);
            res.send('not found');
        }
        console.log(res.statusCode, res.statusMessage);
    });
});

app.post('/insert', function(req, res) {
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
                    // throw err;
                }
            });
        } else if (!err && res.statusCode == 200){
            var data = { "event_id": id, "running_no": run_no, "Tagdata": tag }
            sql = "INSERT INTO users_events_tag SET ?"
            con.query(sql, data, function(err, result){
                if (!err && res.statusCode == 200) {
                    res.status(200);
                    res.send('Data Create Successful');
                } else {
                    res.status(404);
                    res.send('Data Create Not Successful');
                    // throw err;
                }
            });
        }
        console.log(res.statusCode, res.statusMessage);
    });
});

app.delete('/delete/:running_no', function(req, res) {
    var running_no = req.params.Tagdata;
    var sql = "SELECT * FROM users_events_tag WHERE running_no='" + running_no + "'";
    con.query(sql, function(err, result) {
        console.log(result,err)
        if (result.length == 0) {
            //throw err
            res.status(404);
            res.send('Not Found');
        }
        else if (!err && res.statusCode == 200){
            //res.json(result);
            sql = "DELETE FROM users_events_tag WHERE Tagdata='" + running_no + "'";
            con.query(sql, function(err, result){
                if (!err && res.statusCode == 200) {
                    res.status(200);
                    res.send('Data Delete Successful');
                } else {
                    res.status(404);
                    res.send('Data Delete Not Successful');
                }
            });
        }
        console.log(res.statusCode,res.statusMessage)
    });
});

app.get('/select/:txt_running_no', function(req, res) {
    var running_no = req.params.txt_running_no;
    var sql = "SELECT running_no, Tagdata FROM users_events_tag WHERE running_no='"+ running_no + "'";
    con.query(sql, function(err, result) {
        if (!err && res.statusCode == 200) {
            res.status(200);
            res.json(result);
        } else {
            res.status(404);
            res.send('not found');
        }
        console.log(res.statusCode, res.statusMessage);
    });
});

app.listen(port, function() {
    console.log('Starting node.js on port ' + port);
});