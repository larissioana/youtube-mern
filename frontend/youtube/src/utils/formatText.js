
export const formattedString = (name, maxLength) => {
    if (name.length > maxLength) {
        return name.substring(0, maxLength) + "..."
    }
    return name
};