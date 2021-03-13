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

const NoOrdersState = ({ printed }) => {
  const title = printed ? "No printed orders yet" : "No more orders to print";
  const description = printed ?
    "To keep track of which orders you already printed, after the PDF was created we tag each order. But it seems you didn't print any orders yet."
    : "You were using this app a lot. Thank you very much :)";
  return <EmptySearchResult
    title={title}
    description={description}
    withIllustration
  />
}

export { LoadingState, NoOrdersState }
