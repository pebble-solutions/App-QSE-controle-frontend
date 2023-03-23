import date from 'date-and-time';
import fr from 'date-and-time/locale/fr';

/**
 * Retourne une classe CSS par rapport à une réponse S A M I
 * 
 * @param {string} reponse S A M I
 * 
 * @return {string}
 */
export function classNameFromSAMI(reponse) {
    if (typeof reponse === 'string') {
        if (reponse.toLowerCase() == 's') return 'text-bg-success';
        else if (reponse.toLowerCase() == 'a') return 'text-bg-primary';
        else if (reponse.toLowerCase() == 'm') return 'text-bg-warning';
        else if (reponse.toLowerCase() == 'i') return 'text-bg-danger';
    }
    return 'text-bg-secondary';
}

/**
 * Modifie le format de la date entrée en paramètre et la retourne 
 * sous le format 01 févr. 2021
 * @param {string} date 
 */
export function dateFormat(el) {
    date.locale(fr);
    return date.format(new Date(el), 'DD MMM YYYY')
}