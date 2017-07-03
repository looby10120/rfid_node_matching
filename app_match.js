var app = require('express')();
var port = process.env.PORT || 7777;
var mysql =  require('mysql');
var path = require('path');
var dateFormat = require('dateformat');
var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "kmutnb_running"
    });

// localhost:7777/command
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.get('/check_connect', function(req, res) {
    res.send();
});
    
app.post('/select_run', function(req, res) {
    var running_no = req.body.txt_running_no;
    console.log(running_no)
    if(running_no == undefined){
        res.status(404)
        res.send("Error")
    }else{
    var sql = "SELECT user_name, txt_running_no, event_id FROM users_events_all WHERE txt_running_no LIKE '%"+ running_no + "%'"
    console.log(sql)
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
    }
});

app.post('/insert', function(req, res) {
    var id = req.body.event_id;
    var run_no = req.body.running_no;
    var tag = req.body.Tagdata;
    var sql = "SELECT * FROM users_events_tag WHERE running_no='" + run_no + "'";
    console.log(id,run_no,tag)
    if(run_no == undefined || tag == undefined || id == undefined){
        res.status(404)
        res.send("Missing Data")
    } else {
    con.query(sql, function(err, result) {
        console.log(result, err)
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
        } else if (err){
            res.status(404);
            res.send('Error');
            //throw err;
        }
        console.log(res.statusCode, res.statusMessage);
    });
    }
});

app.delete('/delete', function(req, res) {
    var running_no = req.body.running_no;
    var sql = "SELECT * FROM users_events_tag WHERE running_no LIKE '%"+ running_no + "%'";
    console.log(sql)
    if(running_no == undefined){
        res.status(404)
        res.send("Error")
    }else{
    con.query(sql, function(err, result) {
        console.log(result,err)
        if (result.length == 0) {
            //throw err
            res.status(404);
            res.send('Not Found');
        }
        else if (!err && res.statusCode == 200){
            //res.json(result);
            sql = "DELETE FROM users_events_tag WHERE running_no LIKE '%"+ running_no + "%'";
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
    }
});

app.post('/select_event', function(req, res) {
    var running_no = req.body.txt_running_no;
    if(running_no == undefined){
        res.status(404)
        res.send("Error") 
    }else{
    var sql = "SELECT * FROM events";
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
    }
});

app.get('/select_all', function(req, res) {
    var sql = "SELECT running_no, Tagdata FROM users_events_tag";
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

app.get('/join/:txt_running_no', function(req, res) {
    var running_no = req.params.txt_running_no;
    var sql =   "SELECT users_events_all.user_name,"+
                "s_running_type.running_type,prefix_running_number, "+
                "s_running_categories.running_cat_desc "+
                "FROM (users_events_all LEFT JOIN s_running_type ON users_events_all.running_type_id = s_running_type.running_type_id) "+
                "LEFT JOIN s_running_categories ON users_events_all.running_cat_id = s_running_categories.running_cat_id "+
                "WHERE users_events_all.txt_running_no LiKE '%"+ running_no + "%'"
    console.log(sql)
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