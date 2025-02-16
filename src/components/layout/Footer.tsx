import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const footerLinks = {
    Company: [
      { name: 'About', href: '/about' },
      { name: 'Careers', href: '/careers' },
      { name: 'Press', href: '/press' },
      { name: 'Blog', href: '/blog' },
      { name: 'Affiliate Program', href: '/affiliate' },
      { name: 'Partnerships', href: '/partnerships' },
    ],
    Community: [
      { name: 'Team Plans', href: '/team-plans' },
      { name: 'Gift Membership Cards', href: '/gift-cards' },
      { name: 'Corporate Gift Cards', href: '/corporate-gifts' },
    ],
    Teaching: [
      { name: 'Become a Teacher', href: '/teach' },
      { name: 'Teacher Help Center', href: '/teacher-help' },
      { name: 'Teacher Rules & Requirements', href: '/teacher-rules' },
    ],
    Mobile: [
      {
        name: 'Download on the App Store',
        href: '#',
        img: 'https://api.tempolabs.ai/proxy-asset?url=https://storage.googleapis.com/tempo-public-assets/app-store.svg',
      },
      {
        name: 'Get it on Google Play',
        href: '#',
        img: 'https://api.tempolabs.ai/proxy-asset?url=https://storage.googleapis.com/tempo-public-assets/google-play.svg',
      },
    ],
  };

  return (
    <footer className='bg-background text-foreground py-12 dark'>
      <div className='container mx-auto px-6'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className='font-semibold mb-4'>{category}</h3>
              <ul className='space-y-2'>
                {links.map((link) => (
                  <li key={link.name}>
                    {link.img ? (
                      <a
                        href={link.href}
                        className='hover:opacity-80 inline-block'
                      >
                        <img src={link.img} alt={link.name} className='h-10' />
                      </a>
                    ) : (
                      <Link
                        to={link.href}
                        className='text-gray-300 hover:text-white text-sm'
                      >
                        {link.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className='mt-12 pt-8 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400'>
          <div className='flex items-center space-x-4 mb-4 md:mb-0'>
            <span>© Learning Platform, {new Date().getFullYear()}</span>
            <Link to='/help' className='hover:text-white'>
              Help
            </Link>
            <Link to='/privacy' className='hover:text-white'>
              Privacy
            </Link>
            <Link to='/terms' className='hover:text-white'>
              Terms
            </Link>
          </div>
          <div className='flex items-center space-x-4'>
            <select
              className='bg-transparent border border-gray-700 rounded px-2 py-1 text-sm'
              defaultValue='en'
            >
              <option value='en' className='text-black'>
                English
              </option>
              <option value='es' className='text-black'>
                Español
              </option>
              <option value='fr' className='text-black'>
                Français
              </option>
            </select>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
