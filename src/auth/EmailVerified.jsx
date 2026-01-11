export default function EmailVerified() {
  return (
    <div className="max-w-md mx-auto mt-20 text-center">
      <h2 className="text-2xl font-bold text-green-600">
        Email Verified 🎉
      </h2>
      <p className="mt-3">
        Your email has been successfully verified.
      </p>
      <a
        href="/login"
        className="inline-block mt-4 text-blue-600 underline"
      >
        Proceed to Login
      </a>
    </div>
  );
}
