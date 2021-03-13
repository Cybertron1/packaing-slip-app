import React from "react";
import { Card as ShopifyCard } from "@shopify/polaris";
import style from './Card.module.scss';

const Card = ({ children }) => {
  return <div className={style['c-max-width']}>
    <ShopifyCard>
      {children}
    </ShopifyCard>
  </div>
}

export default Card;
