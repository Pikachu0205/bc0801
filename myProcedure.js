lastLockset = [], thisLockset = [];
blockBody=null, lastRoundBlock=null, lastRoundVote={};
isVoteLock = 0, synH = 0, transaction123 = [], receiverAddress123 = [];
size = [8, 4, 2, 1, 0.5, 0.25, 0.125, 0.0625];
require("./S8-5.js");
require("./setNode.js");

fs = require('fs');



function firstBlock(){	//決定leader要送什麼block
	//getTransaction();
	
	if(mode == "t"){
		
		if(round == 1)
			myDeliver.BlockDeliver(height, round, ID);
		
		else if(lastLockset.length >= 4*fault+1){
			lastRoundBlock = maxVotesBlock(lastLockset, 2, fault);
			myDeliver.BlockDeliver(height, round, ID);
		}
		
	}
	
	if(mode == "m"){
		
		if(round == 1)
			myDeliver.leaderToWitDeliver(height, round, ID, witnessList);
	
		else if(lastLockset.length >= 2*fault+1){
			
			//msig檢查票是不是都null
			if( !msigNull(lastLockset, height, round) )	
				//如果不全為null.則票block的Round最大
				lastRoundBlock = msigMaxRoundVote(lastLockset);
				
			myDeliver.leaderToWitDeliver(height, round, ID, witnessList);
		}
		
	}
	
}

/*
function getTransaction(){
	axios.get('http://' + awsUrl + ':3000/geth').then(response => {
		
		//console.log(response.data);
		transaction123 = response.data;
		
	}) .catch(error => {	console.log(error);	});
}
*/


async function feedbackTransaction(){
	//console.log(feedbackVote);
	//for(i=0; i < member; i++){
	
	
	
	if(isfeedback != 1){
		
		isfeedback = 1;
		console.log("transaction123 " + transaction123);
		var ftra = transaction123;
		var fvote = feedbackVote;
		//console.log("transaction123 : " + transaction123);
		console.log("===== feedback =====");
		//console.log("feedbackVote : " + feedbackVote);
		//console.log("transaction123 " + transaction123);
		
		
		
		for(var i = 0; i < awsUrlList.length; i++){
			console.log("ftra: " + ftra);
			//console.log("fvote: " + fvote);
			
			await axios({
				method: 'post',
				url: 'http://' + awsUrlList[i] + ':3000/consensus',
				//url: 'http://' + awsUrl + ':3000/consensus',
				
				data: {
					height : height,
					round : round,
					transaction : ftra,
					blockHash : commitBlock.blockHash.split(),
					vote : fvote
				}
				
				
			}).then(function(res){
				console.log(res.data);
				//console.log(res.config.data);
				myMain.toStop();
				
				transactionReceiver =0;
				//myMain.newHeight(0);
			})
			.catch(function(err){console.log(err.data);});
		}
		
	}
	//}
}


function legalVote(lockset, height, round, c){	//找出大於cf+1張合法票的人
	var memls = [], block = [], obj={};
	
	for(var i in lockset)	//論文寫說4f+1投給同一個值.目前沒寫判斷是否同一個
		if(memls[lockset[i].sender] == null  &&  lockset[i].vote != null
				&&  lockset[i].height == height  &&  lockset[i].round == round){
			block.push(lockset[i].vote);
			memls[lockset[i].sender] = 1;	//每人一票
		}
		
	for(var i in block){  
		var key = block[i].block; 
		
		(obj[key]) ? obj[key]++ : obj[key]=1;
			
		if(obj[key] >= c*fault+1)
			return block[i];
	}
	
	return null;
}


function msigMaxRoundVote(lockset){	//找出所有票中所投的block中擁有的最大round
	var maxRound = 0, maxRoundVote = {};
	
	for(var i in lockset)
		if(lockset[i].round > maxRound  &&  lockset[i].vote != null)
			maxRoundVote = lockset[i].vote;
	
	return maxRoundVote;
}


function maxVotesBlock(lockset, c, fault){	//選出上回合最多人支持的block
	lockset = lockset.sort();
	result = {};
	max = 0;
	mark = null;
	
	for(var i in lockset)	//看這張票是不是加到result裡面了
		(result[lockset[i]]) ? result[lockset[i]]++ : result[lockset[i]] = 1;
	
	for(var i in lockset){
		
		if(result[lockset[i]] > max){
			max = result[lockset[i]];
			mark = lockset[i];
		}
		
	}
	
	return (max >= c*fault+1) ? mark.vote : null;
}


function msigNull(lockset, height, round){	//看是不是全為0
	var allnull = true, memberls = [];
	
	for(var i in lockset)
		if(lockset[i].height == height  &&  lockset[i].round == round-1)
			if(lockset[i].vote != null)
				allnull = false;
	
	return allnull;
}


function setLockset(){
	lastLockset.length = 0;
	
	for(var i = 0; i < thisLockset.length; i++){
		var c = thisLockset[i];
		lastLockset.push(c);
	}
	
	thisLockset.length = 0;
	if(round > 1)
		feedbackVote.length = 0;
}


function Timing(){	//10min 600000	20min 1200000	30min 1800000	ihr 3600000	
	setTimeout(function(){
		
		var throughput = (height*size[dataSize]/300).toFixed(5)
		var write = TOs1 + "\t" + TOs2 + "\t" + height + "\t" + throughput + "\n";
		var write2 = throughput + ", ";
		var write3 = TOs1 + "," + sizeName[dataSize] + "," + throughput
		
		fs.appendFile('timeing.txt', write, function (err) {	if(err)	console.log(err);	})
		
		fs.appendFile('timeing2.txt', write2, function (err) {	if(err)	console.log(err);	})
		fs.appendFile(filename, write3, function (err) {	if(err)	console.log(err);	})
		
	//fs.appendFile(filenameThroughput, write2, function (err) {	if(err)	console.log(err);	})
	//},600000);
	//},10000);
	//},480000);
	},300000);
}


function getArrDifference(arr1, arr2){	//找出兩個陣列不同的值

    return arr1.concat(arr2).filter(function(v, i, arr) {

        return arr.indexOf(v) === arr.lastIndexOf(v);
    });
}


module.exports = {
	firstBlock,
	maxVotesBlock,
	//getTransaction,
	feedbackTransaction,
	legalVote,
	msigNull,
	msigMaxRoundVote,
	setLockset,
	Timing,
	getArrDifference
}