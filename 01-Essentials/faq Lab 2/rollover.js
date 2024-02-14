$(document).ready( () => {
	$("#faq_rollovers h2").hover( //when hovering over #faq h2
		evt => { //create event
			const h2 = evt.currentTarget; 
			$(h2).next().show(); //show content that is after h2 => p
		},
		evt => {
			const h2 = evt.currentTarget;
			$(h2).next().hide(); //hide content that is after h2 => p
		}
	); // end hover
}); // end ready