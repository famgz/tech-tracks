import LoginButton from "@/components/buttons/login";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Props {
  children: React.ReactNode;
}

export default function LoginDialog({ children }: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="gap-6">
        <DialogHeader>
          <DialogTitle>Faça login na plataforma</DialogTitle>
        </DialogHeader>

        <DialogDescription className="space-y-2">
          <p>Bem-vindo ao Tech Tracks.</p>
          <p>Conecte-se usando uma das forma de login abaixo</p>
        </DialogDescription>

        <LoginButton loginProvider="google" />

        <LoginButton loginProvider="github" />
      </DialogContent>
    </Dialog>
  );
}
