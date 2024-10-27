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
          <span>Bem-vindo ao Tech Tracks.</span>
          <span className="inline-block">
            Conecte-se usando uma das formas de login abaixo
          </span>
        </DialogDescription>

        <div className="space-y-3">
          <LoginButton loginProvider="google" />
          <LoginButton loginProvider="github" />
        </div>
      </DialogContent>
    </Dialog>
  );
}
