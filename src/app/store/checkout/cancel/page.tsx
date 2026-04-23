import { Metadata } from 'next';
import CancelContent from './CancelContent';

export const metadata: Metadata = {
  title: 'Checkout Canceled | Photography Store',
  description: 'Your checkout was canceled.',
};

export default function CheckoutCancelPage() {
  return <CancelContent />;
}
