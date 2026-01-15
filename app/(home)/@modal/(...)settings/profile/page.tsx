"use client";

import { CustomInput } from "@/components/customized/CustomInput";
import { CustomTextarea } from "@/components/customized/CustomTextarea";
import { ProfileBanner } from "@/components/Profile/ProfileBanner";
import { Button } from "@/components/ui/button";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";

import { Field, FieldGroup } from "@/components/ui/field";
import { CustomAvatar } from "@/components/User/CustomAvatar";
import { useFilePicker } from "@/hooks/useFilePicker";
import { authClient } from "@/lib/auth-client";
import { getQueryClient } from "@/lib/getQueryClient";
import { toastMessage } from "@/lib/toast";
import { zodResolver } from "@hookform/resolvers/zod";

import { useRouter } from "next/navigation";
import { useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { IoClose } from "react-icons/io5";
import { TbCameraPlus } from "react-icons/tb";
import z from "zod";

const formSchema = z.object({
    displayName: z.string().max(50).min(0).optional(),
    bio: z.string().max(160).min(0).optional(),
    location: z.string().max(30).min(0).optional(),
    website: z.string().max(100).min(0).optional(),
});

export default function ComposeModal() {
    const router = useRouter();
    const { data: sessionData } = authClient.useSession();

    const profilePictureRef = useRef<HTMLInputElement | null>(null);
    const profileBannerRef = useRef<HTMLInputElement | null>(null);
    const profilePicturePicker = useFilePicker(1);
    const profileBannerPicker = useFilePicker(1);

    const queryClient = getQueryClient();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            displayName: sessionData?.user.displayUsername ?? "",
            bio: sessionData?.user.bio ?? "",
            location: sessionData?.user.location ?? "",
            website: sessionData?.user.website ?? "",
        }
    });

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            const result = await authClient.updateUser({
                image: profilePicturePicker.pickedFiles[0]?.url,
                profileBannerImage: profileBannerPicker.pickedFiles[0]?.url,
                displayUsername: data.displayName,
                bio: data.bio,
                location: data.location,
                website: data.website,
            });

            if (!result.error) {
                toastMessage("Profile updated successfully!", true);
                queryClient.invalidateQueries({ queryKey: ["user", sessionData?.user.username] });
                router.refresh();
                router.back();
            } else {
                toastMessage(result.error.message ?? "Failed to update profile", false);
            }
        } catch (error) {
            toastMessage("Something went wrong. Try again later.", false);
        }
    }

    const handleOpenChange = () => {
        router.back();
    }

    const displayName = form.watch("displayName");
    const bio = form.watch("bio");
    const location = form.watch("location");
    const website = form.watch("website");

    return (
        <Dialog open={true} onOpenChange={handleOpenChange}>
            <DialogContent className="!max-w-[600px] p-0 !rounded-2xl h-full sm:max-h-[650px] flex flex-col sm:rounded-xl ring-0 gap-0 overflow-hidden" showCloseButton={false}>
                <div className="overflow-y-auto">
                    <DialogHeader className="flex flex-row justify-between p-2">
                        <div className="flex gap-6 items-center">
                            <Button size="icon-lg" variant="ghost" className="rounded-full hover:cursor-pointer hover:bg-black/10" onClick={handleOpenChange}>
                                <IoClose className="size-6" />
                            </Button>
                            <DialogTitle className="text-xl font-bold">Edit profile</DialogTitle>
                        </div>
                        <Button className="rounded-full font-bold px-4 hover:cursor-pointer" onClick={() => form.handleSubmit(onSubmit)()}>Save</Button>
                    </DialogHeader>
                    <ProfileBanner src={profileBannerPicker.pickedFiles.length > 0 ? profileBannerPicker.pickedFiles[0].url : (sessionData?.user.profileBannerImage ?? "")} styles="brightness-90">
                        <div className="absolute -bottom-15 z-50 left-4 rounded-full border-white border-4">
                            <CustomAvatar src={profilePicturePicker.pickedFiles.length > 0 ? profilePicturePicker.pickedFiles[0].url : (sessionData?.user.image ?? "")} alt={``} size="xl" styles="brightness-90" useLink={false}>
                                <Button size="icon-lg" className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 z-50 rounded-full hover:cursor-pointer bg-black/10 hover:bg-white/10" onClick={() => profilePictureRef.current?.click()}>
                                    <TbCameraPlus className="size-5" />
                                </Button>
                            </CustomAvatar>
                        </div>
                        <div className="flex gap-4 absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2">
                            <Button size="icon-lg" className="rounded-full hover:cursor-pointer bg-black/50 hover:bg-black/45" onClick={() => profileBannerRef.current?.click()}>
                                <TbCameraPlus className="size-5" />
                            </Button>
                            <Button size="icon-lg" className="rounded-full hover:cursor-pointer bg-black/50 hover:bg-black/45" onClick={handleOpenChange}>
                                <IoClose fill="white" className="size-5" />
                            </Button>
                        </div>
                    </ProfileBanner>
                    <form className="mt-15 p-4">
                        <input type="file" name="profilePicture" ref={profilePictureRef} className="hidden" onChange={profilePicturePicker.handleFileAdd} />
                        <input type="file" name="profileBanner" ref={profileBannerRef} className="hidden" onChange={profileBannerPicker.handleFileAdd} />
                        <FieldGroup>
                            <Controller
                                name="displayName"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field>
                                        <CustomInput
                                            {...field}
                                            type="text"
                                            label="Name"
                                            value={displayName ?? ""}
                                            maxLength={50}
                                            fieldState={fieldState}
                                            styles="text-black border-gray-300 shadow-none"
                                        />
                                    </Field>
                                )}
                            />
                            <Controller
                                name="bio"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field>
                                        <CustomTextarea
                                            {...field}
                                            label="Bio"
                                            value={bio ?? ""}
                                            maxLength={160}
                                            fieldState={fieldState}
                                            styles="text-black border-gray-300 shadow-none resize-none"
                                        />
                                    </Field>
                                )}
                            />
                            <Controller
                                name="location"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field>
                                        <CustomInput
                                            {...field}
                                            type="text"
                                            label="Location"
                                            value={location ?? ""}
                                            maxLength={30}
                                            fieldState={fieldState}
                                            styles="text-black border-gray-300 shadow-none"
                                        />
                                    </Field>
                                )}
                            />
                            <Controller
                                name="website"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field>
                                        <CustomInput
                                            {...field}
                                            type="text"
                                            label="Website"
                                            value={website ?? ""}
                                            maxLength={30}
                                            fieldState={fieldState}
                                            styles="text-black border-gray-300 shadow-none"
                                        />
                                    </Field>
                                )}
                            />
                        </FieldGroup>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    )
}