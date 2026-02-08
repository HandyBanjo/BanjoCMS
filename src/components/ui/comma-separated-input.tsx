'use client';

import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";

interface CommaSeparatedInputProps {
    value: string[];
    onChange: (value: string[]) => void;
    placeholder?: string;
}

export function CommaSeparatedInput({ value, onChange, placeholder }: CommaSeparatedInputProps) {
    // Initialize local string state from the array
    const [inputValue, setInputValue] = useState(value?.join(', ') || '');

    // Sync from parent ONLY if the parent value changes significantly (e.g. initial load or external reset)
    // We avoid syncing if the parsed local value matches the parent to prevent cursor jumps or deleted commas
    useEffect(() => {
        const currentParsed = inputValue.split(',').map(s => s.trim()).filter(Boolean);
        const parentString = JSON.stringify(value || []);
        const localString = JSON.stringify(currentParsed);

        if (parentString !== localString) {
             setInputValue((value || []).join(', '));
        }
    }, [value]); // careful with dependency loop, relying on the check above

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setInputValue(newValue);

        // Parse and emit to parent
        const parsedArray = newValue.split(',').map(s => s.trim()).filter(Boolean);
        onChange(parsedArray);
    };

    return (
        <Input 
            value={inputValue}
            onChange={handleChange}
            placeholder={placeholder}
        />
    );
}
