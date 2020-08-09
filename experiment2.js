//node experiment2.js m 0 16
//它會自動產生各個timeout  執行各種大小的blockSize
//t	5f+1 m	3f+1

child_process = require('child_process').execFile;
fs = require('fs');
args = process.argv;
workerProcess = [];
size = ["8MB", "4MB", "2MB", "1MB", "512KB", "256KB"];


//==========開始==========



/*function setMode(){
	var mode = "t";
	
	for(a = 0; a < 2; a++){	
		setTimeout(function(){
			
			setNHT(mode);
			mode = "m";
			
		},60635000 * a);
	}
}

setNHT(args[2]);


function setNHT(mode){	//控制data大小
	var newHeightTogether = 0;
	
	for(var i = 0; i < 2; i++){	
		setTimeout(function(){
			
			setNumOfNode(mode, newHeightTogether);
			newHeightTogether++;
			
		},30315000 * i);
	}
}

setNumOfNode('t', 1);


function setNumOfNode(mode, newHeightTogether){
	var numNode = 16;
	
	for(var i = 0; i < 2; i++){	
		setTimeout(function(){
			
			setDS(mode, newHeightTogether, numNode);
			numNode += 15;
			
		},15155000 * i);
	}
}*/

setDS('t', 1, 31);


function setDS(mode, newHeightTogether, numNode){	//控制data大小
	var dataSize = 0;
	
	for(var i = 0; i < 6; i++){
	//for(var j = 0; j < 3; j++){	
		setTimeout(function(){
			
			controlTO(mode, newHeightTogether, numNode, dataSize);
			dataSize++;
			
		},2525000 * i);
	}
}


function controlTO(mode, newHeightTogether, numNode, dataSize){	//控制timeout大小
	var T1 = 100;
	var T2 = 125;
	
	for(var i = 0; i < 8; i++){
	//for(var i = 0; i < 2; i++){
		
		setTimeout(function(){
			
			newTest(mode, newHeightTogether, numNode, dataSize, T1, T2);
			
		},315000 * i);
		
		setTimeout(function(){
			T1 = T1 * 2;
			T2 = T2 * 2;
		},315000 * i + 1000);
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
		
	},310000);
}

/*function record(newHeightTogether, dataSize){
	
	var to = (newHeightTogether == 0) ? "no" : "to";
	var fileName =  "height" + numNode + "node _ " + size[dataSize] + " _ " + args[2] + " _ " + to + ".txt";
	var fileName2 =  "throughput" + numNode + "node _ " + size[dataSize] + " _ " + args[2] + " _ " + to + ".txt";
	
	fs.writeFile(fileName, write, function (err) {	if(err)	console.log(err);	})
	fs.writeFile(fileName2, write2, function (err) {	if(err)	console.log(err);	})
	
}*/
