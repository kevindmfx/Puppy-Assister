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

  useEffect(() => {
    const cleanup = () => {
      document.body.style.overflow = '';
      if (highlightedElementRef.current) {
        highlightedElementRef.current.classList.remove('tutorial-highlight');
        highlightedElementRef.current.style.zIndex = '';
        highlightedElementRef.current.style.position = '';
        highlightedElementRef.current = null;
      }
    };
  
    if (isTutorialOpen) {
      document.body.style.overflow = 'hidden';
      // Clean up previous highlight before applying a new one
      cleanup();
  
      const step = steps[currentStep];
      if (!step) return;

      const targetElement = document.querySelector(step.target) as HTMLElement;
  
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
  
        const handleScrollEnd = () => {
          targetElement.classList.add('tutorial-highlight');
          highlightedElementRef.current = targetElement;
        };
  
        let scrollTimeout: NodeJS.Timeout;
        const scrollEndListener = () => {
          clearTimeout(scrollTimeout);
          scrollTimeout = setTimeout(handleScrollEnd, 150);
        };
  
        window.addEventListener('scroll', scrollEndListener, { once: true });
        // Fallback for when the element is already in view and scroll event might not fire
        setTimeout(handleScrollEnd, 300); 
      }
    } else {
      cleanup();
    }
  
    return cleanup;
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

  const step = steps[currentStep];

  return (
    <>
      <div className="fixed inset-0 z-[100] bg-black/60" onClick={handleClose} />
      
      <Card className="fixed top-4 right-4 z-[102] w-full max-w-sm">
        <CardHeader>
          <CardTitle>Tutorial</CardTitle>
          <CardDescription>
            Passo {currentStep + 1} de {steps.length}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>{step?.content || "Carregando..."}</p>
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
