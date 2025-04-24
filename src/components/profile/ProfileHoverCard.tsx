import { ReactNode } from "react"
import { HoverCard } from "radix-ui";

interface ProfileHoverCardProps {
    children: ReactNode;
}

const ProfileHoverCard = ({ children }: ProfileHoverCardProps) => {
    return (
        <HoverCard.Root>
            <HoverCard.Trigger asChild>
                {children}
            </HoverCard.Trigger>
            <HoverCard.Portal>
                <HoverCard.Content className="bg-red-500">
                    profile hover card
                </HoverCard.Content>
            </HoverCard.Portal>
        </HoverCard.Root>
    );
}

export default ProfileHoverCard;