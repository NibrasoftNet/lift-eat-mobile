import { Button, ButtonText } from "@/components/ui/button";
import { Drawer, DrawerBackdrop, DrawerContent, DrawerHeader, DrawerBody, DrawerFooter } from "@/components/ui/drawer";
import { Heading } from "@/components/ui/heading";
import React, { Dispatch, SetStateAction } from "react";
import { OtpInput } from "react-native-otp-entry";

export default function AuthDrawer({ showDrawer, setShowDrawer }: { showDrawer: boolean, setShowDrawer: Dispatch<SetStateAction<boolean>> }) {
    return (
        <Drawer
            isOpen={showDrawer}
            onClose={() => {
                setShowDrawer(false);
            }}
            size="md" anchor="bottom"
        >
            <DrawerBackdrop />
            <DrawerContent>
                <DrawerHeader>
                    <Heading size="xl" className='text-center w-full'>Enter the otp send to your mailbox</Heading>
                </DrawerHeader>
                <DrawerBody>
                    <OtpInput
                        numberOfDigits={6}
                        focusColor="green"
                        autoFocus={false}
                        hideStick={true}
                        placeholder="******"
                        blurOnFilled={true}
                        disabled={false}
                        type="numeric"
                        secureTextEntry={false}
                        focusStickBlinkingDuration={500}
                        onFocus={() => console.log("Focused")}
                        onBlur={() => console.log("Blurred")}
                        onTextChange={(text) => console.log(text)}
                        onFilled={(text) => console.log(`OTP is ${text}`)}
                        textInputProps={{
                            accessibilityLabel: "One-Time Password",
                        }}
                    />
                </DrawerBody>
                <DrawerFooter>
                    <Button
                        onPress={() => {
                            setShowDrawer(false);
                        }}
                        className="flex-1"
                    >
                        <ButtonText>Submit</ButtonText>
                    </Button>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
};