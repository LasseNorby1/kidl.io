import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Share2, Copy, Check } from "lucide-react";

const ReferralPage = () => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const referralLink = `${window.location.origin}?ref=USER_ID`; // Replace USER_ID with actual user ID

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      toast({
        title: "Success",
        description: "Referral link copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy link",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Refer a Friend</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center p-6 bg-primary/5 rounded-lg">
            <Share2 className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              Share the Learning Journey
            </h3>
            <p className="text-gray-600 mb-4">
              Invite friends and family to join our learning platform
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Your Referral Link</label>
            <div className="flex gap-2">
              <Input value={referralLink} readOnly />
              <Button
                variant="outline"
                size="icon"
                onClick={copyToClipboard}
                className="flex-shrink-0"
              >
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6 text-center">
                <h4 className="font-semibold mb-2">Share via Email</h4>
                <Button
                  variant="outline"
                  onClick={() =>
                    (window.location.href = `mailto:?subject=Join%20Our%20Learning%20Platform&body=Check%20out%20this%20amazing%20learning%20platform:%20${encodeURIComponent(
                      referralLink,
                    )}`)
                  }
                >
                  Send Email
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <h4 className="font-semibold mb-2">Share on Twitter</h4>
                <Button
                  variant="outline"
                  onClick={() =>
                    window.open(
                      `https://twitter.com/intent/tweet?text=Join%20me%20on%20this%20amazing%20learning%20platform!%20${encodeURIComponent(
                        referralLink,
                      )}`,
                    )
                  }
                >
                  Tweet
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <h4 className="font-semibold mb-2">Share on Facebook</h4>
                <Button
                  variant="outline"
                  onClick={() =>
                    window.open(
                      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                        referralLink,
                      )}`,
                    )
                  }
                >
                  Share
                </Button>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReferralPage;
