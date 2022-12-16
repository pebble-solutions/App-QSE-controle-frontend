/**
 * Retourne les statistique du premier personnel dispo dans le store
 * 
 * @param {object} stat L'objet stat disponible dans le store
 * 
 * @returns {object}
 */
export function getPersonnelStats(stat) {
    let stats = null;

    if (stat) {
        for (const key in stat.stats) {
            stats = stat.stats[key];
            break;
        }
    }

    return stats;
}