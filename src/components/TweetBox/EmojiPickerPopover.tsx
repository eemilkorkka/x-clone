import { Popover } from "radix-ui";
import { ReactNode } from "react";
import EmojiPicker, { EmojiClickData, EmojiStyle } from 'emoji-picker-react';

interface EmojiPickerPopoverProps {
    children: ReactNode;
    onEmojiClick: (emoji: EmojiClickData) => void;
}

const EmojiPickerPopover = ({ children, onEmojiClick }: EmojiPickerPopoverProps) => {
    return (
        <Popover.Root>
            <Popover.Trigger asChild>
                {children}
            </Popover.Trigger>
		    <Popover.Anchor />
            <Popover.Portal>
                <Popover.Content side="bottom" align="center" sideOffset={20} className="w-fit flex flex-col shadow-[0_3px_10px_rgb(0,0,0,0.2)] rounded-xl overflow-y-auto bg-white z-20">
                    <EmojiPicker onEmojiClick={(emoji) => onEmojiClick(emoji)} emojiStyle={EmojiStyle.TWITTER} />
                    <Popover.Arrow fill="white" />
                </Popover.Content>
            </Popover.Portal>
	    </Popover.Root>
    );
}

export default EmojiPickerPopover;