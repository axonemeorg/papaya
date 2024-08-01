'use client'

import ColorPicker from "@/components/color/ColorPicker";
import IconPicker from "@/components/icon/IconPicker";


export default function TestPage() {
    return (
        <div>
            <ColorPicker
                open={true}
                onClose={() => {}}
            />
            <IconPicker />
        </div>
    )
}
