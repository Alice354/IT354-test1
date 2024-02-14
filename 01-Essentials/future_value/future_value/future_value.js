"use strict";

$(document).ready( () => {
    $("#calculate").click( () => {
        const investment = parseFloat($("#investment").val());
        const rate = parseFloat($("#rate").val());
        const years = parseFloat($("#years").val());

        if (isNaN(investment) || investment <= 0 || investment > 10000) {
            alert("Must be a valid number greater than 0 and less than or equal to 10,000.");
        } 

        else if (isNaN(rate) || rate <= 0 || rate > 15) {
            alert("Must be a valid number greater than 0 and less than or equal to 15.")
        } 

        else if (isNaN(years) || years <= 0 || years > 50) {
            alert("Must be a valid number greater than 0 and less than or equal to 50.")
        } 

        else{
            let futureValue = investment;
            for (let i = 1; i <= years; i++ ) {
                futureValue += futureValue * rate / 100;
            }
            $("#future_value").val(futureValue.toFixed(2));
        }
        $("#investment").focus();
    });
    $("#investment").focus();
});