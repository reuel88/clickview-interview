import {Button} from "@/components/ui/button.tsx";
import React from "react";

function App() {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        alert("Hello World");
    }

    return (
        <>
            <div className="flex justify-center items-center min-h-screen">

                <div className="mx-auto max-w-7xl">
                    <Button type="button" onClick={handleClick}>
                        Click
                    </Button>
                </div>
            </div>
        </>
    )
}

export default App
