import { AppProps } from 'next/app';
import { CacheProvider, EmotionCache } from '@emotion/react';
import { useRouter } from 'next/router';
import Layout from '../src/Layout';
import createEmotionCache from '../src/createEmotionCache';
import './globals.css';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

export interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

export default function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const router = useRouter();
  const { pathname } = router;
  console.log('pathname', pathname)
  return (
    <CacheProvider value={emotionCache}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </CacheProvider>
  );
}
