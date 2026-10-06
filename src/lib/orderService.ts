import crypto from 'crypto';
import { CLICK_PLANS, ClickPlan } from './click';

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

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8841612635:AAGaKyz6iAES2CxmpCg2Sff-N3jQwQA7zc4';

/**
 * Generate cryptographic secret signature for order actions (prevents forged approvals)
 */
export function generateOrderSecret(orderId: string): string {
  return crypto.createHmac('sha256', BOT_TOKEN).update(orderId).digest('hex').slice(0, 16);
}

export function verifyOrderSecret(orderId: string, signature: string): boolean {
  if (!orderId || !signature) return false;
  const expected = generateOrderSecret(orderId);
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
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

  // Optional: save to Supabase if configured
  try {
    const { supabase } = await import('@/lib/supabase');
    await supabase.from('orders').insert([{
      id: order.id,
      plan_key: order.planKey,
      plan_name: order.planName,
      amount: order.amount,
      status: order.status,
      user_name: order.userName,
      user_phone: order.userPhone,
      created_at: order.created_at,
      updated_at: order.updated_at,
    }]);
  } catch {}

  return order;
}

export async function getOrder(orderId: string): Promise<Order | null> {
  if (!orderId) return null;
  const cached = ordersStore.get(orderId);
  if (cached) return cached;

  try {
    const { supabase } = await import('@/lib/supabase');
    const { data } = await supabase.from('orders').select('*').eq('id', orderId).single();
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
        clickTransId: data.click_trans_id,
        created_at: data.created_at,
        updated_at: data.updated_at,
      };
      ordersStore.set(orderId, order);
      return order;
    }
  } catch {}

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
    const { supabase } = await import('@/lib/supabase');
    await supabase.from('orders').update({
      status: updated.status,
      click_trans_id: updated.clickTransId,
      updated_at: updated.updated_at,
    }).eq('id', orderId);
  } catch {}

  return updated;
}

