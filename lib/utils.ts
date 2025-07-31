import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import queryString from 'query-string';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// convert prisma object into a regular JS objects
export function convertToPlainObject<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

// format number with decimal places
export function formatNumberWithDecimal(num: number): string {
  const strings = num.toString().split('.');
  const int = strings[0];
  const decimal = strings[1];
  return decimal ? `${int}.${decimal.padEnd(2, '0')}` : `${int}.00`;
}

// format errors
export async function formatError(error: any) {
  if (error.name === 'ZodError') {
    const fieldErrors = Object.keys(error.errors).map((field) => error.errors[field]);

    return fieldErrors.join('. ');
  } else if (error.name === 'PrismaClientKnownRequestError' && error.code === 'P2002') {
    const field = error.meta?.target ? error.meta.target[0] : 'Field';

    return `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
  } else {
    return typeof error.message === 'string' ? error.message : JSON.stringify(error.message);
  }
}

// Round number to 2 decimal places
export function round2(value: number | string) {
  if (typeof value === 'number') {
    return Math.round((value + Number.EPSILON) * 100) / 100;
  } else if (typeof value === 'string') {
    return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
  } else {
    throw new Error('Value is not a number or a string');
  }
}

const CURRENCY_FORMAT = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

// Format currency using the forrmatter above
export function formatCurrency(value: number | string): string {
  if (typeof value === 'number') {
    return CURRENCY_FORMAT.format(value);
  } else if (typeof value === 'string') {
    return CURRENCY_FORMAT.format(Number(value));
  } else {
    throw new Error('Value is not a number or a string');
  }
}

// Format number
const NUMBER_FORMATTER = new Intl.NumberFormat('en-US', {
  style: 'decimal',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

export function formatNumber(value: number | string): string {
  if (typeof value === 'number') {
    return NUMBER_FORMATTER.format(value);
  } else if (typeof value === 'string') {
    return NUMBER_FORMATTER.format(Number(value));
  } else {
    throw new Error('Value is not a number or a string');
  }
}

// Shorten UUID
export function shortenUUID(uuid: string): string {
  if (typeof uuid !== 'string' || uuid.length < 8) {
    throw new Error('Invalid UUID');
  }
  return uuid.slice(0, 8).toUpperCase();
}

// Format date and times
export function formatDateTime(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

// Form the pagination links
export function formUrlQuery({
  params,
  key,
  value,
}: {
  params: string;
  key: string;
  value: string | null;
}) {
  const query = queryString.parse(params);

  query[key] = value;

  return queryString.stringifyUrl(
    {
      url: window.location.pathname,
      query,
    },
    {
      skipNull: true,
      skipEmptyString: true,
      arrayFormat: 'bracket',
    }
  );
}
