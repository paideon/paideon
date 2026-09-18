"use client";

import { useRef, useState, type ChangeEvent } from "react";

import { cn } from "../../utilities/cn";

export interface SliderProps {
  label?: string;
  name?: string;
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  showValue?: boolean;
  showMarks?: boolean;
  disabled?: boolean;
  className?: string;
  ref?: React.Ref<HTMLInputElement>;
}

export function Slider({
  label,
  name,
  min = 0,
  max = 100,
  step = 1,
  value,
  defaultValue = 50,
  onChange,
  showValue = true,
  showMarks = false,
  disabled = false,
  className,
  ref,
}: SliderProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const currentValue = value !== undefined ? value : internalValue;
  const percentage = ((currentValue - min) / (max - min)) * 100;
  const sliderRef = useRef<HTMLDivElement>(null);

  const handleChange = (newValue: number) => {
    const clamped = Math.min(max, Math.max(min, newValue));
    if (value === undefined) setInternalValue(clamped);
    onChange?.(clamped);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    let delta = 0;
    if (e.key === "ArrowRight" || e.key === "ArrowUp") delta = step;
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") delta = -step;
    if (e.key === "Home") delta = min - currentValue;
    if (e.key === "End") delta = max - currentValue;
    if (delta !== 0) {
      e.preventDefault();
      handleChange(currentValue + delta);
    }
  };

  return (
    <div className={cn("w-full", className)}>
      {/*
        Hidden native range input — mirrors the visual custom slider below so
        this component has a real ref target and `name`/`value` pair, the
        same way Checkbox/Toggle/Radio pair a sr-only native input with a
        custom visual. This is what actually makes `{...register('x')}` work;
        forwardRef alone on the outer div wouldn't give react-hook-form
        anything to read `.value` from.
      */}
      <input
        ref={ref}
        type="range"
        name={name}
        min={min}
        max={max}
        step={step}
        value={currentValue}
        disabled={disabled}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          handleChange(Number(e.target.value))
        }
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
      />
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-space-2">
          {label && (
            <label className="font-body text-label uppercase tracking-label text-text-primary">
              {label}
            </label>
          )}
          {showValue && (
            <span className="font-body text-label text-gold-base">
              {currentValue}
              {max === 100 ? "%" : ""}
            </span>
          )}
        </div>
      )}
      <div
        ref={sliderRef}
        className={cn(
          "relative w-full h-2 rounded-full bg-surface-deep",
          disabled ? "cursor-not-allowed opacity-40" : "cursor-pointer"
        )}
        onClick={(e) => {
          if (disabled) return;
          const rect = sliderRef.current?.getBoundingClientRect();
          if (rect) {
            const clickX = e.clientX - rect.left;
            const newValue = min + (clickX / rect.width) * (max - min);
            handleChange(Math.round(newValue / step) * step);
          }
        }}
      >
        <div
          className="absolute left-0 top-0 h-full bg-green-base rounded-full pointer-events-none"
          style={{ width: `${percentage}%` }}
        />
        <div
          role="slider"
          tabIndex={disabled ? -1 : 0}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={currentValue}
          aria-disabled={disabled}
          onKeyDown={handleKeyDown}
          className={cn(
            "absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white shadow-elevation-2",
            "focus-visible:outline-2 focus-visible:outline-gold-base focus-visible:outline-offset-2",
            disabled ? "cursor-not-allowed" : "cursor-pointer"
          )}
          style={{ left: `calc(${percentage}% - 8px)` }}
        />
      </div>
      {showMarks && (
        <div className="flex justify-between mt-space-2 px-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className="font-body text-caption text-text-muted">
              {min + (i * (max - min)) / 4}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
