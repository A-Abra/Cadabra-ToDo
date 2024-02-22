import React from "react";

/*
    PARAMS:
    value is the editor state on what is being passed/typed into the editor
    delay is how many ms to wait after finished typing to trigger save
*/
export function useDebounce(value: string, delay: number) {
    const [debouncedValue, setDebouncedValue] = React.useState(value);
    /* every time value changes dependent on wpm of user useEffect is called
    to set the debouncedValue to changed value of the user typing but is only
    set based on delay (e.g. within 700ms) but if its changed (e.g. type again in editor)
    within the 700ms we return clearTimeout to not set the DebouncedValue */
    React.useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}