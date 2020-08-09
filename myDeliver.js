axios = require('axios');

require("./S8-5.js");



function BlockDeliver(height, round, ID){
	//console.log('Broadcast Block');
	
	var data = {
		type: "Block",
		height: height, round: round, sender: ID, maker: ID,
		lockset: lastLockset
	}
	
	if(lastRoundBlock == null)	//創新block
		//data.transaction = buffer1024[dataSize];
		data.transaction = transaction123;
	else
		data.maker = lastRoundBlock.maker;
	
	data = myMain.signature(data);	//產生blockHash和signature
	data.block = (lastRoundBlock == null) ? data.blockHash : lastRoundBlock.block;
		
	for(var i in ipList)
		mesDeliver(i, data);
}


//傳給其他node
function msigDeliver(thisBlock){
	//console.log('Broadcast msig');
	
	var data = {
		type: "Block",
		height: height, round: round, sender: ID,
		maker: thisBlock.maker,
		block: thisBlock.block
		//transaction: thisBlock.transaction
	}
	
	//產生blockHash和signature
	data = myMain.signature(data);
	
	for(var i in ipList)
		mesDeliver(i, data);
}


//witness互傳
function witToWitDeliver(data, witnessListAbc){	
	data.sender = ID;
	
	for(var i in witnessListAbc)
		if(witnessListAbc[i] != ID)
			mesDeliver(witnessListAbc[i], data);
		
}


//leader傳給witness
function leaderToWitDeliver(height, round, ID, witnessListAbc){
	//console.log("send P to the witnesses");
	
	var data = {
		type: "Witness",
		height: height, round: round, sender: ID,
		maker: ID,
		lockset: lastLockset,
		witSig: []
	}
	
	if(lastRoundBlock == null)	//創新block
		data.transaction = transaction123;
		//data.transaction = buffer1024[dataSize];
	else
		data.maker = lastRoundBlock.maker;
	
	//產生blockHash和signature
	data = myMain.signature(data);	
	data.block = (lastRoundBlock == null) ? data.blockHash : lastRoundBlock.block;
		
	for(var i in witnessListAbc)
		mesDeliver(witnessListAbc[i], data);
}


function VoteDeliver(height, round, ID){
	var data = {
		type: "Vote",
		height: height, round: round, sender: ID,
		vote : blockBody
	}
	
	data = myMain.signature(data);
	lastRoundVote = data.vote;
	
	for(var i in ipList)
		mesDeliver(i, data);
	
	isVoteLock = 1;
}


function TOvoteDeliver(height, round, ID){
	//console.log('TimeOut Vote', 'height = ', height, 'round = ', round);
	
	var data = {
		type: "Vote",
		height: height, round: round, sender: ID,
		vote : lastRoundVote,	//投上回合的投的票
		timeout: 1
	}
	
	//console.log("Time Out Vote: ", data.vote);
	
	data = myMain.signature(data);
	
	for(var i in ipList)
		mesDeliver(i, data);
	
	isVoteLock = 1;
}


function SynReqDeliver(height, round, ID, senior, reqHeight, reqRound){
	//console.log("Ask for synBlock");
	
	var data = {
		type: "SynReq",
		height: height, round: round, sender: ID,
		rH : reqHeight,
		rR : reqRound
	}
	
	data = myMain.signature(data);
	mesDeliver(senior, data);
}


function SynResDeliver(height, round, ID, junior, reqHeight, items){
	//console.log("Res for synBlock");
	
	var data = {
		type: "SynRes",
		height: height, round: round, sender: ID,
		items : items,
		synheight : reqHeight
	}
	
	data = myMain.signature(data);
	mesDeliver(junior, data);
}


function ReadyDeliver(ID, i){
	var data = {	type: "Ready", height: 0, round: 0, sender: ID	}
	
	data = myMain.signature(data);
	
	if(i == 1)
		for(var j = 1; j < ipList.length; j++)
			mesDeliver(j, data);
	else
		mesDeliver(i, data);

}


function mesDeliver(recipient, data){
	axios({
		method: 'post',
		url: ipList[recipient].concat("/" + data.type),
		data: data
	}).then(function(res){/*console.log(res);*/}).catch(function(err){/*console.log(err);*/});
}

module.exports = {
	BlockDeliver,
	leaderToWitDeliver,
	witToWitDeliver,
	msigDeliver,
	VoteDeliver,
	TOvoteDeliver,
	SynReqDeliver,
	SynResDeliver,
	ReadyDeliver,
	mesDeliver
}
