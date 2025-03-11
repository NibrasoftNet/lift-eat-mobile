import {Card} from "@/components/ui/card";
import {Image, ImageSourcePropType} from "react-native";
import {VStack} from "@/components/ui/vstack";
import {Heading} from "@/components/ui/heading";
import {Text} from "@/components/ui/text";

type IntroCardProps = {
    title: string;
    description: string;
    imageUrl: ImageSourcePropType;
}

export const IntroCard = ({title, description, imageUrl}: IntroCardProps) => {
    return (
        <Card className="p-5 rounded-lg max-w-[360px] m-3">
            <Image
                source={imageUrl}
                className="w-full h-4/6"
                resizeMode="contain"
            />
            <VStack className="mb-6">
                <Heading className="text-3xl text-center mb-2 text-typography-700">
                    {title}
                </Heading>
                <Text className="text-md text-center">
                    {description}
                </Text>
            </VStack>
        </Card>
    )
}