
/** Renvoie un nombre aléatoire entre une valeur min (incluse)
 * et une valeur max (exclue)
 */
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}
