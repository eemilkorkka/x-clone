"use client";
import React from "react";
import { ReactNode, useState, ChangeEvent } from "react";
import { Dialog, VisuallyHidden } from "radix-ui";
import { IoClose } from "react-icons/io5";
import Button from "../Shared/Button";
import ProfilePicture from "./ProfilePicture";
import { Session } from "next-auth";
import FormInput from "../Form/FormInput";
import formDataType from "@/types/formDataType";

interface EditProfileDialogProps {
    children: ReactNode;
    session: Session | null;
    displayName?: string;
    bio?: string;
    location?: string;
}

const EditProfileDialog = ({ children, session, displayName, bio, location }: EditProfileDialogProps) => {

    const initialState = {
        name: displayName ?? "",
        bio: bio ?? "",
        location: location ?? ""
    };

    const [open, setOpen] = useState<boolean>(false);
    const [formData, setFormData] = useState<formDataType>({
        name: initialState.name,
        bio: initialState.bio,
        location: initialState.location
    });

    const onInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value
        }));
    }

    const formInputs = [
        {
            type: "text",
            name: "name",
            label: "Name",
            style: "border-gray-400",
            onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onInputChange(e)
        },
        {
            name: "bio",
            label: "Bio",
            style: "border-gray-400",
            isTextArea: true,
            onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onInputChange(e)
        },
        {
            name: "location",
            label: "Location",
            style: "border-gray-400",
            onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onInputChange(e)
        }
    ];

    return (
        <Dialog.Root onOpenChange={() => setFormData(initialState)}>
            <Dialog.Trigger asChild onClick={() => setOpen(true)}>
                {children}
            </Dialog.Trigger>
            <Dialog.Overlay className="fixed inset-0 bg-gray-700/50 z-20" />
            <Dialog.Content className="p-2 flex flex-col gap-4 w-full h-full sm:h-fit sm:max-h-[90vh] top-0 sm:w-[600px] bg-white z-20 fixed left-1/2 sm:top-13 -translate-x-1/2 sm:rounded-2xl overflow-hidden">
                <VisuallyHidden.Root>
                    <Dialog.Title />
                </VisuallyHidden.Root>
                <div className="flex justify-between">
                    <div className="flex gap-4 items-center">
                        <Dialog.Close asChild className="hover:cursor-pointer text-gray-700">
                            <button className="rounded-full p-1.5 hover:bg-gray-200 outline-0" onClick={() => setOpen(false)}>
                                <IoClose size={23} />
                            </button>
                        </Dialog.Close>
                        <span className="font-bold text-xl">Edit profile</span>
                    </div>
                    <Button style="text-sm px-4 pt-2 pb-2 border-gray-300!" variant="black">
                        Save
                    </Button>
                </div>
                <div className="relative -m-2">
                    <div className="bg-red-500 w-full h-45"></div>
                    <div className="w-full h-full max-w-30 max-h-30 absolute left-4 -translate-y-1/2 border-4 border-white rounded-full">
                        <ProfilePicture
                            image={session?.user.image}
                        />
                    </div>
                </div>
                <form className="flex flex-col gap-4 p-2 mt-18">
                    {formInputs.map((input, index) => {
                        return (
                            <React.Fragment key={index}>
                                <FormInput
                                    type={input.type}
                                    name={input.name}
                                    label={input.label}
                                    formData={formData}
                                    style={input.style}
                                    isTextArea={input.isTextArea}
                                    onChange={input.onChange}
                                />
                            </React.Fragment>
                        )
                    })}
                </form>
            </Dialog.Content>
        </Dialog.Root>
    );
}

export default EditProfileDialog;