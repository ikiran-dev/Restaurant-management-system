'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function HomePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me', {
          credentials: 'include',
        });

        if (response.ok) {
          
          router.replace('/dashboard');
        } else {
      
          setIsLoading(false);
        }
      } catch (error) {
        
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-20">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Digital Menu Management System
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Create, manage, and share restaurant menus with beautiful digital interfaces and QR codes
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/auth/login">
              <Button size="lg" className="gap-2">
                Sign In
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button size="lg" variant="outline" className="gap-2">
                Register
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-2">Easy Management</h3>
            <p className="text-gray-600">
              Manage multiple restaurants, categories, and dishes from a single dashboard
            </p>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-2">Beautiful Menus</h3>
            <p className="text-gray-600">
              Customers view your menus on responsive, professionally designed pages
            </p>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-2">QR Code Sharing</h3>
            <p className="text-gray-600">
              Generate and download QR codes for easy menu sharing with customers
            </p>
          </Card>
        </div>

        <Card className="p-8 text-center bg-blue-50 border-blue-200">
          <h2 className="text-2xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-gray-600 mb-6">
            Create your restaurant account and start managing your menu today
          </p>
          <Link href="/auth/register">
            <Button size="lg">Get Started Now</Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}
