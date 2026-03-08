export function shortFormatter(value: number, unit: string, suffix: string) {
    const getDate = () => {
        const date = new Date();

        let daysAgo = 0;

        switch (unit) {
            case "day":
                daysAgo = value;
                break;
            case "week":
                daysAgo = value * 7;
                break;
            case "month":
                daysAgo = value * 30;
                break;
            case "year":
                daysAgo = value * 365;
                break;
        }

        date.setDate(date.getDate() - daysAgo);

        const showYear = date.getFullYear() < new Date().getFullYear();

        if (showYear) {
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
        } else {
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
            });
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
        case "week":
        case "month":
        case "year":
            return getDate();
    }
}

export function getNumberToDisplay(num: number): string {
    return new Intl.NumberFormat('en', {
        notation: 'compact',
        maximumFractionDigits: 1,
    } as Intl.NumberFormatOptions).format(num);
}