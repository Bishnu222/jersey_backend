import React, { useState } from 'react';

export default function EsewaPayment({ amount }) {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function handlePayment() {
    setMessage('');
    setLoading(true);

    try {
      const response = await fetch('/api/esewa/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url; // Redirect to eSewa payment
      } else {
        setMessage('Failed to get payment URL from server.');
      }
    } catch (error) {
      console.error('Payment initiation failed:', error);
      setMessage('Payment initiation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        onClick={handlePayment}
        disabled={loading}
        className="bg-[#b91c1c] hover:bg-red-700 text-white px-6 py-2 rounded font-semibold disabled:opacity-50 transition"
      >
        {loading ? 'Processing...' : `Pay Rs ${amount} with eSewa`}
      </button>
      {message && <p className="text-red-600">{message}</p>}
    </div>
  );
}
