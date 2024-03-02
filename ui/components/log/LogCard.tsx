"use client"
import { ActionIcon, Badge, Button, Card, Divider, Group, Image, Text, Tooltip } from "@mantine/core";
import { Log } from "../../entities/Log";
import classes from "./LogCard.module.css"
import { useRouter } from "next/navigation";
import { IconAdjustments, IconCpu, IconReplace } from "@tabler/icons-react";

type LogCardProps = {
    log: Log
}

export default function LogCard({log} : LogCardProps) {

    const router = useRouter();

    return (
        <Card withBorder radius="md" className={classes.card}>
            <Card.Section className={classes.imageSection}>
                <Image src="./logImage.png" alt="Log Image" />
            </Card.Section>
        
            <Group justify="space-between" mt="md">
                <div>
                <Text fw={500}>{log.description}</Text>
                <Text fz="xs" c="dimmed">
                    <b>{log.size}</b>
                    { " | " + log.fileName}
                </Text>
                </div>
                <Divider/>
            </Group>
            <Group justify="space-between" mt="md" gap={6}>
                <Button 
                    disabled={!log.isProcessed} 
                    radius="md" 
                    style={{ flex: 1 }} 
                    onClick={() => router.push(`/chat?log_id=${log.logId}`)}>
                    Chat with Log
                </Button>
                <Tooltip label="Refine">
                    <ActionIcon 
                        variant="filled" 
                        aria-label="Settings" 
                        h={36} 
                        w={36} 
                        radius="md" 
                        className={classes.actionButton}
                        onClick={() => router.push(`/refine?log_id=${log.logId}`)}>
                        <IconReplace stroke={1.5} />
                    </ActionIcon>
                </Tooltip>
            </Group>
        </Card>
      );
  }
  