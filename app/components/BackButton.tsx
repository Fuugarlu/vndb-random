import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';

export default function BackToMainButton() {
  return (
    <Link href="/" className="flex items-center text-blue-600 hover:text-blue-800">
      <FaArrowLeft className="mr-2" /> {/* Left arrow icon */}
      Back to Random VNs
    </Link>
  );
}
