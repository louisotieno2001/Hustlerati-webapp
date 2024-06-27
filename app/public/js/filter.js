function filterPost() {
    var input, filter, cards, card, h1, p, txtValue;
    input = document.getElementById('search');
    filter = input.value.toUpperCase();
    cards = document.getElementsByClassName('card');

    for (var i = 0; i < cards.length; i++) {
        card = cards[i];
        h1 = card.getElementsByTagName('h1')[0];
        p = card.getElementsByTagName('p')[0];
        
        // Concatenate title and truncated body text for filtering
        txtValue = h1.textContent.toUpperCase() + ' ' + p.textContent.toUpperCase();

        if (txtValue.indexOf(filter) > -1) {
            card.style.display = '';
        } else {
            card.style.display = 'none';
        }
    }
}