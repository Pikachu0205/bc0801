var saveblock = [], readyMem = 0;
receiveBlock = 0, stopRecMsig = 0, broMsig = 0, witnessAbc = [];
lastBlockHash = 0;
feedbackVote = [],isfeedback = 0;

var multer = require('multer');
var upload = multer();

myMain = require("./myMain.js");
myProcedure = require("./myProcedure.js");
myDeliver = require("./myDeliver.js");

transactionReceiver = 0;



app.post('/Height',upload.array(), function(req, res) {
	
	//console.log(req.body);
	//console.log(typeof(req.body.receiverAddress));
	//console.log(req.body.receiverAddress[1]);
	//console.log(req.body.transaction[1]);
	
	if(transactionReceiver == 0){
		
		transaction123.length = 0;
		receiverAddress123.length = 0;
		feedbackVote.length = 0;
	
		transactionReceiver = 1;
		isfeedback = 0;
		
		lastBlockHash = req.body.parentHash;
		height = req.body.height;
		//console.log();
		console.log("\n===== height : " + height + " =====");
		
		//console.log("transaction123 : " + transaction123);
		//console.log("receiverAddress123 : " + receiverAddress123);
		//console.log("req.body.transaction : " + req.body.transaction);
		//console.log("req.body.receiverAddress : " + req.body.receiverAddress);
		
		for(var i = 0; i < req.body.receiverAddress.length; i++){
			if(req.body.receiverAddress[i] == "0x00000000000000000000000000000000000000ff"){
				transaction123.push(String(req.body.transaction[i]));
				receiverAddress123.push(req.body.receiverAddress[i]);
			}
		}
		
		//console.log("transaction123 : " + transaction123);
		//console.log("receiverAddress123 : " + receiverAddress123);
		

		
		//transaction123 = req.body.transaction;
		//if(req.body.height == height + 1)
		//if(transactionReceiver == 0){
		myMain.newHeight(0);
		//transactionReceiver = 1;
	}
	//height = req.body.blockHeight;
	
	//console.log(transaction123);
	
	res.send(" abc ");
});
	
app.post('/Block', function(req, res) {
	if(myMain.customVerify(req.body)  &&  height > 0){
		//myMain.display(req.body);
			
		//if(receiveBlock == null && req.body.height == height  &&  req.body.round == round)
		if(receiveBlock == null && req.body.height == height  &&  req.body.round == round)
			myMain.getBlock(req);
		
		//else if(req.body.height > height  &&  saveblock.indexOf(req.body.height) == -1)
			//myDeliver.SynReqDeliver(height, round, ID, req.body.sender, req.body.height, req.body.round);
		
		else if(req.body.height >= height  &&  req.body.round > round){
			//if(myMain.vdf()){
				var istimeout = -1;		//synround為要同步到的回合
				myMain.toStop();
				
				//console.log("round > ", req.body.round);
				myMain.newRound(istimeout, req.body.round, req);
			}
		
	}
	res.end();
});

app.post('/Vote', function(req, res) {
	if(myMain.customVerify(req.body)  &&  height > 0){
		myMain.display(req.body);	//console.log("vote:", req.body.vote);
			
		thisLockset.push(req.body);		//將票存到lockset
		
		//console.log(req.body.vote);
		fbBh = (req.body.vote == null) ? [] : req.body.vote.blockHash;
		fbv = {
			blockHash: fbBh,
			sender: req.body.sender,
			voteHash: req.body.blockHash,
			signature: req.body.signature
		}
		feedbackVote.push(fbv);
		
		//if(req.body.height > height  &&  saveblock.indexOf(req.body.height) == -1)
			//myDeliver.SynReqDeliver(height, round, ID, req.body.sender, req.body.height, req.body.round);
		
		//else if(req.body.height >= height  &&  req.body.round > round){
		if(req.body.height >= height  &&  req.body.round > round){
			//if(myMain.vdf()){
				var istimeout = -1;		//synround為要同步到的回合
				myMain.toStop();
				
				//console.log("round > ", req.body.round);
				myMain.newRound(istimeout, req.body.round, req);
			}
		
		
		if( commitBlock ==null && ((mode == "t"  &&  thisLockset.length == 4*fault+1) || (mode == "m"  &&  thisLockset.length == 2*fault+1)) ){
			if(mode == "t")
				commitBlock = myProcedure.legalVote(thisLockset, height, round, 4);
			if(mode == "m")
				commitBlock = myProcedure.legalVote(thisLockset, height, round, 2);
			
			if(commitBlock != null){
				//console.log("insert", commitBlock, "to DB");
				
				saveblock.push(req.body.height);
				//mgdb.insertOne(commitBlock);
				lastBlockHash = commitBlock.blockHash;
				
				//console.log(commitBlock.blockHash);
				//console.log(thisLockset);
				
				if( !newHeightTogether ){
					if(isfeedback != 1){
						
						myProcedure.feedbackTransaction();
						isfeedback = 1;
					}
						
					//myMain.newHeight(0);
				}
				
			}
		}
		
	}
	res.end();
});

