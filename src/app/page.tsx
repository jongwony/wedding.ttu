// import Image from "next/image";

export default function Home() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-12 text-center">
      <h1 className="text-4xl font-bold mb-4">You’re Invited!</h1>
      <p className="text-lg text-gray-600 mb-6">
        Join us for the celebration of our wedding.
      </p>
      <div className="flex justify-center">
        <img
          src="/images/couple.jpg"
          alt="Couple"
          className="rounded-lg shadow-lg w-full max-w-md"
        />
      </div>
    </section>
  );
}