var c_number;
var c_pin;
var id;
var pin;

var firstScreen=document.querySelector("div.firstscreen");
var messageScreen=document.querySelector("div.messagescreen");
var userScreen=document.querySelector("div.userscreen");
var operatorScreen=document.querySelector("div.operatorscreen");
var withdrawScreen=document.querySelector("div.wscreen");
var depositScreen=document.querySelector("div.dscreen");
var pinScreen=document.querySelector("div.pscreen");
var opScreen=document.querySelector("div.opscreen");
var opdScreen=document.querySelector("div.opdscreen");


var withdrawOptionButton=document.querySelector("button.w");
var depositOptionButton=document.querySelector("button.d");
var pinOptionButton=document.querySelector("button.p");
var statementOptionButton=document.querySelector("button.s");
var opOptionButton=document.querySelector("button.op");
var opDepositOptionButton=document.querySelector("button.od");
var opBalanceOptionButton=document.querySelector("button.ob")

var withdrawButton=document.querySelector("button.withdraw");
var depositButton=document.querySelector("button.deposit");
var pinButton=document.querySelector("button.npin");
var opDepositButton=document.querySelector("button.odeposit");

withdrawOptionButton.addEventListener("click",function()
	{
		userScreen.classList.add("hide");
		withdrawScreen.classList.remove("hide");
	});

depositOptionButton.addEventListener("click",function()
	{
		userScreen.classList.add("hide");
		depositScreen.classList.remove("hide");
	});

pinOptionButton.addEventListener("click",function()
	{
		userScreen.classList.add("hide");
		pinScreen.classList.remove("hide");
	});

opOptionButton.addEventListener("click",function()
	{
		firstScreen.classList.add("hide");
		opScreen.classList.remove("hide");	
	});
opDepositOptionButton.addEventListener("click",function()
	{
		operatorScreen.classList.add("hide");
		opdScreen.classList.remove("hide");
	});


statementOptionButton.addEventListener("click",function()
	{
		var req = new XMLHttpRequest();
		req.open('POST',"/user/statement");
		req.setRequestHeader("Content-type","application/x-www-form-urlencoded");
		req.onreadystatechange = function()
		{
			if(req.readyState == 4)
			{
				var d = JSON.parse(req.responseText);
				if(d.status =="F")
				{
					document.querySelector("div.message").textContent=d.message;
					userScreen.classList.add("hide");
					messageScreen.classList.remove("hide");

				}
				else if(d.status == "S")
				{
					var h="<ul>";
					console.log(d);
					d.transaction.forEach(function(t)
						{
							var type=t.type;
							var amt=t.amt;
							var date=new Date(t.date);
							date=(date.getMonth()+1) + '/'+date.getDate()
							h=h+"<li>"+type+" "+amt+" "+date+"</li>"
						});
					h=h+"</ul>";
					document.querySelector("div.message").innerHTML=h;
					userScreen.classList.add("hide");
					messageScreen.classList.remove("hide");
				}
			}
		}
		req.send("c_number="+c_number+"&c_pin="+c_pin);
	});

withdrawButton.addEventListener("click",function()
	{
		var amt=document.querySelector("input.amtw").value;
		console.log(amt);
		var req = new XMLHttpRequest();
		req.open('POST',"/user/withdraw");
		req.setRequestHeader("Content-type","application/x-www-form-urlencoded");
		req.onreadystatechange = function()
		{
			if(req.readyState == 4)
			{
				var d = JSON.parse(req.responseText);
				if(d.status =="F")
				{
					document.querySelector("div.message").textContent=d.message;
					withdrawScreen.classList.add("hide");
					messageScreen.classList.remove("hide");

				}
				else if(d.status == "S")
				{
					document.querySelector("div.message").textContent="Current Balance:"+d.balance;
					withdrawScreen.classList.add("hide");
					messageScreen.classList.remove("hide");
				}
			}
		}
		req.send("c_number="+c_number+"&c_pin="+c_pin+"&amt="+amt);
	});

depositButton.addEventListener("click",function()
	{
		var amt=document.querySelector("input.amtd").value;
		console.log(amt);
		var req = new XMLHttpRequest();
		req.open('POST',"/user/deposit");
		req.setRequestHeader("Content-type","application/x-www-form-urlencoded");
		req.onreadystatechange = function()
		{
			if(req.readyState == 4)
			{
				var d = JSON.parse(req.responseText);
				if(d.status =="F")
				{
					document.querySelector("div.message").textContent=d.message;
					depositScreen.classList.add("hide");
					messageScreen.classList.remove("hide");

				}
				else if(d.status == "S")
				{
					document.querySelector("div.message").textContent="Current Balance:"+d.balance;
					depositScreen.classList.add("hide");
					messageScreen.classList.remove("hide");
				}
			}
		}
		req.send("c_number="+c_number+"&c_pin="+c_pin+"&amt="+amt);
	});

