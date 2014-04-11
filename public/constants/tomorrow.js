app.constant('tomorrow', (function(){
 var tonight = new Date(); 
 tonight.setHours(23,59,59,999); 
 var tomorrow = new Date(
   tonight.getFullYear(),
   tonight.getMonth(), 
   tonight.getDate()+1);
 tomorrow.setHours(23,59,59,999);
 return tomorrow;
})());
