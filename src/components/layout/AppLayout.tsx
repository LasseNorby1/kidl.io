import React from 'react';
import Header from '@/components/dashboard/Header';
import Footer from '@/components/layout/Footer';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <div className='min-h-screen flex flex-col pt-20'>
      <Header />
      <main className=''>{children}</main>
      <Footer />
    </div>
  );
};

export default AppLayout;
