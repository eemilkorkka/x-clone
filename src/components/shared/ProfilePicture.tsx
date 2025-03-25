import Image from "next/image";
import defaultPfp from "../../assets/default-pfp.png";


interface ProfilePictureProps {
	image?: string;
	style?: string;
}

const ProfilePicture = ({ image, style }: ProfilePictureProps) => {
    return (
		<div className="max-w-[40px] max-h-[40px]">
			<Image 
				src={image ? image : defaultPfp} 
				alt="avatar"
				height={0} 
				width={0}
				unoptimized
				priority={true}
				className={`rounded-full w-full h-full ${style}`} 
			/>
		</div>
    );
}

export default ProfilePicture;