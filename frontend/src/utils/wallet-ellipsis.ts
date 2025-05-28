export const walletEllipsis = (str: string, start = 7, end = 4): string => {
  if (typeof str !== "string") return str;

  return `${str.substring(0, start)}...${str.substring(
    str.length - end,
    str.length
  )}`.toLowerCase();
};
