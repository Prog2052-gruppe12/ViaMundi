/**
 * Format a Date object to yyyy-MM-dd (local time).
 * @param {Date} date
 * @returns {string}
 */
export function formatYMDLocal(date) {
    if (!(date instanceof Date)) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}