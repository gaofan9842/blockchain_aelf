$(document).ready(function(){
	$("#login").click(function(event) {
		//var flag = 0;
		var name = $("#username").val();
		var pwd = $("#password").val();
		if(name=="")
		{
		   alert("用户名不能为空！");
		} 
		else if(pwd=="")
		{
		   alert("密码不能为空！");
		}
		else if(name!="" && pwd !="")
		{
			var db = openDatabase('DAPPDB', '1.0', 'TJU_DB', 2 * 1024 * 1024);
			var sqlStr="SELECT * FROM user where name = '";
			sqlStr+=name;
			sqlStr+="'";
			db.transaction(function (tx) {
				tx.executeSql(sqlStr, [], function (tx, results) {
				   var len = results.rows.length;
				   if(len==0) alert("用户名或密码错误！");
				   else{
						console.log("记录数： "+len);
						console.log(results.rows.item(0).password);
						if(results.rows.item(0).password==pwd){
							var url="home.html?"+name+"?"+results.rows.item(0).unhashedAddress+"?"+results.rows.item(0).hashedAddress+"?A?";
							console.log(url);
							setTimeout(() => {
								window.location.assign(encodeURI(url));
							}, 1000);
						
						}
						else {
							alert("用户名或密码错误！");
						}
					}
				 
				});

			});
		}
	});
	$("#signup").click(function(event) {
		// AElf = window.AElf;
		// const Wallet = AElf.wallet;
		// const sha256 = AElf.utils.sha256;
		// var newAccount = Wallet.createNewWallet();
		// console.log(newAccount.address);

		// var userContractAddress = AElf.utils.decodeAddressRep(newAccount.address);
		// console.log(userContractAddress);
		window.location.href = "register.html";
	});

});