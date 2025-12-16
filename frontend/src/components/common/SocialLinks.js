import React from 'react';
import { FaFacebook, FaInstagram, FaWhatsapp } from 'react-icons/fa';

const SocialIcon = ({ href, children, brandColor }) => (
  <a 
    href={href} 
    target="_blank" 
    rel="noopener noreferrer" 
    style={{ color: brandColor }}
    className="transition-transform transform hover:scale-125"
  >
    {children}
  </a>
);

const SocialLinks = () => {
  return (
    <div className="bg-white p-4 rounded-2xl flex flex-col items-center gap-6 shadow-lg animate-float-y">
      <SocialIcon href="https://web.facebook.com/" brandColor="#1877F2"> {/* Facebook Blue */}
        <FaFacebook size={32} />
      </SocialIcon>
      <SocialIcon href="https://wa.me/" brandColor="#128C7E"> {/* Darker WhatsApp Green */}
        <FaWhatsapp size={32} />
      </SocialIcon>
      <SocialIcon href="https://www.instagram.com/" brandColor="#BC2A8D"> {/* Brighter Instagram Violet-Pink */}
        <FaInstagram size={32} />
      </SocialIcon>
    </div>
  );
};

export default SocialLinks;