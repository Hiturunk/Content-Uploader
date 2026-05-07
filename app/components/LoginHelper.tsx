import { useSubmit } from "@remix-run/react";
import { useEffect } from "react";
import { useAccount } from "wagmi";

export function LoginHelper({
  userId,
  directory,
  hasError,
}: {
  userId: string;
  directory: string | null;
  hasError: boolean;
}) {
  const { address, isConnected } = useAccount();

  const submit = useSubmit();

  useEffect(() => {
    if (hasError) {
      submit(null, { method: "post", action: "/logout" });
    }
  }, [hasError, submit]);

  useEffect(() => {
    if (!address || !isConnected || !userId) {
      return;
    }
    if (address === directory) {
      return;
    }
    // update user only if wallet is connected and address differs from the existing user directory
    console.log({ isConnected, userId, address, directory });

    const formData = new FormData();

    formData.append("address", address as string);
    formData.append("userId", userId);

    submit(formData, {
      preventScrollReset: true,
      method: "post",
      action: "/updateUserDirectory",
    });
  }, [isConnected, userId, address, directory, submit]);

  return null;
}
