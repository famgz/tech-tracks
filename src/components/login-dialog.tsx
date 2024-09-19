import LoginGoogleButton from "@/components/buttons/login-google";
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

      <DialogContent className="gap-5">
        <DialogHeader>
          <DialogTitle>Faça login na plataforma</DialogTitle>
        </DialogHeader>

        <DialogDescription>
          Conecte-se usando sua conta do Google
        </DialogDescription>

        <LoginGoogleButton />
      </DialogContent>
    </Dialog>
  );
}
