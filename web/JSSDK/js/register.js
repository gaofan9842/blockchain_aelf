$(document).ready(function(){
	$("#okButton").click(function(event) {
		var username = $("#username").val();
		var pwd = $("#password").val();
		var flag=0;
		for(var i=0;i<=username.length-1;i++){
			if(username[i]<'A'||username[i]>'Z')	{
				flag=1;
				alert("用户名只能包含大写字母！");
				break;
			}
		}
		if(flag==0){
			if(username==""){
				alert("用户名不能为空！");
			 }else if(pwd==""){
				alert("密码不能为空！");
			 }else if(username!="" && pwd !=""){
				 //search from table user by username
				 var sql="SELECT * FROM user where name = ";
				 sql+="'"+username+"'";
				 
				 var db = openDatabase('DAPPDB', '1.0', 'TJU_DB', 2 * 1024 * 1024);
				 
				  db.transaction(function (tx) {
					 tx.executeSql(sql, [], function (tx, results) {
						res=results.rows.length;
							if (res == 1){
							 alert("该用户已经存在！");
						 }else {
							 var usertype = $("input[type='radio']:checked").val();
							 var flag = 0;
							 if(usertype == "用户"){
								 flag = 1;
							 }else if(usertype == "商家"){
							 flag = 0;
							 }
							 
							 AElf = window.AElf;
							 const Wallet = AElf.wallet;
							 const sha256 = AElf.utils.sha256;
							 var newAccount = Wallet.createNewWallet();
							 
							 
							 var userContractAddress = AElf.utils.decodeAddressRep(newAccount.address);
							 
							 var db = openDatabase('DAPPDB', '1.0', 'TJU_DB', 2 * 1024 * 1024);
							 db.transaction(function (tx) {  
								 tx.executeSql('CREATE TABLE IF NOT EXISTS  user(name unique,password,primaryKey,hashedAddress,unhashedAddress,likeNumber,dislikeNumber,commentNumber,beCommentedNumbner,tokenP,tokenA,flag)');
							  });
							 
							 var sql="INSERT INTO user(name,password,primaryKey,hashedAddress,unhashedAddress,likeNumber,dislikeNumber,commentNumber,beCommentedNumbner,tokenP,tokenA,flag) VALUES (";
							 sql+="\""+username+"\",";
							 sql+="\""+pwd+"\",";
							 sql+="\""+newAccount.privateKey+"\",";
							 sql+="\""+newAccount.address+"\",";
							 sql+="\""+userContractAddress+"\",";
							 sql+="0,0,0,0,0,0,"+flag+")";
							 
							 
							 //var sql='INSERT INTO user(name,password,primaryKey,hashedAddress,unhashedAddress,likeNumber,dislikeNumber,commentNumber,beCommentedNumbner,token,flag) VALUES ("qw","qw","54e20bc6d5e1f17ac581afe26a2a536a145574e884c0ea8de10f2bfc7d279da2","c696660158c7afc80c472a66527034718facaf4111487ad769d4fd0845c3e9bb","2WTeky7YtRjTBrfiVAMcJEGtuem2hYd6wd1vu1ztcxDdkck6jY",0,0,0,0,0,1)';
							 //var sql='INSERT INTO user(name,password,primaryKey,hashedAddress,unhashedAddress,likeNumber,dislikeNumber,commentNumber,beCommentedNumbner,token,flag) VALUES ("qwe","qwe","fbdb6761c0874cb8fb39f6d10958069f8427bdc4c379bdd01bd09ebfe3fc6938","bd754dec934f0fc758daf185a11536e4010d9f684eb4a5defcf44e3fcd180cf3","2SSTSqiVMf8X3Dvv2ZT2FXudDE8A7BZyNqoUF3emjyc1gHxu19",0,0,0,0,0,1)';
							 console.log(sql);
							 db.transaction(function (tx) {
								 tx.executeSql(sql);
							 });
	 
						 
							 
							 alert("注册成功！");
							 setTimeout(() => {
								 window.location.href = "index.html";
							 }, 500);
						 
						}
						
					 }, null);
				  });
	 
			 }
		}
	
	});

});