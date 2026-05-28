'use client';

import React, { useState } from 'react';
import { Button } from './Button';

export const ContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    const formElement = e.currentTarget;
    const formData = new FormData(formElement);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      message: formData.get('message'),
    };

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setSubmitStatus('success');
        formElement.reset();
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 md:p-10 rounded-sm shadow-xl border-t-4 border-[var(--color-primary-red)]">
      <h3 className="text-2xl font-bold uppercase tracking-wide mb-6">Send a Message</h3>
      
      {submitStatus === 'success' && (
        <div className="bg-green-50 text-green-800 p-4 rounded-sm border border-green-200 mb-6">
          Thank you! Your message has been sent. We'll be in touch shortly.
        </div>
      )}
      
      {submitStatus === 'error' && (
        <div className="bg-red-50 text-red-800 p-4 rounded-sm border border-red-200 mb-6">
          Oops! Something went wrong. Please try again later.
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Full Name</label>
        <input 
          type="text" 
          id="name" 
          name="name" 
          required 
          className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:border-[var(--color-primary-red)] focus:ring-1 focus:ring-[var(--color-primary-red)] outline-none transition-colors"
          placeholder="John Doe"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Email Address</label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            required 
            className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:border-[var(--color-primary-red)] focus:ring-1 focus:ring-[var(--color-primary-red)] outline-none transition-colors"
            placeholder="john@example.com"
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Phone Number (Optional)</label>
          <input 
            type="tel" 
            id="phone" 
            name="phone" 
            className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:border-[var(--color-primary-red)] focus:ring-1 focus:ring-[var(--color-primary-red)] outline-none transition-colors"
            placeholder="+1 (555) 123-4567"
          />
        </div>
      </div>
      
      <div>
        <label htmlFor="message" className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Message</label>
        <textarea 
          id="message" 
          name="message" 
          required 
          rows={5}
          className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:border-[var(--color-primary-red)] focus:ring-1 focus:ring-[var(--color-primary-red)] outline-none transition-colors resize-none"
          placeholder="Tell us about your project..."
        ></textarea>
      </div>
      
      <Button type="submit" variant="primary" size="lg" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </Button>
    </form>
  );
};
