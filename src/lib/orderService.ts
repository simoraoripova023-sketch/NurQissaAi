import crypto from 'crypto';
import { CLICK_PLANS, ClickPlan } from './click';
import { supabaseAdmin } from './supabase';

export interface Order {
  id: string;
  planKey: 'pack3' | 'pack10' | 'vip';
  planName: string;
  amount: number;
  storiesGranted: number;
  status: 'pending' | 'prepared' | 'verifying' | 'paid' | 'cancelled' | 'rejected_underpaid';
  userName?: string;
  userPhone?: string;
  provider?: string;
  receiptNote?: string;
  clickTransId?: string;
  clickPrepareId?: string;
  created_at: string;
  updated_at: string;
}

// Global in-memory cache to guarantee fast access and persistence across hot-reloads
declare global {
  var __nurqissa_orders_store: Map<string, Order> | undefined;
}

const ordersStore = globalThis.__nurqissa_orders_store ?? new Map<string, Order>();
globalThis.__nurqissa_orders_store = ordersStore;

const ORDER_SECRET_SALT = process.env.ORDER_SECRET_KEY || process.env.TELEGRAM_BOT_TOKEN || 'nurqissa_secure_order_salt';

/**
 * Generate cryptographic secret signature for order actions (prevents forged approvals)
 */
export function generateOrderSecret(orderId: string): string {
  return crypto.createHmac('sha256', ORDER_SECRET_SALT).update(orderId).digest('hex').slice(0, 16);
}

export function verifyOrderSecret(orderId: string, signature: string): boolean {
  if (!orderId || !signature) return false;
  const expected = generateOrderSecret(orderId);
  const expectedBuf = Buffer.from(expected);
  const signatureBuf = Buffer.from(signature);
  if (expectedBuf.length !== signatureBuf.length) {
    return false;
  }
  return crypto.timingSafeEqual(expectedBuf, signatureBuf);
}

export async function createOrder(params: {
  planKey: string;
  userName?: string;
  userPhone?: string;
  provider?: string;
}): Promise<Order> {
  // Anti-fraud: strictly validate that only authentic plans are allowed
  const validKey = (params.planKey === 'pack3' || params.planKey === 'vip') ? params.planKey : 'pack10';
  const plan = CLICK_PLANS[validKey] || CLICK_PLANS.pack10;
  
  // Format readable unique ID: NQ-29K-xxxx or NQ-69K-xxxx or NQ-VIP-xxxx
  const prefix = validKey === 'pack3' ? 'NQ-29K' : validKey === 'vip' ? 'NQ-VIP' : 'NQ-69K';
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const orderId = `${prefix}-${Date.now().toString().slice(-4)}${randomSuffix}`;

  const order: Order = {
    id: orderId,
    planKey: validKey,
    planName: plan.nameUz,
    amount: plan.price,
    storiesGranted: plan.stories,
    status: 'pending',
    userName: params.userName || 'Mijoz',
    userPhone: params.userPhone || "Ko'rsatilmadi",
    provider: params.provider || 'card',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  ordersStore.set(orderId, order);

  // Securely persist to primary orders table via supabaseAdmin
  try {
    await supabaseAdmin.from('orders').upsert([{
      id: order.id,
      plan_key: order.planKey,
      plan_name: order.planName,
      amount: order.amount,
      status: order.status,
      user_name: order.userName,
      user_phone: order.userPhone,
      provider: order.provider,
      created_at: order.created_at,
      updated_at: order.updated_at,
    }]);
  } catch (err) {
    console.warn('Orders persistence notice:', err);
  }

  return order;
}

export async function getOrder(orderId: string): Promise<Order | null> {
  if (!orderId) return null;
  const cached = ordersStore.get(orderId);
  if (cached) return cached;

  // 1. Try primary Supabase 'orders' table via supabaseAdmin
  try {
    const { data } = await supabaseAdmin.from('orders').select('*').eq('id', orderId).maybeSingle();
    if (data) {
      const order: Order = {
        id: data.id,
        planKey: data.plan_key as any,
        planName: data.plan_name,
        amount: Number(data.amount),
        storiesGranted: data.plan_key === 'pack3' ? 3 : data.plan_key === 'vip' ? 999 : 10,
        status: data.status,
        userName: data.user_name,
        userPhone: data.user_phone,
        provider: data.provider || 'card',
        receiptNote: data.receipt_note,
        clickTransId: data.click_trans_id,
        clickPrepareId: data.click_prepare_id,
        created_at: data.created_at,
        updated_at: data.updated_at,
      };
      ordersStore.set(orderId, order);
      return order;
    }
  } catch (err) {
    console.warn('Fetch order notice:', err);
  }

  // 2. Deterministic self-healing fallback from orderId prefix
  if (orderId.startsWith('NQ-')) {
    const isPack3 = orderId.includes('29K');
    const isVip = orderId.includes('VIP');
    const validKey = isPack3 ? 'pack3' : isVip ? 'vip' : 'pack10';
    const plan = CLICK_PLANS[validKey] || CLICK_PLANS.pack10;
    const restoredOrder: Order = {
      id: orderId,
      planKey: validKey,
      planName: plan.nameUz,
      amount: plan.price,
      storiesGranted: plan.stories,
      status: 'verifying',
      userName: 'Mijoz',
      userPhone: '',
      provider: 'card',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    ordersStore.set(orderId, restoredOrder);
    return restoredOrder;
  }

  return null;
}

export async function updateOrder(orderId: string, updates: Partial<Order>): Promise<Order | null> {
  const order = await getOrder(orderId);
  if (!order) return null;

  const updated: Order = {
    ...order,
    ...updates,
    updated_at: new Date().toISOString(),
  };

  ordersStore.set(orderId, updated);

  try {
    await supabaseAdmin.from('orders').update({
      status: updated.status,
      click_trans_id: updated.clickTransId,
      receipt_note: updated.receiptNote,
      updated_at: updated.updated_at,
    }).eq('id', orderId);
  } catch (err) {
    console.warn('Update order notice:', err);
  }

  return updated;
}
