import date from 'date-and-time';
import fr from 'date-and-time/locale/fr';

/**
 * Retourne la durée entre deux date au format H:MM
 * 
 * @param {string} sd       
 * @param {string} sf 
 * 
 * @return {string}
 */
export function calculateDiffDate(sd, sf) {
    let diff = diffDate(sd, sf);

    if (diff < 0) diff = 0;

    return numberToTimeString(diff);
}

/**
 * Retourne l'intervalle entre deux dates en millisecondes
 * 
 * @param {string} sd Date de début de l'intervalle 
 * @param {string} ed Date de fin de l'intervalle 
 * 
 * @returns {number} La diférence en milliseconde
 */
export function diffDate(sd, ed) {
    let dd = new Date(sqlDateToIso(sd));
    let df = new Date(sqlDateToIso(ed));

    let diff = df - dd;

    return diff;
}

/**
 * Convertie un horaire sur deux digit (ex 5 => 05)
 * @param {number|string} time Durée à convertir
 * @returns {string}
 */
export function padTime(time) {
    if (typeof time !== 'string') {
        time = time.toString();
    }

    return time.padStart(2, "0");
}

/**
 * Transforme une date SQL en une date ISO8601
 * @param {String} date Date SQL à transformer
 * @returns {String}
 */
export function sqlDateToIso(date) {
    if (date) {
        date = date.replace(/(\d{4}-\d{2}-\d{2})\s/, '$1T');
        return date;
    }
    return null;
}

/**
 * Convertie un nombre entier ou flottant en durée.
 * Ex : 65 => 1:05
 * 
 * @param {number} time Nombre à convertir
 * @returns {string}
 */
export function numberToTimeString(time) {
    let minutes = Math.floor((time / (1000 * 60)) % 60),
        hours = Math.floor((time / (1000 * 60 * 60)) % 24);

    if(!minutes) {
        minutes = 0;
    }

    if(!hours) {    
        hours = 0;
    }

    return hours + ":" + padTime(minutes); 
}

/**
 * Convertie un objet date en une chaine de caractère date SQL
 * AAAA-MM-JJ
 * AAAA-MM-JJ HH:II:SS (si useTime est true)
 * 
 * @param {Date} date La date à transformer
 * @param {boolean} useTime Si true, retourne aussi les heures
 * 
 * @return {string}
 */
export function toSqlDate(date, useTime) {
	let dateSql = date.getFullYear()         + '-' +
	padTime(date.getMonth() + 1)  + '-' +
	padTime(date.getDate());
	
	if (useTime) {
		dateSql += ' '+
			padTime(date.getHours())      + ':' +
			padTime(date.getMinutes())    + ':' +
			padTime(date.getSeconds());
	}

	return dateSql;
}

/**
 * Retourne la date SQL au format H:MM ou J+1 H:MM.
 *
 * @param {date} val La date à convertir
 * @param {string} refVal La valeur précédente (pour avoir le J+1 sur la date de fin)
 *
 * @return {string}
 */
export function dateToTime(val, refVal) {
    let date = new Date(sqlDateToIso(val));
    let str = date.getHours() + ":" + padTime(date.getMinutes());
    if (refVal) {
        let refDate = new Date(sqlDateToIso(refVal));
        if (refDate.getDate() != date.getDate()) {
            str = "J+1 " + str;
        }
    }
    return str;
}

/**
 * Modifie le format de la date entrée en paramètre et la retourne 
 * sous le format 01 févr. 2021
 * @param {string} date 
 */
export function dateFormat(el) {
    date.locale(fr);
    return date.format(new Date(el.replace(' ', 'T')), 'DD MMM YYYY')
}