import GalleryItem from "@/components/GalleryItem";

const images = [
  { src: "/images/photo1.jpg", alt: "Photo 1" },
  { src: "/images/photo2.jpg", alt: "Photo 2" },
  { src: "/images/photo3.jpg", alt: "Photo 3" },
];

export default function Gallery() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-6">Gallery</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((image, index) => (
          <GalleryItem key={index} src={image.src} alt={image.alt} />
        ))}
      </div>
    </section>
  );
}