opBalanceOptionButton.addEventListener("click",function()
	{
		var req = new XMLHttpRequest();
		req.open('POST',"/operator/balance");
		req.setRequestHeader("Content-type","application/x-www-form-urlencoded");
		req.onreadystatechange = function()
		{
			if(req.readyState == 4)
			{
				var d = JSON.parse(req.responseText);
				if(d.status =="F")
				{
					document.querySelector("div.message").textContent=d.message;
					operatorScreen.classList.add("hide");
					messageScreen.classList.remove("hide");

				}
				else if(d.status == "S")
				{
					document.querySelector("div.message").textContent="Current Balance:"+d.balance;
					operatorScreen.classList.add("hide");
					messageScreen.classList.remove("hide");
				}
			}
		}
		req.send("id="+id+"&pin="+pin);
	});

pinButton.addEventListener("click",function(){
		var newpin=document.querySelector("input.newpin").value;
		console.log(newpin);
		var req = new XMLHttpRequest();
		req.open('POST',"/user/changepin");
		req.setRequestHeader("Content-type","application/x-www-form-urlencoded");
		req.onreadystatechange = function()
		{
			if(req.readyState == 4)
			{
				var d = JSON.parse(req.responseText);
				if(d.status =="F")
				{
					document.querySelector("div.message").textContent=d.message;
					pinScreen.classList.add("hide");
					messageScreen.classList.remove("hide");

				}
				else if(d.status == "S")
				{
					document.querySelector("div.message").textContent="Success";
					pinScreen.classList.add("hide");
					messageScreen.classList.remove("hide");
				}
			}
		}
		req.send("c_number="+c_number+"&c_pin="+c_pin+"&npin="+newpin);
});


opDepositButton.addEventListener("click",function()
	{
		var amt=document.querySelector("input.amtdo").value;
		console.log(amt);
		var req = new XMLHttpRequest();
		req.open('POST',"/operator/deposit");
		req.setRequestHeader("Content-type","application/x-www-form-urlencoded");
		req.onreadystatechange = function()
		{
			if(req.readyState == 4)
			{
				var d = JSON.parse(req.responseText);
				if(d.status =="F")
				{
					document.querySelector("div.message").textContent=d.message;
					opdScreen.classList.add("hide");
					messageScreen.classList.remove("hide");

				}
				else if(d.status == "S")
				{
					document.querySelector("div.message").textContent="Current ATM Balance:"+d.balance;
					opdScreen.classList.add("hide");
					messageScreen.classList.remove("hide");
				}
			}
		}
		req.send("id="+id+"&pin="+pin+"&amt="+amt);
	});


var logonButton=document.querySelector("button.logon");
var opLogonButton=document.querySelector("button.oplogon");

logonButton.addEventListener("click",function()
	{

		c_number = document.querySelector("input.c_number").value;
		c_pin = document.querySelector("input.c_pin").value
		var req = new XMLHttpRequest();
		req.open('POST',"/user/validate");
		req.setRequestHeader("Content-type","application/x-www-form-urlencoded");
		req.onreadystatechange = function()
		{
			if(req.readyState == 4)
			{
				var d = JSON.parse(req.responseText);
				if(d.status =="F")
				{
					document.querySelector("div.message").textContent=d.message;
					firstScreen.parentNode.removeChild(firstScreen);
					messageScreen.classList.remove("hide");

				}
				else if(d.status == "S")
				{
					firstScreen.parentNode.removeChild(firstScreen);
					userScreen.classList.remove("hide");
				}
			}
		}
		req.send("c_number="+c_number+"&c_pin="+c_pin);
		

	});

opLogonButton.addEventListener("click",function()
	{

		id = document.querySelector("input.id").value;
		pin = document.querySelector("input.pin").value
		var req = new XMLHttpRequest();
		req.open('POST',"/operator/validate");
		req.setRequestHeader("Content-type","application/x-www-form-urlencoded");
		req.onreadystatechange = function()
		{
			if(req.readyState == 4)
			{
				var d = JSON.parse(req.responseText);
				if(d.status =="F")
				{
					document.querySelector("div.message").textContent=d.message;
					opScreen.parentNode.removeChild(opScreen);
					messageScreen.classList.remove("hide");

				}
				else if(d.status == "S")
				{
					opScreen.parentNode.removeChild(opScreen);
					operatorScreen.classList.remove("hide");
				}
			}
		}
		req.send("id="+id+"&pin="+pin);
		

	});


