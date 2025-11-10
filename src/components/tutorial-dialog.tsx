"use client";

import { useState, useEffect, useCallback } from "react";
import { useTutorial } from "@/context/tutorial-context";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./ui/dialog";
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

  useEffect(() => {
    if (isTutorialOpen) {
      const step = steps[currentStep];
      const targetElement = document.querySelector(step.target) as HTMLElement;
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
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
    <Dialog open={isTutorialOpen} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent className="sm:max-w-[425px]" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Tutorial</DialogTitle>
          <DialogDescription>
            Passo {currentStep + 1} de {steps.length}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p>{step?.content || "Carregando..."}</p>
        </div>
        <DialogFooter className="flex w-full justify-between">
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
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
