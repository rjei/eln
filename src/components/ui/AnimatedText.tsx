import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface AnimatedTextProps {
  children: string;
  scrollContainerRef?: React.RefObject<HTMLElement>;
  containerClassName?: string;
  textClassName?: string;
  animationDuration?: number;
  ease?: string;
  scrollStart?: string;
  scrollEnd?: string;
  stagger?: number;
}

export function AnimatedText({
  children,
  scrollContainerRef,
  containerClassName = '',
  textClassName = '',
  animationDuration = 1,
  ease = 'back.inOut(2)',
  scrollStart = 'center bottom+=50%',
  scrollEnd = 'bottom bottom-=40%',
  stagger = 0.03
}: AnimatedTextProps) {
  const containerRef = useRef<HTMLHeadingElement>(null);
  const scrollTriggerInstance = useRef<ScrollTrigger | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const scroller = scrollContainerRef?.current || window;
    const charElements = el.querySelectorAll('.char');

    if (scrollTriggerInstance.current) {
      scrollTriggerInstance.current.kill();
    }

    const tl = gsap.fromTo(
      charElements,
      {
        willChange: 'opacity, transform',
        opacity: 0,
        yPercent: 120,
        scaleY: 2.3,
        scaleX: 0.7,
        transformOrigin: '50% 0%'
      },
      {
        duration: animationDuration,
        ease: ease,
        opacity: 1,
        yPercent: 0,
        scaleY: 1,
        scaleX: 1,
        stagger: stagger,
        scrollTrigger: {
          trigger: el,
          scroller,
          start: scrollStart,
          end: scrollEnd,
          scrub: true
        }
      }
    );

    scrollTriggerInstance.current = tl.scrollTrigger || null;

    return () => {
      if (scrollTriggerInstance.current) {
        scrollTriggerInstance.current.kill();
      }
    };
  }, [children, scrollContainerRef, animationDuration, ease, scrollStart, scrollEnd, stagger]);

  const splitText = children.split('');

  return (
    <h2 ref={containerRef} className={`overflow-hidden ${containerClassName}`}>
      <span
        className={`inline-block text-center leading-relaxed font-black ${textClassName}`}
        style={{ fontSize: 'clamp(1.6rem, 8vw, 10rem)' }}
      >
        {splitText.map((char, index) => (
          <span key={index} className="inline-block char">
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </span>
    </h2>
  );
}
