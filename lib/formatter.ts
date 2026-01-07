export function shortFormatter(value: number, unit: string, suffix: string) {

    const showYear = new Date(value).getFullYear() > new Date().getFullYear();

    const getDate = () => {
        if (showYear) {
            return `${new Date(value).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            })}`;
        } else {
            return `${new Date(value).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
            })}`;
        }
    }

    switch (unit) {
        case "second":
            return `${value}s`;
        case "minute":
            return `${value}m`;
        case "hour":
            return `${value}h`;
        case "day":
            return getDate();
        case "year":
            return getDate();
    }
}