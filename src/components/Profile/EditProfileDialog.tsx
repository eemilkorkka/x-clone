"use client";
import React from "react";
import { ReactNode, useState, ChangeEvent, Dispatch, SetStateAction, useRef } from "react";
import { Dialog, VisuallyHidden } from "radix-ui";
import { IoClose } from "react-icons/io5";
import Button from "../Shared/Button";
import ProfilePicture from "./ProfilePicture";
import FormInput from "../Form/FormInput";
import formDataType from "@/types/formDataType";
import ProfileBanner from "./ProfileBanner";
import Icon from "../TweetBox/Icon";
import { TbCameraPlus } from "react-icons/tb";
import { uploadFiles } from "@/utils/utilFunctions";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Dropdown from "../Shared/Dropdown";
import { dropdownFields } from "@/utils/birthDateDropdowns";

interface EditProfileDialogProps {
    children: ReactNode;
    initialState: formDataType;
    formData: formDataType;
    setFormData: Dispatch<SetStateAction<formDataType>>;
}

const EditProfileDialog = ({ children, initialState, formData, setFormData }: EditProfileDialogProps) => {
    const [open, setOpen] = useState<boolean>(false);
    const router = useRouter();
    const { data: session, update } = useSession();
    const [localFormData, setLocalFormData] = useState<formDataType>(formData);
    const [preview, setPreview] = useState<{ profilePicture: string; coverPicture: string }>({
        profilePicture: initialState.profilePicture,
        coverPicture: initialState.coverPicture
    });

    const profilePicturePickerRef = useRef<HTMLInputElement | null>(null);
    const coverPicturePickerRef = useRef<HTMLInputElement | null>(null);

    const onInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        console.log(name);

        setLocalFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value
        }));
    }

    const formInputs = [
        {
            type: "text",
            name: "name",
            label: "Name",
            style: "border-gray-300",
            maxLength: 50,
            onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onInputChange(e)
        },
        {
            name: "bio",
            label: "Bio",
            style: "border-gray-300",
            isTextArea: true,
            maxLength: 160,
            onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onInputChange(e)
        },
        {
            name: "location",
            label: "Location",
            style: "border-gray-300",
            maxLength: 30,
            onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onInputChange(e)
        },
        {
            name: "website",
            label: "Website",
            style: "border-gray-300",
            maxLength: 100,
            onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onInputChange(e)
        }
    ];

    const handleCoverPictureRemove = () => {
        setLocalFormData((prev) => ({ ...prev, coverPicture: "" }));
        setPreview((prev) => ({ ...prev, coverPicture: "" }));
        if (coverPicturePickerRef.current) coverPicturePickerRef.current.value = "";
    }

    const saveProfileChanges = async () => {
        let updatedFormData = { ...localFormData };

        if (preview.profilePicture !== initialState.profilePicture ||
            preview.coverPicture !== initialState.coverPicture
        ) {
            const keys: string[] = [];
            const filesToUpload: { url: string; file: File }[] = [];

            const profilePictureChanged = preview.profilePicture !== initialState.profilePicture;
            const coverPictureChanged = preview.coverPicture !== initialState.coverPicture;
            const formDataToUpload = new FormData();

            if (!profilePicturePickerRef.current?.files || !coverPicturePickerRef.current?.files) return;

            if (profilePictureChanged && coverPictureChanged && profilePicturePickerRef.current?.files[0] && coverPicturePickerRef.current?.files[0]) {
                filesToUpload.push(
                    { url: preview.profilePicture, file: profilePicturePickerRef.current?.files[0] },
                    { url: preview.coverPicture, file: coverPicturePickerRef.current?.files![0] }
                );
                keys.push("profilePicture", "coverPicture");
            } else if (profilePictureChanged && profilePicturePickerRef.current?.files[0]) {
                filesToUpload.push({ url: preview.profilePicture, file: profilePicturePickerRef.current?.files[0] });
                keys.push("profilePicture");
            } else if (coverPictureChanged && coverPicturePickerRef.current?.files[0]) {
                filesToUpload.push({ url: preview.coverPicture, file: coverPicturePickerRef.current?.files[0] });
                keys.push("coverPicture");
            }

            if (filesToUpload.length > 0) {
                const uploadResponse = await uploadFiles(filesToUpload, formDataToUpload);

                if (uploadResponse?.urls) {
                    const updatedFields: Record<string, string> = {};
                    uploadResponse.urls.forEach((url: { url: string }, i: number) => {
                        updatedFields[keys[i]] = url.url;
                    });

                    updatedFormData = {
                        ...updatedFormData,
                        ...updatedFields
                    };

                    setLocalFormData(updatedFormData);
                }
            }
        }

        const response = await fetch("/api/profile/edit", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                formData: updatedFormData
            })
        });

        const json = await response.json();

        if (response.ok) {
            await update();
            setFormData(updatedFormData);
            toast.success(json.message, {
                style: {
                    background: "#1D9BF0",
                    color: "white"
                }
            });
            router.refresh();
        } else {
            toast.error(json.message, {
                style: {
                    background: "#1D9BF0",
                    color: "white"
                }
            });
        }

        setOpen(false);
    }

    const handleDialogOpenChange = () => {
        setLocalFormData(initialState);
        setPreview({ profilePicture: initialState.profilePicture, coverPicture: initialState.coverPicture });
    }

    return (
        <Dialog.Root open={open} onOpenChange={handleDialogOpenChange}>
            <Dialog.Trigger asChild onClick={() => setOpen(true)}>
                {children}
            </Dialog.Trigger>
            <Dialog.Overlay className="fixed inset-0 bg-gray-700/50 z-20" onClick={() => setOpen(false)} />
            <Dialog.Content className="flex flex-col w-full h-full sm:h-fit sm:max-h-[78vh] top-0 sm:w-[600px] bg-white z-20 fixed left-1/2 sm:top-20 -translate-x-1/2 sm:rounded-2xl overflow-hidden">
                <VisuallyHidden.Root>
                    <Dialog.Title />
                </VisuallyHidden.Root>
                <div className="sticky top-0 z-10 bg-white/90 p-2 backdrop-blur-sm flex justify-between">
                    <div className="flex gap-4 items-center">
                        <Dialog.Close asChild className="hover:cursor-pointer text-gray-700">
                            <button className="rounded-full p-1.5 hover:bg-gray-200 outline-0" onClick={() => setOpen(false)}>
                                <IoClose size={23} />
                            </button>
                        </Dialog.Close>
                        <span className="font-bold text-xl">Edit profile</span>
                    </div>
                    <Button style="text-sm px-4 pt-2 pb-2 border-gray-300!" variant="black" onClick={saveProfileChanges}>
                        Save
                    </Button>
                </div>
                <div className="h-full overflow-y-auto p-2">
                    <div className="-m-2">
                        <ProfileBanner image={preview.coverPicture || localFormData.coverPicture}>
                            <div className="flex gap-4 absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 text-gray-500 text-sm">
                                <Icon onClick={() => coverPicturePickerRef.current?.click()} style="text-white! bg-black/50 hover:bg-gray-900/50!">
                                    <TbCameraPlus size={22} />
                                    <input
                                        type="file"
                                        className="hidden"
                                        ref={coverPicturePickerRef}
                                        onChange={() => setPreview((prev) => ({ ...prev, coverPicture: URL.createObjectURL(coverPicturePickerRef.current?.files![0]!) }))}
                                        multiple
                                        accept="image/*"
                                    />
                                </Icon>
                                {preview.coverPicture && (
                                    <Icon onClick={() => handleCoverPictureRemove()} style="text-white! bg-black/50 hover:bg-gray-900/50!">
                                        <IoClose size={22} />
                                    </Icon>
                                )}
                            </div>
                        </ProfileBanner>
                        <div className="relative w-[100px] h-[100px] mobile:w-[133px] mobile:h-[133px]">
                            <ProfilePicture image={preview.profilePicture || localFormData.profilePicture} style="w-full h-full absolute left-4 -translate-y-1/2 border-4 border-white bg-white" />
                            <div className="absolute left-12 mobile:left-16 -top-4">
                                <Icon onClick={() => profilePicturePickerRef.current?.click()} style="text-gray-300! hover:bg-gray-200/10!">
                                    <TbCameraPlus size={22} />
                                    <input
                                        type="file"
                                        className="hidden"
                                        ref={profilePicturePickerRef}
                                        onChange={() => setPreview((prev) => ({ ...prev, profilePicture: URL.createObjectURL(profilePicturePickerRef.current?.files![0]!) }))}
                                        multiple
                                        accept="image/*"
                                    />
                                </Icon>
                            </div>
                        </div>
                    </div>
                    <form className="flex flex-col gap-8 p-2 -mt-10 mobile:-mt-15">
                        {formInputs.map((input, index) => {
                            return (
                                <React.Fragment key={index}>
                                    <FormInput
                                        type={input.type}
                                        name={input.name}
                                        label={input.label}
                                        formData={localFormData}
                                        style={input.style}
                                        maxLength={input.maxLength}
                                        isTextArea={input.isTextArea}
                                        onChange={input.onChange}
                                    />
                                </React.Fragment>
                            )
                        })}
                        <div className="flex gap-2">
                            {dropdownFields.map((dropdown, index) => {
                                return (
                                    <div key={index} className={dropdown.style}>
                                        <Dropdown
                                            name={dropdown.name}
                                            data={dropdown.data}
                                            label={dropdown.label}
                                            formData={formData}
                                            value={localFormData[dropdown.name]}
                                            bgColor="bg-white"
                                            borderColor={"border-gray-300"}
                                            onChange={onInputChange}
                                        />
                                    </div>
                                )
                            })}
                        </div>
                    </form>
                </div>
            </Dialog.Content>
        </Dialog.Root>
    );
}

export default EditProfileDialog;