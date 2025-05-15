"use client";

import { useState, useEffect } from 'react';
import './globals.css';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();
  const [darkMode, setDarkMode] = useState(true);
  
  // Apply dark mode to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);
  
  return (
    <html lang="en" className={darkMode ? 'dark' : ''}>
      <body className={`${inter.className} bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-white transition-colors duration-300`}>
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 w-full"></div>
        <nav className="bg-white dark:bg-gray-800 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                    Fraud Detection System
                  </h1>
                </div>
                <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
                  <Link
                    href="/"
                    className={`inline-flex items-center px-3 pt-1 border-b-2 text-sm font-medium ${
                      pathname === '/' 
                        ? 'border-purple-500 text-purple-700 dark:text-purple-300 dark:border-purple-400' 
                        : 'border-transparent text-gray-600 dark:text-gray-300 hover:text-purple-700 hover:border-purple-300 dark:hover:text-purple-300'
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/transactions"
                    className={`inline-flex items-center px-3 pt-1 border-b-2 text-sm font-medium ${
                      pathname === '/transactions' 
                        ? 'border-purple-500 text-purple-700 dark:text-purple-300 dark:border-purple-400' 
                        : 'border-transparent text-gray-600 dark:text-gray-300 hover:text-purple-700 hover:border-purple-300 dark:hover:text-purple-300'
                    }`}
                  >
                    Transactions
                  </Link>
                </div>
              </div>
              
              {/* Dark mode toggle */}
              <div className="flex items-center">
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {darkMode ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {children}
        </main>
        
        <footer className="bg-white dark:bg-gray-800 shadow-inner mt-12">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              Fraud Detection System © {new Date().getFullYear()}
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}