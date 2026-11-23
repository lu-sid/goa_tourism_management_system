
export const formatCurrency = (amount, options = {}) => {
  if (amount === null || amount === undefined || amount === "") {
    return "Price unavailable";
  }

  const numericAmount = Number(amount);

  if (!Number.isFinite(numericAmount)) {
    return "Price unavailable";
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
    ...options,
  }).format(numericAmount);
};

export const formatCompactCurrency = (amount) => {
  if (amount === null || amount === undefined) return "—";

  const numericAmount = Number(amount);

  if (!Number.isFinite(numericAmount)) return "—";

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(numericAmount);
};

export const calculateDiscount = (originalPrice, discountedPrice) => {
  const original = Number(originalPrice);
  const discounted = Number(discountedPrice);

  if (
    !Number.isFinite(original) ||
    !Number.isFinite(discounted) ||
    original <= 0 ||
    discounted < 0 ||
    discounted >= original
  ) {
    return 0;
  }

  return Math.round(((original - discounted) / original) * 100);
};
