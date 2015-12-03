//check if user exists with details given
//details are saved in users.csv in the format of username,password
// if details are incorrect a windoe will pop up warning the user about the wrong details
function checkUser(){
  
	var success=0;
	var allText="";
	var usersData = new XMLHttpRequest();
	usersData.open("GET", 'users.csv', false);
		usersData.onreadystatechange = function (){
			if(usersData.readyState === 4){
				if(usersData.status === 200 || usersData.status == 0){
					var allText = usersData.responseText;
					var lines = allText.split('\n');
					var usernameCorrect=0;
					for(var line = 0; line < lines.length; line++){
						if (line!=0){
							var linesParts=lines[line].split(',');
							if (linesParts[0]==document.getElementById('username').value){
								usernameCorrect=1;
								if (linesParts[1]==document.getElementById('password').value){
									window.location.href='profile.html';
								}
								else {window.alert('Please check your password')}
							}
									
						}
					}
				if (usernameCorrect==0) window.alert('Please check your username');
				}
			}
		}
	usersData.send();
}