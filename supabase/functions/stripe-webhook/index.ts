import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@12.0.0";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
  apiVersion: "2023-10-16",
});

const endpointSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET") || "";

serve(async (req) => {
  const signature = req.headers.get("stripe-signature");
  const body = await req.text();

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature || "",
      endpointSecret,
    );
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_KEY") ?? "",
    );

    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated":
        const subscription = event.data.object;
        const customerId = subscription.customer;

        // Get user by Stripe customer ID
        const { data: profile } = await supabase
          .from("profiles")
          .select("id")
          .eq("stripe_customer_id", customerId)
          .single();

        if (profile) {
          await supabase.from("subscriptions").upsert({
            user_id: profile.id,
            stripe_subscription_id: subscription.id,
            stripe_customer_id: customerId,
            plan_id: subscription.items.data[0].price.id,
            status: subscription.status,
            current_period_end: new Date(
              subscription.current_period_end * 1000,
            ),
            cancel_at: subscription.cancel_at
              ? new Date(subscription.cancel_at * 1000)
              : null,
          });

          await supabase
            .from("profiles")
            .update({ subscription_status: subscription.status })
            .eq("id", profile.id);
        }
        break;

      case "customer.subscription.deleted":
        const deletedSubscription = event.data.object;
        await supabase
          .from("subscriptions")
          .update({ status: "canceled" })
          .eq("stripe_subscription_id", deletedSubscription.id);

        const { data: userProfile } = await supabase
          .from("profiles")
          .select("id")
          .eq("stripe_customer_id", deletedSubscription.customer)
          .single();

        if (userProfile) {
          await supabase
            .from("profiles")
            .update({ subscription_status: "inactive" })
            .eq("id", userProfile.id);
        }
        break;
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: `Webhook Error: ${err.message}` }),
      {
        headers: { "Content-Type": "application/json" },
        status: 400,
      },
    );
  }
});
