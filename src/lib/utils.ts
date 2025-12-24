import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

export const getSessionId = (): string | null => {
  return localStorage.getItem("cart_session_id");
}
export const setSessionId = (sessionId: string): void => {
  localStorage.setItem("cart_session_id", sessionId);
}
export const clearSessionId = (): void => {
  localStorage.removeItem("cart_session_id");
}

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "Something went wrong";
};
