"use server";

import { login } from "@/actions/auth";
import GoogleIcon from "@/components/icons/google";
import { Button } from "@/components/ui/button";
import { LoginProvider } from "@/types/auth";
import { GitHubLogoIcon } from "@radix-ui/react-icons";

interface Props {
  redirect?: string;
  loginProvider: LoginProvider;
}

function getLoginProviderIcon(loginProvider: LoginProvider) {
  switch (loginProvider) {
    case "google":
      return GoogleIcon;
    case "github":
      return GitHubLogoIcon;
  }
}

export default async function LoginButton({ redirect, loginProvider }: Props) {
  const Icon = getLoginProviderIcon(loginProvider);

  return (
    <form action={login} className="flex items-center justify-between">
      <input type="hidden" name="redirect" value={redirect} />
      <input type="hidden" name="login-provider" value={loginProvider} />
      <Button
        className="flex w-full items-center gap-2"
        variant={"outline"}
        type={"submit"}
      >
        <Icon className="size-4" />
        <span className="font-bold">
          Login com <span className="capitalize">{loginProvider}</span>
        </span>
      </Button>
    </form>
  );
}
