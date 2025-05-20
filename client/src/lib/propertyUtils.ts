/**
 * Utility functions for property-related operations
 */

/**
 * Format a price number as a price string with commas and dollar sign
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
}

/**
 * Format a date string to a "time ago" format (e.g., "3 days ago")
 */
export function formatTimeAgo(dateString: string | Date): string {
  const date = dateString instanceof Date ? dateString : new Date(dateString);
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  
  let interval = seconds / 31536000; // seconds in a year
  
  if (interval > 1) {
    return Math.floor(interval) + " years ago";
  }
  
  interval = seconds / 2592000; // seconds in a month
  if (interval > 1) {
    return Math.floor(interval) + " months ago";
  }
  
  interval = seconds / 86400; // seconds in a day
  if (interval > 1) {
    return Math.floor(interval) + " days ago";
  }
  
  interval = seconds / 3600; // seconds in an hour
  if (interval > 1) {
    return Math.floor(interval) + " hours ago";
  }
  
  interval = seconds / 60; // seconds in a minute
  if (interval > 1) {
    return Math.floor(interval) + " minutes ago";
  }
  
  return Math.floor(seconds) + " seconds ago";
}

/**
 * Format a date string to a standard date format (e.g., "January 1, 2023")
 */
export function formatDate(dateString: string | Date): string {
  const date = dateString instanceof Date ? dateString : new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
}

/**
 * Calculate monthly mortgage payment estimate
 */
export function calculateMortgagePayment(
  homePrice: number,
  downPaymentPercent: number = 20,
  interestRate: number = 6.5,
  loanTermYears: number = 30
): number {
  // Calculate loan amount
  const downPayment = homePrice * (downPaymentPercent / 100);
  const principal = homePrice - downPayment;
  
  // Monthly interest rate
  const monthlyRate = interestRate / 100 / 12;
  
  // Total number of payments
  const numberOfPayments = loanTermYears * 12;
  
  // Calculate monthly payment
  const monthlyPayment = principal * 
    (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
    (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
  
  return Math.round(monthlyPayment);
}

/**
 * Convert price to a readable format with abbreviations for large numbers
 */
export function shortenPrice(price: number): string {
  if (price >= 1000000) {
    return `$${(price / 1000000).toFixed(price % 1000000 === 0 ? 0 : 1)}M`;
  } else if (price >= 10000) {
    return `$${Math.round(price / 1000)}k`;
  } else {
    return formatPrice(price);
  }
}

/**
 * Parse URL query parameters for property search
 */
export function parseSearchParams(searchParams: URLSearchParams) {
  return {
    location: searchParams.get('location') || '',
    minPrice: searchParams.get('minPrice') ? parseInt(searchParams.get('minPrice')!) : undefined,
    maxPrice: searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice')!) : undefined,
    propertyType: searchParams.get('propertyType') || '',
    minBeds: searchParams.get('minBeds') ? parseInt(searchParams.get('minBeds')!) : undefined,
    minBaths: searchParams.get('minBaths') ? parseInt(searchParams.get('minBaths')!) : undefined,
    status: searchParams.get('status') || 'active',
    premiumOnly: searchParams.get('premiumOnly') === 'true'
  };
}

/**
 * Create a search query string from search parameters
 */
export function createSearchQueryString(params: Record<string, any>): string {
  const queryParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      queryParams.append(key, String(value));
    }
  });
  
  return queryParams.toString();
}
