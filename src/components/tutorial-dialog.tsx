"use client";

import { useState } from "react";
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
  
  const step = steps[currentStep];
  
  // This logic is tricky. We need to find the element and position the dialog relative to it.
  // For simplicity, we'll just show a centered dialog.
  // A more advanced implementation would use a library like Shepherd.js or Intro.js
  // and get the element's position with getBoundingClientRect().

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
        <DialogFooter className="flex justify-between w-full">
            <Button variant="outline" onClick={handleClose}>
                Pular Tutorial
            </Button>
            <div className="flex gap-2">
                <Button variant="ghost" onClick={handlePrev} disabled={currentStep === 0}>
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Anterior
                </Button>
                <Button onClick={handleNext}>
                    {currentStep === steps.length - 1 ? "Finalizar" : "Próximo"}
                    <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
            </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
