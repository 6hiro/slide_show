import { useEffect, useRef, useState } from "react";

export const useMousePosition = () => {
    const isScrubbingRef = useRef<boolean>(false); // for Mouse Event
    const [isScrubbing, setIsScrubbing] = useState<boolean>(false);

    const [mousePosition, setMousePosition] = useState<{
        x: number | null, y: number | null, movementX: number | null, movementY: number | null
    }>({
        x: null,
        y: null,
        movementX: null,
        movementY: null
    });

    function handleMouseUp(e: React.MouseEvent<HTMLElement, MouseEvent> | MouseEvent) {
        if(isScrubbingRef){
            isScrubbingRef.current = false;
            setIsScrubbing(false);
        }
    };

    useEffect(() => {
        function handle(e: any) {
            if(isScrubbingRef.current ){
                setMousePosition({
                    x: e.pageX,
                    y: e.pageY,
                    movementX: e.movementX,
                    movementY: e.movementY
                })
            }
        }
        document.addEventListener('mousemove', handle);;
        return () => document.addEventListener('mousemove', handle)
    });

    return {
        isScrubbingRef,
        isScrubbing,
        setIsScrubbing,
        mousePosition,
        setMousePosition,
        handleMouseUp
    }
};