import { Heading } from "@/components/ui/heading";
import { VStack } from "@/components/ui/vstack";
import React from "react";
import {Link} from "expo-router";
import Feather from "@expo/vector-icons/Feather";

export default function PlanDetails() {
    return (
        <VStack>
            <Heading className="text-typography-900">Single plan Details</Heading>
            <Link href="/plans/my-plans" asChild>
                <Feather name="chevrons-left" size={24} color="black" />
            </Link>
        </VStack>
    );
}