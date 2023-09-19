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
 * @param {string} format 'milliseconde' (par défaut), 'day', 'week'
 * 
 * @returns {number} La diférence en milliseconde
 */
export function diffDate(sd, ed, format) {
	format = typeof format === 'undefined' ? 'milliseconde' : format;

    let dd = new Date(sqlDateToIso(sd));
    let df = new Date(sqlDateToIso(ed));

    let diff = df - dd;

	if (['day', 'week'].includes(format)) {
		diff = diff / (1000 * 3600 * 24);
	}
	
	if (format == 'week') {
		diff = diff / 7;
	}

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
	if (typeof date === "object") {
		return date;
	}
	
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
 * 
 * Déprécié, utiliser plutôt getDisplayFormatedDate.
 * 
 * @param {string} date 
 */
export function dateFormat(el) {
    return getDisplayFormatedDate(el);
}

/**
 * Formate une date pour l'affichage.
 * 
 * Formatage retournée : 4 oct. 2023
 * 
 * @param {string|Date} val Une date au format YYYY-MM-DD HH:II:SS
 * 
 * @returns {string}
 */
export function getDisplayFormatedDate(val) {
    if (!val) {
        return null;
    }
    
    let d = val instanceof Date ? val : getDateFromSQL(val);
    date.locale(fr);
    return date.format(d, 'D MMM YYYY');
}

/**
 * Retourne un objet Date depuis une date SQL
 * 
 * @param {string} val Une date au format SQL
 * 
 * @returns {Date}
 */
export function getDateFromSQL(val) {
    val = val ? val.replace(' ', 'T') : null;
    return new Date(val);
}

/**
 * Retourne la valeur de la date ou NULL
 * 
 * La fonction retourne null si la valeur entrée est null ou égale à 0000-00-00( 00:00:00)
 * @param {string} val Une date au format SQL
 * @returns {string}
 */
export function getValue(val) {
    return val && val !== "0000-00-00 00:00:00" && val !== "0000-00-00" ? val : null;
}

Date.prototype.getYearDay = function() { //1 - 366
	var year  = this.getFullYear();
	var month = this.getMonth();
	var day   = this.getDate();
	
	var offset = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
	
	//l'année bissextile n'est utile qu'à partir de mars
	var bissextile = (month < 2) ? 0 : (year % 400 == 0 || (year % 4 == 0 && year % 100 != 0));
	
    return parseInt(day + offset[month] + bissextile);
};

Date.prototype.getMonday = function() {
	var offset = (this.getDay() + 6) % 7;
	return new Date(this.getFullYear(), this.getMonth(), this.getDate()-offset);
};

Date.prototype.getWeek = function() { //1 - 53
	var year = this.getFullYear();
	var week;
	
	//dernier lundi de l'année
	var lastMonday = new Date(year, 11, 31).getMonday();
	
	//la date est dans la dernière semaine de l'année
	//mais cette semaine fait partie de l'année suivante
	if(this >= lastMonday && lastMonday.getDate() > 28) {
		week = 1;
	} else {
		//premier lundi de l'année
		var firstMonday = new Date(year, 0, 1).getMonday();
		
		//correction si nécessaire (le lundi se situe l'année précédente)
		if(firstMonday.getFullYear() < year) firstMonday = new Date(year, 0, 8).getMonday();
		
		//nombre de jours écoulés depuis le premier lundi
		var days = this.getYearDay() - firstMonday.getYearDay();
		
		//window.alert(days);
		
		//si le nombre de jours est négatif on va chercher
		//la dernière semaine de l'année précédente (52 ou 53)
		if(days < 0) {
			week = new Date(year, this.getMonth(), this.getDate()+days).getWeek();
		}
		else {
			//numéro de la semaine
			week = 1 + parseInt(days / 7);
			
			//on ajoute une semaine si la première semaine
			//de l'année ne fait pas partie de l'année précédente
			week += (new Date(year-1, 11, 31).getMonday().getDate() > 28);
		}
	}
	
	return parseInt(week);
};

var pad = function(num) { return ('00'+num).slice(-2) };
Date.prototype.getSqlDate = function(time) {

	var t = typeof time === 'undefined' ? false:true;

	let date = this.getFullYear()         + '-' +
	pad(this.getMonth() + 1)  + '-' +
	pad(this.getDate());
	
	if (t) {
		date += ' '+
			pad(this.getHours())      + ':' +
			pad(this.getMinutes())    + ':' +
			pad(this.getSeconds());
	}

	return date;
};

Date.dayFrDict = ['Di', 'Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa'];
Date.monthFrDict = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

export function listIntervalDays(dateStart, dateEnd) {
	let days = [];
	
	if (dateEnd) {
		let start = new Date(dateStart);
		let end = new Date(dateEnd);

		start.setHours(0,0,0,0,);
		end.setHours(0,0,0,0,);

		let diff_time = end.getTime() - start.getTime();
		let diff_days = Math.round(diff_time / (1000 * 3600* 24));

		for (let index = 0; index <= diff_days; index++) {
			let current = new Date(start);
			current.setDate(start.getDate() + index);

			days.push(current);
		}
	}

	return days;
}

/**
 * Retourne la liste des semaines entre une date de début et une date de fin
 * 
 * @param {string} dateStart 	Date de début de l'interval
 * @param {string} dateEnd 		Date de fin de l'interval
 * 
 * @returns {Array}
 */
export function listIntervalWeeks(dateStart, dateEnd) {
	let weeks = [];

	let days = listIntervalDays(dateStart, dateEnd);

	let n = 0;
	let start = null;
	let last = null;

	days.forEach((day) => {

		n += 1;

		if (!start) {
			start = day;
		}

		if (day.getDay() === 0 && last) {

			weeks.push({
				n,
				start,
				week: start.getWeek(),
				year: start.getFullYear()
			});

			start = null;
			n = 0;
		}

		last = day;
	});

	if (start) {
		weeks.push({
			n,
			start,
			week: start.getWeek(),
			year: start.getFullYear()
		});
	}

	return weeks;
}

export function listIntervalMonths(dateStart, dateEnd) {
	let months = [];

	let days = listIntervalDays(dateStart, dateEnd);

	let n = 0;
	let start = null;
	let last = null;

	days.forEach((day) => {
		if (!start) {
			start = day;
		}

		if (day.getDate() === 1 && last) {
			months.push({
				n,
				start,
				month: Date.monthFrDict[start.getMonth()]
			});

			n = 0;
			start = null;
		}

		last = day;

		n += 1;
	});

	if (start) {
		months.push({
			n,
			start,
			month: Date.monthFrDict[start.getMonth()]
		});
	}

	return months;
}


/**
 * Convertie un nombre de jour en Y ans M month D jours
 * 
 * @param {number} $nbDays 
 * 
 * @return {string}
 */
export function daysToYearMonthDay(nbDays) {
	const DaysInOneYear = 365.25;
	const DaysInOneMonth = 30.4167;

	let years = Math.floor(nbDays / DaysInOneYear);
	let remainingDaysAfterYears = nbDays % DaysInOneYear;

	let months = Math.floor(remainingDaysAfterYears / DaysInOneMonth);
	let days = Math.floor(remainingDaysAfterYears % DaysInOneMonth);

	let yearsLabel = years + " an" + (years > 1 ? 's ' : ' ');
	let monthsLabel = months + ' mois ';
	let andLabel = years || months ? 'et ' : '';

	return (years > 0 ? yearsLabel : '') + (months > 0 ? monthsLabel : '') + (days > 1 ? andLabel + days + ' jours' : '');
}