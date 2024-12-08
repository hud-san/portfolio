export function formatDate(date: Date | string | null): string | null {
    if (date instanceof Date) {
      return date.toISOString().split('T')[0];
    } else if (typeof date === 'string') {
      return new Date(date).toISOString().split('T')[0];
    }
    return null;
  }