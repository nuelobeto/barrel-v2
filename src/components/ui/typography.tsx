import {cn} from '@/lib/utils';
import {cva, type VariantProps} from 'class-variance-authority';

const textVariants = cva('text-neutral-600', {
  variants: {
    variant: {
      heading1: 'text-6xl leading-normal',
      heading2: 'text-[3.375rem] leading-normal',
      heading3: 'text-5xl leading-normal',
      heading4: 'text-[2.625rem] leading-normal',
      heading5: 'text-4xl leading-normal',
      heading6: 'text-[2rem] leading-normal',
      heading7: 'text-[1.75rem] leading-normal',
      heading8: 'text-2xl leading-normal',
      heading9: 'text-xl leading-normal',
      heading10: 'text-lg leading-normal',
      heading11: 'text-base leading-normal',
      body1: 'text-2xl leading-normal',
      body2: 'text-xl leading-normal',
      body3: 'text-lg leading-normal',
      body4: 'text-base leading-normal',
      body5: 'text-sm leading-normal',
      body6: 'text-xs leading-normal',
    },
  },
  defaultVariants: {
    variant: 'body5',
  },
});

interface TextProps
  extends React.HTMLAttributes<
      HTMLHeadingElement | HTMLParagraphElement | HTMLSpanElement
    >,
    VariantProps<typeof textVariants> {
  element?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
}

const Text = ({
  element: Element = 'p',
  className,
  variant,
  children,
  ...props
}: TextProps) => {
  return (
    <Element className={cn(textVariants({variant, className}))} {...props}>
      {children}
    </Element>
  );
};

export {Text};
