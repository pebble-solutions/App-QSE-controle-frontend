/**
 * Retourne les informations d'un personnel depuis l'ID d'un personnel
 * 
 * @param {number} id ID d'un personnel
 * @param {Array}   collection collection du personnel dans laquellle on cherche l'ID
 * 
 * @return {object}
 */
export function getPersonnelById(id, collection) {
    return collection.find(e => e.id == id);
}