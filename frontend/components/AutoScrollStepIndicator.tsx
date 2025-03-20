import React, { useEffect, useRef } from "react";
import { CheckCircleIcon } from "lucide-react";

const StepIndicator = ({ steps, currentStep, isStepComplete }) => {
  // Create refs for the container and the active step
  const scrollContainerRef = useRef(null);
  const activeStepRef = useRef(null);

  // Use useEffect to scroll when currentStep changes
  useEffect(() => {
    if (scrollContainerRef.current && activeStepRef.current) {
      const container = scrollContainerRef.current;
      const activeElement = activeStepRef.current;

      // Calculate positions
      const containerRect = container.getBoundingClientRect();
      const activeRect = activeElement.getBoundingClientRect();

      // Check if the active element is outside the visible area
      const isVisible =
        activeRect.left >= containerRect.left &&
        activeRect.right <= containerRect.right;

      if (!isVisible) {
        // Calculate scroll position to center the active step
        const scrollLeft =
          activeElement.offsetLeft -
          container.clientWidth / 2 +
          activeElement.offsetWidth / 2;

        // Smooth scroll to the position
        container.scrollTo({
          left: scrollLeft,
          behavior: "smooth",
        });
      }
    }
  }, [currentStep]);

  return (
    <div className="p-4 bg-[#122a46] border-b border-[#1e3a5e]">
      <div ref={scrollContainerRef} className="flex overflow-x-auto">
        {steps.map((step, index) => (
          <div
            key={index}
            ref={currentStep === index ? activeStepRef : null}
            className="flex items-center min-w-max"
          >
            {index > 0 && <div className="w-8 h-px bg-[#1e3a5e]"></div>}
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                currentStep === index
                  ? "bg-blue-500 text-white"
                  : isStepComplete(index)
                  ? "bg-green-500 text-white"
                  : "bg-[#1e3a5e] text-blue-200"
              }`}
            >
              {isStepComplete(index) ? (
                <CheckCircleIcon size={16} />
              ) : (
                index + 1
              )}
            </div>
            <div className="ml-2 mr-4">
              <div className="text-sm font-medium text-blue-200">
                {step.name}
              </div>
              <div className="text-xs text-blue-300 opacity-70">
                {step.description}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepIndicator;
