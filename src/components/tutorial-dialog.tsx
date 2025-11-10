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
  const [position, setPosition] = useState({ top: 0, left: 0, arrow: 'top' });
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
      setIsVisible(true);
    } else {
      document.body.style.overflow = '';
      setIsVisible(false);
      cleanupHighlight();
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isTutorialOpen]);
  
  useEffect(() => {
    if (isTutorialOpen && steps.length > 0) {
      cleanupHighlight();
      
      const step = steps[currentStep];
      const targetElement = document.querySelector(step.target) as HTMLElement;
      
      if (targetElement) {
        targetElement.classList.add("tutorial-highlight");
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
        previousTargetRef.current = targetElement;
        
        // Timeout to wait for scroll to finish before calculating position
        const timer = setTimeout(() => {
            const targetRect = targetElement.getBoundingClientRect();
            const dialogWidth = 350; 
            const dialogHeight = 220; 
            const offset = 15;

            let top = targetRect.bottom + offset;
            let left = targetRect.left + (targetRect.width / 2) - (dialogWidth / 2);
            let arrow = 'top';

            // Flip to top if not enough space at the bottom
            if (top + dialogHeight > window.innerHeight) {
              top = targetRect.top - dialogHeight - offset;
              arrow = 'bottom';
            }
            // Adjust left position to stay within viewport
            if (left < offset) {
                left = offset;
            }
            if (left + dialogWidth > window.innerWidth - offset) {
                left = window.innerWidth - dialogWidth - offset;
            }

            setPosition({ top: top + window.scrollY, left: left + window.scrollX, arrow });
        }, 300); // Adjust delay as needed

        return () => clearTimeout(timer);
      }
    }
    
    return cleanupHighlight;
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
  
  if (!isTutorialOpen || !isVisible) {
    return null;
  }

  const step = steps[currentStep];

  return (
    <div className="fixed inset-0 z-[100]" onClick={handleClose}>
        <div 
            className={cn(
                "fixed z-[101] w-[350px] transition-all duration-300 animate-in fade-in zoom-in-95",
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
              <Button variant="ghost" size="icon" className="absolute right-2 top-2 h-6 w-6" onClick={handleClose}>
                  <X className="h-4 w-4"/>
              </Button>
              <CardHeader>
                  <CardTitle>Bem-vindo ao Puppy Assister!</CardTitle>
                  <CardDescription>
                      Passo {currentStep + 1} de {steps.length}
                  </CardDescription>
              </CardHeader>
              <CardContent>
                  <p>{step.content}</p>
              </CardContent>
              <CardFooter className="flex w-full justify-between">
                  <Button variant="ghost" size="sm" onClick={handleClose}>
                      Pular Tutorial
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
    </div>
  );
}
