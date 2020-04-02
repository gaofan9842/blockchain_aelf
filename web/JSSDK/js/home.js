
// UnhashedAccount is long address, use it to trading
// HashedAccount is short address, use it to query
var senderUnhashedAccount  ;
var receiverUnhashedAccount  ;
var senderHashedAccount ;
var receiverHashedAccount ;
// id means the Transaction id
var id ;
// commentStr is the comment content
var commentStr = "OO：@KK 66666666";

var receiverName = senderName ;

var senderlikeNumber,receiverlikeNumber;
var senderdislikeNumber,receiverdislikeNumber;
var sendercommentNumber,receivercommentNumber;
var senderbeCommentedNumbner,receiverbeCommentedNumbner;
var senderTokenp,receiverTokenp;
var senderTokena,receivertokena;

//初始化完成后sender的长短地址已经获得
var sql = "SELECT * FROM user where name =  '"+senderName+"'";
db.transaction(function (tx) {
    tx.executeSql(sql, [], function (tx, results) {
        senderUnhashedAccount = results.rows.item(0).unhashedAddress;
    }, null);
});

setTimeout(() => {
    selectHashedAddress();
}, 300);


//close shop details interface
function closeWindow(){
    
    senderName = tempSenderName;
    console.log("**sendreName is :" +senderName);
    document.getElementById('perInfoPage').style.display='none';
}


//receiverName
function testLikeContract (){
    selectUnhashedAddress();
    var trans;
    setTimeout(() => {
        trans = helloWorldC.likeEvent({
            SenderAdd : senderUnhashedAccount,
            ReceiverAdd : receiverUnhashedAccount
        });    
    }, 300);

    setTimeout(() => {
        selectEveryNumbers();
    }, 600);
    

    setTimeout(() => {
        receivertokena+=2;
        senderTokenp+=2;
        receiverlikeNumber+=1;
        db.transaction(function (tx) {
            tx.executeSql("UPDATE user SET likeNumber = "+receiverlikeNumber+" WHERE name = '"+receiverName+"'");
            tx.executeSql("UPDATE user SET tokenP = "+senderTokenp+" WHERE name = '"+senderName+"'");
            tx.executeSql("UPDATE user SET tokenA = "+receivertokena+" WHERE name = '"+receiverName+"'");
        });
        id=trans.TransactionId;
        console.log("the id is : "+id);
    }, 1200);
}


//receiverName
function testDislikeContract (){
    selectUnhashedAddress();
    var trans;
    setTimeout(() => {
        trans = helloWorldC.dislikeEvent({
            SenderAdd : senderUnhashedAccount,
            ReceiverAdd : receiverUnhashedAccount
        });
    }, 300);

    setTimeout(() => {
        selectEveryNumbers();
    }, 600);
    
    setTimeout(() => {
        receivertokena-=2;
        senderTokenp+=2;
        receiverdislikeNumber+=1;
        db.transaction(function (tx) {
            tx.executeSql("UPDATE user SET dislikeNumber = "+receiverdislikeNumber+" WHERE name = '"+receiverName+"'");
            tx.executeSql("UPDATE user SET tokenP = "+senderTokenp+" WHERE name = '"+senderName+"'");
            tx.executeSql("UPDATE user SET tokenA = "+receivertokena+" WHERE name = '"+receiverName+"'");
        });
        id=trans.TransactionId;
        console.log("the id is : "+id);
    }, 1200);
}


//receiverName  commentStr 
function testCommentContract (){
    selectUnhashedAddress();
    var trans;
    setTimeout(() => {
        trans = helloWorldC.commentEvent({
            SenderCommentAdd : senderUnhashedAccount,
            CommentContent : commentStr
        });        
    }, 300);

    setTimeout(() => {
        selectEveryNumbers();
    }, 600);
    
    setTimeout(() => {
        senderTokenp+=2;
        sendercommentNumber+=1;
        receiverbeCommentedNumbner+=1;
        db.transaction(function (tx) {
            tx.executeSql("UPDATE user SET tokenP = "+senderTokenp+" WHERE name = '"+senderName+"'");
            tx.executeSql("UPDATE user SET commentNumber = "+sendercommentNumber+" WHERE name = '"+senderName+"'");
            tx.executeSql("UPDATE user SET beCommentedNumbner = "+receiverbeCommentedNumbner+" WHERE name = '"+receiverName+"'");
            tx.executeSql("SELECT * from user where name ='"+receiverName+"'", [], function (tx, results) {
                receiverHashedAccount = results.rows.item(0).hashedAddress;
            }, null);
        });
        id=trans.TransactionId;
        console.log("the id is : "+id);
    }, 1200);
    

    setTimeout(() => {    
        sql ="INSERT INTO COMMENTINFO (id,senderHashedAddress ,senderUnhashedAddress , receiverHashedAddress ,receiverUnhashedAddress, commentContent) VALUES (";
        sql+="\""+id+"\",";
        sql+="\""+senderHashedAccount+"\",";
        sql+="\""+senderUnhashedAccount+"\",";
        sql+="\""+receiverHashedAccount+"\",";
        sql+="\""+receiverUnhashedAccount+"\",";
        sql+="\""+commentStr+"\")";
        console.log(sql);
        db.transaction(function (tx) {
            tx.executeSql(sql);
        });       
    }, 1500);


}

