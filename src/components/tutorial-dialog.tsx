"use client";

import { useState, useEffect, useRef } from "react";
import { useTutorial } from "@/context/tutorial-context";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { cn } from "@/lib/utils";

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
  const previousTargetRef = useRef<Element | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0, arrow: 'bottom' });
  const [isVisible, setIsVisible] = useState(false);

  const cleanupHighlight = () => {
    if (previousTargetRef.current) {
      previousTargetRef.current.classList.remove("tutorial-highlight");
      previousTargetRef.current = null;
    }
  };
  
  useEffect(() => {
    if (isTutorialOpen) {
      document.body.style.overflow = 'hidden';
      const timer = setTimeout(() => setIsVisible(true), 100);
      return () => {
        clearTimeout(timer);
        document.body.style.overflow = '';
      };
    } else {
      document.body.style.overflow = '';
      setIsVisible(false);
      cleanupHighlight();
    }
  }, [isTutorialOpen]);
  
  useEffect(() => {
    if (!isTutorialOpen || !isVisible || steps.length === 0) {
      cleanupHighlight();
      return;
    }
    
    const step = steps[currentStep];
    const targetElement = document.querySelector(step.target) as HTMLElement;
    
    if (targetElement) {
        cleanupHighlight();
        targetElement.classList.add("tutorial-highlight");
        previousTargetRef.current = targetElement;
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });

        const timer = setTimeout(() => {
            const targetRect = targetElement.getBoundingClientRect();
            const dialogElement = dialogRef.current;
            if (!dialogElement) return;

            const dialogRect = dialogElement.getBoundingClientRect();
            const offset = 15;
            const viewportPadding = 10;

            let top, left;

            // Position above the target
            top = targetRect.top - dialogRect.height - offset;
            
            // Center horizontally
            left = targetRect.left + (targetRect.width / 2) - (dialogRect.width / 2);

            // Adjust horizontal position to stay within viewport
            if (left < viewportPadding) {
                left = viewportPadding;
            }
            if (left + dialogRect.width > window.innerWidth - viewportPadding) {
                left = window.innerWidth - dialogRect.width - viewportPadding;
            }
            
            // Adjust vertical position to stay within viewport (if it goes off the top)
            if (top < viewportPadding) {
                top = viewportPadding;
            }

            setPosition({ top: top + window.scrollY, left: left + window.scrollX, arrow: 'bottom' });
        }, 500); 

        return () => clearTimeout(timer);
    }
    
}, [isTutorialOpen, isVisible, currentStep, steps]);


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
      <div 
          ref={dialogRef}
          className={cn(
              "fixed z-[102] w-[350px] transition-all duration-300 animate-in fade-in zoom-in-95",
              !isVisible && "opacity-0 pointer-events-none"
          )}
          style={{ top: `${position.top}px`, left: `${position.left}px` }}
          onClick={(e) => e.stopPropagation()}
      >
        <Card className="shadow-2xl relative">
            <div className={cn(
                "absolute h-4 w-4 rotate-45 bg-card border-border",
                position.arrow === 'top' && "-top-2 left-1/2 -translate-x-1/2 border-l border-t",
                position.arrow === 'bottom' && "-bottom-2 left-1/2 -translate-x-1/2 border-r border-b"
            )}></div>
             <CardHeader>
                <Button variant="ghost" size="icon" className="absolute right-2 top-2 h-6 w-6" onClick={handleClose}>
                    <X className="h-4 w-4"/>
                </Button>
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
                    <Button variant="outline" size="sm" onClick={handlePrev} disabled={currentStep === 0}>
                        <ChevronLeft className="mr-1 h-4 w-4" />
                        Anterior
                    </Button>
                    <Button size="sm" onClick={handleNext}>
                        {currentStep === steps.length - 1 ? "Finalizar" : "Próximo"}
                        <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                </div>
            </CardFooter>
          </Card>
      </div>
    </>
  );
}
