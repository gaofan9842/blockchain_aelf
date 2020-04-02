
    AElf = window.AElf;
    var aelf;
    var Myaddress="";
    var MyaddressHashed="";
    var wallet;
    var transferTJUPP,transferTJUPN,transferTJUAP,transferTJUAN,transferTJUP,transferTJUA;
    var updateMyTokenPP,updateMyTokenPN,updateMyTokenAP,updateMyTokenAN,updateMyTokenP,updateMyTokenA;
    const Wallet = AElf.wallet;
    const sha256 = AElf.utils.sha256;
    var senderName="";
    var tempSenderName="";
    var flag="";
   // console.log("????????????????????");


    var helloWorldC;
    var tranferFlag=0;
    var tokenContract


    //从页面接收参数
    var url=decodeURI(location.href);
    var from = url.indexOf("?")+1;
    for(var p=1;p<=4;p++){
        for(var i=from;i<=url.length-1;i++){
            if(url[i]=='?'){
                from =i+1;
                break;
            }
            if(p==1)senderName+=url[i];
            else if(p==2) Myaddress+=url[i];
            else if(p==3) MyaddressHashed+=url[i];
            else flag+=url[i];
        }

    }
    tempSenderName = senderName;

    console.log("用户名 ："+senderName);
    console.log("地址 ："+Myaddress);
    console.log("地址 (Hashed)："+MyaddressHashed);
    console.log("flag ："+flag);

    const MiddleManAddress ="26sZjwJDVca4CDvMAaiJFBn2FgYSGEQ7KAwjaquv6AMfd4RLH9";
    const MiddleManAddressUnhashed = AElf.utils.decodeAddressRep(MiddleManAddress);

    if(flag=="A"){
    var  defaultPrivateKey="19cbe8e0d2f891d749e8183290d888db44b158e03adf16847f770edef1ef79c2";
    
 //   var db = openDatabase('DAPPDB', '1.0', 'TJU_DB', 2 * 1024 * 1024);

     wallet = Wallet.getWalletByPrivateKey(defaultPrivateKey);
        

    //连接对方aelf
    console.log("执行到这里啦zc！");
    aelf = new AElf(new AElf.providers.HttpProvider(
            //'http://172.23.52.35:1235/chain',
           'http://192.168.43.75:1235/chain',
           null,
            null,
            null,
            [{
                name: 'Accept',
                value: 'text/plain;v=1.0'
            }]
        ));


        
    if(aelf.isConnected()){
       console.log("执行到这里啦！");
        var helloWorldContractName = 'HelloWorldContract';
        var {
            GenesisContractAddress
        } = aelf.chain.getChainStatus();
        var zeroC = aelf.chain.contractAt(GenesisContractAddress, wallet);
        var helloWorldContractAddress = zeroC.GetContractAddressByName.call(sha256(helloWorldContractName));

        helloWorldC = aelf.chain.contractAt(helloWorldContractAddress, wallet);
        var tokenAddress = zeroC.GetContractAddressByName.call(sha256('AElf.ContractNames.Token'));
        tokenContract = aelf.chain.contractAt(tokenAddress, wallet);


        setTimeout(() => {
            var query = tokenContract.GetBalance.call({
                symbol: senderName+"PP",
                owner: MiddleManAddress
             });
         transferTJUPP=query.balance;
        }, 100);
        
        // 从中间人那里查数据（保证已经连接的是对方的IP以及对方IP下的合约初始化）
        //查的是symbol token 
        setTimeout(() => {
            var query = tokenContract.GetBalance.call({
                symbol: senderName+"PN",
                owner: MiddleManAddress
            });
        transferTJUPN=query.balance;
        }, 200);
       
        setTimeout(() => {
             var query = tokenContract.GetBalance.call({
                symbol: senderName+"AP",
                owner: MiddleManAddress
            });
            transferTJUAP=query.balance;
        }, 300);

        setTimeout(() => {
           var query = tokenContract.GetBalance.call({
                symbol: senderName+"AN",
                owner: MiddleManAddress
            });
            transferTJUAN=query.balance;
        console.log("transferTJUAP  "+transferTJUAP);
        console.log("transferTJUAN  "+transferTJUAN);
        console.log("transferTJUPP  "+transferTJUPP);
        console.log("transferTJUPN  "+transferTJUPN);
        transferTJUP = transferTJUPP - transferTJUPN ; 
        transferTJUA = transferTJUAP - transferTJUAN ;

        console.log("transferTJUA  "+transferTJUA);
        console.log("transferTJUP  "+transferTJUP);
      }, 400);
    

// 中和对方中间人token(保证中和前必须已经完成上面查询)
//transfer的是symbol token
    setTimeout(() => {
           if(transferTJUA>0){
                    helloWorldC.middleTransfer({
                        To : MiddleManAddressUnhashed,
                        MySymbol : senderName+"AN",
                        Amount : transferTJUA
                    });
            }else if (transferTJUA<0){
                    var temp = -transferTJUA;
                    helloWorldC.middleTransfer({
                        To : MiddleManAddressUnhashed,
                        MySymbol : senderName+"AP",
                        Amount : temp
                    });
            }
    }, 600);

    setTimeout(() => {
                if(transferTJUP>0){
                    helloWorldC.middleTransfer({
                        To : MiddleManAddressUnhashed,
                        MySymbol : senderName+"PN",
                        Amount : transferTJUP
                    });
                } else if(transferTJUP<0){
                    var temp = -transferTJUP;
                    helloWorldC.middleTransfer({
                        To : MiddleManAddressUnhashed,
                        MySymbol : senderName+"PP",
                        Amount : temp
                    });
                }
        console.log("跨链前的权威值是： "+transferTJUA);
        console.log("跨链前的活跃值是： "+transferTJUP);
    }, 1200);
   
}


    //连接自己的aelf(保证之前的中和操作已经完成并且保证将合约初始化为本aelf下的)

    setTimeout(() => {
        aelf = new AElf(new AElf.providers.HttpProvider(
            'http://127.0.0.1:1235/chain',
            null,
            null,
            null,
            [{
                name: 'Accept',
                value: 'text/plain;v=1.0'
            }]
        )); 
         if(!aelf.isConnected()){
            alert('本地服务器已掉线(区块链服务掉线)，登陆失败!');
        }

        var helloWorldContractName = 'HelloWorldContract';
        var {
            GenesisContractAddress
        } = aelf.chain.getChainStatus();
        var zeroC = aelf.chain.contractAt(GenesisContractAddress, wallet);
        var helloWorldContractAddress = zeroC.GetContractAddressByName.call(sha256(helloWorldContractName));

        helloWorldC = aelf.chain.contractAt(helloWorldContractAddress, wallet);
        var tokenAddress = zeroC.GetContractAddressByName.call(sha256('AElf.ContractNames.Token'));
        tokenContract = aelf.chain.contractAt(tokenAddress, wallet);
    }, 1800);


    setTimeout(() => {
        //这里的判断是保证当用户在本dapp下线后又在该dapp上线时的跨链情形。
        //当对方中间人处的P和A值都是零时就可能是这种情况。
     
        if(transferTJUA==0&&transferTJUP==0){
            tranferFlag=1;
            // var db = openDatabase('DAPPDB', '1.0', 'TJU_DB', 2 * 1024 * 1024);
            // db.transaction(function (tx) {
            //     tx.executeSql("SELECT * FROM user where name = '"+senderName+"'", [], function (tx, results) {
            //     var len = results.rows.length, i;
            //     for (i = 0; i < len; i++){
            //             // alert(results.rows.item(i).log );
            //             //console.log(results.rows.item(i).name);
            //             transferTJUP = results.rows.item(i).tokenP;
            //             transferTJUA = results.rows.item(i).tokenA;
            //         }
                
            //     }, null);
            // });

        //链上查询本方中间人出的p/a积分值。完成转钱操作。
            var query = tokenContract.GetBalance.call({
                    symbol: senderName+"PP",
                    owner: MiddleManAddress
                 });
             transferTJUPP=query.balance;

            var query = tokenContract.GetBalance.call({
                    symbol: senderName+"PN",
                    owner: MiddleManAddress
                });
            transferTJUPN=query.balance;
          
           
         
            var query = tokenContract.GetBalance.call({
                    symbol: senderName+"AP",
                    owner: MiddleManAddress
                });
            transferTJUAP=query.balance;
            
    
           
            var query = tokenContract.GetBalance.call({
                    symbol: senderName+"AN",
                    owner: MiddleManAddress
                });
            transferTJUAN=query.balance;
            

        }
    }, 2000);


    //根据查询出来的值对于登录账户进行转账更新。
    //这里无所谓是“直上直下”，还是跨链，都是用transferTJUA/trsnferTJUP来定义的。
    setTimeout(() => {
        
        transferTJUA = transferTJUAP - transferTJUAN;
        transferTJUP = transferTJUPP - transferTJUPN;
           if(transferTJUA>0){
                helloWorldC.middleTransfer({
                    To : Myaddress,
                    MySymbol : "TJUAP",
                    Amount : transferTJUA
                })
            }else if(transferTJUA<0){
                var tempTransferTJUA = - transferTJUA;
                helloWorldC.middleTransfer({
                    To : Myaddress,
                    MySymbol : "TJUAN",
                    Amount :  tempTransferTJUA
                })
            }
            
    }, 2500);

    setTimeout(() => {
              if(transferTJUP>0){
                console.log("??????????????????????????"+transferTJUP);
                console.log("the chain is "+aelf.currentProvider.host);
                helloWorldC.middleTransfer({
                    To : Myaddress,
                    MySymbol : "TJUPP",
                    Amount : transferTJUP
                })
            }else if(transferTJUP<0){
                var tempTransferTJUP = - transferTJUP;
                helloWorldC.middleTransfer({
                    To : Myaddress,
                    MySymbol : "TJUPN",
                    Amount : tempTransferTJUP
                })
            }
        console.log("成功完成跨链！！");
    }, 3000);


    setTimeout(() => {
        //这里是用标志位标志了是否是直上直下.中和本方中间人账户。
        //直上直下才需要中和本方中加人，跨链的话不需要中和本方中间人。
        if(tranferFlag==1){
            if(transferTJUP>0){
            helloWorldC.middleTransfer({
                To : MiddleManAddressUnhashed,
                MySymbol : username+"PN",
                Amount : transferTJUP
            });        
        }else if(transferTJUP<0){
            var tempAmout = -transferTJUP;
            helloWorldC.middleTransfer({
                To : MiddleManAddressUnhashed,
                MySymbol : username+"PP",
                Amount : tempAmout
            });
        }


    }
}, 3400);
   

    setTimeout(() => {
        if(tranferFlag==1){
                if(transferTJUA>0){
            helloWorldC.middleTransfer({
                To : MiddleManAddressUnhashed,
                MySymbol : username+"AN",
                Amount : transferTJUA
            });        
        }else if(transferTJUA<0){
            var tempAmout = -transferTJUA;
            helloWorldC.middleTransfer({
                To : MiddleManAddressUnhashed,
                MySymbol : username+"AP",
                Amount : tempAmout
            });
        }
    }
    
    }, 3800);

    //更新数据库里的积分值，以便用户下线时积分还可以被成功查询到。
    setTimeout(() => {
        var db = openDatabase('DAPPDB', '1.0', 'TJU_DB', 2 * 1024 * 1024);
        db.transaction(function (tx) {
        tx.executeSql("UPDATE user SET tokenA  = "+transferTJUA+" WHERE name = '"+senderName+"'");
        tx.executeSql("UPDATE user SET tokenP = "+transferTJUP+" WHERE name = '"+senderName+"'");
    });
    }, 4000);

    }else {
    //这里的else是通过标志位flag来判断是由登录界面转入还是由comment界面转入的。
    //登录界面转入才需要进行以上跨链操作，否则只要连接本方aelf即可。不涉及任何跨链上的事。

    
        // AElf = window.AElf;
        // var Wallet = AElf.wallet;
       // var sha256 = AElf.utils.sha256;

        var defaultPrivateKey = '19cbe8e0d2f891d749e8183290d888db44b158e03adf16847f770edef1ef79c2';

         wallet = Wallet.getWalletByPrivateKey(defaultPrivateKey);
         aelf = new AElf(new AElf.providers.HttpProvider(
                'http://127.0.0.1:1235/chain',
                null,
                null,
                null,
                [{
                    name: 'Accept',
                    value: 'text/plain;v=1.0'
                }]
            ));
        if(!aelf.isConnected()) {
            alert('Blockchain Node is not running.');
        }

        var helloWorldContractName = 'HelloWorldContract';
        var {
            GenesisContractAddress
        } = aelf.chain.getChainStatus();
        var zeroC = aelf.chain.contractAt(GenesisContractAddress, wallet);
        var helloWorldContractAddress = zeroC.GetContractAddressByName.call(sha256(helloWorldContractName));

        var helloWorldC = aelf.chain.contractAt(helloWorldContractAddress, wallet);
        var tokenAddress = zeroC.GetContractAddressByName.call(sha256('AElf.ContractNames.Token'));
        var tokenContract = aelf.chain.contractAt(tokenAddress, wallet);
       //var db = openDatabase('DAPPDB', '1.0', 'TJU_DB', 2 * 1024 * 1024);
        //alert('远程服务器已掉线，账户信息同步失败！');
    }