//query personal information
function PerInf(){
    console.log("现在查询的是 ：" +senderName);
    
    selectEveryNumbers();
    
    setTimeout(() => {
        selectHashedAddress();
    }, 300);

    setTimeout(() => {
        let PPScore=tokenContract.GetBalance.call({
            symbol: 'TJUPP',
            owner: senderHashedAccount
        });
        let PNScore=tokenContract.GetBalance.call({
            symbol: 'TJUPN',
            owner: senderHashedAccount
        });
        let senderPBalance = PPScore.balance-PNScore.balance;
    
        let APScore=tokenContract.GetBalance.call({
            symbol: 'TJUAP',
            owner: senderHashedAccount
        });
        let ANScore=tokenContract.GetBalance.call({
            symbol: 'TJUAN',
            owner: senderHashedAccount
        });
        let senderABalance = APScore.balance-ANScore.balance;
        //console.log(senderBalance);
        
        document.getElementById('perInfoPage').style.display='block';
        document.getElementById('thePerScore').innerText = "活跃积分为 : "+senderPBalance+"   权威积分为 : "+senderABalance;
        document.getElementById('thePerHashedAdd').innerText = "账户钱包的哈希地址 : "+senderHashedAccount;
        document.getElementById('thePerUnhashedAdd').innerText = "账户钱包的未哈希地址 : "+senderUnhashedAccount;
        document.getElementById('like').innerText = "获赞数量为 ： "+senderlikeNumber+"  获踩数量为 ： "+senderdislikeNumber;
        document.getElementById('comment').innerText = "评论总数为 ： "+sendercommentNumber+"  被回复总数为 ： "+senderbeCommentedNumbner;
    }, 600);

    // document.getElementById('fade').style.display='block';
    

}

function queryPerInfoDb(){
    console.log("现在查询的是* ：" +senderName);
    selectEveryNumbers();

    setTimeout(() => {
        document.getElementById('perInfoPage').style.display='block';
        document.getElementById('thePerScore').innerText = "活跃积分为 : "+senderTokenp+"   权威积分为 : "+senderTokena;
        document.getElementById('thePerHashedAdd').innerText = "账户钱包的哈希地址 : "+senderHashedAccount;
        document.getElementById('thePerUnhashedAdd').innerText = "账户钱包的未哈希地址 : "+senderUnhashedAccount;
        document.getElementById('like').innerText = "获赞数量为 ： "+senderlikeNumber+"  获踩数量为 ： "+senderdislikeNumber;
        document.getElementById('comment').innerText = "评论总数为 ： "+sendercommentNumber+"  被回复总数为 ： "+senderbeCommentedNumbner;        
    }, 600);

}

function selectUnhashedAddress(){
    // commentStr = $("#idid").val();
    sql = "SELECT * FROM user where name =  '"+receiverName+"'";
    db.transaction(function (tx) {
        tx.executeSql(sql, [], function (tx, results) {
            var len = results.rows.length, i;
            //console.log("记录数： "+len);
            receiverUnhashedAccount = results.rows.item(i).unhashedAddress;
        }, null);
    });
}

function selectHashedAddress(){
    
    sql = "SELECT * FROM user where name =  '"+senderName+"'";
    db.transaction(function (tx) {
        tx.executeSql(sql, [], function (tx, results) {
            var len = results.rows.length, i;
            //console.log("记录数： "+len);
            senderHashedAccount = results.rows.item(i).hashedAddress;
        }, null);
    });
}

function getUserAdd(str){
    var ans="";
    for (var i=0;i<str.length;i++){
        if (str[i]==":" || str[i]=="："){
            break;
        }
        ans+=str[i];
    }
    return ans;
}

