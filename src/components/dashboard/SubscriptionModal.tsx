import React, { useState, useEffect } from "react";
import { createSubscription, stripePromise } from "@/lib/stripe";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check } from "lucide-react";

interface SubscriptionModalProps {
  open?: boolean;
  onClose?: () => void;
  onSubscribe?: (plan: string) => void;
}

const SubscriptionModal = ({
  open = true,
  onClose = () => {},
  onSubscribe = () => {},
}: SubscriptionModalProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState<string | null>(null);
  const plans = [
    {
      name: "Basic",
      price: "9.99",
      priceId: "price_basic", // Stripe Price ID
      features: [
        "Access to all subjects",
        "Basic progress tracking",
        "1 child account",
      ],
      color: "bg-blue-50",
    },
    {
      name: "Family",
      price: "19.99",
      priceId: "price_family", // Stripe Price ID
      features: [
        "Everything in Basic",
        "Up to 3 child accounts",
        "Advanced analytics",
        "Priority support",
      ],
      color: "bg-purple-50",
      popular: true,
    },
    {
      name: "Premium",
      price: "29.99",
      priceId: "price_premium", // Stripe Price ID
      features: [
        "Everything in Family",
        "Unlimited child accounts",
        "1-on-1 tutoring sessions",
        "Customized learning paths",
      ],
      color: "bg-green-50",
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px]">
        <DialogHeader>
          <DialogTitle>Choose Your Subscription Plan</DialogTitle>
          <DialogDescription>
            Select the plan that best fits your family's needs
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`${plan.color} ${plan.popular ? "border-2 border-primary" : ""}`}
            >
              <CardContent className="pt-6">
                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold">{plan.name}</h3>
                  <div className="mt-2">
                    <span className="text-3xl font-bold">${plan.price}</span>
                    <span className="text-gray-600">/month</span>
                  </div>
                </div>
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full mt-6"
                  onClick={async () => {
                    try {
                      setLoading(plan.name);
                      await createSubscription(plan.priceId);
                      onSubscribe(plan.name.toLowerCase());
                    } catch (error: any) {
                      toast({
                        title: "Error",
                        description:
                          error.message || "Failed to create subscription",
                        variant: "destructive",
                      });
                    } finally {
                      setLoading(null);
                    }
                  }}
                  variant={plan.popular ? "default" : "outline"}
                  disabled={loading === plan.name}
                >
                  {loading === plan.name ? "Processing..." : "Subscribe Now"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SubscriptionModal;
