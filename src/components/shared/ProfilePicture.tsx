import Image from "next/image";
import defaultPfp from "../../assets/default-pfp.png";


interface ProfilePictureProps {
	image?: string;
	style?: string;
}

const ProfilePicture = ({ image, style }: ProfilePictureProps) => {
    return (
		<Image 
			src={image ? image : defaultPfp} 
			alt="avatar"
			height={40} 
			width={40}
			unoptimized
			priority={true}
			className={`rounded-full ${style}`} 
		/>
    );
}

export default ProfilePicture;