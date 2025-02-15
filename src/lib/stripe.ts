import { supabase } from "./supabase";

export const createSubscription = async (priceId: string) => {
  try {
    // In development, just simulate success
    if (process.env.NODE_ENV === "development") {
      return { success: true };
    }

    // Create a checkout session on Supabase Edge Function
    const {
      data: { sessionId, url },
      error,
    } = await supabase.functions.invoke("create-checkout-session", {
      body: { priceId },
    });

    if (error) throw error;

    // Redirect to Stripe Checkout
    window.location.href = url;
    return { success: true };
  } catch (error) {
    console.error("Error creating subscription:", error);
    throw error;
  }
};

export const getSubscriptionStatus = async () => {
  try {
    const { data: subscription, error } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", supabase.auth.user()?.id)
      .single();

    if (error) throw error;
    return subscription?.status || "inactive";
  } catch (error) {
    console.error("Error fetching subscription:", error);
    return "inactive";
  }
};