function selectEveryNumbers(){
    sql = "select * from user WHERE name= '" +senderName+"'";
    db.transaction(function (tx) {
        tx.executeSql(sql, [], function (tx, results) {
            senderlikeNumber = results.rows.item(0).likeNumber;
            senderdislikeNumber = results.rows.item(0).dislikeNumber;
            sendercommentNumber = results.rows.item(0).commentNumber;
            senderbeCommentedNumbner = results.rows.item(0).beCommentedNumbner;
            senderTokenp = results.rows.item(0).tokenP;
            senderTokena = results.rows.item(0).tokenA;
            senderHashedAccount = results.rows.item(0).hashedAddress;
        }, null);
    });
    setTimeout(() => {
        sql = "select * from user WHERE name= '" +receiverName+"'";
        db.transaction(function (tx) {
            tx.executeSql(sql, [], function (tx, results) {
                receiverlikeNumber = results.rows.item(0).likeNumber;
                receiverdislikeNumber = results.rows.item(0).dislikeNumber;
                receivercommentNumber = results.rows.item(0).commentNumber;
                receiverbeCommentedNumbner = results.rows.item(0).beCommentedNumbner;
                receiverTokenp = results.rows.item(0).tokenP;
                receivertokena = results.rows.item(0).tokenA;
                receiverHashedAccount = results.rows.item(0).hashedAddress;
            }, null);
        });
    }, 300);

}

	
function getAdd(str){
    var ans="";
	for (var i=6;i<str.length;i++){
		if (str[i]==":" || str[i]=="："){
			break;
		}
		ans+=str[i];
	}
	return ans;
}

function jmpToComPage(){
    window.location.href = "comment.html";
}



// textarea限制字数

function keyUP(t){
    var len = $(t).val().length;
    if(len > 139){
        $(t).val($(t).val().substring(0,140));
    }
}



var username = senderName;

//下线操作
function exitButton(){

    //create出该用户特有的symbol币种（如果用户之前已经下线过，那aelf机制就自动不在create）
    tokenContract.Create({
        symbol: username+"PP",
        tokenName: username+"PP",
        totalSupply: 100000,
        decimals: 2,
        issuer: wallet.address,
        isBurnable: true
    });
    setTimeout(() => {
            tokenContract.Create({
            symbol: username+"PN",
            tokenName: username+"PN",
            totalSupply: 100000,
            decimals: 2,
            issuer: wallet.address,
            isBurnable: true
        });
    }, 200);

    setTimeout(() => {
            tokenContract.Create({
            symbol: username+"AP",
            tokenName: username+"AP",
            totalSupply: 100000,
            decimals: 2,
            issuer: wallet.address,
            isBurnable: true
        });
    }, 400);

    setTimeout(() => {
            tokenContract.Create({
            symbol: username+"AN",
            tokenName: username+"AN",
            totalSupply: 100000,
            decimals: 2,
            issuer: wallet.address,
            isBurnable: true
        });
    }, 600);


    //发币
    setTimeout(() => {
            tokenContract.Issue({
            symbol: username+"PP",
            amount: 100000,
            memo: '记事本',
            to: helloWorldContractAddress
        });
    }, 800);

        setTimeout(() => {
                tokenContract.Issue({
                symbol: username+"PN",
                amount: 100000,
                memo: '记事本',
                to: helloWorldContractAddress
            });
        }, 1000);

        setTimeout(() => {
            tokenContract.Issue({
                symbol: username+"AP",
                amount: 100000,
                memo: '记事本',
                to: helloWorldContractAddress
            });
        }, 1200);

        setTimeout(() => {
                tokenContract.Issue({
                symbol: username+"AN",
                amount: 100000,
                memo: '记事本',
                to: helloWorldContractAddress
            });
        }, 1400);

        var userTJUPP,userTJUPN,userTJUAP,userTJUAN,userTJUA,userTJUP;
        console.log("?????????????"+MyaddressHashed);
        console.log("!!!!!!!!!!!!!"+Myaddress);
        
        //从用户账户链上查询该用户钱包中的值，查出之后需要给中间人打多少钱。
        setTimeout(() => {
            userTJUPP = tokenContract.GetBalance.call({
            symbol: 'TJUPP',
            owner: MyaddressHashed
        }).balance;
        }, 1500);

        setTimeout(() => {
            userTJUPN = tokenContract.GetBalance.call({
            symbol: 'TJUPN',
            owner: MyaddressHashed
        }).balance;
        }, 1600);
     
      setTimeout(() => {
        userTJUAP = tokenContract.GetBalance.call({
            symbol: 'TJUAP',
            owner: MyaddressHashed
        }).balance;
      }, 1700);

      setTimeout(() => {
            userTJUAN = tokenContract.GetBalance.call({
            symbol: 'TJUAN',
            owner: MyaddressHashed
        }).balance;
      }, 1800);
      
setTimeout(() => {
        console.log("我的账户PP值： "+userTJUPP);
        console.log("我的账户PN值:  "+userTJUPN);
        console.log("我的账户AP值： "+userTJUAP);
        console.log("我的账户AN值:  "+userTJUAN);
     
        userTJUA = userTJUAP - userTJUAN;
        userTJUP = userTJUPP - userTJUPN;
        console.log("我的账户A值： "+userTJUA);
        console.log("我的账户P值:  "+userTJUP);
}, 1900);
    
   
 //给中间人打symbol币并且同时中和掉账户本身的通用货币（TJUP、TJUA）
   setTimeout(() => {
    if(userTJUP>0){
        helloWorldC.middleTransfer({
            To : Myaddress,
            MySymbol : "TJUPN",
            Amount : userTJUP
        });
        
            helloWorldC.middleTransfer({
                To : MiddleManAddressUnhashed,
                MySymbol : username+"PP",
                Amount : userTJUP
            });        
    }else if(userTJUP<0){
        var tempAmout = -userTJUP;
        helloWorldC.middleTransfer({
            To : Myaddress,
            MySymbol : "TJUPP",
            Amount : tempAmout
        });
            helloWorldC.middleTransfer({
                To : MiddleManAddressUnhashed,
                MySymbol : username+"PN",
                Amount : tempAmout
            });
    }
   }, 2000);

   setTimeout(() => {
    if(userTJUA>0){
        helloWorldC.middleTransfer({
            To : Myaddress,
            MySymbol : "TJUAN",
            Amount : userTJUA
        });
  
            helloWorldC.middleTransfer({
                To : MiddleManAddressUnhashed,
                MySymbol : username+"AP",
                Amount : userTJUA
            });
    }else if (userTJUA<0){
        var tempAmout = -userTJUA;
        helloWorldC.middleTransfer({
            To : Myaddress,
            MySymbol : "TJUAP",
            Amount : tempAmout
        });
      
            helloWorldC.middleTransfer({
                To : MiddleManAddressUnhashed,
                MySymbol : username+"AN",
                Amount : tempAmout
            });
    }       
   }, 2200);
   

    


    setTimeout(() => {
        window.location.href = "index.html";
    }, 3800);
    
    setTimeout(() => {
        check(username,"3000");
    }, 3000);
        // setTimeout(() => {
        //     window.location.href = "index.html";
        // }, 2000);
        
    }


