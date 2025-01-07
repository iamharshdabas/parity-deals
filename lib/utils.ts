import { clsx, type ClassValue } from "clsx";
import numbro from "numbro";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(number: number) {
  return numbro(number).format({
    thousandSeparated: true,
    mantissa: 0,
    average: true,
  });
}
