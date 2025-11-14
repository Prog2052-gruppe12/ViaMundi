/**
 * Parse a date string in yyyy-MM-dd format to a Date object.
 * Returns null for invalid or empty inputs.
 * @param {string} dateStr
 * @returns {Date | null}
 */
export function parseYMD(dateStr) {
    if (!dateStr) return null;
    const [year, month, day] = dateStr.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    return isNaN(date.getTime()) ? null : date;
}