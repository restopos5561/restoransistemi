import React, { Fragment } from 'react';
import { XMarkIcon as XIcon } from '@heroicons/react/24/outline';
import PropTypes from 'prop-types';

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md',
  showCloseButton = true,
  footer = null
}) => {
  if (!isOpen) return null;

  // Modal boyutları
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full mx-4'
  };

  return (
    <Fragment>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-secondary-900/50 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 sm:items-center">
          <div 
            className={`relative w-full ${sizeClasses[size]} bg-white rounded-xl shadow-soft 
              transform transition-all`}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-secondary-100">
              <h3 className="text-lg font-semibold text-secondary-900">
                {title}
              </h3>
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="p-1 rounded-lg text-secondary-400 hover:bg-secondary-50 
                    transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 
                    focus:ring-primary-500"
                >
                  <XIcon className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Content */}
            <div className="p-4 space-y-4">
              {children}
            </div>

            {/* Footer */}
            {footer && (
              <div className="flex justify-end gap-3 px-4 py-3 border-t border-secondary-100 bg-secondary-50">
                {footer}
              </div>
            )}
          </div>
        </div>
      </div>
    </Fragment>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl', 'full']),
  showCloseButton: PropTypes.bool,
  footer: PropTypes.node
};

export default Modal; 