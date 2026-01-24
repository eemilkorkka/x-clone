import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from "./ui/popover";

import {
    EmojiPicker,
    EmojiPickerContent,
    EmojiPickerFooter,
    EmojiPickerSearch
} from "./ui/emoji-picker";

interface EmojiPickerPopoverProps {
    children: React.ReactNode;
    onEmojiSelect: (emoji: string) => void;
}

export const EmojiPickerPopover = ({ children, onEmojiSelect }: EmojiPickerPopoverProps) => {
    return (
        <Popover>
            <PopoverTrigger nativeButton={false} render={
                <div>
                    {children}
                </div>
            }>
            </PopoverTrigger>
            <PopoverContent className="w-fit p-0">
                <EmojiPicker
                    className="h-[342px]"
                    onEmojiSelect={({ emoji }) => onEmojiSelect(emoji)}
                >
                    <EmojiPickerSearch />
                    <EmojiPickerContent />
                    <EmojiPickerFooter />
                </EmojiPicker>
            </PopoverContent>
        </Popover>
    )
}