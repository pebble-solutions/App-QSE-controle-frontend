import date from 'date-and-time';
import fr from 'date-and-time/locale/fr';

/**
 * Retourne une classe CSS par rapport à une réponse S A M I
 * 
 * @param {string} reponse      S A M I
 * @param {object} dict         Le dictionnaire des classes CSS à utiliser
 * 
 * @return {string}
 */
export function classNameFromSAMI(reponse, dict) {

    if (typeof dict === "undefined") {
        dict = {
            s: 'text-bg-success',
            a: 'text-bg-primary',
            m: 'text-bg-warning',
            i: 'text-bg-danger'
        };
    }

    if (typeof reponse === 'string') {
        if (typeof dict[reponse.toLowerCase()] !== "undefined") {
            return dict[reponse.toLowerCase()];
        }
    }
    return 'text-bg-secondary';
}

/**
 * Modifie le format de la date entrée en paramètre et la retourne 
 * sous le format 01 févr. 2021
 * @param {string} date 
 */
export function dateFormat(el) {
    if (!el) return 'Date non définie';
    date.locale(fr);
    return date.format(new Date(el.replace(' ', 'T')), 'DD MMM YYYY')
}

/**
 * Liste les questions obligatoires non répondues
 * 
 * @param {Array} reponses Collection des réponses apportées à la collecte
 * @param {Array} lignes Collection des lignes à vérifier
 * 
 * @returns {Array}
 */
export function listMissingMandatoryQuestions(reponses, lignes) {
    const questionsManquantes = [];

    if (reponses && lignes) {
        for (const reponse of reponses) {
            const ligneCourante = lignes.find((e) => e.id === reponse.ligne);

            if (reponse.ligne && ligneCourante && ligneCourante.obligatoire === "OUI" && !reponse.data) {
                questionsManquantes.push(ligneCourante.ligne);
            }
        }
    }

    return questionsManquantes;
}