app.post('/SynReq', function(req, res){	
	if(myMain.customVerify(req.body)){
		myMain.display(req.body);
		
		mgdb.find({
			
			height:{
				"$gte": req.body.height,
				"$lt": req.body.rH
			}
			
		}).toArray(function(err,items){
			if(err) throw err;
			//myDeliver.SynResDeliver(height, round, ID, req.body.sender, req.body.rH, items, VDF);
			myDeliver.SynResDeliver(height, round, ID, req.body.sender, req.body.rH, items);
		});
	}
	
	res.end();
});

app.post('/SynRes', function(req, res) {
	if(myMain.customVerify(req.body)){
	//if(myMain.customVerify(req.body) && vdfVerif(req.body.data.VDF, lastBlockHash)){
		myMain.display(req.body);
		
		
		
		for(var j in req.body.items){
				
			verifyblock = {
				height: req.body.items[j].height,
				maker: req.body.items[j].maker,
				blockHash: req.body.items[j].blockHash,
				signature: req.body.items[j].signature
			}
			
			//if(myMain.synVerify(verifyblock)){
				if(saveblock.indexOf(req.body.items[j].height) == -1){
					saveblock.push(req.body.items[j].height);
					//console.log("~~~~~Commit the syn block~~~~~");
					mgdb.insertOne(verifyblock);
				}
			//}
			
		}
	}
	
	//synH用來確定這個回傳的h比我高.有時我可能先收到更高的
	if(synH < req.body.synheight){
		synH = req.body.synheight;
		height = req.body.synheight-1;
		
		//synround為要同步到的回合 因為要從height去同步所以-1
		var synround = req.body.round-1;
		
		myMain.newHeight(synround);
	}
	
	//console.log();
	res.end();
});

app.post('/Ready', function(req, res) {
	//if(myMain.customVerify(req.body)){
		var startRound = -1;
		
		if(ID == 0){
			readyMem++;
			//console.log("readyMem", readyMem);
			
			if(readyMem == member-1){
				myDeliver.ReadyDeliver(ID, 1);
				
				setTimeout(function(){
					myProcedure.Timing();
					//myMain.newHeight(startRound);
				},500);
			}
			
		}
		else
			//myMain.newHeight(startRound);
		
	//}
	
	res.end();
});

app.post('/Witness', function(req, res) {
	var allSig = true;
	
	//if(myMain.synVerify(req.body)  &&  !stopRecMsig  &&  req.body.height == height  &&  req.body.round == round){
	if(req.body.height == height  &&  req.body.round == round){
		
		//檢查自己簽了沒
		if(req.body.witSig.indexOf(ID) == -1)
			req.body.witSig.push(ID);
			//console.log("簽完witSig: ", req.body.witSig);
		
		//找出還沒簽的人
		witnessAbc = myProcedure.getArrDifference(witnessList, req.body.witSig);
		//console.log(witnessAbc);
		delete req.body.transaction;
		
		//有人沒簽
		if(witnessAbc.length != 0){
			req.body.sender = ID;
			myDeliver.witToWitDeliver(req.body, witnessAbc);	//witness互傳
		}
		
		//大家都簽了
		else	{
			if(!broMsig){	//還沒廣播過
				broMsig = 1;
				myMain.display(req.body);
				myDeliver.msigDeliver(req.body);
			}
		}
	}
	
	else if(req.body.height >= height  &&  req.body.round > round){
		//if(myMain.vdf(lastBlockHash)){
			
			//synround為要同步到的回合
			var timeout = -1, synround = req.body.round;
			
			//停止timeout的設定
			myMain.toStop();
			
			//console.log("round > ", synround);
			myMain.newRound(timeout, synround, req);
		}
	
	res.end();
});