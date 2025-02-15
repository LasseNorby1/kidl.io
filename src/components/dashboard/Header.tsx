import React, { useState, useEffect } from "react";
import { useSearch } from "@/lib/search";
import { useNavigate, useLocation } from "react-router-dom";
import { useDebounce } from "@/lib/hooks";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Mic,
  Search,
  ArrowLeft,
  Bell,
  ChevronDown,
  BookOpen,
  Calculator,
  Globe,
  Microscope,
  Music,
  Palette,
} from "lucide-react";
import UserMenu from "./UserMenu";
import NotificationsDialog from "./NotificationsDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

interface HeaderProps {
  onSearch?: (query: string) => void;
  onVoiceSearch?: () => void;
  onParentModeToggle?: (enabled: boolean) => void;
  isParentMode?: boolean;
}

const Header = ({
  onSearch = () => {},
  onVoiceSearch = () => {},
  onParentModeToggle = () => {},
  isParentMode = false,
}: HeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedQuery = useDebounce(searchQuery, 300);
  const { search, results, loading } = useSearch();
  const { user } = useAuth();
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    const fetchSubjects = async () => {
      const { data } = await supabase
        .from("subjects")
        .select("*")
        .is("parent_id", null) // Only fetch subjects without a parent
        .order("name");
      setSubjects(data || []);
    };

    fetchSubjects();
  }, []);

  const getSubjectIcon = (iconName: string) => {
    const icons = {
      Calculator: <Calculator className="w-4 h-4" />,
      Microscope: <Microscope className="w-4 h-4" />,
      Book: <BookOpen className="w-4 h-4" />,
      Globe: <Globe className="w-4 h-4" />,
      Palette: <Palette className="w-4 h-4" />,
      Music: <Music className="w-4 h-4" />,
    };
    return icons[iconName] || <BookOpen className="w-4 h-4" />;
  };
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  const showBackButton = location.pathname !== "/dashboard";

  useEffect(() => {
    const fetchUnreadNotifications = async () => {
      if (!user) return;

      const { data } = await supabase
        .from("notifications")
        .select("id")
        .eq("user_id", user.id)
        .eq("read", false);

      setUnreadNotifications(data?.length || 0);
    };

    fetchUnreadNotifications();
  }, [user]);

  useEffect(() => {
    if (debouncedQuery) {
      search(debouncedQuery);
    }
  }, [debouncedQuery]);

  const handleVoiceSearch = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Voice search is not supported in this browser");
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setSearchQuery(transcript);
      navigate(`/search?q=${encodeURIComponent(transcript)}`);
    };

    recognition.start();
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="w-full h-20 bg-white border-b border-gray-200 px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        {showBackButton && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/dashboard")}
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
        <h1 className="text-2xl font-bold text-primary">kidl.io</h1>
        {user?.role === "child" && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="text-sm font-medium">
                Subjects
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[400px]">
              <div className="grid grid-cols-2 gap-3 p-4">
                {subjects.map((subject: any) => (
                  <DropdownMenuItem
                    key={subject.id}
                    className="p-0 focus:bg-transparent"
                    onClick={() => navigate(`/subject/${subject.id}`)}
                  >
                    <div className="flex items-center gap-2 p-3 rounded-md hover:bg-accent w-full">
                      {getSubjectIcon(subject.icon)}
                      <div>
                        <div className="text-sm font-medium leading-none">
                          {subject.name}
                        </div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          {subject.description}
                        </p>
                      </div>
                    </div>
                  </DropdownMenuItem>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      <div className="flex-1 max-w-2xl mx-8">
        <form onSubmit={handleSearch} className="flex items-center gap-2">
          <div className="relative flex-1">
            <Input
              type="text"
              placeholder="Search for lessons..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={handleVoiceSearch}
                  className="flex-shrink-0"
                >
                  <Mic className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Search with voice</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </form>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{user?.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <UserMenu />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowNotifications(true)}
            className="relative"
          >
            <Bell className="w-5 h-5" />
            {unreadNotifications > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                {unreadNotifications}
              </span>
            )}
          </Button>
        </div>
        <NotificationsDialog
          open={showNotifications}
          onClose={() => setShowNotifications(false)}
        />
      </div>
    </header>
  );
};

export default Header;
