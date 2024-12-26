"use client";
import React from "react";

interface EventDetails {
  title: string;
  startDate: string;
  endDate: string;
  description: string;
  location: string;
}

const generateGoogleCalendarURL = (event: EventDetails) => {
  return `https://calendar.google.com/calendar/u/0/r/eventedit?text=${encodeURIComponent(
    event.title
  )}&dates=${event.startDate}/${event.endDate}&details=${encodeURIComponent(
    event.description
  )}&location=${encodeURIComponent(event.location)}&sf=true&output=xml`;
};
const generateICSFile = (event: EventDetails) => {
  const icsContent = `
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//TTUWORLD//WEDDING//KO
CALSCALE:GREGORIAN
BEGIN:VEVENT
DTSTART:${event.startDate}
DTEND:${event.endDate}
SUMMARY:${event.title}
DESCRIPTION:${event.description}
LOCATION:${event.location}
END:VEVENT
END:VCALENDAR`;

  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const url = window.URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "wedding_even.ics";
  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

const CalendarEventActions = () => {
  const eventDetails = {
    title: "Jongwon ❤️ Ttu 💍",
    startDate: "20251019T030000Z",
    endDate: "20251019T060000Z",
    description: "소중한 시간을 내어 참석해 주셔서 진심으로 감사드립니다. 💖",
    location: "스타시티아트홀, 대한민국 서울특별시 광진구 화양동 능동로 110 스타시티영존 5층",
  };

  const handleICSDownload = () => {
    generateICSFile(eventDetails);
  };

  const handleGoogleCalendar = () => {
    const googleCalendarURL = generateGoogleCalendarURL(eventDetails);
    window.open(googleCalendarURL, "_blank");
  };

  return (
    <div className="flex justify-center items-center space-x-4 mt-6">
      <button
        onClick={handleGoogleCalendar}
        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-all duration-300"
      >
        📅 Google 캘린더에 추가
      </button>
      <button
        onClick={handleICSDownload}
        className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-all duration-300"
      >
        📅 .ICS 파일 다운로드
      </button>
    </div>
  );
};

export default CalendarEventActions;
