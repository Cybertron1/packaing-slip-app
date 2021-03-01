import styles from "./States.module.scss";
import { EmptySearchResult } from "@shopify/polaris";
import React from "react";

const LoadingState = () => {
  return <div className={styles['loading-state']}>
    <EmptySearchResult
      title='Loading orders'
      withIllustration
    /></div>;
}

const NoOrdersState = () => {
  return <EmptySearchResult
    title='No printed orders yet'
    description="To keep track of which orders you already printed, after the PDF was created we tag each order. But it seems you didn't print any orders yet."
    withIllustration
  />
}

export { LoadingState, NoOrdersState }
