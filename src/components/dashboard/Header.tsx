import React, { useState, useEffect } from "react";
import { useSearch } from "@/lib/search";
import { useNavigate } from "react-router-dom";
import { useDebounce } from "@/lib/hooks";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { LogOut, Mic, Search, User } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuth } from "@/lib/auth";

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
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedQuery = useDebounce(searchQuery, 300);
  const { search, results, loading } = useSearch();
  const { user, logout } = useAuth();

  useEffect(() => {
    if (debouncedQuery) {
      search(debouncedQuery);
    }
  }, [debouncedQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="w-full h-20 bg-white border-b border-gray-200 px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold text-primary">Learning Dashboard</h1>
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
                  onClick={onVoiceSearch}
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
          <User className="w-5 h-5" />
          <span className="text-sm font-medium">{user?.name}</span>
        </div>
        <Button variant="ghost" size="icon" onClick={logout}>
          <LogOut className="w-5 h-5" />
        </Button>
      </div>
    </header>
  );
};

export default Header;
