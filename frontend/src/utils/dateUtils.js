export const formatDate = (
    date,
    locale = "en-IN"
) => {
    if (!date) {
        return "";
    }

    const value = new Date(date);

    if (Number.isNaN(value.getTime())) {
        return "";
    }

    return new Intl.DateTimeFormat(
        locale,
        {
            day: "numeric",
            month: "long",
            year: "numeric"
        }
    ).format(value);
};

export const formatTime = (
    date,
    locale = "en-IN"
) => {
    if (!date) {
        return "";
    }

    const value = new Date(date);

    if (Number.isNaN(value.getTime())) {
        return "";
    }

    return new Intl.DateTimeFormat(
        locale,
        {
            hour: "numeric",
            minute: "2-digit"
        }
    ).format(value);
};

export const formatDateTime = (
    date,
    locale = "en-IN"
) => {
    if (!date) {
        return "";
    }

    const value = new Date(date);

    if (Number.isNaN(value.getTime())) {
        return "";
    }

    return new Intl.DateTimeFormat(
        locale,
        {
            dateStyle: "medium",
            timeStyle: "short"
        }
    ).format(value);
};

export const isToday = (date) => {
    const value = new Date(date);

    const today = new Date();

    return (
        value.getDate() ===
            today.getDate() &&
        value.getMonth() ===
            today.getMonth() &&
        value.getFullYear() ===
            today.getFullYear()
    );
};

export const getRelativeDay = (
    date
) => {
    const value = new Date(date);

    if (Number.isNaN(value.getTime())) {
        return "";
    }

    if (isToday(value)) {
        return "Today";
    }

    const yesterday = new Date();

    yesterday.setDate(
        yesterday.getDate() - 1
    );

    if (
        value.getDate() ===
            yesterday.getDate() &&
        value.getMonth() ===
            yesterday.getMonth() &&
        value.getFullYear() ===
            yesterday.getFullYear()
    ) {
        return "Yesterday";
    }

    return formatDate(value);
};

export default {
    formatDate,
    formatTime,
    formatDateTime,
    isToday,
    getRelativeDay
};