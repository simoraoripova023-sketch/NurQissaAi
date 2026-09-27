import crypto from 'crypto';

export interface ClickPlan {
  id: 'pack3' | 'pack10' | 'vip';
  nameUz: string;
  nameEn: string;
  price: number; // in UZS
  formattedPrice: string;
  stories: number;
  isSubscription: boolean;
}

export const CLICK_PLANS: Record<string, ClickPlan> = {
  pack3: {
    id: 'pack3',
    nameUz: "«Kichkintoy» To'plami",
    nameEn: "Starter Pack",
    price: 29000,
    formattedPrice: "29 000",
    stories: 3,
    isSubscription: false,
  },
  pack10: {
    id: 'pack10',
    nameUz: "«Nurli Oila» To'plami",
    nameEn: "Radiant Family Pack",
    price: 69000,
    formattedPrice: "69 000",
    stories: 10,
    isSubscription: false,
  },
  vip: {
    id: 'vip',
    nameUz: "«VIP Cheksiz Obuna»",
    nameEn: "VIP Unlimited",
    price: 99000,
    formattedPrice: "99 000",
    stories: 999,
    isSubscription: true,
  },
};

export const CLICK_CONFIG = {
  serviceId: process.env.CLICK_SERVICE_ID || '32849', // Default test service ID
  merchantId: process.env.CLICK_MERCHANT_ID || '24519', // Default test merchant ID
  secretKey: process.env.CLICK_SECRET_KEY || 'NUR_QISSA_CLICK_SECRET_KEY_DEV_2026',
  isSandbox: process.env.CLICK_SANDBOX !== 'false',
  baseUrl: 'https://my.click.uz/services/pay',
  productionDomain: 'https://nur-qissa.uz',
};

export const CLICK_ERROR = {
  SUCCESS: 0,
  SIGN_CHECK_FAILED: -1,
  INCORRECT_AMOUNT: -2,
  ACTION_NOT_FOUND: -3,
  ALREADY_PAID: -4,
  USER_NOT_FOUND: -5,
  TRANSACTION_NOT_FOUND: -6,
  FAILED_TO_UPDATE: -7,
  REQUEST_ERROR: -8,
  TRANSACTION_CANCELLED: -9,
} as const;

export const CLICK_ERROR_MESSAGES: Record<number, string> = {
  0: 'Success',
  [-1]: 'SIGN CHECK FAILED!',
  [-2]: 'Incorrect parameter amount (Underpaid or incorrect amount)',
  [-3]: 'Action not found',
  [-4]: 'Already paid',
  [-5]: 'User not found',
  [-6]: 'Transaction does not exist',
  [-7]: 'Failed to update order state',
  [-8]: 'Error in request from click',
  [-9]: 'Transaction cancelled',
};

/**
 * Generate official Click payment link for redirecting users to Click app / web
 */
export function generateClickPaymentUrl(params: {
  serviceId?: string;
  merchantId?: string;
  amount: number;
  orderId: string;
  returnUrl?: string;
}): string {
  const serviceId = params.serviceId || CLICK_CONFIG.serviceId;
  const merchantId = params.merchantId || CLICK_CONFIG.merchantId;
  const returnUrl = params.returnUrl || `${CLICK_CONFIG.productionDomain}/payment/callback?order_id=${params.orderId}`;

  const query = new URLSearchParams({
    service_id: serviceId,
    merchant_id: merchantId,
    amount: params.amount.toFixed(2),
    transaction_param: params.orderId,
    return_url: returnUrl,
  });

  return `${CLICK_CONFIG.baseUrl}?${query.toString()}`;
}

/**
 * Verify Click MD5 signature for Prepare (action = 0)
 * Click formula: md5(click_trans_id + service_id + SECRET_KEY + merchant_trans_id + amount + action + sign_time)
 */
export function verifyClickPrepareSignature(params: {
  clickTransId: string | number;
  serviceId: string | number;
  merchantTransId: string;
  amount: string | number;
  action: string | number;
  signTime: string;
  signString: string;
  secretKey?: string;
}): boolean {
  const secretKey = params.secretKey || CLICK_CONFIG.secretKey;
  const payload = `${params.clickTransId}${params.serviceId}${secretKey}${params.merchantTransId}${params.amount}${params.action}${params.signTime}`;
  const computed = crypto.createHash('md5').update(payload).digest('hex');
  return computed.toLowerCase() === params.signString.toLowerCase();
}

/**
 * Verify Click MD5 signature for Complete (action = 1)
 * Click formula: md5(click_trans_id + service_id + SECRET_KEY + merchant_trans_id + merchant_prepare_id + amount + action + sign_time)
 */
export function verifyClickCompleteSignature(params: {
  clickTransId: string | number;
  serviceId: string | number;
  merchantTransId: string;
  merchantPrepareId: string | number;
  amount: string | number;
  action: string | number;
  signTime: string;
  signString: string;
  secretKey?: string;
}): boolean {
  const secretKey = params.secretKey || CLICK_CONFIG.secretKey;
  const payload = `${params.clickTransId}${params.serviceId}${secretKey}${params.merchantTransId}${params.merchantPrepareId}${params.amount}${params.action}${params.signTime}`;
  const computed = crypto.createHash('md5').update(payload).digest('hex');
  return computed.toLowerCase() === params.signString.toLowerCase();
}
