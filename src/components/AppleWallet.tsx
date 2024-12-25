"use client";
import React from 'react';
import Image from 'next/image';

const AddToAppleWalletButton = () => {
  const handleButtonClick = () => {
    // Pass file download URL
    const passFileUrl = '/files/PassConnect.pkpass';

    // Trigger file download
    const link = document.createElement('a');
    link.href = passFileUrl;
    link.download = 'PassConnect.pkpass';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button onClick={handleButtonClick} className="focus:outline-none">
      <Image
        src="/images/KR_Add_to_Apple_Wallet_RGB_102221.svg"
        alt="Apple Wallet에 추가"
        width={128} // 적절한 너비로 설정
        height={24} // 적절한 높이로 설정
      />
    </button>
  );
};

export default AddToAppleWalletButton;