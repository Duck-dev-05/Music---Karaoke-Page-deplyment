'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';
import { FaExclamationTriangle } from 'react-icons/fa';

export default function ErrorPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const error = searchParams.get('error');
  const message = searchParams.get('message');

  useEffect(() => {
    // If no error message, redirect to login
    if (!error) {
      router.push('/login');
    }
  }, [error, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-md p-8 space-y-6 bg-white backdrop-blur">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <FaExclamationTriangle className="w-12 h-12 text-yellow-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              {error === 'AccountExists' ? 'Account Already Exists' : 'Error'}
            </h1>
            <p className="text-gray-600">
              {message || 'An error occurred during authentication.'}
            </p>
          </div>

          <div className="space-y-4">
            <Button
              onClick={() => router.push('/login')}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              Return to Login
            </Button>
            <Button
              onClick={() => router.push('/register')}
              variant="outline"
              className="w-full"
            >
              Create New Account
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
} 