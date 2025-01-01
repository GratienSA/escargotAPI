import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formUrlQuery = ({ params, key, value }: { params: string; key: string; value: string }) => {
  const urlParams = new URLSearchParams(params);
  urlParams.set(key, value);
  return `${window.location.pathname}?${urlParams.toString()}`;
};
