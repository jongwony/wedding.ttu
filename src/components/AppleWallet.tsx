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
    <div className="flex flex-col justify-center">
      <h2 className="mt-24 text-3xl font-bold">Apple 지갑에 추가하기</h2>
      <p className="text-gray-600 dark:text-gray-400 m-4">
        아이폰을 사용하신다면 Apple 지갑에 추가하여 알림을 받아보세요.
      </p>

      <div className="mb-12">
        <button onClick={handleButtonClick} className="focus:outline-none">
          <Image
            src="/images/KR_Add_to_Apple_Wallet_RGB_102221.svg"
            alt="Apple Wallet에 추가"
            width={128} // 적절한 너비로 설정
            height={24} // 적절한 높이로 설정
          />
        </button>
      </div>
    </div>
  );
};

export default AddToAppleWalletButton;