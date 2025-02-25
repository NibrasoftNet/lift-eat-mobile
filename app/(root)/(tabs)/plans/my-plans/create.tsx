import { Heading } from "@/components/ui/heading";
import { VStack } from "@/components/ui/vstack";
import { Link } from "expo-router";

import React from "react";
import Feather from '@expo/vector-icons/Feather';
export default function Create() {
    return (
        <VStack>
            <Heading className="text-typography-900">New plan Creation</Heading>
            <Link href="/plans/my-plans" asChild>
                <Feather name="chevrons-left" size={24} color="black" />
            </Link>
        </VStack>
    );
}