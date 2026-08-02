import React, { useState } from 'react';
import { X, ShoppingBag, Trash2, Plus, Minus, ShieldCheck, Bookmark, ArrowRight, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function CartDrawer({ isOpen, onClose, cartItems, onUpdateQuantity, onRemoveItem, onClearCart }) {
  const [checkoutStep, setCheckoutStep] = useState('cart'); // 'cart', 'checkout', 'success'
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const freeShippingThreshold = 25.0;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const isFreeShipping = subtotal >= freeShippingThreshold;

  const handleCheckoutSubmit = (e) => {
    e.preventDefault();
    setCheckoutStep('success');
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handleFinish = () => {
    onClearCart();
    setCheckoutStep('cart');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-6 bg-[#1D2A44] text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-400" />
              <h2 className="font-serif text-xl font-bold text-amber-50">
                {checkoutStep === 'cart' && `Your Direct Cart (${cartItems.reduce((a, b) => a + b.quantity, 0)})`}
                {checkoutStep === 'checkout' && 'Direct Checkout'}
                {checkoutStep === 'success' && 'Order Confirmed!'}
              </h2>
            </div>
            <button onClick={onClose} className="text-slate-300 hover:text-white">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          {checkoutStep === 'cart' && cartItems.length > 0 && (
            <div className="bg-amber-50 p-3.5 border-b border-amber-200 text-xs font-sans">
              <div className="flex justify-between items-center mb-1.5">
                <span className="font-semibold text-slate-800">
                  {isFreeShipping ? '🎉 You qualify for FREE UK Delivery!' : `Add £${remainingForFreeShipping.toFixed(2)} more for FREE UK Delivery!`}
                </span>
                <span className="font-bold text-[#8C2520]">{Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100))}%</span>
              </div>
              <div className="w-full bg-amber-200/80 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-[#8C2520] h-full rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (subtotal / freeShippingThreshold) * 100)}%` }}
                />
              </div>
            </div>
          )}

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {checkoutStep === 'cart' && (
              <>
                {cartItems.length === 0 ? (
                  <div className="text-center py-16 space-y-4">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                      <ShoppingBag className="w-8 h-8" />
                    </div>
                    <h3 className="font-serif text-xl font-bold text-slate-800">Your direct cart is empty</h3>
                    <p className="text-xs text-slate-500 max-w-xs mx-auto">
                      Explore our catalogue to support indie authors directly and claim free bookmarks with every order!
                    </p>
                    <button 
                      onClick={onClose}
                      className="mt-4 bg-[#8C2520] text-white px-6 py-2.5 rounded-xl text-xs font-bold font-sans"
                    >
                      Start Browsing
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex gap-4 p-3 border border-slate-200 rounded-xl bg-slate-50/50 items-center">
                        <img src={item.coverImage} alt={item.title} className="w-14 h-20 object-cover rounded shadow-sm" />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-serif text-sm font-bold text-slate-900 truncate">{item.title}</h4>
                          <p className="text-[11px] text-slate-500 font-sans">Format: {item.selectedFormat || item.format}</p>
                          <p className="font-serif text-sm font-bold text-[#8C2520] mt-1">£{item.price.toFixed(2)}</p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <div className="flex items-center border border-slate-300 rounded-lg bg-white">
                            <button 
                              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                              className="p-1 hover:bg-slate-100 text-slate-600"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="px-2 text-xs font-bold">{item.quantity}</span>
                            <button 
                              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                              className="p-1 hover:bg-slate-100 text-slate-600"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <button 
                            onClick={() => onRemoveItem(item.id)}
                            className="text-slate-400 hover:text-red-600 p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {checkoutStep === 'checkout' && (
              <form onSubmit={handleCheckoutSubmit} className="space-y-4 text-xs font-sans">
                <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl">
                  <span className="font-bold text-slate-800 block">Direct Order Benefits Activated:</span>
                  <span className="text-slate-600 block mt-0.5">✨ Free Custom Bookmark + Direct Author Royalty</span>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Full Name</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Jane Doe" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2.5 border rounded-lg focus:outline-none focus:border-[#8C2520]" 
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Email Address</label>
                  <input 
                    type="email" 
                    required 
                    placeholder="jane@example.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2.5 border rounded-lg focus:outline-none focus:border-[#8C2520]" 
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Delivery Address (UK)</label>
                  <textarea 
                    required 
                    placeholder="House number, Street, City, Postcode" 
                    rows={3}
                    className="w-full p-2.5 border rounded-lg focus:outline-none focus:border-[#8C2520]"
                  />
                </div>

                <div className="p-3 bg-slate-100 rounded-xl space-y-2">
                  <div className="flex justify-between font-bold text-slate-800">
                    <span>Order Total</span>
                    <span>£{(subtotal + (isFreeShipping ? 0 : 3.50)).toFixed(2)}</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Includes {isFreeShipping ? 'FREE Shipping' : 'Standard Shipping (£3.50)'}
                  </p>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-[#8C2520] hover:bg-[#A62D27] text-white py-3.5 rounded-xl font-bold text-sm shadow-md"
                >
                  Confirm & Place Direct Order
                </button>
              </form>
            )}

            {checkoutStep === 'success' && (
              <div className="text-center py-10 space-y-4">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-slate-900">Thank You, {name || 'Reader'}!</h3>
                <p className="text-xs text-slate-600 max-w-xs mx-auto">
                  Your direct order has been placed successfully! Confirmation email sent to <span className="font-bold text-slate-800">{email}</span>.
                </p>
                <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 text-xs text-slate-700 text-left space-y-1">
                  <span className="font-bold block text-[#8C2520]">Order Highlights:</span>
                  <span>• Free custom GB Publishing bookmark included</span>
                  <span>• Direct dispatch within 1–2 working days</span>
                </div>
                <button 
                  onClick={handleFinish}
                  className="bg-[#1D2A44] text-white px-8 py-3 rounded-xl text-xs font-bold"
                >
                  Return to Storefront
                </button>
              </div>
            )}
          </div>

          {/* Footer Subtotal */}
          {checkoutStep === 'cart' && cartItems.length > 0 && (
            <div className="p-6 bg-slate-50 border-t border-slate-200 space-y-4">
              <div className="space-y-1 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-semibold">£{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>UK Shipping</span>
                  <span className="font-semibold">{isFreeShipping ? 'FREE' : '£3.50'}</span>
                </div>
                <div className="flex justify-between font-serif text-xl font-bold text-slate-900 pt-2 border-t">
                  <span>Total</span>
                  <span className="text-[#8C2520]">£{(subtotal + (isFreeShipping ? 0 : 3.50)).toFixed(2)}</span>
                </div>
              </div>

              <button 
                onClick={() => setCheckoutStep('checkout')}
                className="w-full bg-[#8C2520] hover:bg-[#A62D27] text-white py-3.5 rounded-xl font-sans font-bold text-sm shadow-lg flex items-center justify-center gap-2"
              >
                <span>Proceed to Direct Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
