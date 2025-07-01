import Link from "next/link";
import { Avatar } from "radix-ui";
import ProfileHoverCard from "../Profile/ProfileHoverCard";

interface ProfilePictureProps {
  image: string | undefined;
  username?: string;
  showProfileHoverCard?: boolean;
  style?: string;
  href?: string;
}

const ProfilePicture = ({ image, username, style, href, showProfileHoverCard }: ProfilePictureProps) => {
  
  const avatarImage = (
    <Avatar.Image
      className="w-full h-full rounded-[inherit] object-cover relative"
      src={image}
      width={40}
      height={40}
      alt="Profile Picture"
    />
  );

  const avatarRoot = (
    <Avatar.Root className={`w-10 h-10 min-w-10 min-h-10 select-none overflow-hidden rounded-full bg-blackA1 ${style}`}>
      {href ? (
        <Link href={href} onClick={(e) => e.stopPropagation()} className="rounded-full">
          {avatarImage}
        </Link>
      ) : (
        avatarImage
      )}
      <Avatar.Fallback
        className="flex w-full h-full items-center justify-center bg-gray-100"
      />
    </Avatar.Root>
  );

  if (!showProfileHoverCard || !username) {
    return avatarRoot;
  }

  return (
    <ProfileHoverCard username={username}>
      {avatarRoot}
    </ProfileHoverCard>
  );
}

export default ProfilePicture;