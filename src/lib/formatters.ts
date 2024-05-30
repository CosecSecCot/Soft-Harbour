const CURRENCY_FORMATTER = Intl.NumberFormat("en-IN", {
    currency: "INR",
    style: "currency",
    minimumFractionDigits: 0,
});

const NUMBER_FORMATTER = Intl.NumberFormat("en-IN");

export function formatCurrency(amount: number) {
    return CURRENCY_FORMATTER.format(amount);
}

export function formatNumber(amount: number) {
    return NUMBER_FORMATTER.format(amount);
}
