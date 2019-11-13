var express = require('express');
var mysql = require('mysql');
var app = express();
var cors = require('cors')
var bodyParser = require('body-parser')
var port = process.env.PORT || 3000
var multer = require('multer');
const CSVToJSON = require('csvtojson');
// var connection = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: '',
//     database: 'testconnect'
// });
app.use(bodyParser.json())
app.use(cors())
app.use(
    bodyParser.urlencoded({
        extended: true
    })
)
app.use(express.static("public"));
var connection_mysql = null;
// var connection = mysql.createPool({
//     connectionLimit: 50,
//     host: 'localhost',
//     user: 'root',
//     password: '',
//     database: 'learning_sql'
// });

// connection.connect(function (error) {
//     if (!!error) {
//         console.log('Error');
//     } else {
//         console.log('Connected');
//     }
// });

app.post('/getdata_mysql', function (req, res) {
    // connection.query("SELECT * FROM mySampleTable", function(error,rows, fields){
    //     if(!!error){
    //         console.log('Error in query');
    //     }else{
    //         console.log('Successful qurey');
    //         console.log(rows);
    //         res.send('Hello, ' +rows[0].Name);
    //     }
    // });
    // console.log(typeof(req.body.host));
    connection_mysql = mysql.createPool({
        connectionLimit: 50,
        host: req.body.host,
        port: req.body.port,
        user: req.body.user,
        password: req.body.password,
        database: req.body.database
    })
    connection_mysql.getConnection(function (error, tempCont) {
        // console.log(tempCont);
        if (!!error) {
            // tempCont.release();
            console.log("Error");
            // console.log(JSON.parse("{\"ERROR\" :" + "\"" + error.code + "\"" + "}"));
            res.json("ERROR :" + error.code);
        } else {
            console.log("Connected");
            var list_database = "";
            var first_table = true;
            tempCont.query("SHOW TABLES", function (error, rows, fields) {
                // tempCont.release();
                if (!!error) {
                    console.log('Error in query');
                    res.json("ERROR :" + error.code);
                } else {
                    console.log('Successful qurey');
                    // console.log(fields[0].FieldPacket.json().name);
                    // var name_table = fields;
                    // console.log(JSON.stringify(rows));
                    if (JSON.stringify(rows) == "[]") { res.json({}) }
                    else {
                        rows.forEach((x, index, array) => {
                            var temp = JSON.stringify(x).replace(/"|{|}/g, "");
                            temp = temp.replace(/(.*):(.*)/, "$2");
                            // list_name_table.push(temp);
                            console.log("---------------" + temp);
                            tempCont.query("SELECT * FROM " + temp, function (error, rows, fields) {
                                if (!!error) {
                                    console.log('Error in each table');
                                    res.json("ERROR :" + error.code);
                                } else {
                                    if (first_table) {
                                        list_database = list_database + "\"" + temp + "\":" + JSON.stringify(rows).replace(/null/gi, "\"null\"");
                                        first_table = false;
                                    } else {
                                        list_database = list_database + ",\"" + temp + "\":" + JSON.stringify(rows).replace(/null/gi, "\"null\"");
                                    }
                                    if (index == (array.length - 1)) {
                                        // console.log(list_database);
                                        res.send("{" + list_database + "}");
                                    }
                                }
                                // console.log(temp);
                                // console.log(first_table);
                                // console.log(list_database);
                            });
                        });
                    }
                }
            });
            tempCont.release();
        }
    }
    )
});

app.post('/uploads', function (req, res) {
    // console.log(req.fi);
    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, __dirname + '/uploads')
        },
        filename: function (req, file, cb) {
            cb(null, Date.now() + "-" + file.originalname);
        }
    })
    var upload = multer({ storage: storage }).any();
    upload(req, res, function (err) {
        if (err) {
            // console.log("err", err);
            res.send({
                message: "Error",
                data: err
            });
        } else {
            // console.log("res", res);
            // console.log("body",req.body);
            const CSVToJSON = require('csvtojson');

            var list_json = "";
            for (var x = 0; x < req.files.length; x++) {
                var path = req.files[x].path; //đường dẫn của file
                var sync = true;
                CSVToJSON().fromFile(path).then(data => {
                    let temp = "\"File " + req.files[x].originalname + "\":" + JSON.stringify(data);
                    if(x==0){
                        list_json = temp;
                    }else{
                        list_json = list_json + "," + temp;
                    }
                    sync = false;
                });
                while (sync) { require('deasync').sleep(100); } //syn proccess need enhance!
            }
            // console.log("{" + list_json+ "}");
            list_json = "{" + list_json + "}";
            res.send({
                message: 'uploaded',
                data: list_json
            });
        }
    })
})
app.listen(port);
console.log("Started at port 3000");