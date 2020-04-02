var db = openDatabase('DAPPDB', '1.0', 'TJU_DB', 2 * 1024 * 1024);
 
db.transaction(function (tx) {
    tx.executeSql('CREATE TABLE IF NOT EXISTS COMMENTINFO (id unique, senderHashedAddress ,senderUnhashedAddress , receiverHashedAddress ,receiverUnhashedAddress, commentContent)');
	
});

// db.transaction(function (tx) {
//    tx.executeSql('INSERT INTO COMMENTINFO (id, senderHashedAddress ,senderUnhashedAddress , receiverHashedAddress ,receiverUnhashedAddress) VALUES ("12345","wqwe","qwew","2313ds","ewq12")');
	
// });
 
db.transaction(function (tx) {
tx.executeSql('SELECT * FROM COMMENTINFO', [], function (tx, results) {
    var len = results.rows.length, i;
	console.log(len); 
    for (i = 0; i < len; i++){
       console.log(results.rows.item(i).id);
        
    }
}, null);
});