"use client";
import Image from "next/image";
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
    <div className="mt-24 flex flex-col justify-center items-center space-x-4">

      {/* 헤더 */}
      <h1 className="text-4xl font-bold mb-4">시월의 열아홉번째 날.</h1>

      <p className="text-gray-600 dark:text-gray-400 mb-4">
        2025년 10월 19일 일요일 오후 12시
      </p>

      {/* 캘린더 */}
      <div className="p-4 w-full max-w-md">
        {/* 요일 */}
        <div className="grid grid-cols-7 text-center text-gray-700 dark:text-gray-300 font-semibold border-b pb-2">
          {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
            <div key={day} className="py-2">{day}</div>
          ))}
        </div>

        {/* 날짜 */}
        <div className="grid grid-cols-7 gap-2 mt-2">
          {/* October 1, 2025 is Wednesday, so three empty spaces */}
          <div></div>
          <div></div>
          <div></div>

          {Array.from({ length: 31 }, (_, i) => {
            const day = i + 1;
            const isEventDay = day === 19;
            return (
              <div
                key={day}
                className={`py-3 text-center rounded-full ${isEventDay ? "bg-pink-500 text-white font-bold relative" : "bg-gray-100 dark:bg-gray-900"
                  }`}
              >
                {day === 19 ? "💍" : day}
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex gap-2 mx-auto mt-4 text-sm font-semibold text-white">
        <button
          onClick={handleGoogleCalendar}
          className="flex items-center bg-blue-500 hover:bg-opacity-80 py-2 px-4 rounded-md transition-all duration-300"
        >
          <Image
            src="/images/logo/gcal.png"
            width={24}
            height={24}
            alt="구글캘린더 로고"
            className="h-[1em] w-auto align-middle"
          />
          <span className="ml-2">
            Google 캘린더 추가
          </span>
        </button>
        <button
          onClick={handleICSDownload}
          className="bg-gray-500 hover:bg-opacity-80 text-white py-2 px-4 rounded-md transition-all duration-300"
        >
          📅 기본 캘린더 추가
        </button>
      </div>
    </div>
  );
};

export default CalendarEventActions;
