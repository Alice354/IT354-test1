$(function() {  //display using tabs widget
    $( "#tabs" ).tabs();
});

$(document).ready(function () {
    const imagesArray = [
        'images/card_1.png', 'images/card_2.png', 'images/card_3.png',     
        'images/card_4.png', 'images/card_5.png', 'images/card_6.png',
        'images/card_7.png', 'images/card_8.png', 'images/card_9.png',
        'images/card_10.png', 'images/card_11.png', 'images/card_12.png',
        'images/card_13.png', 'images/card_14.png', 'images/card_15.png',
        'images/card_16.png', 'images/card_17.png', 'images/card_18.png',
        'images/card_19.png', 'images/card_20.png', 'images/card_21.png', 
        'images/card_22.png', 'images/card_23.png', 'images/card_24.png'
    ];
    
    let attempts = 0;
    const flippedCards = [];
    let isFlipping = false;
    const num_cards = parseInt($('#num_cards').val());
    const cards = $('#cards');
    const player = $('#player');
    const high_score = $('#high_score');
    const correct = $('#correct');
    let correctSelections = 0;
    
    //Initialize or retrieve high score from local storage
    let highScore = parseInt(localStorage.getItem('high_score')) || 0;
  
    // Function to check if the flipped cards form a pair
    function checkForPair() {
        attempts++;
        const card1Index = flippedCards[0]; //Get index
        const card1Src = $('.card').eq(card1Index).attr('src'); //Get src of index 
        const card2Index = flippedCards[1];
        const card2Src = $('.card').eq(card2Index).attr('src');

        if (card1Src === card2Src) {
            correctSelections += 2;
            //display blank images if match paired
            $('.card').eq(card1Index).fadeOut(500, function() {
                $(this).attr('src', 'images/blank.png').fadeIn(500);
            });
            $('.card').eq(card2Index).fadeOut(500, function() {
                $(this).attr('src', 'images/blank.png').fadeIn(500);
            });

            //Remove matched cards from the array and prevent from being clicked
            imagesArray[card1Index] = null;
            imagesArray[card2Index] = null;
            $('.card').eq(card1Index).off('click'); 
            $('.card').eq(card2Index).off('click');

            //Check if all pairs have been matched and end game
            if (correctSelections === imagesArray.length) {
                alert("Game over!");
            }
        } 
        else {
            // Flip the unmatched cards back
            $('.card').eq(card1Index).fadeOut(500);
            $('.card').eq(card2Index).fadeOut(500);

            // After 0.5s delay, turn unmatched cards face down again
            setTimeout(function() {
                $('.card').eq(card1Index).attr('src', 'images/back.png').fadeIn(500);
                $('.card').eq(card2Index).attr('src', 'images/back.png').fadeIn(500);
            }, 500);
        }
        
        flippedCards.length = 0; // Clear the flipped cards array
        isFlipping = false;
    }

    //Preload images function
    function preloadImages(imagesArray) {
        let loadedImages = 0;
        imagesArray.forEach(imageUrl => {    
            const img = new Image();
            img.src = imageUrl;
            img.onload = function (){
                loadedImages++;
            };
        });            
    }
    
    // Event handler for clicking/flipping on cards
    $(document).on('click', '.card', function () {
        if (isFlipping) return;
        
        const clickedCard = $(this);
        const cardIndex = clickedCard.index();
        
        // Check if the card is already flipped or in a pair
        if (!flippedCards.includes(cardIndex) && flippedCards.length < 2) {
            flippedCards.push(cardIndex);
            clickedCard.attr('src', imagesArray[cardIndex]);  
        }

        // Check for a pair after 2 cards are flipped
        if (flippedCards.length === 2) {
            isFlipping = true;
            setTimeout(checkForPair, 500);
        }
    });

    cardDisplay(num_cards); //display all cards back.png facing front

    //Save settings
    $('#save_settings').click(function () {
        // Get player name and number of cards from input fields
        const player_name = $('#player_name').val();
        const num_cards = parseInt($('#num_cards').val());
        if(!player_name) {  
            alert('please enter a valid player name.');
            return;
        }

        // Save settings in session storage
        sessionStorage.setItem('playerName', player_name);
        sessionStorage.setItem('numCards', num_cards);
    
        const selectedNumCards = parseInt(num_cards, 10);
        const halfCards = selectedNumCards/2;
        const selectedImages = imagesArray.slice(0, halfCards);
        const doubledImages = selectedImages.concat(selectedImages);  //Create pair images
        
        const shuffleImages = doubledImages.sort(() => 0.5 - Math.random()); //Shuffle selected images
        sessionStorage.getItem('shuffleImages', shuffleImages); //store shuffled images in current session

        //store current selection of images 
        cardDisplay(selectedNumCards, shuffleImages); 

        updateDisplay(player_name, selectedNumCards);
    });

    // Click event handler for cards
    function cardClickHandler() {
        const imageSrc = $(this).data('src');
        
        // Reveal the image source
        if (imageSrc) {
            $(this).attr('src', imageSrc);
            const cardIndex = $(this).index();
            flippedCards.push(cardIndex);

            // Check for a pair after 2 cards are flipped
            if (flippedCards.length === 2) {
                isFlipping = true;
                setTimeout(checkForPair, 500);
            }
        }
    }

    // Update the cardDisplay function to display the shuffle array of pairs
    function cardDisplay(numCards, shuffleImages) {
        cards.empty(); // Clear existing content
        for (let i = 0; i < numCards; i++) {
            const cardImg = $('<img class="card">');
            cardImg.attr('src', 'images/back.png'); // Set default back.png for all cards
             
            // Check if there are selected images and if the current index is within bounds
            if (shuffleImages && shuffleImages.length > i) {
                cardImg.data('src', shuffleImages[i]);
            } else {
                cardImg.data('src', ''); // Set an empty data-src for non-selected cards
            }

            //Attach click event to each card
            // cardImg.on('click', function() {
            //     const imageSrc = $(this).data('src');
            //     // Reveal the image source
            //     if(imageSrc){
            //         $(this).attr('src', imageSrc);
            //     }
            // });
            cardImg.on('click', cardClickHandler);
            cards.append(cardImg);
        }
    }

     //Update the display of player name, high score, and correct score
     function updateDisplay(player_name, selectedNumCards) {
        player.text(`Player: ${player_name}`);

        const percentCorrect = (correctSelections / selectedNumCards.length) * 100 || 0;
        correct.text(`Correct: ${percentCorrect.toFixed()}%`); 

        // Check for a new high score
        if (correctSelections === cards.length && attempts < highScore || highScore === 0) {
            highScore = attempts;
            high_score.text(`High Score: ${highScore.toFixed()}%`);
            localStorage.setItem('highScore', highScore);
        }
    }

    preloadImages(imagesArray); //initial array of images = 48;
});




