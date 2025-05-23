import React, { FC } from "react";
import { Container } from "unstated-next";

type Props = {
  states: Container<unknown>[];
  children: React.ReactNode;
};
export const StateProviders: FC<Props> = ({ states, children }) => {
  return (
    <>
      {states.reduce<JSX.Element>(
        (acc, state) => (
          <state.Provider>{acc}</state.Provider>
        ),
        <>{children}</>
      )}
    </>
  );
};
