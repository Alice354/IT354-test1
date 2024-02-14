"use strict"

$(document).ready( () => {
    $("#start_timer").click(  () => {
		let totalTime = $("#totalTime").val();
		let interval = $("#interval").val();
		let isValid = true;
			
		// validate the time
		if (totalTime == "") { 
			$("#time_error").text("This field is required.");
			isValid = false;
		} else if (isNaN(totalTime)) {
			$("#time_error").text("Time must be a number.");
			isValid = false;
		} else {
			$("#time_error").text("");
		} 
			
		// validate the interval
		if (interval == "") { 
			$("#interval_error").text("This field is required.");
			isValid = false;
		} else if (isNaN(interval)) {
			$("#interval_error").text("Interval must be a number.");
			isValid = false;
		} else {
			$("#interval_error").text("");
		}
			
		if (isValid) {
			totalTime = totalTime * 1000;
			interval = interval * 1000;
			let elapsedTime = 0;
			let elapsedPercent = 0;
			$("#progressbar").progressbar({
				value: 0
			});
			let timer = setInterval( () => {
				elapsedTime += interval;
				elapsedPercent = (elapsedTime/totalTime) * 100;
				$("#progressbar").progressbar("value", elapsedPercent);

				if (elapsedTime == totalTime) {
					clearInterval(timer);
					$("#complete span").text("Time is up!");
				}
			},
			interval );
    	}
    });
	$("#totalTime").focus();
});