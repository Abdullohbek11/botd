export function formatPrice(price: number): string {
  return new Intl.NumberFormat('uz-UZ', {
    style: 'currency',
    currency: 'UZS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price).replace('UZS', 'so\'m');
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('uz-UZ', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

export function getOrderStatusText(status: string): string {
  const statusMap = {
    pending: 'Kutish jarayonida',
    confirmed: 'Tasdiqlandi',
    shipping: 'Yetkazilmoqda',
    delivered: 'Yetib keldi',
    cancelled: 'Bekor qilindi'
  };
  return statusMap[status as keyof typeof statusMap] || status;
}

export function getOrderStatusColor(status: string): string {
  const colorMap = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    shipping: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  };
  return colorMap[status as keyof typeof colorMap] || 'bg-gray-100 text-gray-800';
}