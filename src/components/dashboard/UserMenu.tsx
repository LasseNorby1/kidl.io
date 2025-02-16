import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { User, Settings, CreditCard, UserPlus, Bell } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { useNavigate } from 'react-router-dom';

interface UserMenuProps {}

const UserMenu = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const isParent = user?.role === 'parent';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='icon' className='rounded-full'>
          <User className='w-5 h-5' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-56'>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {isParent && (
          <>
            <DropdownMenuItem onClick={() => navigate('/settings/billing')}>
              <CreditCard className='mr-2 h-4 w-4' />
              <span>Billing</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/settings/refer')}>
              <UserPlus className='mr-2 h-4 w-4' />
              <span>Refer a Friend</span>
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuItem onClick={() => navigate('/settings/profile')}>
          <Settings className='mr-2 h-4 w-4' />
          <span>Settings</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout}>Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
