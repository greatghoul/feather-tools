/**
 * Displays a notification message using the global Notify class.
 *
 * @param {string} title - The title of the notification.
 * @param {string} message - The message content of the notification.
 * @param {'info'|'success'|'warning'|'error'} [status='info'] - The status type of the notification.
 */
export function notify(title, message, status = 'info') {
    new window.Notify({
        status: status,
        title: title,
        text: message,
        effect: 'fade',
        speed: 300,
        autoclose: true,
        autotimeout: 3000,
        position: 'x-center top'
    });
}

/**
 * Returns the trimmed string if it's not blank, otherwise returns the default value.
 *
 * @param {string} value - The input string.
 * @param {string} defaultValue - The value to return if input is blank, default to ''.
 * @returns {string}
 */
export function defaultText(value, defaultValue = '') {
    if (typeof value === 'string') {
        const trimmed = value.trim();
        if (trimmed !== '') {
            return trimmed;
        }
    }

    return defaultValue;
}