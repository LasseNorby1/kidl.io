import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import { CreditCard, Clock } from "lucide-react";

const BillingSettings = () => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscription = async () => {
      if (!user) return;

      try {
        const { data } = await supabase
          .from("subscriptions")
          .select("*")
          .eq("user_id", user.id)
          .single();

        setSubscription(data);
      } catch (error) {
        console.error("Error fetching subscription:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Billing Settings</CardTitle>
        </CardHeader>
        <CardContent>
          {subscription ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <CreditCard className="w-8 h-8 text-primary" />
                  <div>
                    <h3 className="font-semibold">Current Plan</h3>
                    <p className="text-sm text-gray-500">
                      {subscription.plan_id}
                    </p>
                  </div>
                </div>
                <Button variant="outline">Change Plan</Button>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <Clock className="w-8 h-8 text-primary" />
                  <div>
                    <h3 className="font-semibold">Next Payment</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(
                        subscription.current_period_end,
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <h3 className="font-semibold mb-2">No Active Subscription</h3>
              <p className="text-gray-500 mb-4">Choose a plan to get started</p>
              <Button>View Plans</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BillingSettings;
