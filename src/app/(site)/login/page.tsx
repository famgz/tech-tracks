import LoginGoogleButton from "@/components/buttons/login-google";

interface Props {
  searchParams: {
    redirect?: string;
  };
}

export default async function LoginPage({ searchParams }: Props) {
  const { redirect } = searchParams;

  return (
    <div className="_container flex-center bg-muted/60">
      <div className="w-full max-w-md rounded-lg bg-background">
        <div className="space-y-8 p-8 text-center shadow-lg">
          <div className="space-y-8">
            <h1 className="text-2xl font-semibold">Faça login na plataforma</h1>
            <p className="text-gray-500">Bem-vindo ao Tech Tracks</p>
          </div>

          <div className="mt-6 space-y-3">
            <p className="text-gray-500">
              Conecte-se usando sua conta do Google
            </p>
            <LoginGoogleButton redirect={redirect} />
          </div>
        </div>
      </div>
    </div>
  );
}
