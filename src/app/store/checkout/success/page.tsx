import { Metadata } from 'next';
import SuccessContent from './SuccessContent';

export const metadata: Metadata = {
  title: 'Order Success | Photography Store',
  description: 'Thank you for your order!',
};

export default function CheckoutSuccessPage() {
  return <SuccessContent />;
}
