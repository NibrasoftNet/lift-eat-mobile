import { Button, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { Pressable } from "@/components/ui/pressable";
import { useToast, Toast, ToastTitle, ToastDescription } from "@/components/ui/toast";
import { VStack } from "@/components/ui/vstack";
import { Icon, CloseIcon, HelpCircleIcon } from "@/components/ui/icon";
import React from "react";

export default function ToastTest() {
    const toast = useToast();
    const [toastId, setToastId] = React.useState(0);
    const handleToast = () => {
        // @ts-ignore
        if (!toast.isActive(toastId)) {
            showNewToast();
        }
    };
    const showNewToast = () => {
        const newId = Math.random();
        setToastId(newId);
        toast.show({
            // @ts-ignore
            id: newId,
            placement: 'top',
            duration: 3000,
            render: ({ id }) => {
                const uniqueToastId = "toast-" + id;
                return (
                    <Toast
                        action="error"
                        variant="outline"
                        nativeID={uniqueToastId}
                        className="p-4 gap-6 border-error-500 w-full shadow-hard-5 max-w-[443px] flex-row justify-between"
                    >
                        <HStack space="md">
                            <Icon
                                as={HelpCircleIcon}
                                className="stroke-error-500 mt-0.5"
                            />
                            <VStack space="xs">
                                <ToastTitle className="font-semibold text-error-500">Error!</ToastTitle>
                                <ToastDescription size="sm">
                                    Something went wrong.
                                </ToastDescription>
                            </VStack>
                        </HStack>
                        <HStack className="min-[450px]:gap-3 gap-1">
                            <Button variant="link" size="sm" className="px-3.5 self-center">
                                <ButtonText>Retry</ButtonText>
                            </Button>
                            <Pressable onPress={() => toast.close(id)}>
                                <Icon as={CloseIcon} />
                            </Pressable>
                        </HStack>
                    </Toast>
                );
            },
        });
    };
    return (
        <VStack className="size-full flex items-center justify-center">
            <Button onPress={handleToast}>
                <ButtonText>Press</ButtonText>
            </Button>
        </VStack>
);
}
