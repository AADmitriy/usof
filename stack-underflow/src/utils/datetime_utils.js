
export function make_datetime_readable(dateStringWithTimezone) {
    const date = new Date(dateStringWithTimezone);

    const normalFormat = date.toLocaleString(); 
    return normalFormat
}

export function make_date_sql_compatible(dateString) {
    const date = new Date(dateString)
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    return`${year}-${month}-${day}`
}

export function isValidDateString(dateString) {
    const dateObject = new Date(dateString);
    return dateObject instanceof Date && !isNaN(dateObject);
}

export function isDateStringEarlier(dateStr1, dateStr2) {
    const date1 = new Date(dateStr1);
    const date2 = new Date(dateStr2);
  
    return date1 < date2;
}

export function get_difference_between_now_and_date(date_str) {
    const date_now = new Date(); 
    // const input_date =  new Date(date_str.replace(' ', 'T') + "Z");
    const input_date =  new Date(date_str);

    // get total seconds between the times
    var delta = Math.abs(date_now - input_date) / 1000;
    
    // calculate (and subtract) whole days
    var days = Math.floor(delta / 86400);
    delta -= days * 86400;
    
    // calculate (and subtract) whole hours
    var hours = Math.floor(delta / 3600) % 24;
    delta -= hours * 3600;
    
    // calculate (and subtract) whole minutes
    var minutes = Math.floor(delta / 60) % 60;
    delta -= minutes * 60;

    if (days === 1) {
        return `day ago`
    }
    else if (days > 1) {
        return `${days} days ago`
    }
    else if (hours === 1) {
        return `hour ago`
    }
    else if (hours > 1) {
        return `${hours} hours ago`
    }
    else if (minutes === 1) {
        return `just a minute ago`
    }
    else if (minutes > 1) {
        return `${minutes} minutes ago`
    }
    else {
        return `just now`
    }
}

export function isValidDateRange(start, end) {
    if ((start === "" && end !== "")
        ||
        (start !== "" && end === "")) {
        return true
    }
    
    return isDateStringEarlier(start, end)
}