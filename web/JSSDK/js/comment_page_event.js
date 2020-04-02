
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

var receiverName = senderName;

var senderlikeNumber,receiverlikeNumber;
var senderdislikeNumber,receiverdislikeNumber;
var sendercommentNumber,receivercommentNumber;
var senderbeCommentedNumbner,receiverbeCommentedNumbner;
var senderTokenp,receiverTokenp;
var senderTokena,receivertokena;
console.log("11*     "+aelf.currentProvider.host);
var sql = "SELECT * FROM user where name =  '"+senderName+"'";
db.transaction(function (tx) {
    tx.executeSql(sql, [], function (tx, results) {
        senderUnhashedAccount = results.rows.item(0).unhashedAddress;
    }, null);
});

setTimeout(() => {
    selectHashedAddress();
}, 300);


//close personal information window
function closeWindow(){
    document.getElementById('perInfoPage').style.display='none';
    // document.getElementById('fade').style.display='none';
}

//like event use helloworld contract demo
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

//dislike event use helloworld contract demo
//need receiverName
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

//commment event use helloworld contract demo
//need receiverName  commentStr
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

//show personal details from block chain
function testPerInf(){

    selectEveryNumbers();

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

//show personal details from database 
function queryPerInfoDb(){

    selectEveryNumbers();

    setTimeout(() => {

        document.getElementById('perInfoPage').style.display='block';
        document.getElementById('thePerScore').innerText = "活跃积分为 : "+senderTokenp+"   权威积分为 : "+senderTokena;
        document.getElementById('thePerHashedAdd').innerText = "账户钱包的哈希地址 : "+senderHashedAccount;
        document.getElementById('thePerUnhashedAdd').innerText = "账户钱包的未哈希地址 : "+senderUnhashedAccount;
        document.getElementById('like').innerText = "获赞数量为 ： "+senderlikeNumber+"  获踩数量为 ： "+senderdislikeNumber;
        document.getElementById('comment').innerText = "评论总数为 ： "+sendercommentNumber+"  被回复总数为 ： "+senderbeCommentedNumbner;   
        // document.getElementById('perInfoPage').style.display='block';
        // document.getElementById('thePerScore').innerText = "your P score is : "+senderTokenp+"  ;your A score is : "+senderTokena;
        // document.getElementById('thePerHashedAdd').innerText = "your hashed address is : "+senderHashedAccount;
        // document.getElementById('thePerUnhashedAdd').innerText = "your unhashed address is : "+senderUnhashedAccount;
        // document.getElementById('like').innerText = "your like number is "+senderlikeNumber+"  ;your dislike number is "+senderdislikeNumber;
        // document.getElementById('comment').innerText = "your commment number is "+sendercommentNumber+"  ;your be comment number is "+senderbeCommentedNumbner;        
    }, 600);

}

//according to receiver name to query receiverUnhashedAccount (long address)
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

//according to sender name to query senderHashedAccount (short address)
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

//query sender and receiver information
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
            }, null);
        });
    }, 300);

}

