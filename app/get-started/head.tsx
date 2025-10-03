export default function Head() {
  const title = "Get Started • RunAsh AI"
  const description =
    "Create your account and choose your role (creator, seller, buyer, enterprise). Sign in via SSO, passkeys, magic links, or OTP. Secure and fast onboarding."
  const url = (process.env.NEXT_PUBLIC_APP_URL || "") + "/get-started"
  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta name="robots" content="index,follow" />
    </>
  )
}
