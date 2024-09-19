import { login } from "@/actions/auth";
import GoogleIcon from "@/components/icons/google";
import { Button } from "@/components/ui/button";

export default function LoginGoogleButton() {
  return (
    <form action={login} className="flex items-center justify-between">
      <Button
        className="flex w-full items-center gap-2"
        variant={"outline"}
        type={"submit"}
      >
        <GoogleIcon className="size-4" />
        <span className="font-bold">Google</span>
      </Button>
    </form>
  );
}
