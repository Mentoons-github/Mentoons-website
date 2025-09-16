import { format, isToday, isYesterday, isThisYear } from 'date-fns';

interface DateFormatOptions extends Intl.DateTimeFormatOptions {
  year?: "numeric" | "2-digit";
  month?: "numeric" | "2-digit" | "long" | "short" | "narrow";
  day?: "numeric" | "2-digit";
  hour?: "numeric" | "2-digit";
  minute?: "numeric" | "2-digit";
  hour12?: boolean;
}

export function formatDateString(
  dateString: string | number | Date,
  options: DateFormatOptions = {}
): string {
  const date = new Date(dateString);

  if (isNaN(date.getTime())) return "Invalid Date";

  const defaultOptions: DateFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    // hour: "numeric",
    // minute: "2-digit",
    // hour12: true,
  };

  return date.toLocaleString(undefined, { ...defaultOptions, ...options });
}


export const getDateLabel = (dateString:string) => {
  const date = new Date(dateString);

  if (isToday(date)) {
    return "Today";
  } else if (isYesterday(date)) {
    return "Yesterday";
  } else if (isThisYear(date)) {
    return format(date, "EEEE"); // Monday, Tuesday etc
  } else {
    return format(date, "dd/MM/yyyy");  // For previous years
  }
};

export const formatMessageTime = (timestamp: string) => {
  const messageDate = new Date(timestamp);
  const now = new Date();

  const isToday =
    messageDate.getDate() === now.getDate() &&
    messageDate.getMonth() === now.getMonth() &&
    messageDate.getFullYear() === now.getFullYear();

  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);

  const isYesterday =
    messageDate.getDate() === yesterday.getDate() &&
    messageDate.getMonth() === yesterday.getMonth() &&
    messageDate.getFullYear() === yesterday.getFullYear();

  if (isToday) {
    return messageDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  if (isYesterday) {
    return "Yesterday";
  }

  return messageDate.toLocaleDateString(); 
};



