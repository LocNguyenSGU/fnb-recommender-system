'use client';

import Modal from '@/components/ui/Modal';
import LoginForm from './LoginForm';

interface SignInModalProps {
  open: boolean;
  onClose: () => void;
  /** Called after successful sign-in (e.g. close modal and refresh nav) */
  onSuccess?: () => void;
}

export default function SignInModal({ open, onClose, onSuccess }: SignInModalProps) {
  const handleSuccess = () => {
    onSuccess?.();
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Sign in" maxWidth="sm">
      <div className="p-6 flex-1 min-h-0 flex flex-col items-center justify-center w-full">
        <p className="text-gray-600 text-sm mb-6 text-center">
          Sign in to write blog posts and manage your account.
        </p>
        <div className="w-full flex justify-center">
          <LoginForm onSuccess={handleSuccess} onSignUpClick={onClose} />
        </div>
      </div>
    </Modal>
  );
}
