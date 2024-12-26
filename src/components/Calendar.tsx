"use client";
import React from "react";

const ICSFileGenerator = () => {
  const generateICSFile = () => {
    // 이벤트 정보 설정
    const eventDetails = {
      startDate: "20240101T120000", // YYYYMMDDTHHMMSSZ 형식
      endDate: "20240101T150000", // YYYYMMDDTHHMMSSZ 형식
      title: "Wedding Ceremony of [신랑 & 신부]",
      description: "Join us to celebrate the wedding of [신랑] and [신부]!",
      location: "서울특별시 강남구 OOO 호텔 2층",
    };

    // ICS 파일 내용 생성
    const icsContent = `
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//YourCompany//YourApp//EN
CALSCALE:GREGORIAN
BEGIN:VEVENT
DTSTART:${eventDetails.startDate}
DTEND:${eventDetails.endDate}
SUMMARY:${eventDetails.title}
DESCRIPTION:${eventDetails.description}
LOCATION:${eventDetails.location}
END:VEVENT
END:VCALENDAR`;

    // Blob 객체로 파일 생성
    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = window.URL.createObjectURL(blob);

    // 파일 다운로드 트리거
    const link = document.createElement("a");
    link.href = url;
    link.download = "wedding_event.ics";
    document.body.appendChild(link);
    link.click();

    // 다운로드 후 정리
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="flex justify-center items-center mt-6">
      <button
        onClick={generateICSFile}
        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-all duration-300"
      >
        📅 캘린더에 추가하기
      </button>
    </div>
  );
};

export default ICSFileGenerator;