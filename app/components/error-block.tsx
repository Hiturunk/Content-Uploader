import { Form } from "@remix-run/react";
interface ErrorHandlerProps {
  error: any;
  type: boolean;
}

export function ErrorHandler({ error, type }: ErrorHandlerProps) {
  let errorBlock;

  if (type) {
    errorBlock = (
      <Form>
        <div className="flex w-fit items-center justify-center">
          <h1>Oops</h1>
          <p>Status: {error.status}</p>
          <p className="max-w-xl break-words rounded bg-white p-4 text-center shadow-lg">
            {error.data.message}
          </p>
        </div>
      </Form>
    );
  } else {
    const errorMessage = (error as Error).message;
    errorBlock = (
      <Form>
        <div className="my-16 flex w-full flex-col items-center justify-center text-center">
          <h1 className="text-lg">Uh oh... Something went wrong.</h1>
          <p className="mt-8 max-w-2xl break-words rounded p-4 text-center text-xl shadow-lg">
            {errorMessage}
          </p>
        </div>
      </Form>
    );
  }

  return errorBlock;
}
