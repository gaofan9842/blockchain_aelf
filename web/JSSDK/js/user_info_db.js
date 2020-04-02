var db = openDatabase('DAPPDB', '1.0', 'TJU_DB', 2 * 1024 * 1024);
db.transaction(function (tx) {  
    tx.executeSql('CREATE TABLE IF NOT EXISTS  user(name unique,password,primaryKey,hashedAddress,unhashedAddress,likeNumber,dislikeNumber,commentNumber,beCommentedNumbner,tokenP,tokenA,flag)');
 });


//  db.transaction(function (tx) {
//     tx.executeSql('INSERT INTO user(name,password,primaryKey,hashedAddress,unhashedAddress,likeNumber,dislikeNumber,commentNumber,beCommentedNumbner,token,flag) VALUES ("风中的恋情","111","111","11","111",11,111,111,111,111,1)');
//  });


 db.transaction(function (tx) {
    tx.executeSql('SELECT * FROM user', [], function (tx, results) {
       var len = results.rows.length, i;
        console.log("记录数： "+len);
       for (i = 0; i < len; i++){
         // alert(results.rows.item(i).log );
            console.log(results.rows.item(i).name);
        }
     
    }, null);
 });