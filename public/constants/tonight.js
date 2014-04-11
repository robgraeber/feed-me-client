app.constant('tonight', (function(){
 var tonight = new Date(); 
 tonight.setHours(23,59,59,999); 
 return tonight})()
);
