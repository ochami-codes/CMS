export function formatCurrency(
  amount = 0,
  currency = "KES",
  locale = "en-KE"
) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(amount) || 0);
}