//node experiment.js t 31
//它會自動產生各個timeout  執行各種大小的blockSize
//t	5f+1 m	3f+1

child_process = require('child_process').execFile;
fs = require('fs');
args = process.argv;
workerProcess = [];
size = ["8MB", "4MB", "2MB", "1MB", "512KB", "256KB"];

a = args[2];
b = args[3];
c = args[3];
d = args[4];
e = args[5];
if(a == null)	a = 0;
if(b == null)	b = 0;
if(c == null)	c = 0;
if(d == null)	d = 0;
if(e == null)	e = 0;

//==========開始==========

setMode();

function setMode(){
	var mode = "t";
	
	for(a = 0; a < 2; a++){	
		setTimeout(function(){
			
			setNHT(mode);
			mode = "m";
			
		//},500000 * j);
		//},94235000 * j);
		},60635000 * a);
	}
}


function setNHT(mode){	//控制data大小
	var newHeightTogether = 0;
	
	for(b = 0; b < 2; b++){	
		setTimeout(function(){
			
			setNumOfNode(mode, newHeightTogether);
			newHeightTogether++;
			
		//},245000 * j);
		//},47115000 * j);
		},30315000 * b);
	}
}

function setNumOfNode(mode, newHeightTogether){
	var numNode = 16;
	
	for(c = 0; c < 2; c++){	
		setTimeout(function(){
			
			setDS(mode, newHeightTogether, numNode);
			numNode += 15;
			
		//},120000 * j);
		//},23555000 * j);
		},15155000 * c);
	}
}

function setDS(mode, newHeightTogether, numNode){	//控制data大小
	var dataSize = 0;
	
	for(d = 0; d < 6; d++){
	//for(var j = 0; j < 3; j++){	
		setTimeout(function(){
			
			controlTO(mode, newHeightTogether, numNode, dataSize);
			dataSize++;
			
		//},4890000 * j);
		//},37500 * j);
		//},3925000 * j);
		},2525000 * d);
	}
}


function controlTO(mode, newHeightTogether, numNode, dataSize){	//控制timeout大小
	var T1 = 100;
	var T2 = 125;
	
	for(e = 0; e < 8; e++){
	//for(var i = 0; i < 2; i++){
		
		setTimeout(function(){
			
			newTest(mode, newHeightTogether, numNode, dataSize, T1, T2);
			
		//},610000 * i);
		//},17500 * i);
		//},490000 * i);
		},315000 * e);
		
		setTimeout(function(){
			T1 = T1 * Math.pow(2, e);
			T2 = T2 * Math.pow(2, e);
		//},610000 * i + 1000);
		//},17500 * i + 1000);
		},315000 * e + 1000);
	}
}


function newTest(mode, newHeightTogether, numNode, dataSize, T1, T2){		//[2] = mode; [3] = node數;
	workerProcess[0] = child_process('node', ['setNode.js', 0, mode, numNode, T1, T2, dataSize, newHeightTogether],
	function (error, stdout, stderr) {
		if (error) {
			console.log(error.stack);	console.log('Error code: '+error.code);	console.log('Signal received: '+error.signal);
			console.log('stdout: ' + stdout);	console.log('stderr: ' + stderr);
			}
	});

	setTimeout(function(){
		
		for(var i=1; i < numNode; i++) {
			workerProcess[i] = child_process('node', ['setNode.js', i, mode, numNode, T1, T2, dataSize, newHeightTogether],
			function (error, stdout, stderr) {
				//if (error) {	console.log(error.stack);	console.log('Error code: '+error.code);	console.log('Signal received: '+error.signal);	}console.log('stdout: ' + stdout);	console.log('stderr: ' + stderr);
			});
		}
		
	},100);
	
	setTimeout(function(){
		
		for(var i=0; i < numNode; i++)
			workerProcess[i].kill();
		
	//},605000);
	//},15000);
	//},485000);
	},310000);
}

/*function record(newHeightTogether, dataSize){
	
	var to = (newHeightTogether == 0) ? "no" : "to";
	var fileName =  "height" + numNode + "node _ " + size[dataSize] + " _ " + args[2] + " _ " + to + ".txt";
	var fileName2 =  "throughput" + numNode + "node _ " + size[dataSize] + " _ " + args[2] + " _ " + to + ".txt";
	
	fs.writeFile(fileName, write, function (err) {	if(err)	console.log(err);	})
	fs.writeFile(fileName2, write2, function (err) {	if(err)	console.log(err);	})
	
}*/
