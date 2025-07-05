import React, { useCallback, useEffect } from 'react';
import * as WebBrowser from 'expo-web-browser';
import { Button, ButtonIcon, ButtonText } from '@/components/ui/button';
import * as Linking from 'expo-linking';
import { useSSO } from '@clerk/clerk-expo';
import { GoogleIcon } from '../ui/icon';

export const useWarmUpBrowser = () => {
  useEffect(() => {
    // Preloads the browser for Android devices to reduce authentication load time
    // See: https://docs.expo.dev/guides/authentication/#improving-user-experience
    void WebBrowser.warmUpAsync();
    return () => {
      // Cleanup: closes browser when component unmounts
      void WebBrowser.coolDownAsync();
    };
  }, []);
};

// Handle any pending authentication sessions
WebBrowser.maybeCompleteAuthSession();

const OauthButton = () => {
  useWarmUpBrowser();
  // Use the `useSSO()` hook to access the `startSSOFlow()` method
  const { startSSOFlow } = useSSO();

  const handleOauth = useCallback(async () => {
    try {
      // Start the authentication process by calling `startSSOFlow()`
      const { createdSessionId, setActive, signIn, signUp } =
        await startSSOFlow({
          strategy: 'oauth_google',

          // Defaults to current path
          redirectUrl: Linking.createURL('/analytics'),
        });
      console.log('rewrwerwe', createdSessionId, signUp);
      // If sign in was successful, set the active session
      if (createdSessionId) {
        setActive!({ session: createdSessionId });
      } else {
        // If there is no `createdSessionId`,
        // there are missing requirements, such as MFA
        // Use the `signIn` or `signUp` returned from `startSSOFlow`
        // to handle next steps
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
  }, []);

  return (
    <Button
      className="w-full justify-center items-center bg-transparent border-2"
      onPress={() => handleOauth()}
    >
      <ButtonIcon as={GoogleIcon} className="w-10 h-10" />
      <ButtonText className="font-semibold text-tertiary-500">
        Google
      </ButtonText>
    </Button>
  );
};

export default OauthButton;
