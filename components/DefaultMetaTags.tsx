export default function DefaultMetaTags() {
  return (
    <>
      <meta httpEquiv="content-language" content="en-us" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, viewport-fit=cover" />
      <meta name="theme-color" content="#000000" media="(prefers-color-scheme: dark)" />
      <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="format-detection" content="telephone=no" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-16x16.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-32x32.png" />
      <link rel="shortcut icon" href="/favicon.ico" />
    </>
  );
}
