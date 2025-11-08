import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  StyledOverlayContainer,
  StyledOverlayLabel,
  StyledOverlayBox,
  StyledToggleButton,
} from './FSDOverlay.styles';

interface OverlayElement {
  element: HTMLElement;
  path: string;
  layer: string;
  rect: DOMRect;
}

const LAYER_COLORS: Record<string, string> = {
  app: '#6366f1',
  pages: '#8b5cf6',
  widgets: '#ec4899',
  features: '#f59e0b',
  entities: '#10b981',
  shared: '#6b7280',
};

export function FSDOverlay() {
  const [isEnabled, setIsEnabled] = useState(true);
  const [overlays, setOverlays] = useState<OverlayElement[]>([]);

  useEffect(() => {
    if (!isEnabled) {
      setOverlays([]);
      return;
    }

    const updateOverlays = () => {
      const elements = document.querySelectorAll('[data-fsd-path]');
      const newOverlays: OverlayElement[] = [];

      elements.forEach((el) => {
        if (el instanceof HTMLElement) {
          const path = el.getAttribute('data-fsd-path');
          if (path) {
            const layer = path.split('/')[0];
            // shared 레이어는 오버레이에서 제외 (화면을 너무 가림)
            if (!layer || layer === 'shared') {
              return;
            }
            const rect = el.getBoundingClientRect();
            newOverlays.push({
              element: el,
              path,
              layer,
              rect,
            });
          }
        }
      });

      setOverlays(newOverlays);
    };

    updateOverlays();

    const observer = new MutationObserver(updateOverlays);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['data-fsd-path'],
    });

    const resizeObserver = new ResizeObserver(updateOverlays);
    document.querySelectorAll('[data-fsd-path]').forEach((el) => {
      resizeObserver.observe(el);
    });

    const handleScroll = () => {
      requestAnimationFrame(updateOverlays);
    };
    const handleResize = () => {
      requestAnimationFrame(updateOverlays);
    };

    window.addEventListener('scroll', handleScroll, true);
    window.addEventListener('resize', handleResize);

    return () => {
      observer.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', handleResize);
    };
  }, [isEnabled]);

  if (typeof window === 'undefined') {
    return null;
  }

  return (
    <>
      <StyledToggleButton
        onClick={() => setIsEnabled(!isEnabled)}
        $isActive={isEnabled}
        title="FSD 오버레이 토글"
      >
        {isEnabled ? '🔴' : '⚪'} FSD
      </StyledToggleButton>
      {isEnabled &&
        createPortal(
          <>
            {overlays.map((overlay, index) => {
              const color = LAYER_COLORS[overlay.layer] || '#666';
              // 화면 상단에 가까우면(30px 이내) 레이블을 안쪽에 표시
              const isNearTop = overlay.rect.top < 30;
              const labelTop = isNearTop ? overlay.rect.top + 4 : overlay.rect.top - 28;

              return (
                <div key={`${overlay.path}-${index}`}>
                  <StyledOverlayLabel
                    $color={color}
                    style={{
                      position: 'fixed',
                      top: `${labelTop}px`,
                      left: `${overlay.rect.left}px`,
                      pointerEvents: 'none',
                      zIndex: 10000,
                    }}
                  >
                    {overlay.path}
                  </StyledOverlayLabel>
                  <StyledOverlayContainer
                    style={{
                      position: 'fixed',
                      top: `${overlay.rect.top}px`,
                      left: `${overlay.rect.left}px`,
                      width: `${overlay.rect.width}px`,
                      height: `${overlay.rect.height}px`,
                      pointerEvents: 'none',
                      zIndex: 9999,
                    }}
                  >
                    <StyledOverlayBox $color={color} />
                  </StyledOverlayContainer>
                </div>
              );
            })}
          </>,
          document.body
        )}
    </>
  );
}
