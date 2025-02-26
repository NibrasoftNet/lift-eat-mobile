import { Heading } from "@/components/ui/heading";
import { VStack } from "@/components/ui/vstack";
import { Task } from "@/db/schema";
import { useSQLiteContext } from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";
import * as schema from '@/db/schema'
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import { useQuery } from "@tanstack/react-query";

export default function Progress() {
    const db = useSQLiteContext()
    const drizzleDb = drizzle(db, { schema })
    useDrizzleStudio(db);

    const tasks = useQuery({
        queryKey: ['tasks'],
        queryFn: async () => {
            const result: Task[] = await drizzleDb.query.tasks.findMany()
            console.log("List of tasks", result)
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


