"use client";

import { useState, useEffect, useRef } from "react";
import { useTutorial } from "@/context/tutorial-context";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";

interface TutorialStep {
  target: string;
  content: string;
}

interface TutorialDialogProps {
  pageKey: string;
  steps: TutorialStep[];
}

export function TutorialDialog({ pageKey, steps }: TutorialDialogProps) {
  const { isTutorialOpen, closeTutorial, completeTutorial } = useTutorial();
  const [currentStep, setCurrentStep] = useState(0);
  const highlightedElementRef = useRef<HTMLElement | null>(null);
  const [highlightStyle, setHighlightStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    const cleanupHighlight = () => {
      if (highlightedElementRef.current) {
        highlightedElementRef.current.classList.remove('tutorial-highlight');
        highlightedElementRef.current = null;
      }
      setHighlightStyle({});
    };

    if (isTutorialOpen) {
      document.body.style.overflow = 'hidden';
      cleanupHighlight();

      const step = steps[currentStep];
      if (!step) return;

      const targetElement = document.querySelector(step.target) as HTMLElement;

      if (targetElement) {
        const handleHighlight = () => {
          const rect = targetElement.getBoundingClientRect();
          const padding = 16; // 1rem

          setHighlightStyle({
            position: 'absolute',
            left: `${rect.left - padding}px`,
            top: `${rect.top - padding}px`,
            width: `${rect.width + padding * 2}px`,
            height: `${rect.height + padding * 2}px`,
            boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.6)',
            borderRadius: 'var(--radius)',
            zIndex: 100,
            pointerEvents: 'none',
          });
          
          targetElement.classList.add('tutorial-highlight');
          highlightedElementRef.current = targetElement;
        };

        targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // Use a combination of timeout and event listener for robustness
        let scrollTimeout: NodeJS.Timeout;
        const scrollEndListener = () => {
          clearTimeout(scrollTimeout);
          scrollTimeout = setTimeout(handleHighlight, 150); // Delay to allow layout to settle
        };
        
        // Use 'scrollend' if available, fallback to 'scroll' with timeout
        try {
          window.addEventListener('scrollend', scrollEndListener, { once: true });
        } catch (e) {
          window.addEventListener('scroll', scrollEndListener, { once: true });
        }
        
        // Fallback for when the element is already in view and scroll event might not fire
        setTimeout(handleHighlight, 300);
      }
    } else {
      document.body.style.overflow = '';
      cleanupHighlight();
    }

    return () => {
      document.body.style.overflow = '';
      cleanupHighlight();
    };
  }, [isTutorialOpen, currentStep, steps]);


  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleClose = () => {
    closeTutorial();
    completeTutorial(pageKey);
    setCurrentStep(0);
  };

  if (!isTutorialOpen) {
    return null;
  }

  return (
    <>
      <div style={highlightStyle} />
      
      <Card className="fixed top-4 right-4 z-[102] w-full max-w-sm">
        <CardHeader>
          <CardTitle>Tutorial</CardTitle>
          <CardDescription>
            Passo {currentStep + 1} de {steps.length}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>{steps[currentStep]?.content || "Carregando..."}</p>
        </CardContent>
        <CardFooter className="flex w-full justify-between">
          <Button variant="ghost" size="sm" onClick={handleClose}>
            Pular
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={handlePrev} disabled={currentStep === 0}>
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Anterior</span>
            </Button>
            <Button size="icon" onClick={handleNext}>
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">{currentStep === steps.length - 1 ? "Finalizar" : "Próximo"}</span>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </>
  );
}
