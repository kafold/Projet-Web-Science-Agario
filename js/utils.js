/** Fichier contenant des fonctions utilitaires
 */

/** Renvoie un nombre aléatoire entre une valeur min (incluse) et une valeur max (exclue)
 */
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

/** Calcul la distance à déplacer un objet sachant qu'il se déplace à la vitesse (speed) et qu'il s'est déjà déplacé
 * de (delta).
 * delta : nombre de ms passé depuis la dernière frame
 * speed : la vitess de l'objet
 */
var calcDistanceToMove = function(delta, speed) {
    return (speed * delta) / 1000;
};

/** Generate a random color
 * @source https://stackoverflow.com/questions/1484506/random-color-generator-in-javascript
 * @returns {string}
 */
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