var ans="";
function getAdd(str){
    ans="";
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


// return to home page, and transfer information 
function backToHome (){

    var url="home.html?"+tempSenderName+"?"+Myaddress+"?"+MyaddressHashed+"?B?";
    
    window.location.assign(encodeURI(url));
    
}


// textarea限制字数
function keyUP(t){
    var len = $(t).val().length;
    if(len > 139){
        $(t).val($(t).val().substring(0,140));
    }
}



var mainComment = $('.commentAll').find('.plBtn');

// init the page
var shopKey;
db.transaction(function (tx) {
    tx.executeSql("SELECT * FROM user where name = '"+shopName+"'", [], function (tx, results) {
    var len = results.rows.length, i;
        console.log("记录数： "+len);
        console.log("商家"+shopName+"的address是"+shopKey);
        shopKey =  results.rows.item(0).hashedAddress;
    }, null);
});

setTimeout(() => {
    db.transaction(function (tx) {
        tx.executeSql("SELECT * FROM commentinfo where receiverHashedAddress = '"+shopKey+"'", [], function (tx, results) {
        var len = results.rows.length, i;
            console.log("记录数： "+len);
            for (i = 0; i < len; i++){
                // alert(results.rows.item(i).log ); 
                //console.log(results.rows.item(i).commentContent);
                var oSize = results.rows.item(i).commentContent;
                oHtml = '<div class="comment-show-con clearfix"><div class="comment-show-con-img pull-left"><img src="img/header-img-comment_03.png" alt=""></div><div class="comment-show-con-list pull-left clearfix"><div class="pl-text clearfix"><span class="my-pl-con">&nbsp;'+ oSize +'</span></div><div class="date-dz"><div class="date-dz-right pull-right comment-pl-block"><a href="javascript:;"  style="color : white" class="date-dz-pl pl-hf hf-con-block pull-left">回复</a><span class="pull-left date-dz-line">|</span><a href="javascript:;" style="color : white" class="date-dz-z pull-left"><i class="date-dz-z-click-red"></i>赞</a><span class="pull-left date-dz-line">|</span><a href="javascript:;" style="color : white" class="date-dz-z pull-left"><i class="date-dz-z-click-red1"></i>踩</a><span class="pull-left date-dz-line">|</span><a href="javascript:;" style="color : white" class="date-dz-pl info hf-con-block pull-left"><i class="date-dz-z-click-red2"></i>详情 </a></div></div><div class="hf-list-con"></div></div></div>';
                if(oSize.replace(/(^\s*)|(\s*$)/g, "") != ''){
                    
                    mainComment.parents('.reviewArea ').siblings('.comment-show').prepend(oHtml);
                    mainComment.siblings('.flex-text-wrap').find('.comment-input').prop('value','').siblings('pre').find('span').text('');
                }                   
            }
        
        }, null);
    });    
}, 300);


var commentOthers = $('.comment-show').find('.pl-hf');



// create main comment interface
$('.commentAll').on('click','.plBtn',function(){
    //获取输入内容
    var oSize = $(this).siblings('.flex-text-wrap').find('.comment-input').val();
    
    receiverName=shopName;
    commentStr = senderName+": "+oSize;
    
    testCommentContract();
    //动态创建评论模块
    oHtml = '<div class="comment-show-con clearfix"><div class="comment-show-con-img pull-left"><img src="img/header-img-comment_03.png" alt=""></div><div class="comment-show-con-list pull-left clearfix"><div class="pl-text clearfix"><span class="my-pl-con">&nbsp;'+ commentStr +'</span></div><div class="date-dz"><div class="date-dz-right pull-right comment-pl-block"><a href="javascript:;" style="color : white" class="date-dz-pl pl-hf hf-con-block pull-left">回复</a><span class="pull-left date-dz-line">|</span><a href="javascript:;" style="color : white" class="date-dz-z pull-left"><i class="date-dz-z-click-red"></i>赞</a><span class="pull-left date-dz-line">|</span><a href="javascript:;" style="color : white" class="date-dz-z pull-left"><i class="date-dz-z-click-red1"></i>踩</a><span class="pull-left date-dz-line">|</span><a href="javascript:;" style="color : white" class="date-dz-pl info hf-con-block pull-left"><i class="date-dz-z-click-red2"></i>详情 </a></div></div><div class="hf-list-con"></div></div></div>';
    if(oSize.replace(/(^\s*)|(\s*$)/g, "") != ''){
        
        $(this).parents('.reviewArea ').siblings('.comment-show').prepend(oHtml);
        $(this).siblings('.flex-text-wrap').find('.comment-input').prop('value','').siblings('pre').find('span').text('');
    }
});




// reply button function
$('.comment-show').on('click','.pl-hf',function(){
    commentOthers=$(this);
    //获取回复人的名字
    var fhName = $(this).parents('.date-dz-right').parents('.date-dz').siblings('.pl-text').find('.my-pl-con').html();
    
    fhName=getAdd(fhName);
    receiverName=fhName;
    //回复@
    var fhN = '回复@'+fhName+" ";
    
    var fhHtml = '<div class="hf-con pull-left"> <textarea class="content comment-input hf-input" placeholder="" onkeyup="keyUP(this)"></textarea> <a href="javascript:;" class="hf-pl">评论</a></div>';
    //显示回复
    if($(this).is('.hf-con-block')){
        $(this).parents('.date-dz-right').parents('.date-dz').append(fhHtml);
        $(this).removeClass('hf-con-block');
        $('.content').flexText();
        $(this).parents('.date-dz-right').siblings('.hf-con').find('.pre').css('padding','6px 15px');
        
        //input框自动聚焦
        $(this).parents('.date-dz-right').siblings('.hf-con').find('.hf-input').val('').focus().val(fhN);
    }else {
        $(this).addClass('hf-con-block');
        $(this).parents('.date-dz-right').siblings('.hf-con').remove();
    }
});



 
// create comment reply interface
$('.comment-show').on('click','.hf-pl',function(){
    var oThis = $(this);
    // 获取输入内容
    var oHfVal = $(this).siblings('.flex-text-wrap').find('.hf-input').val();
    console.log("comment contant: "+oHfVal);
    
    oSize=oHfVal;
    commentStr = senderName+": "+oHfVal;
    testCommentContract();
    oHtml = '<div class="comment-show-con clearfix"><div class="comment-show-con-img pull-left"><img src="img/header-img-comment_03.png" alt=""></div><div class="comment-show-con-list pull-left clearfix"><div class="pl-text clearfix"><span class="my-pl-con">&nbsp;'+ commentStr +'</span></div><div class="date-dz"><div class="date-dz-right pull-right comment-pl-block"><a href="javascript:;" style="color : white" class="date-dz-pl pl-hf hf-con-block pull-left">回复</a><span class="pull-left date-dz-line">|</span><a href="javascript:;" style="color : white" class="date-dz-z pull-left"><i class="date-dz-z-click-red"></i>赞</a><span class="pull-left date-dz-line">|</span><a href="javascript:;" style="color : white" class="date-dz-z pull-left"><i class="date-dz-z-click-red1"></i>踩</a><span class="pull-left date-dz-line">|</span><a href="javascript:;" style="color : white" class="date-dz-pl info hf-con-block pull-left"><i class="date-dz-z-click-red2"></i>详情 </a></div></div><div class="hf-list-con"></div></div></div>';
    
    if(oSize.replace(/(^\s*)|(\s*$)/g, "") != ''){
        
        mainComment.parents('.reviewArea ').siblings('.comment-show').prepend(oHtml);
        mainComment.siblings('.flex-text-wrap').find('.comment-input').prop('value','').siblings('pre').find('span').text('');
    
    }
    //commentOthers=$(this).parents('.hf-con').siblings('.date-dz').find('.date-dz-right').find('.hf-con-block')
    commentOthers.addClass('hf-con-block');
    commentOthers.parents('.date-dz-right').siblings('.hf-con').remove();
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


// show personal details infomation
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
