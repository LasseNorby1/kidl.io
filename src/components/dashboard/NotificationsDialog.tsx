import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import { Info, AlertCircle, CheckCircle, AlertTriangle } from "lucide-react";

interface NotificationsDialogProps {
  open: boolean;
  onClose: () => void;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  target_role: "all" | "parent" | "child";
  created_at: string;
  read: boolean;
}

const NotificationsDialog = ({ open, onClose }: NotificationsDialogProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user) return;

      // Fetch notifications based on user role
      const { data } = await supabase
        .from("notifications")
        .select("*")
        .or(`target_role.eq.all,target_role.eq.${user.role}`)
        .order("created_at", { ascending: false });

      setNotifications(data || []);

      // Mark all as read
      if (data && data.length > 0) {
        const unreadNotifications = data.filter((n) => !n.read);
        if (unreadNotifications.length > 0) {
          await supabase
            .from("notifications")
            .update({ read: true })
            .in(
              "id",
              unreadNotifications.map((n) => n.id),
            );
        }
      }
    };

    if (open) {
      fetchNotifications();
    }
  }, [open, user]);

  const getIcon = (type: string) => {
    switch (type) {
      case "info":
        return <Info className="h-4 w-4 text-blue-500" />;
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Notifications</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {notifications.length === 0 ? (
              <div className="text-center text-gray-500 py-4">
                No notifications
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg border ${notification.read ? "bg-gray-50" : "bg-white"}`}
                >
                  <div className="flex items-start gap-3">
                    {getIcon(notification.type)}
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-medium">{notification.title}</h4>
                        <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                          {notification.target_role === "all"
                            ? "Everyone"
                            : notification.target_role === "parent"
                              ? "Parents"
                              : "Children"}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(notification.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default NotificationsDialog;
