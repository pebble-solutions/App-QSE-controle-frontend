/**
 * Retourne un formulaire depuis une collection en utilisant l'ID fournis en paramètre.
 * 
 * @param {number} id L'ID du formulaire à trouver dans la collection
 * @param {array} formulaires Collection de formulaires
 * 
 * @return {object}
 */
export function getFormulaireFromId(id, formulaires) {
    return formulaires.find(e => e.id == id);
}