export const formatViews = (num) => {
    return new Intl.NumberFormat("en-Us").format(num)
};

export const formatNumber = (num) => {
    if (num >= 1000000000) {
        return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B';
    }
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    return num;
};

export const formatDate = (string) => {
    const options = {
        day: "numeric",
        month: "short",
        year: "numeric"
    };

    const date = new Date(string);
    let formattedDate = date.toLocaleDateString("en-Us", options);
    return formattedDate
};