import { loadStripe } from "@stripe/stripe-js";
import { supabase } from "./supabase";

const STRIPE_PUBLIC_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

if (!STRIPE_PUBLIC_KEY) {
  console.error("Missing Stripe publishable key");
}

export const stripePromise = loadStripe(STRIPE_PUBLIC_KEY || "");

export const createSubscription = async (priceId: string) => {
  try {
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
