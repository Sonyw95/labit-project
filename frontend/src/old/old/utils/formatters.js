export const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

export const formatNumber = (num) => {
    if (num >= 1000000) {
        return `${(num / 1000000).toFixed(1)  }M`;
    }
    if (num >= 1000) {
        return `${(num / 1000).toFixed(1)  }K`;
    }
    return num.toString();
};

export const formatReadTime = (minutes) => {
    if (minutes < 60) {
        return `${minutes}분`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}시간 ${remainingMinutes}분` : `${hours}시간`;
};