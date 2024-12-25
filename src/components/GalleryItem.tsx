import Image from "next/image";

// GalleryItem 컴포넌트
interface Props {
  src: string;
  alt: string;
}

const GalleryItem = ({ src, alt }: Props) => (
  <div className="overflow-hidden rounded-lg shadow-lg">
    <Image
      src={src}
      alt={alt}
      layout="responsive"
      width={100}
      height={100}
      className="object-cover transition-transform duration-300 hover:scale-110"
    />
  </div>
);

export default GalleryItem;