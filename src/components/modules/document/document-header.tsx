import {Button} from '@/components/ui/button';
import {Text} from '@/components/ui/typography';
import {IDocument} from '@/types/document';

interface DocumentHeaderProps {
  document: IDocument;
  scale: number;
  setScale: (scale: number) => void;
  svgRefs: React.MutableRefObject<SVGElement[]>;
}

export default function DocumentHeader({
  document,
  scale,
  setScale,
  svgRefs,
}: DocumentHeaderProps) {
  const handleZoomIn = () => {
    svgRefs.current.forEach(svg => {
      if (svg) {
        const newScale = Math.min(scale * 1.2, 3);
        setScale(newScale);
        svg.style.transform = `scale(${newScale})`;
      }
    });
  };

  const handleZoomOut = () => {
    svgRefs.current.forEach(svg => {
      if (svg) {
        const newScale = Math.max(scale / 1.2, 1);
        setScale(newScale);
        svg.style.transform = `scale(${newScale})`;
      }
    });
  };
  return (
    <header className="flex items-center justify-between py-4.5 px-6 h-18 bg-periwinkle-500 rounded-t-xl border-b border-neutral-50">
      <Text variant="heading9" element="h1" className="font-medium text-white">
        {document?.title}
      </Text>
      <div className="flex items-center gap-3.5 p-2.5 bg-white rounded-10px shadow-[0px_-1px_3px_rgba(0,0,0,0.04),0px_1px_3px_rgba(0,0,0,0.08)]">
        <Button
          disabled={scale >= 3}
          onClick={handleZoomIn}
          variant="ghost"
          className="p-0 h-4 group"
        >
          <img
            src="/images/plus.svg"
            alt="zoom in"
            width={16}
            height={16}
            className="group-disabled:opacity-50"
          />
        </Button>
        <Button
          disabled={scale === 1}
          onClick={handleZoomOut}
          variant="ghost"
          className="p-0 h-4 group"
        >
          <img
            src="/images/minus.svg"
            alt="zoom out"
            width={16}
            height={16}
            className="group-disabled:opacity-50"
          />
        </Button>
      </div>
    </header>
  );
}
