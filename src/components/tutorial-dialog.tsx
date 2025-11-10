"use client";

import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { useTutorial } from "@/context/tutorial-context";
import { ChevronLeft, ChevronRight } from "lucide-react";

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

  const cleanupHighlight = () => {
    if (previousTargetRef.current) {
      previousTargetRef.current.classList.remove("tutorial-highlight");
    }
  };

  useEffect(() => {
    if (isTutorialOpen && steps.length > 0) {
      cleanupHighlight();
      
      const step = steps[currentStep];
      const targetElement = document.querySelector(step.target);
      
      if (targetElement) {
        targetElement.classList.add("tutorial-highlight");
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        previousTargetRef.current = targetElement;
      }
    } else {
      cleanupHighlight();
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
  
  if (!isTutorialOpen) {
    return null;
  }

  const step = steps[currentStep];

  return (
    <Dialog open={isTutorialOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Bem-vindo ao Puppy Assister!</DialogTitle>
           <DialogDescription>
            Passo {currentStep + 1} de {steps.length}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p>{step.content}</p>
        </div>
        <DialogFooter className="flex w-full justify-between">
            <Button variant="outline" onClick={handleClose}>
                Pular Tutorial
            </Button>
            <div className="flex gap-2">
                <Button variant="ghost" onClick={handlePrev} disabled={currentStep === 0}>
                    <ChevronLeft className="mr-1 h-4 w-4" />
                    Anterior
                </Button>
                <Button onClick={handleNext}>
                    {currentStep === steps.length - 1 ? "Finalizar" : "Próximo"}
                    <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
            </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