//before user offline, query hello world contract balance to check middle man balance
function check(use,ti){
    let a = tokenContract.GetBalance.call({
		symbol: use+"PP",
		owner: helloWorldContractAddress
	});
    console.log("hello 的 "+use+"PP "+ti+"是 "+a.balance );
    let b = tokenContract.GetBalance.call({
		symbol: use+"PN",
		owner: helloWorldContractAddress
	});
    console.log("hello 的 "+use+"PN "+ti+"是 "+b.balance );
    let c = tokenContract.GetBalance.call({
		symbol: use+"AP",
		owner: helloWorldContractAddress
	});
    console.log("hello 的 "+use+"AP "+ti+"是 "+c.balance );
    let d = tokenContract.GetBalance.call({
		symbol: use+"AN",
		owner: helloWorldContractAddress
	});
    console.log("hello 的 "+use+"AN "+ti+"是 "+d.balance );

}

//create and issue score according to username
function create(){
    tokenContract.Create({
        symbol: username+"PP",
        tokenName: username+"PP",
        totalSupply: 100000,
        decimals: 2,
        issuer: wallet.address,
        isBurnable: true
    });
    setTimeout(() => {
        tokenContract.Create({
                symbol: username+"PN",
                tokenName: username+"PN",
                totalSupply: 100000,
                decimals: 2,
                issuer: wallet.address,
                isBurnable: true
            });    
    }, 100);
    setTimeout(() => {
            tokenContract.Create({
                symbol: username+"AP",
                tokenName: username+"AP",
                totalSupply: 100000,
                decimals: 2,
                issuer: wallet.address,
                isBurnable: true
            });    
    }, 200);
    setTimeout(() => {
                tokenContract.Create({
                symbol: username+"AN",
                tokenName: username+"AN",
                totalSupply: 100000,
                decimals: 2,
                issuer: wallet.address,
                isBurnable: true
            });
    }, 300);
    setTimeout(() => {

        tokenContract.Issue({
            symbol: username+"PP",
            amount: 100000,
            memo: '记事本',
            to: helloWorldContractAddress
        });
    }, 600);
    setTimeout(() => {
        tokenContract.Issue({
            symbol: username+"PN",
            amount: 100000,
            memo: '记事本',
            to: helloWorldContractAddress
        });          
    }, 700);
      setTimeout(() => {
        tokenContract.Issue({
            symbol: username+"AP",
            amount: 100000,
            memo: '记事本',
            to: helloWorldContractAddress
        });           
      }, 800);
   setTimeout(() => {
             tokenContract.Issue({
            symbol: username+"AN",
            amount: 100000,
            memo: '记事本',
            to: helloWorldContractAddress
        });  
   }, 900);
}




