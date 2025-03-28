import { Avatar } from "radix-ui";

interface ProfilePictureProps {
  image: string | undefined;
  style?: string;
}

const ProfilePicture = ({ image, style }: ProfilePictureProps) => {
  	return (
    	<Avatar.Root className={`w-10 h-10 min-w-10 min-h-10 select-none overflow-hidden rounded-full bg-blackA1 ${style}`}>
			<Avatar.Image
				className="w-full h-full rounded-[inherit] object-cover"
				src={image}
				width={40}
				height={40}
				alt="Profile Picture"
			/>
			<Avatar.Fallback
				className="flex w-full h-full items-center justify-center bg-gray-400"
			/>
		</Avatar.Root>
  	);
}

export default ProfilePicture;
