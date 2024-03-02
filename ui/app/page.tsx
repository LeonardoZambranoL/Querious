"use client"
import { Button, Container, Group, Image, Text } from "@mantine/core";
import classes from './page.module.css';
import {IconBulb, IconMessageCircle2, IconStackFront} from "@tabler/icons-react"
import { useRouter } from "next/navigation";

export default function Home() {

  const router = useRouter();

  return (
    <div className={classes.wrapper}>
      <Image src="./Rohde_Schwarz_Logo.png" className={classes.logo}/>
      <Container size={700} className={classes.inner}>
        <h1 className={classes.title}>
          Welcome to the{' '}
          <Text component="span" variant="gradient" gradient={{ from: 'blue', to: 'cyan' }} inherit className={classes.highlighted}>
            revolution
          </Text>{' '}
          of Log's
        </h1>

        <Text className={classes.description} color="dimmed">
        <IconMessageCircle2/>
          Chat with your Log-Files.
        </Text>

        <Text className={classes.description} color="dimmed">
          <IconStackFront/>
          Summarize them.
        </Text>

        <Text className={classes.description} color="dimmed">
          <IconBulb/>
          Understand them.
        </Text>

        <Group className={classes.controls}>
          <Button
            size="xl"
            className={classes.control}
            variant="gradient"
            gradient={{ from: 'blue', to: 'cyan' }}
            onClick={() => router.push("/dashboard")}
          >
            Get started
          </Button>
          
        </Group>
      </Container>
    </div>
  );
  /*
          <Button
            component="a"
            href="https://github.com/mantinedev/mantine"
            size="xl"
            variant="default"
            className={classes.control}
            leftSection={<GithubIcon size={20} />}
          >
            GitHub
          </Button>*/
}