var mainComment = $('.commentAll').find('.plBtn');

// init the page   
db.transaction(function (tx) {
    tx.executeSql("SELECT * FROM user where flag = 0 ", [], function (tx, results) {
    var len = results.rows.length, i;
        console.log("商家数： "+len);
        for (i = 0; i < len; i++){
            // alert(results.rows.item(i).log ); 
            //console.log(results.rows.item(i).commentContent);
            var oSize = results.rows.item(i).name;
            oHtml = '<div class="comment-show-con clearfix"><div class="comment-show-con-img pull-left"><img src="img/xiaohua.png" alt=""></div><div class="comment-show-con-list pull-left clearfix"><div class="pl-text clearfix" style="color : white"><span class="my-pl-con">&nbsp;'+ oSize +'</span></div><div class="date-dz"><div class="date-dz-right pull-right comment-pl-block"><a href="javascript:;" style="color : white" class="date-dz-pl pl-hf hf-con-block pull-left">论坛</a><span class="pull-left date-dz-line">|</span><a href="javascript:;"  style="color : white" class="date-dz-z pull-left"><i class="date-dz-z-click-red"></i>赞</a><span class="pull-left date-dz-line">|</span><a href="javascript:;" style="color : white" class="date-dz-z pull-left"><i class="date-dz-z-click-red1"></i>踩</a><span class="pull-left date-dz-line">|</span><a href="javascript:;" style="color : white" class="date-dz-pl info hf-con-block pull-left"><i class="date-dz-z-click-red2" ></i>详情 </a></div></div><div class="hf-list-con"></div></div></div>';
            if(oSize.replace(/(^\s*)|(\s*$)/g, "") != ''){
                
                mainComment.parents('.reviewArea ').siblings('.comment-show').prepend(oHtml);
                mainComment.siblings('.flex-text-wrap').find('.comment-input').prop('value','').siblings('pre').find('span').text('');
            }                   
        }
    
    }, null);
});




// 点击论坛跳转界面*****************传商家名字以及当前用户名字
$('.comment-show').on('click','.pl-hf',function(){
    commentOthers=$(this);
    //获取论坛人的名字
    var fhName = $(this).parents('.date-dz-right').parents('.date-dz').siblings('.pl-text').find('.my-pl-con').html();
    console.log(fhName);
    fhName=getAdd(fhName);

    var url="comment.html?"+senderName+"?"+Myaddress+"?"+MyaddressHashed+"?"+fhName+"?";
    setTimeout(() => {
        window.location.assign(encodeURI(url));
    }, 100);
});





// like/dislike button function
$('.comment-show').on('click','.date-dz-z',function(){
    var check = $(this).html();
    check = check[check.length-1];
    if($(this).is('.date-dz-z-click')){
        $(this).removeClass('date-dz-z-click red');
        if (check=='赞'){
            $(this).find('.date-dz-z-click-red').removeClass('red');
        } else {
            $(this).find('.date-dz-z-click-red1').removeClass('red');
        }
    }else {
        receiverName = $(this).parents('.date-dz-right').parents('.date-dz').siblings('.pl-text').find('.my-pl-con').html();
        receiverName = getAdd(receiverName);
        console.log("receiver : "+receiverName);
        console.log("sender : "+senderName);
        if (check=='赞'){
            testLikeContract();
        }else {
            testDislikeContract();
        }
        $(this).addClass('date-dz-z-click');
        if (check=='赞'){
            $(this).find('.date-dz-z-click-red').addClass('red');
        } else {
            $(this).find('.date-dz-z-click-red1').addClass('red');
        }
    }
});


// show shop details infomation
$('.comment-show').on('click','.info',function(){
    var fhName = $(this).parents('.date-dz-right').parents('.date-dz').siblings('.pl-text').find('.my-pl-con').html();
    
    fhName=getAdd(fhName);
    senderName = fhName;
    receiverName = senderName;
    selectHashedAddress();
    setTimeout(() => {
        queryPerInfoDb();
    }, 300);
    
    console.log(senderName);
    setTimeout(() => {
        document.getElementById('perInfoPage').style.display='block';
    }, 1000);
    
});
