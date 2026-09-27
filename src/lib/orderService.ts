import { CLICK_PLANS, ClickPlan } from './click';

export interface Order {
  id: string;
  planKey: string;
  planName: string;
  amount: number;
  status: 'pending' | 'prepared' | 'paid' | 'cancelled' | 'rejected_underpaid';
  userName?: string;
  userPhone?: string;
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

export async function createOrder(params: {
  planKey: string;
  userName?: string;
  userPhone?: string;
}): Promise<Order> {
  const plan = CLICK_PLANS[params.planKey] || CLICK_PLANS.pack10;
  const orderId = `nq_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;

  const order: Order = {
    id: orderId,
    planKey: plan.id,
    planName: plan.nameUz,
    amount: plan.price,
    status: 'pending',
    userName: params.userName || 'Mijoz',
    userPhone: params.userPhone || "Ko'rsatilmadi",
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
    }]).catch(() => {});
  } catch {}

  return order;
}

export async function getOrder(orderId: string): Promise<Order | null> {
  const cached = ordersStore.get(orderId);
  if (cached) return cached;

  try {
    const { supabase } = await import('@/lib/supabase');
    const { data } = await supabase.from('orders').select('*').eq('id', orderId).single();
    if (data) {
      const order: Order = {
        id: data.id,
        planKey: data.plan_key,
        planName: data.plan_name,
        amount: Number(data.amount),
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
    }).eq('id', orderId).catch(() => {});
  } catch {}

  return updated;
}
