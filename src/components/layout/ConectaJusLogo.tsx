import Image from "next/image";

type ConectaJusLogoProps = {
  className?: string;
  imageClassName?: string;
};

export function ConectaJusLogo({
  className = "",
  imageClassName = "",
}: ConectaJusLogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Image
        src="/brand/conectajus-logo-premium.jpg"
        alt="ConectaJus"
        width={180}
        height={72}
        priority
        className={`h-auto w-[180px] object-contain ${imageClassName}`}
      />
    </div>
  );
}
