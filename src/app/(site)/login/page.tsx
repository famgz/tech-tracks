import LoginButton from "@/components/buttons/login";

interface Props {
  searchParams: {
    redirect?: string;
  };
}

export default async function LoginPage({ searchParams }: Props) {
  const { redirect } = searchParams;

  return (
    <div className="flex-center flex-1 bg-muted">
      <div className="max-w-xl flex-1 rounded-lg bg-background">
        <div className="space-y-8 p-8 text-center shadow-lg">
          <div className="space-y-4">
            <h1 className="text-2xl font-semibold">Faça login na plataforma</h1>
            <div className="space-y-2 text-gray-500">
              <p>Bem-vindo ao Tech Tracks</p>
              <p>Conecte-se usando uma das forma de login abaixo</p>
            </div>
          </div>

          <div className="space-y-6">
            <LoginButton redirect={redirect} loginProvider="google" />
            <LoginButton redirect={redirect} loginProvider="github" />
          </div>
        </div>
      </div>
    </div>
  );
}
