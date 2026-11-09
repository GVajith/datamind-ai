export default function DataArtwork({ className = "", priority = false }) {
  return (
    <img
      className={`data-artwork ${className}`}
      src="/images/data-sculpture.png"
      alt=""
      aria-hidden="true"
      width="1024"
      height="1024"
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      draggable="false"
    />
  );
}
