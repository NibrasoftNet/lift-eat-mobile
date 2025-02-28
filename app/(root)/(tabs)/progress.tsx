import { Heading } from "@/components/ui/heading";
import { VStack } from "@/components/ui/vstack";
import { User } from "@/db/schema";
import { useSQLiteContext } from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";
import * as schema from '@/db/schema'
import { useQuery } from "@tanstack/react-query";

export default function Progress() {
    const db = useSQLiteContext()
    const drizzleDb = drizzle(db, { schema })

    const users = useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const result: User[] = await drizzleDb.query.users.findMany()
            console.log("List of users", result)
            return {
                status: 200,
                result: result,
            }
        },
    });

    return (
    <VStack>
      <Heading className="text-typography-900">Coming soon</Heading>
    </VStack>
  );
}


