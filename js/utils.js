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


/** Calcul s'il y a collision entre un cercle et un rectangle.
 *
 * Le cercle ayant comme attributs (x,y) et de rayon r
 * Le rectangle (x,y) largeur w0 et hauteur h0
 *
 * @param x0
 * @param y0
 * @param w0
 * @param h0
 * @param cx
 * @param cy
 * @param r
 * @returns {boolean}
 */
function circRectsOverlap(x0, y0, w0, h0, cx, cy, r) {
    var testX=cx;
    var testY=cy;
    if (testX < x0) testX=x0;
    if (testX > (x0+w0)) testX=(x0+w0);
    if (testY < y0) testY=y0;
    if (testY > (y0+h0)) testY=(y0+h0);
    return (((cx-testX)*(cx-testX)+(cy-testY)*(cy-testY))< r*r);
}

/** Calcul s'il y a eu collision entre deux cercles.
 *
 * @param x1 Point x du cercle 1
 * @param y1 Point y du cercle 1
 * @param r1 Rayon du cercle 1
 * @param x2
 * @param y2
 * @param r2
 * @returns {boolean}
 */
function circleCollide(x1, y1, r1, x2, y2, r2) {
    var dx = x1 - x2;
    var dy = y1 - y2;
    return ((dx * dx + dy * dy) < (r1 + r2)*(r1+r2));
}