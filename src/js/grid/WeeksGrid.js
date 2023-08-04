import { diffDate, listIntervalWeeks } from "../date";

export class WeeksGrid {

    /**
     * Initialise la grille
     * 
     * @param {object} options 
     * - columnWidth {number} La largeur de chaque colonne
     * - rowHeight {number} Hauteur de chaque ligne
     * - firstColumnWidth {number} La largeur de la première colonne
     * - dateStart {string} La date de début de la période YYYY-MM-DD
     * - dateEnd {string} La date de fin de la période YYYY-MM-DD
     * - rows {number} Le nombre de lignes dans le tableau, hors ligne d'en-tête
     */
    constructor(options) {
        this.columnWidth = options.columnWidth;
        this.rowHeight = options.rowHeight;
        this.firstColumnWidth = options.firstColumnWidth;
        this.dateStart = options.dateStart;
        this.dateEnd = options.dateEnd;
        this.rows = options.rows
    }

    /**
     * Retourne la position depuis le haut en fonction du numéro de la ligne
     * 
     * @param {number} n        Le numéro de la ligne
     * @param {string} sx       Suffixe à ajouter à l'unité (ex : px)
     * @param {number} coef     Un coeficient multiplicateur pour tracer la grille (défaut 1)
     * 
     * @return {string}
     */
    getTopPosition(n, sx, coef) {
        coef = typeof coef === "undefined" ? 1 : coef;
        const top = (n-1) * (this.columnWidth * coef);
        return sx ? `${top}${sx}` : top;
    }

    /**
     * Retourne la position de la colonne depuis la gauche en fonction du numéro de la colonne
     * 
     * @param {number} n Le numéro de la colonne
     * @param {number} coef Un coeficient multiplicateur pour tracer la grille (défaut 1)
     * @param {string} sx       Suffixe à ajouter à l'unité (ex : px)
     * 
     * @return {string}
     */
    getLeftPosition(n, sx, coef) {
        coef = typeof coef === "undefined" ? 1 : coef;
        const left = (n-1) * (this.columnWidth * coef) + this.firstColumnWidth;
        return sx ? `${left}${sx}` : left;
    }

    /**
     * Retourne le numéro de la semaine de début relatif à la timeline
     * 
     * La semaine 0 de la date de référence correspond au début de la timeline. Si la date de référence commence avant
     * la timeline, elle est considéré débutant à 0.
     * 
     * @param {string} refDd La date de début de référence
     * 
     * @return {number}
     */
    getWeekStartInTimeline(refDd) {
        const weeks_diff = Math.ceil( diffDate(this.dateStart, refDd, 'week'));
        return weeks_diff < 0 ? 0 : weeks_diff;
    }

    /**
     * Retourne le numéro de la semaine de fin relatif à la timeline
     * 
     * 0 correspond au début de la timeline, X correspond à la fin de la timeline. La valeur retournée est 
     * entrer 0 et X. Si la référence prend fin après la timeline, X est retourné.
     * 
     * @param {string} refDd Date de référence de début
     * @param {string} refDf Date de référence de début
     * 
     * @return {number}
     */
    getWeekEndInTimeline(refDd, refDf) {
        refDf = refDf ? refDf : this.dateEnd;
        const weeks_diff = Math.ceil( diffDate(refDd, refDf, 'week'));

        const timeline_space = this.getWeeks().length - this.getWeekStartInTimeline(refDd);

        return weeks_diff > timeline_space ? timeline_space : weeks_diff;
    }

    /**
     * Retourne la largeur d'un élément en fonction du nombre de colonnes à occuper
     * 
     * @param {number} cols Nombre de la colonne
     * @param {string} sx   Le suffixe à ajouter (ex px)
     * 
     * @return {number|string}
     */
    getWidth(cols, sx) {
        const width = cols * this.columnWidth;
        return typeof sx !== 'undefined' ? `${width}${sx}` : width;
    }

    /**
     * Retourne la liste des semaines de la période
     * 
     * @return {Array}
     */
    getWeeks() {
        return listIntervalWeeks(this.dateStart, this.dateEnd);
    }

    /**
     * Retourne la largeur complète de la grille
     * 
     * @param {string} sx           Suffixe à ajouter (ex : px)
     * 
     * @return {string|number}
     */
    getTableWidth(sx) {
        const width = this.getWeeks().length * this.columnWidth + this.firstColumnWidth;
        return sx ? `${width}px` : width;
    }

    /**
     * Retourne la hauteur complète de la grille, incluant la ligne d'entête
     * 
     * @param {string} sx           Suffixe à ajouter (ex : px)
     * 
     * @return {string|number}
     */
    getTableHeight(sx) {
        const height = (this.rows) * this.rowHeight;
        return sx ? `${height}px` : height;
    }
}