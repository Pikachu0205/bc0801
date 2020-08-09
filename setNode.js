//node setNode.js 0 t 6 100 125 5 0
	
express = require('express');
app = express();
app.use(express.json());

MongoClient = require('mongodb').MongoClient;

fs = require('fs');
args = process.argv;
myDeliver = require("./myDeliver.js");
sizeName = ["8MB", "4MB", "2MB", "1MB", "512KB", "256KB"];

height=0, round=0, fault=0, leader=0;
ipList = [], publicKeyList = [], witnessList = [], awsUrlList = [], awsUrl = 'abc';
TO1 = 0, TO2 = 0, TimeRate = 1.5;

ID = parseInt(args[2]);
mode = args[3];
member = parseInt(args[4]);
TOs1 = parseInt(args[5]);
TOs2 = parseInt(args[6]);
dataSize = parseInt(args[7]);	//[7] = 第幾回合.用來選擇不同大小的buffer
newHeightTogether = parseInt(args[8]);	//控制要不要大家憶起進下一height

//filenameHeight = mode + "_" + member + "_" + sizeName[dataSize] + "_" + newHeightTogether + ".txt";
//filenameThroughput = mode + "_" + member + "_" + sizeName[dataSize] + "_" + newHeightTogether + ".txt";
filename = member + "_node" + newHeightTogether + ".txt";

global.mgdb



//=====main=====		t 5f+1, m 3f+1
node();

if(parseInt(args[2]) == 0){
		fs.appendFile('timeing2.txt', "\n", function (err) {	if(err)	console.log(err);	});
		fs.appendFile('height2.txt', "\n", function (err) {	if(err)	console.log(err);	});
		fs.writeFile(filename, "TO,MB,value\n", function (err) {	if(err)	console.log(err);	});
}

function node(){	
	console.log(args);
	var rfReady=0,rfpReady = 0; dbReady=0, awsReady=0;
	
	if(mode == "t")		fault = (member-1)/5;
	if(mode == "m")	fault = (member-1)/3;
	
	fs.readFile('privateKey.txt', function(err, data) {
		if (err) return console.log(err);
		readfile = data.toString().split('\n');
		
		//var port = 1000 + ID * 1000;
		var port = 1050;
		app.listen(port);
		
		privateKey = ec.keyFromPrivate(readfile[ID]);
		
		rfReady = 1;
		if(dbReady==1 && ID!=0 && rfpReady == 1 && awsReady==1)
			myDeliver.ReadyDeliver(ID, 0);
		
		MongoClient.connect("mongodb://localhost:27017/YourDB", {useNewUrlParser: true,useUnifiedTopology: true}, (err, client) => {
			if (err) return console.log(err);
			db = client.db(port.toString());
			db.createCollection('collection', function (err, collection) {
				mgdb = collection;
			
				dbReady = 1;
				if(rfReady == 1 && ID != 0 && rfpReady == 1)
				//if(rfReady == 1 && ID != 0 && rfpReady == 1 && awsReady == 1)
					myDeliver.ReadyDeliver(ID, 0);
			});
		});
		
	});
	
	fs.readFile('publicKey.txt', function(err, data) {	//建立公鑰
		if (err) return console.log(err);
		readfile2 = data.toString().split('\n');
		
		for(i=0; i < member; i++){
			ipList[i] = readfile2[i].replace(/[\r\n]/g,"");
			publicKeyList[i] = readfile2[31+i].replace(/[\r\n]/g,"");
		}
		
		rfpReady = 1;
		//if(dbReady == 1 && ID != 0 && rfReady == 1 && awsReady == 1)
		if(dbReady == 1 && ID != 0 && rfReady == 1)
		myDeliver.ReadyDeliver(ID, 0);
		
	});
	
	fs.readFile('awsUrl.txt', function(err, data) {	//建立公鑰
		if (err) return console.log(err);
		readfile3 = data.toString().split('\n');
		
		awsUrl = readfile3[ID].replace(/[\r\n]/g,"");
		for(i=0; i < 6; i++)
			awsUrlList[i] = readfile3[i].replace(/[\r\n]/g,"");
		
		awsReady = 1;
		if(dbReady == 1 && ID != 0 && rfReady == 1 && rfpReady == 1)
			myDeliver.ReadyDeliver(ID, 0);
		
	});
}
