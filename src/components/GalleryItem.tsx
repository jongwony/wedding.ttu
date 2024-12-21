// GalleryItem 컴포넌트
interface Props {
  src: string;
  alt: string;
}

const GalleryItem = ({ src, alt }: Props) => (
  <div className="overflow-hidden rounded-lg shadow-lg">
    <img
      src={src}
      alt={alt}
      className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
    />
  </div>
);

export default GalleryItem;